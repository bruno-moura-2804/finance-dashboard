
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, TrendingUp, AlertTriangle, Target } from 'lucide-react';

interface FinancialTipsProps {
  saldoRestante: number;
  totalDespesas: number;
  saldoInicial: number;
}

export const FinancialTips: React.FC<FinancialTipsProps> = ({
  saldoRestante,
  totalDespesas,
  saldoInicial
}) => {
  const getTips = () => {
    const tips = [];
    const percentualGasto = saldoInicial > 0 ? (totalDespesas / saldoInicial) * 100 : 0;

    if (saldoRestante < 0) {
      tips.push({
        type: 'warning',
        icon: AlertTriangle,
        title: 'Atenção: Saldo Negativo',
        description: 'Suas despesas excedem o saldo. Considere revisar seus gastos ou aumentar sua renda.',
        color: 'text-red-400'
      });
    } else if (saldoRestante > 0) {
      const economia10 = saldoRestante * 0.1;
      const economia20 = saldoRestante * 0.2;
      
      tips.push({
        type: 'success',
        icon: TrendingUp,
        title: 'Oportunidade de Economia',
        description: `Você pode economizar R$ ${economia10.toFixed(2)} (10%) ou R$ ${economia20.toFixed(2)} (20%) do seu saldo restante.`,
        color: 'text-green-400'
      });
    }

    if (percentualGasto > 90) {
      tips.push({
        type: 'warning',
        icon: AlertTriangle,
        title: 'Alto Percentual de Gastos',
        description: `Você está gastando ${percentualGasto.toFixed(1)}% do seu saldo. Tente manter abaixo de 80%.`,
        color: 'text-yellow-400'
      });
    } else if (percentualGasto < 50) {
      tips.push({
        type: 'info',
        icon: Target,
        title: 'Excelente Controle',
        description: `Parabéns! Você está gastando apenas ${percentualGasto.toFixed(1)}% do seu saldo. Continue assim!`,
        color: 'text-blue-400'
      });
    }

    tips.push({
      type: 'tip',
      icon: Lightbulb,
      title: 'Dica Financeira',
      description: 'A regra 50-30-20: 50% necessidades, 30% desejos, 20% poupança e investimentos.',
      color: 'text-purple-400'
    });

    if (saldoRestante > 0) {
      tips.push({
        type: 'tip',
        icon: Lightbulb,
        title: 'Reserva de Emergência',
        description: 'Considere guardar parte do saldo restante para emergências. O ideal são 6 meses de gastos.',
        color: 'text-cyan-400'
      });
    }

    return tips.slice(0, 3);
  };

  const tips = getTips();

  if (tips.length === 0) {
    return null;
  }

  return (
    <Card className="glass-effect border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-400" />
          Dicas Financeiras
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tips.map((tip, index) => {
          const IconComponent = tip.icon;
          return (
            <div key={index} className="flex gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-600">
              <div className="flex-shrink-0">
                <IconComponent className={`h-5 w-5 ${tip.color}`} />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-white text-sm">{tip.title}</h4>
                  <Badge 
                    variant="outline" 
                    className={`border-current ${tip.color} text-xs`}
                  >
                    {tip.type === 'warning' ? 'Atenção' : 
                     tip.type === 'success' ? 'Oportunidade' :
                     tip.type === 'info' ? 'Parabéns' : 'Dica'}
                  </Badge>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {tip.description}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
