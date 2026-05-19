import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { DollarSign, TrendingDown, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

export function ROICalculator() {
  const [hoursDown, setHoursDown] = useState('');
  const [employeeCount, setEmployeeCount] = useState('');
  const [avgSalary, setAvgSalary] = useState('100');

  const calculateLoss = () => {
    const hours = parseFloat(hoursDown) || 0;
    const employees = parseFloat(employeeCount) || 0;
    const salary = parseFloat(avgSalary) || 0;

    // Cálculo: (horas paradas) x (número de funcionários) x (salário por hora)
    const hourlyRate = salary;
    const totalLoss = hours * employees * hourlyRate;

    return totalLoss;
  };

  const loss = calculateLoss();

  return (
    <Card className="overflow-hidden border-2 border-orange-200 dark:border-orange-800 bg-gradient-to-br from-white to-orange-50 dark:from-gray-900 dark:to-orange-950">
      <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/20 rounded-lg">
            <TrendingDown className="size-6" />
          </div>
          <div>
            <CardTitle className="text-white text-2xl">Calculadora de Prejuízo</CardTitle>
            <CardDescription className="text-white/80">
              Descubra quanto sua empresa perde com problemas técnicos
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hours">Horas de Sistema Parado</Label>
              <Input
                id="hours"
                type="number"
                placeholder="Ex: 8"
                value={hoursDown}
                onChange={(e) => setHoursDown(e.target.value)}
                className="text-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employees">Funcionários Afetados</Label>
              <Input
                id="employees"
                type="number"
                placeholder="Ex: 10"
                value={employeeCount}
                onChange={(e) => setEmployeeCount(e.target.value)}
                className="text-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary">Custo por Hora (R$)</Label>
              <Input
                id="salary"
                type="number"
                placeholder="Ex: 100"
                value={avgSalary}
                onChange={(e) => setAvgSalary(e.target.value)}
                className="text-lg"
              />
            </div>
          </div>

          {loss > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="bg-red-100 dark:bg-red-950 border-2 border-red-300 dark:border-red-700 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <AlertTriangle className="size-6 text-red-600" />
                  <h3 className="text-xl font-bold text-red-900 dark:text-red-100">
                    Prejuízo Estimado
                  </h3>
                </div>
                <div className="flex items-baseline gap-2">
                  <DollarSign className="size-8 text-red-600" />
                  <span className="text-5xl font-bold text-red-600">
                    {loss.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <p className="text-sm text-red-700 dark:text-red-300 mt-2">
                  Este é o valor estimado de prejuízo com base nos dados informados
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg p-6 border-2 border-blue-200 dark:border-blue-700">
                <h4 className="font-bold text-lg mb-2">💡 Solução Quick Fix</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Nossa equipe pode resolver problemas técnicos em até 24h, minimizando seu prejuízo.
                  Investimento a partir de R$ 200,00.
                </p>
                <div className="flex gap-3">
                  <Button className="flex-1">
                    Solicitar Atendimento Urgente
                  </Button>
                  <Button variant="outline">
                    Falar com Especialista
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {loss === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <TrendingDown className="size-12 mx-auto mb-3 opacity-50" />
              <p>Preencha os campos acima para calcular o prejuízo estimado</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
