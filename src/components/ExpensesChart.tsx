
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { PieChart } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface ExpensesChartProps {
  contasFixas: number;
  contasVariaveis: number;
}

export const ExpensesChart: React.FC<ExpensesChartProps> = ({
  contasFixas,
  contasVariaveis
}) => {
  const total = contasFixas + contasVariaveis;
  
  if (total === 0) {
    return null;
  }

  const data = {
    labels: ['Contas Fixas', 'Contas Variáveis'],
    datasets: [
      {
        data: [contasFixas, contasVariaveis],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)', 
          'rgba(245, 158, 11, 0.8)' 
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(245, 158, 11, 1)'
        ],
        borderWidth: 2,
        hoverBackgroundColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(245, 158, 11, 1)'
        ]
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#E2E8F0',
          font: {
            size: 14
          },
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#E2E8F0',
        bodyColor: '#E2E8F0',
        borderColor: '#475569',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            const value = context.parsed;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: R$ ${value.toFixed(2)} (${percentage}%)`;
          }
        }
      }
    }
  };

  const percentageFixed = ((contasFixas / total) * 100).toFixed(1);
  const percentageVariable = ((contasVariaveis / total) * 100).toFixed(1);

  return (
    <Card className="glass-effect border-slate-700" data-testid="chart-container">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <PieChart className="h-5 w-5 text-purple-400" />
          Distribuição de Despesas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-64">
          <Pie data={data} options={options} />
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-600">
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-slate-300 text-sm">Fixas</span>
            </div>
            <div className="text-white font-semibold">R$ {contasFixas.toFixed(2)}</div>
            <div className="text-slate-400 text-xs">{percentageFixed}%</div>
          </div>
          
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-slate-300 text-sm">Variáveis</span>
            </div>
            <div className="text-white font-semibold">R$ {contasVariaveis.toFixed(2)}</div>
            <div className="text-slate-400 text-xs">{percentageVariable}%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
