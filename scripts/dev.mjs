import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import http from "node:http";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const backendDir = path.join(rootDir, "backend");
const isWindows = process.platform === "win32";
const venvPython = path.join(backendDir, ".d_venv", isWindows ? "Scripts" : "bin", isWindows ? "python.exe" : "python");
const python = existsSync(venvPython) ? venvPython : isWindows ? "python" : "python3";
const npm = isWindows ? "npm.cmd" : "npm";
const children = new Set();

function prefixLines(prefix, stream) {
  stream.setEncoding("utf8");
  let buffer = "";
  stream.on("data", (chunk) => {
    buffer += chunk;
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (line.trim()) {
        console.log(`${prefix} ${line}`);
      }
    }
  });
  stream.on("end", () => {
    if (buffer.trim()) {
      console.log(`${prefix} ${buffer}`);
    }
  });
}

function spawnLogged(prefix, command, args, options = {}) {
  const child = spawn(command, args, {
    cwd: rootDir,
    env: process.env,
    stdio: ["ignore", "pipe", "pipe"],
    ...options,
  });
  children.add(child);
  prefixLines(prefix, child.stdout);
  prefixLines(prefix, child.stderr);
  child.on("exit", () => children.delete(child));
  child.on("error", (error) => {
    console.error(`${prefix} ${error.message}`);
  });
  return child;
}

function runStep(prefix, command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawnLogged(prefix, command, args, options);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${prefix} encerrou com codigo ${code}.`));
      }
    });
  });
}

function isPortOpen(port, host = "127.0.0.1") {
  return new Promise((resolve) => {
    const socket = net.createConnection({ port, host });
    socket.setTimeout(1200);
    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.once("timeout", () => {
      socket.destroy();
      resolve(false);
    });
    socket.once("error", () => resolve(false));
  });
}

function quickfixApiIsHealthy() {
  return new Promise((resolve) => {
    const request = http.get("http://127.0.0.1:8000/api/health/", { timeout: 1500 }, (response) => {
      let body = "";
      response.setEncoding("utf8");
      response.on("data", (chunk) => {
        body += chunk;
      });
      response.on("end", () => {
        resolve(response.statusCode === 200 && body.includes("Quick Fix API"));
      });
    });
    request.once("timeout", () => {
      request.destroy();
      resolve(false);
    });
    request.once("error", () => resolve(false));
  });
}

function stopAll(code = 0) {
  for (const child of children) {
    if (!child.killed) {
      child.kill(isWindows ? undefined : "SIGTERM");
    }
  }
  process.exit(code);
}

process.on("SIGINT", () => stopAll(0));
process.on("SIGTERM", () => stopAll(0));

try {
  console.log("[dev] Preparando banco do Django...");
  await runStep("[django:migrate]", python, ["manage.py", "migrate", "--noinput"], { cwd: backendDir });

  let backend = null;
  if (await quickfixApiIsHealthy()) {
    console.log("[dev] Backend QuickFix ja esta ativo em http://127.0.0.1:8000");
  } else if (await isPortOpen(8000)) {
    throw new Error("[dev] A porta 8000 esta ocupada por outro processo. Libere a porta ou ajuste VITE_API_URL.");
  } else {
    console.log("[dev] Iniciando backend em http://127.0.0.1:8000");
    backend = spawnLogged("[django]", python, ["manage.py", "runserver", "127.0.0.1:8000"], { cwd: backendDir });
  }

  console.log("[dev] Iniciando frontend Vite...");
  const frontend = spawnLogged("[vite]", npm, ["run", "dev:frontend"], { shell: isWindows });

  if (backend) {
    backend.on("exit", (code) => {
      if (code !== null && code !== 0) {
        console.error(`[dev] Backend encerrou com codigo ${code}.`);
        stopAll(code);
      }
    });
  }

  frontend.on("exit", (code) => {
    if (code !== null && code !== 0) {
      console.error(`[dev] Frontend encerrou com codigo ${code}.`);
      stopAll(code);
    }
  });
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  console.error("[dev] Verifique se as dependencias Python foram instaladas em backend/.d_venv ou no Python global.");
  stopAll(1);
}
