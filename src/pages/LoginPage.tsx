import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router";
import { Button } from "../app/components/ui/button";
import { Input } from "../app/components/ui/input";
import { Label } from "../app/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../app/components/ui/card";
import { Computer, Wifi, Wrench, ArrowLeft, Shield } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "../app/components/ui/sonner";
import { api } from "../app/api";

interface LoginFormData {
  nomeCompleto: string;
  email: string;
  telefone: string;
  empresa: string;
  cnpj?: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  
  // Pega redirectTo da query string ou do state
  const queryParams = new URLSearchParams(location.search);
  const redirectTo = (location.state as any)?.redirectTo || queryParams.get("redirectTo") || "/dashboard";

  const onSubmit = async (data: LoginFormData) => {
    try {
      const client = await api.saveClient(data);
      localStorage.setItem("userData", JSON.stringify(client));
      toast.success("Login conectado ao servidor!");
    } catch (error) {
      localStorage.setItem("userData", JSON.stringify(data));
      toast.warning("Servidor indisponivel. Dados salvos neste dispositivo.");
    }
    
    setTimeout(() => {
      navigate(redirectTo);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Toaster />
      
      <div className="w-full max-w-6xl">
        {/* Botão Voltar */}
        <div className="mb-4">
          <Button variant="ghost" asChild className="gap-2">
            <a href="/">
              <ArrowLeft className="size-4" />
              Voltar para Home
            </a>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Lado Esquerdo - Branding */}
          <div className="hidden lg:block space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="size-14 bg-primary rounded-lg flex items-center justify-center">
                  <Wrench className="size-8 text-white" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
                    Quick Fix
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Soluções em Tecnologia
                  </p>
                </div>
              </div>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Faça login para solicitar orçamentos personalizados e acompanhar seus pedidos
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-12">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-blue-600">
                <Computer className="size-10 text-blue-600 mb-3" />
                <h3 className="font-semibold mb-2">Manutenção</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Reparo e manutenção de computadores
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-green-600">
                <Wifi className="size-10 text-green-600 mb-3" />
                <h3 className="font-semibold mb-2">Redes</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Infraestrutura e segurança de rede
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-purple-600 col-span-2">
                <Shield className="size-10 text-purple-600 mb-3" />
                <h3 className="font-semibold mb-2">Segurança</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Proteção completa e auditoria de sistemas
                </p>
              </div>
            </div>
          </div>

          {/* Lado Direito - Formulário */}
          <Card className="w-full shadow-2xl">
            <CardHeader className="space-y-3">
              <div className="flex items-center gap-3 lg:hidden">
                <div className="size-10 bg-primary rounded-lg flex items-center justify-center">
                  <Wrench className="size-6 text-white" />
                </div>
                <CardTitle className="text-2xl">Quick Fix</CardTitle>
              </div>
              <CardTitle className="text-2xl hidden lg:block">Área do Cliente</CardTitle>
              <CardDescription>
                Preencha seus dados para iniciar o atendimento. Seus dados serão salvos para facilitar futuros acessos.
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
                  <Label htmlFor="email">E-mail *</Label>
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
                    placeholder="seu@email.com"
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
                  <Label htmlFor="empresa">Nome da Empresa (Opcional)</Label>
                  <Input
                    id="empresa"
                    {...register("empresa")}
                    placeholder="Nome da empresa"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ/CPF (Opcional)</Label>
                  <Input
                    id="cnpj"
                    {...register("cnpj")}
                    placeholder="00.000.000/0000-00"
                  />
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Continuar
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  Ao continuar, você concorda com nossos termos de serviço e política de privacidade.
                </p>
                <p className="text-xs text-center text-muted-foreground">
                  Não tem cadastro conosco? Cadastre-se{" "}
                  <a href="/client-register" className="text-xs underline hover:text-primary transition-colors">
                    aqui
                  </a>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
