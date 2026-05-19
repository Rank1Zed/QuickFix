import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Activity, Users, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export function SystemStatus() {
  const status = {
    online: true,
    techniciansAvailable: 5,
    avgResponseTime: '15min',
    activeRequests: 12,
  };

  return (
    <Card className="border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Status Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="relative"
              >
                <span className="flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
                </span>
              </motion.div>
              <div>
                <h3 className="font-bold text-lg">Status do Sistema</h3>
                <p className="text-sm text-muted-foreground">Todos os serviços operacionais</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-500 text-white border-0 gap-1">
              <CheckCircle className="size-3" />
              ONLINE
            </Badge>
          </div>

          {/* Status Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
              <Users className="size-5 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold text-blue-600">
                {status.techniciansAvailable}
              </div>
              <p className="text-xs text-muted-foreground">Técnicos Online</p>
            </div>
            
            <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
              <Clock className="size-5 mx-auto mb-2 text-orange-500" />
              <div className="text-2xl font-bold text-orange-600">
                {status.avgResponseTime}
              </div>
              <p className="text-xs text-muted-foreground">Tempo Médio</p>
            </div>
            
            <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
              <Activity className="size-5 mx-auto mb-2 text-purple-500" />
              <div className="text-2xl font-bold text-purple-600">
                {status.activeRequests}
              </div>
              <p className="text-xs text-muted-foreground">Atendimentos</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
