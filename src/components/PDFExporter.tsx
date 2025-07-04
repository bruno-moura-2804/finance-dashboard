
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Conta } from '@/pages/Index';
import { FileDown, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PDFExporterProps {
  saldoInicial: number;
  contas: Conta[];
  totalDespesas: number;
  saldoRestante: number;
  contasFixas: number;
  contasVariaveis: number;
}

export const PDFExporter: React.FC<PDFExporterProps> = ({
  saldoInicial,
  contas,
  totalDespesas,
  saldoRestante,
  contasFixas,
  contasVariaveis
}) => {
  const generatePDF = async () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    let currentY = margin;

    const addText = (text: string, x: number, y: number, fontSize = 12, isBold = false) => {
      pdf.setFontSize(fontSize);
      if (isBold) {
        pdf.setFont(undefined, 'bold');
      } else {
        pdf.setFont(undefined, 'normal');
      }
      pdf.text(text, x, y);
      return y + (fontSize * 0.5) + 2;
    };

    currentY = addText('RELATÓRIO FINANCEIRO PESSOAL', margin, currentY, 20, true);
    currentY = addText(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, margin, currentY, 10);
    currentY = addText('Criado por: Bruno Moura', margin, currentY, 10);
    currentY += 10;

    currentY = addText('RESUMO FINANCEIRO', margin, currentY, 16, true);
    currentY += 5;
    
    currentY = addText(`Saldo Inicial: R$ ${saldoInicial.toFixed(2)}`, margin, currentY, 12);
    currentY = addText(`Total de Despesas: R$ ${totalDespesas.toFixed(2)}`, margin, currentY, 12);
    currentY = addText(`Saldo Restante: R$ ${saldoRestante.toFixed(2)} ${saldoRestante >= 0 ? '(POSITIVO)' : '(NEGATIVO)'}`, margin, currentY, 12, true);
    currentY += 10;

    currentY = addText('ANÁLISE POR TIPO DE CONTA', margin, currentY, 16, true);
    currentY += 5;
    
    currentY = addText(`Contas Fixas: R$ ${contasFixas.toFixed(2)} (${contas.filter(c => c.tipo === 'fixa').length} contas)`, margin, currentY, 12);
    currentY = addText(`Contas Variáveis: R$ ${contasVariaveis.toFixed(2)} (${contas.filter(c => c.tipo === 'variavel').length} contas)`, margin, currentY, 12);
    currentY += 10;

    if (contas.length > 0) {
      currentY = addText('DETALHAMENTO DAS CONTAS', margin, currentY, 16, true);
      currentY += 5;

      const contasOrdenadas = [...contas].sort((a, b) => 
        new Date(a.vencimento).getTime() - new Date(b.vencimento).getTime()
      );

      contasOrdenadas.forEach((conta, index) => {
        if (currentY > 250) {
          pdf.addPage();
          currentY = margin;
        }

        currentY = addText(`${index + 1}. ${conta.nome}`, margin, currentY, 12, true);
        currentY = addText(`   Valor: R$ ${conta.valor.toFixed(2)}`, margin + 5, currentY, 10);
        currentY = addText(`   Vencimento: ${new Date(conta.vencimento + 'T00:00:00').toLocaleDateString('pt-BR')}`, margin + 5, currentY, 10);
        currentY = addText(`   Tipo: ${conta.tipo === 'fixa' ? 'Fixa' : 'Variável'}`, margin + 5, currentY, 10);
        
        if (conta.observacao) {
          currentY = addText(`   Observação: ${conta.observacao}`, margin + 5, currentY, 10);
        }
        currentY += 3;
      });
    }

    pdf.addPage();
    currentY = margin;

    currentY = addText('DICAS FINANCEIRAS', margin, currentY, 16, true);
    currentY += 5;

    const dicas = [
      'Regra 50-30-20: 50% necessidades, 30% desejos, 20% poupança',
      'Mantenha uma reserva de emergência de 6 meses de gastos',
      'Revise suas contas mensalmente para identificar gastos desnecessários',
      'Considere renegociar contratos de serviços (internet, telefone, etc.)',
      'Automatize suas economias para não esquecer de poupar'
    ];

    if (saldoRestante < 0) {
      dicas.unshift('⚠️ ATENÇÃO: Suas despesas excedem o saldo disponível!');
      dicas.unshift('• Revise urgentemente todos os gastos');
      dicas.unshift('• Considere aumentar a renda ou reduzir despesas');
    }

    dicas.forEach((dica) => {
      if (currentY > 270) {
        pdf.addPage();
        currentY = margin;
      }
      currentY = addText(`• ${dica}`, margin, currentY, 10);
    });

    try {
      const chartElement = document.querySelector('[data-testid="chart-container"]') as HTMLElement;
      if (chartElement && contas.length > 0) {
        const canvas = await html2canvas(chartElement, {
          backgroundColor: '#1e293b',
          scale: 2
        });
        
        pdf.addPage();
        currentY = margin;
        currentY = addText('GRÁFICO DE DESPESAS', margin, currentY, 16, true);
        
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth - (margin * 2);
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', margin, currentY + 10, imgWidth, imgHeight);
      }
    } catch (error) {
      console.log('Não foi possível capturar o gráfico:', error);
    }

    const fileName = `relatorio-financeiro-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <FileDown className="h-5 w-5 text-blue-400" />
          Exportar Relatório
        </h3>
        <p className="text-slate-400 text-sm">
          Gere um PDF completo com todas as informações financeiras
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="text-sm text-slate-300">
            {contas.length} conta{contas.length !== 1 ? 's' : ''} • R$ {totalDespesas.toFixed(2)}
          </div>
          <Badge 
            variant={saldoRestante >= 0 ? "default" : "destructive"}
            className={saldoRestante >= 0 ? 'bg-green-600' : 'bg-red-600'}
          >
            Saldo: R$ {saldoRestante.toFixed(2)}
          </Badge>
        </div>
        
        <Button 
          onClick={generatePDF}
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
          disabled={saldoInicial === 0 && contas.length === 0}
        >
          <Download className="h-4 w-4 mr-2" />
          Exportar PDF
        </Button>
      </div>
    </div>
  );
};
