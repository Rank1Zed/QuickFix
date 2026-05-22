import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Clock, User, MoreVertical, Filter, Eye, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { api } from '../api';

interface Order {
  id: number;
  title: string;
  type: 'Hardware' | 'Redes';
  status: 'analise' | 'em_andamento' | 'concluido';
  priority: 'baixa' | 'media' | 'alta' | 'urgente';
  professional: string;
  estimatedTime: string;
  createdAt: string;
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

export default function OrdersKanban() {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [allOrders, setAllOrders] = useState<Order[]>(mockOrders);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const serverOrders = await api.listOrders();
        if (serverOrders.length > 0) {
          setAllOrders(serverOrders);
          localStorage.setItem("orders", JSON.stringify(serverOrders));
          return;
        }
      } catch (error) {
        // O fallback local mantem a tela utilizavel sem o servidor.
      }

      const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");

      // Mesclar orders: saved orders sobrescrevem mock orders com mesmo ID
      const savedOrderIds = savedOrders.map((o: Order) => o.id);
      const filteredMockOrders = mockOrders.filter(mo => !savedOrderIds.includes(mo.id));

      setAllOrders([...filteredMockOrders, ...savedOrders]);
    };

    loadOrders();
  }, []);

  const filteredOrders = selectedFilter
    ? allOrders.filter((order) => order.type === selectedFilter)
    : allOrders;

  const columns: Array<keyof typeof statusConfig> = ['analise', 'em_andamento', 'concluido'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-6 md:py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 md:mb-12"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">Dashboard de Pedidos</h1>
          <p className="text-base md:text-lg text-muted-foreground">
            Visualização em tempo real dos seus projetos e solicitações
          </p>
        </motion.div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            variant={selectedFilter === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter(null)}
            className="font-mono"
          >
            {'>'} TODOS
          </Button>
          {Object.keys(typeColors).map((type) => (
            null
          ))}
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {columns.map((status) => {
            const config = statusConfig[status];
            const ordersInColumn = filteredOrders.filter((order) => order.status === status);

            return (
              <div key={status} className="space-y-4">
                {/* Column Header */}
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

                {/* Cards */}
                <div className="space-y-4">
                  {ordersInColumn.map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card
                        className={`group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 ${config.color} relative overflow-hidden`}
                      >
                        {/* Glassmorphism background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/30 dark:from-gray-800/60 dark:to-gray-800/30 backdrop-blur-md" />

                        <CardHeader className="relative pb-3">
                          <div className="flex items-start justify-between mb-2">
                            <Badge className={typeColors[order.type]}>{order.type}</Badge>
                            <Button variant="ghost" size="icon" className="size-6">
                              <MoreVertical className="size-4" />
                            </Button>
                          </div>
                          <CardTitle className="text-base leading-tight group-hover:text-primary transition-colors">
                            {order.title}
                          </CardTitle>
                          <CardDescription className="text-xs">#{order.id}</CardDescription>
                        </CardHeader>

                        <CardContent className="relative space-y-3">
                          {/* Priority */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Prioridade:</span>
                            <Badge variant={priorityConfig[order.priority].variant} className="text-xs">
                              {priorityConfig[order.priority].label}
                            </Badge>
                          </div>

                          {/* Professional */}
                          <div className="flex items-center gap-2 text-sm">
                            <User className="size-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{order.professional}</span>
                          </div>

                          {/* Time */}
                          <div className="flex items-center gap-2 pt-2 border-t">
                            <Clock className="size-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{order.estimatedTime}</span>
                          </div>

                          {/* Created Date */}
                          <p className="text-xs text-muted-foreground">
                            Criado em: {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
