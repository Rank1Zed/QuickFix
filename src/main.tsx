
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import { registerInternalLinkMiddleClickGuard } from "./app/navigation/internalLinkGuard.ts";
  import "./styles/index.css";

  registerInternalLinkMiddleClickGuard();
  createRoot(document.getElementById("root")!).render(<App />);

  if ("serviceWorker" in navigator && import.meta.env.PROD) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js");
    });
  }
  
