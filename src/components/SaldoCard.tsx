
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Edit3, Check, X } from 'lucide-react';

interface SaldoCardProps {
  saldoInicial: number;
  setSaldoInicial: (valor: number) => void;
  saldoRestante: number;
  isPositive: boolean;
}

export const SaldoCard: React.FC<SaldoCardProps> = ({
  saldoInicial,
  setSaldoInicial,
  saldoRestante,
  isPositive
}) => {
  const [editing, setEditing] = useState(saldoInicial === 0);
  const [tempValue, setTempValue] = useState(saldoInicial.toString());

  const handleSave = () => {
    const valor = parseFloat(tempValue) || 0;
    if (valor >= 0) {
      setSaldoInicial(valor);
      setEditing(false);
    }
  };

  const handleCancel = () => {
    setTempValue(saldoInicial.toString());
    setEditing(false);
  };

  return (
    <Card className="glass-effect border-slate-700 animate-fade-in">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-green-400" />
          Saldo Mensal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Saldo Inicial */}
          <div className="space-y-3">
            <Label className="text-slate-300 font-medium">Saldo Inicial</Label>
            {editing ? (
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  placeholder="0.00"
                  className="bg-slate-800 border-slate-600 text-white"
                  min="0"
                  step="0.01"
                />
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancel}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-semibold text-white">
                  R$ {saldoInicial.toFixed(2)}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditing(true)}
                  className="text-slate-400 hover:text-white hover:bg-slate-700"
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Saldo Restante */}
          <div className="space-y-3">
            <Label className="text-slate-300 font-medium">Saldo Restante</Label>
            <div className="flex items-center gap-3">
              <span className={`text-2xl font-semibold ${
                isPositive ? 'text-green-400' : 'text-red-400'
              }`}>
                R$ {saldoRestante.toFixed(2)}
              </span>
              <Badge 
                variant={isPositive ? "default" : "destructive"}
                className={isPositive ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
              >
                {isPositive ? 'Positivo' : 'Negativo'}
              </Badge>
            </div>
            {!isPositive && saldoInicial > 0 && (
              <p className="text-sm text-red-400">
                ⚠️ Atenção: Suas despesas estão maiores que o saldo disponível!
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
