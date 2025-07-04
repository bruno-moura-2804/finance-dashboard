
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { SaldoCard } from '@/components/SaldoCard';
import { ContasForm } from '@/components/ContasForm';
import { ContasList } from '@/components/ContasList';
import { ExpensesChart } from '@/components/ExpensesChart';
import { FinancialTips } from '@/components/FinancialTips';
import { PDFExporter } from '@/components/PDFExporter';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { DollarSign, TrendingUp, TrendingDown, PieChart } from 'lucide-react';

export interface Conta {
  id: string;
  nome: string;
  valor: number;
  vencimento: string;
  tipo: 'fixa' | 'variavel';
  observacao?: string;
}

const Index = () => {
  const [saldoInicial, setSaldoInicial] = useLocalStorage<number>('saldoInicial', 0);
  const [contas, setContas] = useLocalStorage<Conta[]>('contas', []);
  const [showContasForm, setShowContasForm] = useState(false);

  const totalDespesas = contas.reduce((acc, conta) => acc + conta.valor, 0);
  const saldoRestante = saldoInicial - totalDespesas;
  const isPositive = saldoRestante >= 0;

  const contasFixas = contas.filter(conta => conta.tipo === 'fixa');
  const contasVariaveis = contas.filter(conta => conta.tipo === 'variavel');
  const totalFixas = contasFixas.reduce((acc, conta) => acc + conta.valor, 0);
  const totalVariaveis = contasVariaveis.reduce((acc, conta) => acc + conta.valor, 0);

  const adicionarConta = (novaConta: Omit<Conta, 'id'>) => {
    const conta: Conta = {
      ...novaConta,
      id: Date.now().toString()
    };
    setContas([...contas, conta]);
    setShowContasForm(false);
  };

  const removerConta = (id: string) => {
    setContas(contas.filter(conta => conta.id !== id));
  };

  const editarConta = (id: string, contaEditada: Omit<Conta, 'id'>) => {
    setContas(contas.map(conta => 
      conta.id === id ? { ...contaEditada, id } : conta
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-green-400 bg-clip-text text-transparent">
            Gerenciador Financeiro Pessoal
          </h1>
          <p className="text-slate-400 text-lg">Controle suas finanças de forma inteligente</p>
          <Badge variant="outline" className="text-slate-300 border-slate-600">
            Criado por Bruno Moura
          </Badge>
        </div>

        {/* Saldo Inicial */}
        <SaldoCard 
          saldoInicial={saldoInicial}
          setSaldoInicial={setSaldoInicial}
          saldoRestante={saldoRestante}
          isPositive={isPositive}
        />

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="glass-effect border-slate-700 animate-scale-in">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-blue-400" />
                <span className="text-sm font-medium text-slate-300">Total Despesas</span>
              </div>
              <div className="text-2xl font-bold text-white mt-2">
                R$ {totalDespesas.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-slate-700 animate-scale-in" style={{animationDelay: '0.1s'}}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-400" />
                <span className="text-sm font-medium text-slate-300">Contas Fixas</span>
              </div>
              <div className="text-2xl font-bold text-white mt-2">
                R$ {totalFixas.toFixed(2)}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {contasFixas.length} conta{contasFixas.length !== 1 ? 's' : ''}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-slate-700 animate-scale-in" style={{animationDelay: '0.2s'}}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingDown className="h-5 w-5 text-yellow-400" />
                <span className="text-sm font-medium text-slate-300">Contas Variáveis</span>
              </div>
              <div className="text-2xl font-bold text-white mt-2">
                R$ {totalVariaveis.toFixed(2)}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {contasVariaveis.length} conta{contasVariaveis.length !== 1 ? 's' : ''}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-slate-700 animate-scale-in" style={{animationDelay: '0.3s'}}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <PieChart className="h-5 w-5 text-purple-400" />
                <span className="text-sm font-medium text-slate-300">Total Contas</span>
              </div>
              <div className="text-2xl font-bold text-white mt-2">
                {contas.length}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                conta{contas.length !== 1 ? 's' : ''} cadastrada{contas.length !== 1 ? 's' : ''}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contas */}
          <div className="space-y-4">
            <Card className="glass-effect border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-semibold text-white">Minhas Contas</CardTitle>
                <Button 
                  onClick={() => setShowContasForm(!showContasForm)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  {showContasForm ? 'Cancelar' : 'Adicionar Conta'}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {showContasForm && (
                  <ContasForm onSubmit={adicionarConta} />
                )}
                <ContasList 
                  contas={contas}
                  onRemover={removerConta}
                  onEditar={editarConta}
                />
              </CardContent>
            </Card>
          </div>

          {/* Gráfico e Dicas */}
          <div className="space-y-4">
            {contas.length > 0 && (
              <ExpensesChart 
                contasFixas={totalFixas}
                contasVariaveis={totalVariaveis}
              />
            )}
            
            <FinancialTips 
              saldoRestante={saldoRestante}
              totalDespesas={totalDespesas}
              saldoInicial={saldoInicial}
            />
          </div>
        </div>

        {/* Exportar PDF */}
        {(saldoInicial > 0 || contas.length > 0) && (
          <Card className="glass-effect border-slate-700">
            <CardContent className="p-6">
              <PDFExporter 
                saldoInicial={saldoInicial}
                contas={contas}
                totalDespesas={totalDespesas}
                saldoRestante={saldoRestante}
                contasFixas={totalFixas}
                contasVariaveis={totalVariaveis}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
