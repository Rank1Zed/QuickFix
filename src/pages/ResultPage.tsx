import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { CheckCircle2, Clock, AlertTriangle, AlertCircle, Printer, Home, FileText, Info } from "lucide-react";
import { questionsByService } from "../data/questions";
import { AnimatedProgress } from "../components/AnimatedProgress";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { motion } from "motion/react";

interface QuestionnaireResult {
  serviceType: string;
  serviceName: string;
  answers: Record<string, string>;
  description: string;
  totalScore: number;
  averageScore: number;
  answersCount: number;
  timestamp: string;
}

export default function ResultPage() {
  const navigate = useNavigate();
  const [result, setResult] = useState<QuestionnaireResult | null>(null);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const resultData = localStorage.getItem("questionnaireResult");
    const userDataStr = localStorage.getItem("userData");

    if (!resultData) {
      navigate("/");
      return;
    }

    setResult(JSON.parse(resultData));
    if (userDataStr) {
      setUserData(JSON.parse(userDataStr));
    }
  }, [navigate]);

  if (!result) {
    return null;
  }

  // Calcular nível de complexidade
  const getComplexityLevel = (score: number) => {
    if (score <= 1.5) return { label: "Baixa Complexidade", color: "bg-green-500", icon: CheckCircle2 };
    if (score <= 2.5) return { label: "Complexidade Média", color: "bg-blue-500", icon: Clock };
    if (score <= 3.5) return { label: "Complexidade Alta", color: "bg-orange-500", icon: AlertTriangle };
    return { label: "Complexidade Muito Alta", color: "bg-red-500", icon: AlertCircle };
  };

  // Calcular nível de prioridade
  const getPriorityLevel = (score: number) => {
    if (score <= 1.5) return { label: "Baixa Prioridade", color: "default", variant: "outline" as const };
    if (score <= 2.5) return { label: "Prioridade Normal", color: "secondary", variant: "secondary" as const };
    if (score <= 3.5) return { label: "Alta Prioridade", color: "default", variant: "default" as const };
    return { label: "Prioridade Urgente", color: "destructive", variant: "destructive" as const };
  };

  // Determinar tipo de serviço
  const getServiceType = (serviceType: string) => {
    if (serviceType === 'manutencao') return "Manutenção de Computadores";
    if (serviceType === 'redes') return "Rede de Computadores";
    return "Serviço Técnico";
  };

  // Estimativa de prazo
  const getEstimatedTime = (score: number, serviceType: string) => {
    const baseTime: Record<string, number> = {
      manutencao: 1,
      redes: 3,
    };

    const base = baseTime[serviceType] || 3;
    const multiplier = score / 2;
    const days = Math.round(base * multiplier);

    if (days <= 1) return "1 dia";
    if (days <= 7) return `${days} dias`;
    if (days <= 30) return `${Math.round(days / 7)} semanas`;
    return `${Math.round(days / 30)} meses`;
  };

  const complexity = getComplexityLevel(result.averageScore);
  const priority = getPriorityLevel(result.averageScore);
  const serviceType = getServiceType(result.serviceType);
  const estimatedTime = getEstimatedTime(result.averageScore, result.serviceType);

  const ComplexityIcon = complexity.icon;

  const handlePrint = () => {
    window.print();
  };

  const handleNewRequest = () => {
    localStorage.removeItem("questionnaireResult");
    navigate("/dashboard");
  };

  const handleGoHome = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b shadow-sm print:hidden">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Quick Fix</h1>
              <p className="text-sm text-muted-foreground">Diagnóstico Completo</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="size-4 mr-2" />
                Imprimir
              </Button>
              <Button variant="outline" onClick={handleGoHome}>
                <Home className="size-4 mr-2" />
                Início
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Status Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-2">
              <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className={`${complexity.color} p-6 rounded-full shadow-lg`}
                  >
                    <ComplexityIcon className="size-12 text-white" />
                  </motion.div>
                </div>
                <CardTitle className="text-3xl mb-2">Diagnóstico Gerado com Sucesso!</CardTitle>
                <CardDescription className="text-base">
                  Análise completa do seu pedido de {result.serviceName}
                </CardDescription>
              </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">Complexidade</p>
                  <Badge className={`${complexity.color} text-white text-base px-5 py-2 shadow-md`}>
                    {complexity.label}
                  </Badge>
                </div>
                <div className="text-center space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">Prioridade</p>
                  <Badge variant={priority.variant} className="text-base px-5 py-2 shadow-md">
                    {priority.label}
                  </Badge>
                </div>
                <div className="text-center space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">Tipo de Serviço</p>
                  <Badge className={`${result.serviceType === 'manutencao' ? 'bg-blue-500' : 'bg-green-500'} text-white text-base px-5 py-2 shadow-md`}>
                    {serviceType}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          </motion.div>

          {/* Estimativas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-2">
              <CardHeader className="text-center pb-4">
                <CardTitle className="flex items-center justify-center gap-2 text-xl">
                  <Clock className="size-6" />
                  Prazo Estimado
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center pt-4">
                <p className="text-5xl font-bold text-primary mb-4">{estimatedTime}</p>
                <p className="text-base text-muted-foreground">
                  Tempo estimado para conclusão do serviço
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Aviso Importante sobre Prazos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700/50 border-2">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-amber-500 rounded-lg shadow-md">
                      <Info className="size-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <h4 className="font-semibold text-base text-amber-900 dark:text-amber-100">Importante: Prazo Sujeito a Alteração</h4>
                    <p className="text-sm text-amber-800 dark:text-amber-200">Os prazos apresentados acima são <strong>estimativas preliminares</strong> baseadas nas informações fornecidas no questionário. Após uma análise técnica detalhada e aprofundada do seu projeto, nossa equipe poderá ajustar esses prazos para mais ou para menos, considerando:</p>
                    <ul className="text-sm text-amber-800 dark:text-amber-200 list-disc list-inside space-y-1 ml-2">
                      <li>Complexidades técnicas específicas identificadas</li>
                      <li>Requisitos adicionais de infraestrutura ou integração</li>
                      <li>Disponibilidade de recursos e tecnologias necessárias</li>
                      <li>Escopo detalhado após reunião técnica</li>
                    </ul>
                    <p className="text-sm text-amber-800 dark:text-amber-200 mt-3">
                      O orçamento será apresentado formalmente após a análise completa, garantindo total transparência e alinhamento de expectativas.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Dados do Cliente */}
          {userData && (
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-xl">Dados do Cliente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Nome</p>
                    <p className="text-base font-semibold">{userData.nomeCompleto}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">E-mail</p>
                    <p className="text-base font-semibold">{userData.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                    <p className="text-base font-semibold">{userData.telefone}</p>
                  </div>
                  {userData.empresa && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Empresa</p>
                      <p className="text-base font-semibold">{userData.empresa}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Descrição */}
          {result.description && (
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <FileText className="size-6" />
                  Descrição Detalhada
                </CardTitle>
                <CardDescription className="text-base">Informações adicionais fornecidas pelo cliente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 p-5 rounded-lg border">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{result.description}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Respostas */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-xl">Respostas do Questionário</CardTitle>
              <CardDescription className="text-base">Resumo completo das suas respostas ({result.answersCount} perguntas respondidas)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {questionsByService[result.serviceType]?.map((question, index) => {
                  const answer = result.answers[question.id];
                  const selectedOption = question.options.find((opt) => opt.value === answer);

                  if (!selectedOption) return null;

                  return (
                    <div key={question.id}>
                      {index > 0 && <Separator className="my-5" />}
                      <div className="space-y-2">
                        <p className="font-semibold text-base">
                          {index + 1}. {question.question}
                        </p>
                        <div className="bg-muted/50 p-3 rounded-md ml-6">
                          <p className="text-sm">{selectedOption.label}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Próximos Passos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 border-2">
              <CardHeader>
                <CardTitle className="text-xl">Próximos Passos</CardTitle>
                <CardDescription className="text-base">Veja o que acontece após o envio do diagnóstico</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center size-10 rounded-full bg-blue-600 text-white text-lg font-bold flex-shrink-0 shadow-md">
                    1
                  </div>
                  <div className="pt-1 flex-1">
                    <p className="font-semibold mb-2 text-base">Contato Inicial</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Nossa equipe entrará em contato em até 24 horas úteis.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center size-10 rounded-full bg-blue-600 text-white text-lg font-bold flex-shrink-0 shadow-md">
                    2
                  </div>
                  <div className="pt-1 flex-1">
                    <p className="font-semibold mb-2 text-base">Retirada e Orçamento</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Faremos a retirada do equipamento e encaminharemos ao profissional para realizar o orçamento detalhado.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center size-10 rounded-full bg-blue-600 text-white text-lg font-bold flex-shrink-0 shadow-md">
                    3
                  </div>
                  <div className="pt-1 flex-1">
                    <p className="font-semibold mb-2 text-base">Execução e Entrega</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Após aprovação, o profissional fará o serviço e devolveremos seu equipamento.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 print:hidden pt-6"
          >
            <Button onClick={handleNewRequest} className="flex-1" size="lg">
              Fazer Nova Solicitação
            </Button>
            <Button onClick={handleGoHome} variant="outline" className="flex-1" size="lg">
              Voltar ao Início
            </Button>
          </motion.div>
        </div>
      </main>
    </div>
  );
}