import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Computer, Wifi, Wrench, ArrowLeft, Shield, Award, Upload, FileText, X } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";
import { api } from "../api";

interface ProfessionalRegisterFormData {
  nomeCompleto: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  cpf: string;
}

export default function ProfessionalRegister() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<ProfessionalRegisterFormData>();
  const [curriculo, setCurriculo] = useState<File | null>(null);
  const [curriculoError, setCurriculoError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setCurriculoError("Apenas arquivos PDF são aceitos.");
      setCurriculo(null);
      return;
    }
    setCurriculoError("");
    setCurriculo(file);
  };

  const removeFile = () => {
    setCurriculo(null);
    setCurriculoError("");
  };

  const onSubmit = async (data: ProfessionalRegisterFormData) => {
    const payload = { ...data, curriculo: curriculo?.name };
    try {
      const professional = await api.registerProfessional(payload);
      localStorage.setItem("professionalRegisterData", JSON.stringify(professional));
      localStorage.setItem("professionalData", JSON.stringify(professional));
      toast.success("Cadastro salvo no servidor!");
    } catch (error) {
      localStorage.setItem("professionalRegisterData", JSON.stringify(payload));
      toast.warning("Servidor indisponivel. Cadastro salvo neste dispositivo.");
    }
    setTimeout(() => {
      navigate("/professional-login");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Toaster />

      <div className="w-full max-w-6xl">
        {/* Botão Voltar */}
        <div className="mb-4">
          <Button variant="ghost" onClick={() => navigate("/professional-login")} className="gap-2">
            <ArrowLeft className="size-4" />
            Voltar para Login
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
                Cadastre-se para fazer parte da nossa equipe de profissionais
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
              <CardTitle className="text-2xl hidden lg:block">Cadastro do Profissional</CardTitle>
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
                  <Label htmlFor="email">E-mail Profissional *</Label>
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
                  <Label htmlFor="curriculo">Envio de Currículo (PDF)</Label>
                  {!curriculo ? (
                    <label
                      htmlFor="curriculo"
                      className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-green-300 dark:border-green-700 rounded-lg cursor-pointer bg-green-50 dark:bg-green-950/30 hover:bg-green-100 dark:hover:bg-green-950/50 transition-colors"
                    >
                      <Upload className="size-6 text-green-600 mb-2" />
                      <span className="text-sm text-green-700 dark:text-green-400 font-medium">
                        Clique para enviar o PDF
                      </span>
                      <span className="text-xs text-muted-foreground mt-1">Apenas arquivos .pdf</span>
                      <input
                        id="curriculo"
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  ) : (
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/30">
                      <FileText className="size-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-green-800 dark:text-green-300 truncate flex-1">
                        {curriculo.name}
                      </span>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="text-muted-foreground hover:text-red-500 transition-colors flex-shrink-0"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  )}
                  {curriculoError && (
                    <span className="text-sm text-red-500">{curriculoError}</span>
                  )}
                </div>

                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" size="lg">
                  Criar Cadastro
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  Já tem cadastro?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/professional-login")}
                    className="text-xs underline hover:text-green-600 transition-colors"
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
