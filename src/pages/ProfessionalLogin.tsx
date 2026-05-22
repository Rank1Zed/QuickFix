import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Button } from "../app/components/ui/button";
import { Input } from "../app/components/ui/input";
import { Label } from "../app/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../app/components/ui/card";
import { Computer, Wifi, Wrench, ArrowLeft, Shield, Award, Mail, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "../app/components/ui/sonner";
import { api } from "../app/api";

interface ProfessionalLoginFormData {
  email: string;
  senha: string;
}

interface PasswordRecoveryFormData {
  email: string;
  code: string;
}

const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
export default function ProfessionalLogin() {
  const navigate = useNavigate();
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryCode, setRecoveryCode] = useState("");
  const [recoveryEmail, setRecoveryEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfessionalLoginFormData>({ mode: "onChange" });

  const {
    register: registerRecovery,
    handleSubmit: handleRecoverySubmit,
    formState: { errors: recoveryErrors },
    reset: resetRecovery,
    watch: watchRecovery,
  } = useForm<PasswordRecoveryFormData>({ mode: "onChange" });

  const onSubmit = async (data: ProfessionalLoginFormData) => {
    const email = data.email.trim().toLowerCase();
    try {
      const professional = await api.loginProfessional(email, data.senha);
      localStorage.setItem("professionalData", JSON.stringify(professional));
      toast.success("Login realizado!");
      navigate("/professional-dashboard");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Nao foi possivel entrar.");
    }
  };

  const sendRecoveryCode = (data: PasswordRecoveryFormData) => {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setRecoveryCode(code);
    setRecoveryEmail(data.email.trim());
    toast.success("Codigo de recuperacao enviado para o e-mail informado.");

    // Em producao, este codigo deve sair por e-mail via backend. No ambiente local, o console ajuda nos testes.
    console.info(`[QuickFix] Codigo de recuperacao para ${data.email}: ${code}`);
  };

  const confirmRecoveryCode = () => {
    const typedCode = watchRecovery("code")?.trim();
    if (typedCode !== recoveryCode) {
      toast.error("Codigo invalido. Confira o e-mail e tente novamente.");
      return;
    }

    toast.success("Codigo confirmado. Voce ja pode redefinir sua senha com o suporte Quick Fix.");
    setShowRecovery(false);
    setRecoveryCode("");
    setRecoveryEmail("");
    resetRecovery();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Toaster />

      <div className="w-full max-w-6xl">
        <div className="mb-4">
          <Button variant="ghost" asChild className="gap-2">
            <a href="/">
              <ArrowLeft className="size-4" />
              Voltar para Home
            </a>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="hidden lg:block space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="size-14 bg-green-600 rounded-lg flex items-center justify-center">
                  <Wrench className="size-8 text-white" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold text-gray-900 dark:text-white">Quick Fix</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Area do Profissional</p>
                </div>
              </div>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Acesse seu painel para gerenciar atendimentos, analisar pedidos e acompanhar tarefas.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-12">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-blue-600">
                <Computer className="size-10 text-blue-600 mb-3" />
                <h3 className="font-semibold mb-2">Manutencao</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Gerenciar chamados de manutencao</p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-green-600">
                <Wifi className="size-10 text-green-600 mb-3" />
                <h3 className="font-semibold mb-2">Redes</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Gerenciar projetos de rede</p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-purple-600">
                <Shield className="size-10 text-purple-600 mb-3" />
                <h3 className="font-semibold mb-2">Seguranca</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Auditorias e protecao de sistemas</p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-orange-600">
                <Award className="size-10 text-orange-600 mb-3" />
                <h3 className="font-semibold mb-2">Especialista</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Suporte tecnico especializado</p>
              </div>
            </div>
          </div>

          <Card className="w-full shadow-2xl border-2 border-green-200 dark:border-green-800">
            <CardHeader className="space-y-3">
              <div className="flex items-center gap-3 lg:hidden">
                <div className="size-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <Wrench className="size-6 text-white" />
                </div>
                <CardTitle className="text-2xl">Quick Fix</CardTitle>
              </div>
              <CardTitle className="text-2xl hidden lg:block">Login do Profissional</CardTitle>
              <CardDescription>Entre com e-mail e senha cadastrados na aprovacao.</CardDescription>
            </CardHeader>

            <CardContent>
              {!showRecovery ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail profissional *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        className="pl-9"
                        autoComplete="username"
                        {...register("email", {
                          required: "E-mail obrigatorio.",
                          pattern: { value: EMAIL_PATTERN, message: "E-mail invalido." },
                        })}
                        placeholder="profissional@quickfix.com"
                      />
                    </div>
                    {errors.email && <span className="text-sm text-red-500">{errors.email.message}</span>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="senha">Senha *</Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="senha"
                        type="password"
                        className="pl-9"
                        autoComplete="current-password"
                        {...register("senha", { required: "Senha obrigatoria." })}
                        placeholder="Sua senha"
                      />
                    </div>
                    {errors.senha && <span className="text-sm text-red-500">{errors.senha.message}</span>}
                  </div>

                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" size="lg">
                    Acessar Painel
                  </Button>

                  <button
                    type="button"
                    onClick={() => setShowRecovery(true)}
                    className="w-full text-sm underline hover:text-green-600 transition-colors"
                  >
                    Esqueceu a senha?
                  </button>

                  <p className="text-xs text-center text-muted-foreground">
                    Nao tem cadastro conosco?{" "}
                    <a href="/professional-register" className="underline hover:text-green-600 transition-colors">
                      Cadastre-se aqui
                    </a>
                  </p>
                </form>
              ) : (
                <form onSubmit={handleRecoverySubmit(sendRecoveryCode)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="recovery-email">E-mail cadastrado *</Label>
                    <Input
                      id="recovery-email"
                      type="email"
                      autoComplete="email"
                      disabled={!!recoveryCode}
                      {...registerRecovery("email", {
                        required: "Informe o e-mail cadastrado.",
                        pattern: { value: EMAIL_PATTERN, message: "Informe um e-mail valido." },
                      })}
                      placeholder="profissional@quickfix.com"
                    />
                    {recoveryErrors.email && <span className="text-sm text-red-500">{recoveryErrors.email.message}</span>}
                  </div>

                  {!recoveryCode ? (
                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" size="lg">
                      Enviar codigo por e-mail
                    </Button>
                  ) : (
                    <>
                      <div className="rounded-md border bg-muted/40 p-3 text-sm text-muted-foreground">
                        Enviamos um codigo de 6 digitos para {recoveryEmail}. Verifique sua caixa de entrada.
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="recovery-code">Codigo recebido *</Label>
                        <div className="relative">
                          <KeyRound className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="recovery-code"
                            className="pl-9 tracking-[0.35em]"
                            inputMode="numeric"
                            maxLength={6}
                            {...registerRecovery("code", {
                              required: "Informe o codigo recebido.",
                              pattern: { value: /^\d{6}$/, message: "O codigo deve ter 6 numeros." },
                            })}
                            placeholder="000000"
                          />
                        </div>
                        {recoveryErrors.code && <span className="text-sm text-red-500">{recoveryErrors.code.message}</span>}
                      </div>
                      <Button type="button" onClick={confirmRecoveryCode} className="w-full" size="lg">
                        Confirmar codigo
                      </Button>
                    </>
                  )}

                  <Button type="button" variant="outline" onClick={() => setShowRecovery(false)} className="w-full">
                    Voltar ao login
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
