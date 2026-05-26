import { useEffect, useState, type ComponentType } from 'react';
import { motion } from 'motion/react';
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock,
  FileText,
  Mail,
  Phone,
  User,
} from 'lucide-react';
import { Badge } from '../app/components/ui/badge';
import { Button } from '../app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../app/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../app/components/ui/dialog';
import { ScrollArea } from '../app/components/ui/scroll-area';
import { api, type ClientData, type QuestionnaireResult } from '../app/api';
import { questionsByService } from '../app/data/questions';

interface Order {
  id: number;
  title: string;
  type: 'Hardware' | 'Redes';
  status: 'analise' | 'em_andamento' | 'concluido';
  priority: 'baixa' | 'media' | 'alta' | 'urgente';
  professional: string;
  estimatedTime: string;
  createdAt: string;
  questionnaireData?: QuestionnaireResult;
  client?: ClientData | null;
}

const mockOrders: Order[] = [
  {
    id: 1,
    title: 'Manutenção PC Dell Inspiron',
    type: 'Hardware',
    status: 'analise',
    priority: 'alta',
    professional: 'Carlos Silva',
    estimatedTime: '2-3 dias',
    createdAt: '2026-04-05',
  },
  {
    id: 2,
    title: 'Instalação Rede Wi-Fi Empresarial',
    type: 'Redes',
    status: 'em_andamento',
    priority: 'media',
    professional: 'Ana Santos',
    estimatedTime: '3-5 dias',
    createdAt: '2026-04-03',
  },
  {
    id: 3,
    title: 'Configuração Firewall',
    type: 'Redes',
    status: 'analise',
    priority: 'urgente',
    professional: 'Roberto Lima',
    estimatedTime: '1 dia',
    createdAt: '2026-04-06',
  },
  {
    id: 4,
    title: 'Upgrade SSD e Memória RAM',
    type: 'Hardware',
    status: 'concluido',
    priority: 'baixa',
    professional: 'Julia Ferreira',
    estimatedTime: '1 dia',
    createdAt: '2026-03-20',
  },
  {
    id: 5,
    title: 'Cabeamento Estruturado Escritório',
    type: 'Redes',
    status: 'em_andamento',
    priority: 'media',
    professional: 'Ana Santos',
    estimatedTime: '5-7 dias',
    createdAt: '2026-04-01',
  },
];

const statusConfig = {
  analise: {
    label: 'Em Análise',
    color: 'border-blue-400 dark:border-blue-600',
    bgColor: 'from-blue-500/10 to-blue-600/5',
    badgeColor: 'bg-blue-500',
  },
  em_andamento: {
    label: 'Em Andamento',
    color: 'border-orange-400 dark:border-orange-600',
    bgColor: 'from-orange-500/10 to-orange-600/5',
    badgeColor: 'bg-orange-500',
  },
  concluido: {
    label: 'Concluído',
    color: 'border-green-400 dark:border-green-600',
    bgColor: 'from-green-500/10 to-green-600/5',
    badgeColor: 'bg-green-500',
  },
};

const priorityConfig = {
  baixa: { label: 'Baixa', variant: 'secondary' as const },
  media: { label: 'Média', variant: 'default' as const },
  alta: { label: 'Alta', variant: 'destructive' as const },
  urgente: { label: 'Urgente', variant: 'destructive' as const },
};

const typeColors = {
  Hardware: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  Redes: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
};

type IconComponent = ComponentType<{ className?: string }>;

function getAnswerRows(order: Order) {
  const questionnaire = order.questionnaireData;
  const answers = questionnaire?.answers || {};
  const questions = questionsByService[questionnaire?.serviceType || ''] || [];

  return Object.entries(answers).map(([questionId, answer]) => {
    const question = questions.find((item) => item.id === questionId);
    const option = question?.options.find((item) => item.value === answer);

    return {
      id: questionId,
      question: question?.question || questionId,
      answer: option?.label || answer,
    };
  });
}

function InfoItem({ icon: Icon, label, value }: { icon: IconComponent; label: string; value?: string | number | null }) {
  if (value === undefined || value === null || value === '') return null;

  return (
    <div className="flex min-w-0 items-start gap-2 text-sm">
      <Icon className="mt-0.5 size-4 flex-shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="break-words font-medium">{value}</p>
      </div>
    </div>
  );
}

