import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Computer, Wifi, LogOut, FileText, Clock, ArrowRight, LayoutDashboard, ArrowLeft, Plus } from "lucide-react";
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

export default function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [history, setHistory] = useState<QuestionnaireResult[]>([]);

  useEffect(() => {
    // Verificar se usuário está logado
    const userDataStr = localStorage.getItem("userData");
    if (!userDataStr) {
      navigate("/");
      return;
    }

    setUserData(JSON.parse(userDataStr));

    // Carregar histórico (neste exemplo, apenas o último resultado)
    const lastResult = localStorage.getItem("questionnaireResult");
    if (lastResult) {
      setHistory([JSON.parse(lastResult)]);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("questionnaireResult");
    navigate("/");
  };

  const services = [
    {
      id: "manutencao",
      title: "Manutenção de Computadores",
      description: "Diagnóstico, reparo e otimização",
      icon: Computer,
      color: "blue",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      id: "redes",
      title: "Rede de Computadores",
      description: "Configuração e infraestrutura",
      icon: Wifi,
      color: "green",
      gradient: "from-green-500 to-green-600",
    },
  ];

  const getComplexityBadge = (score: number) => {
    if (score <= 1.5) return { label: "Baixa", variant: "outline" as const };
    if (score <= 2.5) return { label: "Média", variant: "secondary" as const };
    if (score <= 3.5) return { label: "Alta", variant: "default" as const };
    return { label: "Muito Alta", variant: "destructive" as const };
  };

  const getPriorityLevel = (score: number) => {
    if (score <= 1.5) return { label: "Baixa Prioridade", variant: "outline" as const };
    if (score <= 2.5) return { label: "Prioridade Normal", variant: "secondary" as const };
    if (score <= 3.5) return { label: "Alta Prioridade", variant: "default" as const };
    return { label: "Prioridade Urgente", variant: "destructive" as const };
  };

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

  if (!userData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
              <Button variant="ghost" onClick={() => navigate("/")} className="gap-2 flex-shrink-0">
                <ArrowLeft className="size-4" />
                <span className="hidden sm:inline">Voltar para Home</span>
                <span className="sm:hidden">Home</span>
              </Button>
              <div className="min-w-0">
                <h1 className="text-xl md:text-2xl font-bold truncate">Quick Fix</h1>
                <p className="text-xs md:text-sm text-muted-foreground truncate">
                  Olá, <span className="font-medium">{userData.nomeCompleto.split(" ")[0]}</span>!
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout} className="flex-shrink-0">
              <LogOut className="size-4 mr-0 sm:mr-2" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-4"
          >
            <h2 className="text-4xl md:text-5xl font-bold">Painel do Cliente</h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Selecione uma área abaixo para iniciar uma nova análise de serviço
            </p>
          </motion.div>

          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="w-full max-w-xs"
                >
                  <Card
                    className="group hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer border-2 hover:border-primary flex flex-col h-full"
                    onClick={() => navigate(`/questionnaire/${service.id}`)}
                  >
                    <CardHeader className="space-y-4 flex-1">
                      <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${service.gradient} w-fit shadow-lg`}>
                        <Icon className="size-7 text-white" />
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {service.title}
                      </CardTitle>
                      <CardDescription className="text-sm leading-relaxed">
                        {service.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button className="w-full group-hover:shadow-md transition-all" variant="outline" size="sm">
                        <Plus className="size-4 mr-2" />
                        Iniciar Anamnese
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Botão de ação */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-center max-w-4xl mx-auto pt-4"
          >
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/orders")}
              className="px-16 py-6 text-base hover:shadow-lg transition-all"
            >
              <LayoutDashboard className="size-5 mr-2" />
              Meus Pedidos
            </Button>
          </motion.div>

          {/* Histórico */}
          {history.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="pt-8"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-3xl font-bold mb-1">Anamneses Recentes</h3>
                  <p className="text-sm text-muted-foreground">Histórico dos seus diagnósticos realizados</p>
                </div>
                <Badge variant="secondary" className="text-sm px-4 py-2 font-semibold shadow-sm">{history.length} registro(s)</Badge>
              </div>

              <div className="space-y-5">
                {history.map((item, index) => {
                  const complexity = getComplexityBadge(item.averageScore);
                  const priority = getPriorityLevel(item.averageScore);
                  const estimatedTime = getEstimatedTime(item.averageScore, item.serviceType);
                  const serviceIcon = services.find(s => s.id === item.serviceType);
                  const ServiceIcon = serviceIcon?.icon || FileText;

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    >
                      <Card className="hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border-2 hover:border-primary/50 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50">
                        <CardHeader className="pb-3">
                          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                            <div className="flex gap-4 flex-1 min-w-0">
                              <div className={`p-3 rounded-xl bg-gradient-to-br ${serviceIcon?.gradient || 'from-gray-500 to-gray-600'} flex-shrink-0 shadow-lg ring-2 ring-white/20`}>
                                <ServiceIcon className="size-7 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-xl mb-2 truncate">
                                  {item.serviceName}
                                </CardTitle>
                                <CardDescription className="text-sm flex items-center gap-1.5">
                                  <Clock className="size-3.5" />
                                  {new Date(item.timestamp).toLocaleDateString('pt-BR', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </CardDescription>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate("/result")}
                              className="self-start sm:self-center hover:bg-primary hover:text-white transition-colors flex-shrink-0"
                            >
                              Ver Resultado
                              <ArrowRight className="size-4 ml-2" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="border-t pt-4">
                            <div className="flex flex-wrap gap-2.5">
                              <Badge variant={complexity.variant} className="px-4 py-1.5 text-xs font-semibold shadow-sm">
                                Complexidade: {complexity.label}
                              </Badge>
                              <Badge className="px-4 py-1.5 text-xs font-semibold bg-[#2B7FFF] hover:bg-[#2B7FFF]/90 text-white shadow-sm">
                                <Clock className="size-3.5 mr-1.5" />
                                Prazo: {estimatedTime}
                              </Badge>
                              <Badge variant={priority.variant} className="px-4 py-1.5 text-xs font-semibold shadow-sm">
                                {priority.label}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="pt-8"
          >
            <div className="flex flex-wrap justify-center gap-6">
              <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 w-full max-w-sm hover:shadow-lg transition-all">
                <CardContent className="pt-6 pb-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-500 rounded-lg shadow-md">
                      <FileText className="size-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-base mb-2">Questionário Inteligente</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Perguntas específicas para cada área de serviço
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 w-full max-w-sm hover:shadow-lg transition-all">
                <CardContent className="pt-6 pb-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-500 rounded-lg shadow-md">
                      <Clock className="size-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-base mb-2">Diagnóstico Rápido</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Análise automática de complexidade e prioridade
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}