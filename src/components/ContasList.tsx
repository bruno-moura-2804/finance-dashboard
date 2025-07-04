
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ContasForm } from './ContasForm';
import { Conta } from '@/pages/Index';
import { Edit3, Trash2, Calendar, DollarSign, FileText } from 'lucide-react';

interface ContasListProps {
  contas: Conta[];
  onRemover: (id: string) => void;
  onEditar: (id: string, conta: Omit<Conta, 'id'>) => void;
}

export const ContasList: React.FC<ContasListProps> = ({ 
  contas, 
  onRemover, 
  onEditar 
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
  };

  const isVencimentoProximo = (vencimento: string) => {
    const hoje = new Date();
    const dataVencimento = new Date(vencimento + 'T00:00:00');
    const diffTime = dataVencimento.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  };

  const handleEdit = (id: string, contaEditada: Omit<Conta, 'id'>) => {
    onEditar(id, contaEditada);
    setEditingId(null);
  };

  if (contas.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-slate-400 text-lg mb-2">Nenhuma conta cadastrada</div>
        <div className="text-slate-500 text-sm">
          Adicione suas primeiras contas para começar o controle financeiro
        </div>
      </div>
    );
  }

  const contasOrdenadas = [...contas].sort((a, b) => 
    new Date(a.vencimento).getTime() - new Date(b.vencimento).getTime()
  );

  return (
    <div className="space-y-3">
      {contasOrdenadas.map((conta) => (
        <div key={conta.id}>
          {editingId === conta.id ? (
            <ContasForm
              onSubmit={(contaEditada) => handleEdit(conta.id, contaEditada)}
              initialData={conta}
              isEditing={true}
            />
          ) : (
            <Card className="bg-slate-800/30 border-slate-600 hover:bg-slate-800/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-white text-lg">{conta.nome}</h4>
                      <Badge 
                        variant={conta.tipo === 'fixa' ? 'default' : 'secondary'}
                        className={
                          conta.tipo === 'fixa' 
                            ? 'bg-blue-600 hover:bg-blue-700' 
                            : 'bg-yellow-600 hover:bg-yellow-700'
                        }
                      >
                        {conta.tipo === 'fixa' ? 'Fixa' : 'Variável'}
                      </Badge>
                      {isVencimentoProximo(conta.vencimento) && (
                        <Badge variant="destructive" className="bg-orange-600 hover:bg-orange-700">
                          Vence em breve
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-slate-300">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-green-400" />
                        <span className="font-semibold text-green-400">
                          R$ {conta.valor.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-blue-400" />
                        <span>{formatDate(conta.vencimento)}</span>
                      </div>
                    </div>

                    {conta.observacao && (
                      <div className="flex items-start gap-1 mt-2">
                        <FileText className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-400">{conta.observacao}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingId(conta.id)}
                      className="text-slate-400 hover:text-blue-400 hover:bg-slate-700"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onRemover(conta.id)}
                      className="text-slate-400 hover:text-red-400 hover:bg-slate-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ))}
    </div>
  );
};
