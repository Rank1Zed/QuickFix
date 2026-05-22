import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Button } from "../app/components/ui/button";
import { Input } from "../app/components/ui/input";
import { Label } from "../app/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../app/components/ui/card";
import { Computer, Wifi, Wrench, ArrowLeft, Shield, Award, Upload, FileText, X } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "../app/components/ui/sonner";
import { api } from "../app/api";

interface ProfessionalRegisterFormData {
  nomeCompleto: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  cpf: string;
  senha: string;
  confirmarSenha: string;
}

const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function formatCpf(value: string) {
  const digits = onlyDigits(value).slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatPhone(value: string) {
  const digits = onlyDigits(value);
  
  // Se não começar com 92, adiciona
  let formattedDigits = digits.startsWith("92") ? digits : "92" + digits;
  formattedDigits = formattedDigits.slice(0, 11);
  
  // Constrói a formatação: (92) XXXXX-XXXX ou (92) XXXX-XXXX
  if (formattedDigits.length <= 2) {
    return "(" + formattedDigits;
  } else if (formattedDigits.length <= 7) {
    return "(" + formattedDigits.slice(0, 2) + ") " + formattedDigits.slice(2);
  } else {
    return "(" + formattedDigits.slice(0, 2) + ") " + formattedDigits.slice(2, 7) + "-" + formattedDigits.slice(7);
  }
}


function isValidCpf(value: string) {
  const cpf = onlyDigits(value);
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  const calcDigit = (base: string, factor: number) => {
    const total = base.split("").reduce((sum, digit) => sum + Number(digit) * factor--, 0);
    const rest = (total * 10) % 11;
    return rest === 10 ? 0 : rest;
  };

  return calcDigit(cpf.slice(0, 9), 10) === Number(cpf[9]) && calcDigit(cpf.slice(0, 10), 11) === Number(cpf[10]);
}

function normalizeUpperName(value: string) {
  return value.replace(/[0-9]/g, "").replace(/\s+/g, " ").toUpperCase();
}

export default function ProfessionalRegister() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProfessionalRegisterFormData>({ mode: "onChange" });

  const [curriculo, setCurriculo] = useState<File | null>(null);
  const [curriculoError, setCurriculoError] = useState("");
  const [diplomas, setDiplomas] = useState<File[]>([]);
  const [diplomasError, setDiplomasError] = useState("");

  const validateFullName = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return "Nome completo e obrigatorio.";
    if (/[0-9]/.test(trimmed)) return "Nome nao pode conter numeros.";
    if (trimmed !== trimmed.toUpperCase()) return "Digite o nome em letras maiusculas.";
    if (trimmed.split(/\s+/).length < 2) return "Informe nome e sobrenome.";
    if (!/^[\p{L}\s'.-]+$/u.test(trimmed)) return "Use apenas letras e separadores validos.";
    return true;
  };

  const validateBirthDate = (value: string) => {
    if (!value) return "Data de nascimento e obrigatoria.";
    const date = new Date(`${value}T00:00:00`);
    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) age--;
    if (Number.isNaN(date.getTime()) || date > today) return "Informe uma data valida.";
    if (age < 18) return "O profissional deve ter pelo menos 18 anos.";
    if (age > 100) return "Confira a data informada.";
    return true;
  };

  const validatePhone = (value: string) => {
    const digits = onlyDigits(value);
    if (!digits.startsWith("92")) return "O telefone deve usar DDD 92.";
    const number = digits.slice(2);
    if (number.length !== 8 && number.length !== 9) return "Informe 8 ou 9 numeros apos o DDD.";
    if (/^(\d)\1+$/.test(number)) return "Telefone invalido.";
    return true;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setCurriculoError("Apenas arquivos PDF sao aceitos.");
      setCurriculo(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setCurriculoError("O curriculo deve ter no maximo 5 MB.");
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

  const handleDiplomasChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const valid: File[] = [];
    for (const file of files.slice(0, 6)) {
      if (!["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(file.type)) {
        setDiplomasError("Diplomas: use JPG, PNG ou WebP.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setDiplomasError("Cada imagem deve ter no maximo 5 MB.");
        return;
      }
      valid.push(file);
    }
    setDiplomasError("");
    setDiplomas(valid);
  };

  const onSubmit = async (data: ProfessionalRegisterFormData) => {
    if (data.senha !== data.confirmarSenha) {
      toast.error("As senhas nao coincidem.");
      return;
    }
    if (!curriculo) {
      toast.error("Envie o curriculo em PDF.");
      return;
    }

    const form = new FormData();
    form.append("nomeCompleto", data.nomeCompleto.trim());
    form.append("email", data.email.trim().toLowerCase());
    form.append("telefone", formatPhone(data.telefone));
    form.append("dataNascimento", data.dataNascimento);
    form.append("cpf", formatCpf(data.cpf));
    form.append("senha", data.senha);
    form.append("curriculo", curriculo);
    diplomas.forEach((file) => form.append("diplomas", file));

    try {
      await api.registerProfessionalForm(form);
      toast.success("Cadastro enviado! Aguarde aprovacao em /admin/avaliar.");
      setTimeout(() => navigate("/professional-login"), 800);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Erro ao cadastrar.";
      if (msg.includes("fetch") || msg.includes("Failed")) {
        toast.error("Backend offline. Rode: cd backend && python manage.py runserver");
      } else {
        toast.error(msg);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Toaster />

      <div className="w-full max-w-6xl">
        <div className="mb-4">
          <Button variant="ghost" asChild className="gap-2">
            <a href="/professional-login">
              <ArrowLeft className="size-4" />
              Voltar para Login
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
                Cadastre-se para fazer parte da nossa equipe de profissionais.
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
              <CardTitle className="text-2xl hidden lg:block">Cadastro do Profissional</CardTitle>
              <CardDescription>Preencha seus dados com atencao. O sistema validara cada campo.</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nomeCompleto">Nome Completo *</Label>
                  <Input
                    id="nomeCompleto"
                    {...register("nomeCompleto", {
                      validate: validateFullName,
                      onChange: (event) =>
                        setValue("nomeCompleto", normalizeUpperName(event.target.value), { shouldValidate: true }),
                    })}
                    onKeyPress={(event: React.KeyboardEvent<HTMLInputElement>) => {
                      // Impede digitar números
                      if (/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    placeholder="SEU NOME COMPLETO"
                  />
                  {errors.nomeCompleto && <span className="text-sm text-red-500">{errors.nomeCompleto.message}</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail Profissional *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email", {
                      required: "E-mail e obrigatorio.",
                      pattern: { value: EMAIL_PATTERN, message: "E-mail invalido." },
                    })}
                    placeholder="profissional@quickfix.com"
                  />
                  {errors.email && <span className="text-sm text-red-500">{errors.email.message}</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone *</Label>
                  <Input
                    id="telefone"
                    inputMode="numeric"
                    {...register("telefone", {
                      validate: validatePhone,
                      onChange: (event) =>
                        setValue("telefone", formatPhone(event.target.value), { shouldValidate: true }),
                    })}
                    onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                      const target = event.currentTarget;
                      const key = event.key;
                      const start = target.selectionStart || 0;
                      const end = target.selectionEnd || 0;
                      const value = target.value;
                      
                      // Impede remover parênteses, espaço e traço
                      if (key === "Backspace" || key === "Delete") {
                        const protectedIndices = [0, 1, 2, 4, 5, 10]; // Posições de (, ), espaço e -
                        if ((key === "Backspace" && protectedIndices.includes(start - 1)) ||
                            (key === "Delete" && protectedIndices.includes(start))) {
                          event.preventDefault();
                        }
                      }
                    }}
                    placeholder="(92) 00000-0000"
                  />
                  {errors.telefone && <span className="text-sm text-red-500">{errors.telefone.message}</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
                  <Input id="dataNascimento" type="date" {...register("dataNascimento", { validate: validateBirthDate })} />
                  {errors.dataNascimento && (
                    <span className="text-sm text-red-500">{errors.dataNascimento.message}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF *</Label>
                  <Input
                    id="cpf"
                    inputMode="numeric"
                    {...register("cpf", {
                      validate: (value) => isValidCpf(value) || "CPF invalido.",
                      onChange: (event) => setValue("cpf", formatCpf(event.target.value), { shouldValidate: true }),
                    })}
                    placeholder="000.000.000-00"
                  />
                  {errors.cpf && <span className="text-sm text-red-500">{errors.cpf.message}</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="senha">Senha *</Label>
                  <Input
                    id="senha"
                    type="password"
                    autoComplete="new-password"
                    {...register("senha", {
                      required: "Senha obrigatoria.",
                      minLength: { value: 8, message: "Minimo 8 caracteres." },
                    })}
                    placeholder="Minimo 8 caracteres"
                  />
                  {errors.senha && <span className="text-sm text-red-500">{errors.senha.message}</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmarSenha">Confirmar senha *</Label>
                  <Input
                    id="confirmarSenha"
                    type="password"
                    autoComplete="new-password"
                    {...register("confirmarSenha", {
                      required: "Confirme a senha.",
                      validate: (v, f) => v === f.senha || "As senhas nao coincidem.",
                    })}
                    placeholder="Repita a senha"
                  />
                  {errors.confirmarSenha && (
                    <span className="text-sm text-red-500">{errors.confirmarSenha.message}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="diplomas">Imagens do diploma (JPG, PNG ou WebP)</Label>
                  <label
                    htmlFor="diplomas"
                    className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-lg cursor-pointer bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 transition-colors"
                  >
                    <Upload className="size-5 text-blue-600 mb-1" />
                    <span className="text-sm text-blue-700 dark:text-blue-400">Selecione ate 6 imagens</span>
                    <input
                      id="diplomas"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      className="hidden"
                      onChange={handleDiplomasChange}
                    />
                  </label>
                  {diplomas.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {diplomas.map((file, i) => (
                        <span key={i} className="text-xs bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                          {file.name}
                        </span>
                      ))}
                    </div>
                  )}
                  {diplomasError && <span className="text-sm text-red-500">{diplomasError}</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="curriculo">Curriculo (PDF) *</Label>
                  {!curriculo ? (
                    <label
                      htmlFor="curriculo"
                      className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-green-300 dark:border-green-700 rounded-lg cursor-pointer bg-green-50 dark:bg-green-950/30 hover:bg-green-100 dark:hover:bg-green-950/50 transition-colors"
                    >
                      <Upload className="size-6 text-green-600 mb-2" />
                      <span className="text-sm text-green-700 dark:text-green-400 font-medium">Clique para enviar o PDF</span>
                      <span className="text-xs text-muted-foreground mt-1">Apenas .pdf ate 5 MB</span>
                      <input id="curriculo" type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
                    </label>
                  ) : (
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/30">
                      <FileText className="size-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-green-800 dark:text-green-300 truncate flex-1">{curriculo.name}</span>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="text-muted-foreground hover:text-red-500 transition-colors flex-shrink-0"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  )}
                  {curriculoError && <span className="text-sm text-red-500">{curriculoError}</span>}
                </div>

                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" size="lg">
                  Criar Cadastro
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  Ja tem cadastro?{" "}
                  <a href="/professional-login" className="underline hover:text-green-600 transition-colors">
                    Faca login aqui
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
