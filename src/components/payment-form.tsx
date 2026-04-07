'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface PaymentFormProps {
  participantId: string;
  maxAmount: number;
  onSuccess?: () => void;
}

export function PaymentForm({ participantId, maxAmount, onSuccess }: PaymentFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    method: 'pix' as string | null,
    notes: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('Insira um valor válido');
      return;
    }

    if (parseFloat(formData.amount) > maxAmount) {
      toast.error(`Valor não pode ser maior que R$ ${maxAmount.toFixed(2)}`);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantId,
          amount: parseFloat(formData.amount),
          method: formData.method,
          notes: formData.notes || null,
        }),
      });

      if (response.ok) {
        toast.success('Pagamento registrado com sucesso');
        setFormData({ amount: '', method: 'pix', notes: '' });
        onSuccess?.();
      } else {
        toast.error('Erro ao registrar pagamento');
      }
    } catch (error) {
      console.error(error);
      toast.error('Erro ao registrar pagamento');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="bg-slate-900/50 border-slate-800 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Registrar Pagamento</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-slate-400 mb-2">Valor (R$)</label>
          <Input
            type="number"
            step="0.01"
            min="0"
            max={maxAmount}
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="bg-slate-800 border-slate-700 text-white"
          />
          <p className="text-xs text-slate-400 mt-1">Máximo: R$ {maxAmount.toFixed(2)}</p>
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-2">Método</label>
          <Select value={formData.method} onValueChange={(value) => setFormData({ ...formData, method: value })}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pix">PIX</SelectItem>
              <SelectItem value="cash">Dinheiro</SelectItem>
              <SelectItem value="card">Cartão</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-2">Observações (opcional)</label>
          <Input
            type="text"
            placeholder="Adicionar observações..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="bg-slate-800 border-slate-700 text-white"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          {loading ? 'Processando...' : 'Registrar Pagamento'}
        </Button>
      </form>
    </Card>
  );
}
