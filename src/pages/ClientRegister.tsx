import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Button } from "../app/components/ui/button";
import { Input } from "../app/components/ui/input";
import { Label } from "../app/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../app/components/ui/card";
import { Computer, Wifi, Wrench, ArrowLeft, Shield } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "../app/components/ui/sonner";
import { api } from "../app/api";

interface ClientRegisterFormData {
  nomeCompleto: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  cpf: string;
  endereco: string;
}

export default function ClientRegister() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<ClientRegisterFormData>();

  const onSubmit = async (data: ClientRegisterFormData) => {
    try {
      const client = await api.registerClient(data);
      localStorage.setItem("clientRegisterData", JSON.stringify(client));
      localStorage.setItem("userData", JSON.stringify(client));
      toast.success("Cadastro salvo no servidor!");
    } catch (error) {
      localStorage.setItem("clientRegisterData", JSON.stringify(data));
      toast.warning("Servidor indisponivel. Cadastro salvo neste dispositivo.");
    }
    setTimeout(() => {
      navigate("/login");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Toaster />

      <div className="w-full max-w-6xl">
        {/* Botão Voltar */}
        <div className="mb-4">
          <Button variant="ghost" asChild className="gap-2">
            <a href="/login">
              <ArrowLeft className="size-4" />
              Voltar para Login
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
                Cadastre-se para solicitar orçamentos personalizados e acompanhar seus pedidos
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
              <CardTitle className="text-2xl hidden lg:block">Cadastro do Cliente</CardTitle>
              <CardDescription>
                Preencha seus dados para criar sua conta no sistema Quick Fix
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
                        message: "E-mail inválido",
                      },
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
                  <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
                  <Input
                    id="dataNascimento"
                    type="date"
                    {...register("dataNascimento", { required: "Data de nascimento é obrigatória" })}
                  />
                  {errors.dataNascimento && (
                    <span className="text-sm text-red-500">{errors.dataNascimento.message}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF *</Label>
                  <Input
                    id="cpf"
                    {...register("cpf", { required: "CPF é obrigatório" })}
                    placeholder="000.000.000-00"
                  />
                  {errors.cpf && (
                    <span className="text-sm text-red-500">{errors.cpf.message}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereço *</Label>
                  <Input
                    id="endereco"
                    {...register("endereco", { required: "Endereço é obrigatório" })}
                    placeholder="Rua, número, bairro, cidade - UF"
                  />
                  {errors.endereco && (
                    <span className="text-sm text-red-500">{errors.endereco.message}</span>
                  )}
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Criar Cadastro
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  Já tem cadastro?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-xs underline hover:text-primary transition-colors"
                  >
                    Faça login aqui
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
