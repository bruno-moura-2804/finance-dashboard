
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Conta } from '@/pages/Index';

interface ContasFormProps {
  onSubmit: (conta: Omit<Conta, 'id'>) => void;
  initialData?: Omit<Conta, 'id'>;
  isEditing?: boolean;
}

export const ContasForm: React.FC<ContasFormProps> = ({ 
  onSubmit, 
  initialData,
  isEditing = false 
}) => {
  const [formData, setFormData] = useState({
    nome: initialData?.nome || '',
    valor: initialData?.valor?.toString() || '',
    vencimento: initialData?.vencimento || '',
    tipo: initialData?.tipo || 'fixa' as 'fixa' | 'variavel',
    observacao: initialData?.observacao || ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome da conta é obrigatório';
    }

    const valor = parseFloat(formData.valor);
    if (!formData.valor || isNaN(valor) || valor <= 0) {
      newErrors.valor = 'Valor deve ser um número positivo';
    }

    if (!formData.vencimento) {
      newErrors.vencimento = 'Data de vencimento é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        nome: formData.nome.trim(),
        valor: parseFloat(formData.valor),
        vencimento: formData.vencimento,
        tipo: formData.tipo,
        observacao: formData.observacao.trim() || undefined
      });

      if (!isEditing) {
        setFormData({
          nome: '',
          valor: '',
          vencimento: '',
          tipo: 'fixa',
          observacao: ''
        });
      }
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-600">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nome da Conta */}
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-slate-300">
                Nome da Conta *
              </Label>
              <Input
                id="nome"
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: Energia elétrica"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
              {errors.nome && <span className="text-red-400 text-sm">{errors.nome}</span>}
            </div>

            {/* Valor */}
            <div className="space-y-2">
              <Label htmlFor="valor" className="text-slate-300">
                Valor (R$) *
              </Label>
              <Input
                id="valor"
                type="number"
                value={formData.valor}
                onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                placeholder="0.00"
                min="0.01"
                step="0.01"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
              {errors.valor && <span className="text-red-400 text-sm">{errors.valor}</span>}
            </div>

            {/* Vencimento */}
            <div className="space-y-2">
              <Label htmlFor="vencimento" className="text-slate-300">
                Vencimento *
              </Label>
              <Input
                id="vencimento"
                type="date"
                value={formData.vencimento}
                onChange={(e) => setFormData({ ...formData, vencimento: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
              />
              {errors.vencimento && <span className="text-red-400 text-sm">{errors.vencimento}</span>}
            </div>

            {/* Tipo */}
            <div className="space-y-2">
              <Label className="text-slate-300">Tipo</Label>
              <Select 
                value={formData.tipo} 
                onValueChange={(value: 'fixa' | 'variavel') => 
                  setFormData({ ...formData, tipo: value })
                }
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="fixa" className="text-white hover:bg-slate-700">
                    Fixa
                  </SelectItem>
                  <SelectItem value="variavel" className="text-white hover:bg-slate-700">
                    Variável
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Observação */}
          <div className="space-y-2">
            <Label htmlFor="observacao" className="text-slate-300">
              Observação (opcional)
            </Label>
            <Textarea
              id="observacao"
              value={formData.observacao}
              onChange={(e) => setFormData({ ...formData, observacao: e.target.value })}
              placeholder="Detalhes adicionais sobre esta conta..."
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 resize-none"
              rows={2}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            {isEditing ? 'Salvar Alterações' : 'Adicionar Conta'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
