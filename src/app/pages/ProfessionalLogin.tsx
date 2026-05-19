import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Computer, Wifi, Wrench, ArrowLeft, Shield, Award } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";
import { api } from "../api";

interface ProfessionalLoginFormData {
  nomeCompleto: string;
  email: string;
  telefone: string;
  registro?: string;
}

export default function ProfessionalLogin() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<ProfessionalLoginFormData>();

  const onSubmit = async (data: ProfessionalLoginFormData) => {
    try {
      const professional = await api.saveProfessional(data);
      localStorage.setItem("professionalData", JSON.stringify(professional));
      toast.success("Login de profissional conectado ao servidor!");
    } catch (error) {
      localStorage.setItem("professionalData", JSON.stringify(data));
      toast.warning("Servidor indisponivel. Dados salvos neste dispositivo.");
    }

    setTimeout(() => {
      navigate("/professional-dashboard");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Toaster />

      <div className="w-full max-w-6xl">
        {/* Botão Voltar */}
        <div className="mb-4">
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="size-4" />
            Voltar para Home
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Lado Esquerdo - Branding */}
          <div className="hidden lg:block space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="size-14 bg-green-600 rounded-lg flex items-center justify-center">
                  <Wrench className="size-8 text-white" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
                    Quick Fix
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Área do Profissional
                  </p>
                </div>
              </div>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Faça login para gerenciar seus atendimentos e acompanhar suas tarefas
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-12">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-blue-600">
                <Computer className="size-10 text-blue-600 mb-3" />
                <h3 className="font-semibold mb-2">Manutenção</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Gerenciar chamados de manutenção
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-green-600">
                <Wifi className="size-10 text-green-600 mb-3" />
                <h3 className="font-semibold mb-2">Redes</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Gerenciar projetos de rede
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-purple-600">
                <Shield className="size-10 text-purple-600 mb-3" />
                <h3 className="font-semibold mb-2">Segurança</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Auditorias e proteção de sistemas
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-orange-600">
                <Award className="size-10 text-orange-600 mb-3" />
                <h3 className="font-semibold mb-2">Especialista</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Suporte técnico especializado
                </p>
              </div>
            </div>
          </div>

          {/* Lado Direito - Formulário */}
          <Card className="w-full shadow-2xl border-2 border-green-200 dark:border-green-800">
            <CardHeader className="space-y-3">
              <div className="flex items-center gap-3 lg:hidden">
                <div className="size-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <Wrench className="size-6 text-white" />
                </div>
                <CardTitle className="text-2xl">Quick Fix</CardTitle>
              </div>
              <CardTitle className="text-2xl hidden lg:block">Área do Profissional</CardTitle>
              <CardDescription>
                Preencha seus dados profissionais para acessar o sistema de gerenciamento
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nomeCompleto">Nome Completo *</Label>
                  <Input
                    id="nomeCompleto"
                    {...register("nomeCompleto", { required: "Nome é obrigatório" })}
                    placeholder="Seu nome completo"
                  />
                  {errors.nomeCompleto && (
                    <span className="text-sm text-red-500">{errors.nomeCompleto.message}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail Profissional *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email", {
                      required: "E-mail é obrigatório",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "E-mail inválido"
                      }
                    })}
                    placeholder="profissional@quickfix.com"
                  />
                  {errors.email && (
                    <span className="text-sm text-red-500">{errors.email.message}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone *</Label>
                  <Input
                    id="telefone"
                    {...register("telefone", { required: "Telefone é obrigatório" })}
                    placeholder="(00) 00000-0000"
                  />
                  {errors.telefone && (
                    <span className="text-sm text-red-500">{errors.telefone.message}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registro">Registro do Profissional *</Label>
                  <Input
                    id="registro"
                    {...register("registro")}
                    placeholder="Número de registro do profissional"
                  />
                </div>

                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" size="lg">
                  Acessar Painel
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  Acesso exclusivo para profissionais cadastrados no sistema Quick Fix.
                </p>
                <p className="text-xs text-center text-muted-foreground">
                  Não tem cadastro conosco? Cadastre-se{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/professional-register")}
                    className="text-xs underline hover:text-green-600 transition-colors"
                  >
                    aqui
                  </button>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
