import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Computer, Wifi, LogOut, FileText, Clock, ArrowRight, LayoutDashboard, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
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

export default function ProfessionalDashboard() {
  const navigate = useNavigate();
  const [professionalData, setProfessionalData] = useState<any>(null);
  const [pendingTasks, setPendingTasks] = useState<QuestionnaireResult[]>([]);

  useEffect(() => {
    // Verificar se profissional está logado
    const professionalDataStr = localStorage.getItem("professionalData");
    if (!professionalDataStr) {
      navigate("/professional-login");
      return;
    }

    setProfessionalData(JSON.parse(professionalDataStr));

    // Carregar tarefas pendentes (simulando com resultado de questionário se existir)
    const lastResult = localStorage.getItem("questionnaireResult");
    if (lastResult) {
      setPendingTasks([JSON.parse(lastResult)]);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("professionalData");
    navigate("/");
  };

  const services = [
    {
      id: "manutencao",
      title: "Manutenção de Computadores",
      description: "Atendimentos de hardware e software",
      icon: Computer,
      color: "blue",
      gradient: "from-blue-500 to-blue-600",
      count: 3,
    },
    {
      id: "redes",
      title: "Rede de Computadores",
      description: "Projetos de infraestrutura",
      icon: Wifi,
      color: "green",
      gradient: "from-green-500 to-green-600",
      count: 2,
    },
  ];

  const getComplexityBadge = (score: number) => {
    if (score <= 1.5) return { label: "Baixa", variant: "outline" as const };
    if (score <= 2.5) return { label: "Média", variant: "secondary" as const };
    if (score <= 3.5) return { label: "Alta", variant: "default" as const };
    return { label: "Muito Alta", variant: "destructive" as const };
  };

  if (!professionalData) {
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
                <h1 className="text-xl md:text-2xl font-bold text-green-600 truncate">Quick Fix - Profissional</h1>
                <p className="text-xs md:text-sm text-muted-foreground truncate">
                  Olá, <span className="font-medium">{professionalData.nomeCompleto.split(" ")[0]}</span>!
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
            <h2 className="text-4xl md:text-5xl font-bold">Painel do Profissional</h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Gerencie seus atendimentos e acompanhe o progresso das tarefas
            </p>
          </motion.div>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="w-full max-w-xs"
                >
                  <Card className="group hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 h-full">
                    <CardHeader className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${service.gradient} shadow-lg`}>
                          <Icon className="size-6 text-white" />
                        </div>
                        <Badge variant="secondary" className="text-lg font-bold px-3 py-1">
                          {service.count}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {service.title}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {service.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-center pt-4"
          >
            <Button size="lg" onClick={() => navigate("/orders-profissional")} className="px-16 py-6 text-base bg-green-600 hover:bg-green-700 hover:shadow-lg transition-all">
              <LayoutDashboard className="size-5 mr-2" />
              Ordens de Serviço
            </Button>
          </motion.div>

          {/* Tarefas Pendentes */}
          {pendingTasks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="pt-8"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-3xl font-bold mb-1">Serviços Disponíveis</h3>
                  <p className="text-sm text-muted-foreground">Pedidos aguardando atendimento</p>
                </div>
                <Badge variant="default" className="bg-green-600 text-sm px-4 py-2 font-semibold shadow-sm">{pendingTasks.length} disponíveis</Badge>
              </div>

              <div className="space-y-5">
                {pendingTasks.map((item, index) => {
                  const complexity = getComplexityBadge(item.averageScore);
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
                                Solicitado em {new Date(item.timestamp).toLocaleDateString('pt-BR', {
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
                            variant="default"
                            size="sm"
                            className="self-start sm:self-center bg-green-600 hover:bg-green-700 transition-colors flex-shrink-0"
                            onClick={() => navigate("/result")}
                          >
                            Ver Detalhes
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
                            <Badge variant="outline" className="px-4 py-1.5 text-xs font-semibold shadow-sm bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700">
                              <AlertCircle className="size-3.5 mr-1.5" />
                              Aguardando Atendimento
                            </Badge>
                            {item.description && (
                              <Badge variant="outline" className="px-4 py-1.5 text-xs font-semibold shadow-sm">
                                <CheckCircle2 className="size-3.5 mr-1.5" />
                                Com descrição detalhada
                              </Badge>
                            )}
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
            className="flex flex-wrap justify-center gap-6 pt-8"
          >
            <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 w-full max-w-xs">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <FileText className="size-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Atendimentos</h4>
                    <p className="text-sm text-muted-foreground">
                      Gerencie chamados atribuídos a você
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 w-full max-w-xs">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Clock className="size-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Priorização</h4>
                    <p className="text-sm text-muted-foreground">
                      Tarefas organizadas por urgência
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

          </motion.div>
        </div>
      </main>
    </div>
  );
}