export default function OrdersProfissionalKanban() {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [allOrders, setAllOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const serverOrders = await api.listOrders();
        if (serverOrders.length > 0) {
          setAllOrders(serverOrders);
          localStorage.setItem('orders', JSON.stringify(serverOrders));
          return;
        }
      } catch (error) {
        // O fallback local mantem a tela utilizavel sem o servidor.
      }

      const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const savedOrderIds = savedOrders.map((order: Order) => order.id);
      const filteredMockOrders = mockOrders.filter((order) => !savedOrderIds.includes(order.id));

      setAllOrders([...filteredMockOrders, ...savedOrders]);
    };

    loadOrders();
  }, []);

  const handleAcceptService = async (orderId: number) => {
    let acceptedOrder: Order | undefined;

    const updatedOrders = allOrders.map((order) => {
      if (order.id !== orderId) return order;
      acceptedOrder = { ...order, status: 'em_andamento' as const, professional: 'Profissional Atribuído' };
      return acceptedOrder;
    });
    setAllOrders(updatedOrders);
    if (selectedOrder?.id === orderId && acceptedOrder) {
      setSelectedOrder(acceptedOrder);
    }

    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const updatedSavedOrders = savedOrders.map((order: Order) =>
      order.id === orderId ? { ...order, status: 'em_andamento' as const, professional: 'Profissional Atribuído' } : order,
    );

    if (!savedOrders.find((order: Order) => order.id === orderId)) {
      const mockOrder = mockOrders.find((order) => order.id === orderId);
      if (mockOrder) {
        updatedSavedOrders.push({ ...mockOrder, status: 'em_andamento' as const, professional: 'Profissional Atribuído' });
      }
    }

    localStorage.setItem('orders', JSON.stringify(updatedSavedOrders));

    try {
      const professionalData = JSON.parse(localStorage.getItem('professionalData') || 'null');
      await api.updateOrder(orderId, {
        status: 'em_andamento',
        professional: professionalData?.nomeCompleto || 'Profissional Atribuído',
      });
    } catch (error) {
      // A alteracao local continua disponivel se a API estiver offline.
    }
  };

  const handleCompleteService = async (orderId: number) => {
    const updatedOrders = allOrders.map((order) => (order.id === orderId ? { ...order, status: 'concluido' as const } : order));
    setAllOrders(updatedOrders);

    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const updatedSavedOrders = savedOrders.map((order: Order) =>
      order.id === orderId ? { ...order, status: 'concluido' as const } : order,
    );

    if (!savedOrders.find((order: Order) => order.id === orderId)) {
      const mockOrder = mockOrders.find((order) => order.id === orderId);
      if (mockOrder) {
        updatedSavedOrders.push({ ...mockOrder, status: 'concluido' as const });
      }
    }

    localStorage.setItem('orders', JSON.stringify(updatedSavedOrders));

    try {
      await api.updateOrder(orderId, { status: 'concluido' });
    } catch (error) {
      // A alteracao local continua disponivel se a API estiver offline.
    }
  };

  const filteredOrders = selectedFilter ? allOrders.filter((order) => order.type === selectedFilter) : allOrders;
  const columns: Array<keyof typeof statusConfig> = ['analise', 'em_andamento', 'concluido'];
  const selectedQuestionnaire = selectedOrder?.questionnaireData;
  const selectedAnswerRows = selectedOrder ? getAnswerRows(selectedOrder) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-6 md:py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 md:mb-12"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">Dashboard de Pedidos - Profissional</h1>
          <p className="text-base md:text-lg text-muted-foreground">
            Gerencie os serviços atribuídos e acompanhe o progresso dos atendimentos
          </p>
        </motion.div>

        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            variant={selectedFilter === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter(null)}
            className="font-mono"
          >
            {'>'} TODOS
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-3">
          {columns.map((status) => {
            const config = statusConfig[status];
            const ordersInColumn = filteredOrders.filter((order) => order.status === status);

            return (
              <div key={status} className="space-y-4">
                <Card className={`border-2 ${config.color}`}>
                  <CardHeader className={`bg-gradient-to-br ${config.bgColor}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <motion.div
                          animate={status === 'analise' ? { scale: [1, 1.2, 1] } : {}}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className={`size-3 rounded-full ${config.badgeColor}`}
                        />
                        <CardTitle className="text-lg">{config.label}</CardTitle>
                      </div>
                      <Badge variant="secondary">{ordersInColumn.length}</Badge>
                    </div>
                  </CardHeader>
                </Card>

                <div className="space-y-4">
                  {ordersInColumn.map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className={`group relative overflow-hidden border-2 transition-all duration-300 hover:shadow-xl ${config.color}`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-md dark:from-gray-800/60 dark:to-gray-800/30" />

                        <CardHeader className="relative pb-3">
                          <div className="mb-2 flex items-start justify-between gap-2">
                            <Badge className={typeColors[order.type]}>{order.type}</Badge>
                            {order.questionnaireData && (
                              <Badge variant="outline" className="text-xs">
                                Anamnese
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-base leading-tight transition-colors group-hover:text-primary">{order.title}</CardTitle>
                          <CardDescription className="text-xs">#{order.id}</CardDescription>
                        </CardHeader>

                        <CardContent className="relative space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Prioridade:</span>
                            <Badge variant={priorityConfig[order.priority].variant} className="text-xs">
                              {priorityConfig[order.priority].label}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <User className="size-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{order.professional}</span>
                          </div>

                          <div className="flex items-center gap-2 border-t pt-2">
                            <Clock className="size-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{order.estimatedTime}</span>
                          </div>

                          <p className="text-xs text-muted-foreground">
                            Criado em: {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                          </p>

                          <Button className="mt-3 w-full" size="sm" variant="outline" onClick={() => setSelectedOrder(order)}>
                            <ClipboardList className="mr-2 size-4" />
                            Ver anamnese
                          </Button>

                          {order.status === 'analise' && (
                            <Button
                              className="mt-3 w-full bg-green-600 hover:bg-green-700"
                              size="sm"
                              onClick={() => handleAcceptService(order.id)}
                            >
                              Aceitar serviço
                            </Button>
                          )}
                          {order.status === 'em_andamento' && (
                            <Button
                              className="mt-3 w-full bg-blue-600 hover:bg-blue-700"
                              size="sm"
                              onClick={() => handleCompleteService(order.id)}
                            >
                              Concluir serviço
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
          <DialogContent className="max-h-[92vh] max-w-4xl p-0">
            {selectedOrder && (
              <>
                <DialogHeader className="border-b px-6 py-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={typeColors[selectedOrder.type]}>{selectedOrder.type}</Badge>
                    <Badge variant={priorityConfig[selectedOrder.priority].variant}>
                      {priorityConfig[selectedOrder.priority].label}
                    </Badge>
                    <Badge variant="outline">{statusConfig[selectedOrder.status].label}</Badge>
                  </div>
                  <DialogTitle className="text-2xl">{selectedOrder.title}</DialogTitle>
                  <DialogDescription>
                    Pedido #{selectedOrder.id} criado em {new Date(selectedOrder.createdAt).toLocaleDateString('pt-BR')}
                  </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[64vh]">
                  <div className="space-y-6 px-6 py-5">
                    <section className="grid gap-4 rounded-md border bg-muted/30 p-4 md:grid-cols-2">
                      <InfoItem icon={User} label="Cliente" value={selectedOrder.client?.nomeCompleto || 'Cliente não informado'} />
                      <InfoItem icon={Phone} label="Telefone" value={selectedOrder.client?.telefone} />
                      <InfoItem icon={Mail} label="E-mail" value={selectedOrder.client?.email} />
                      <InfoItem icon={CalendarDays} label="Prazo estimado" value={selectedOrder.estimatedTime} />
                    </section>

                    <section className="space-y-3">
                      <div className="flex items-center gap-2">
                        <FileText className="size-5 text-primary" />
                        <h3 className="text-lg font-semibold">Descrição do pedido</h3>
                      </div>
                      <div className="rounded-md border bg-background p-4">
                        {selectedQuestionnaire?.description ? (
                          <p className="whitespace-pre-wrap text-sm leading-relaxed">{selectedQuestionnaire.description}</p>
                        ) : (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <AlertCircle className="size-4" />
                            O cliente não adicionou uma descrição detalhada.
                          </div>
                        )}
                      </div>
                    </section>

                    <section className="grid gap-3 rounded-md border bg-muted/30 p-4 md:grid-cols-3">
                      <InfoItem icon={ClipboardList} label="Serviço" value={selectedQuestionnaire?.serviceName || selectedOrder.title} />
                      <InfoItem
                        icon={CheckCircle2}
                        label="Perguntas respondidas"
                        value={selectedQuestionnaire?.answersCount ?? selectedAnswerRows.length}
                      />
                      <InfoItem icon={AlertCircle} label="Pontuação média" value={selectedQuestionnaire?.averageScore?.toFixed(1)} />
                    </section>

                    <section className="space-y-3">
                      <div className="flex items-center gap-2">
                        <ClipboardList className="size-5 text-primary" />
                        <h3 className="text-lg font-semibold">Respostas da anamnese</h3>
                      </div>

                      {selectedAnswerRows.length > 0 ? (
                        <div className="divide-y rounded-md border bg-background">
                          {selectedAnswerRows.map((row) => (
                            <div key={row.id} className="grid gap-2 p-4 md:grid-cols-[1.2fr_1fr]">
                              <p className="text-sm font-medium">{row.question}</p>
                              <p className="text-sm text-muted-foreground">{row.answer}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-md border bg-background p-4 text-sm text-muted-foreground">
                          Nenhuma resposta de anamnese foi encontrada para este pedido.
                        </div>
                      )}
                    </section>
                  </div>
                </ScrollArea>

                <DialogFooter className="border-t px-6 py-4">
                  <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                    Fechar
                  </Button>
                  {selectedOrder.status === 'analise' && (
                    <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleAcceptService(selectedOrder.id)}>
                      Aceitar serviço
                    </Button>
                  )}
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
