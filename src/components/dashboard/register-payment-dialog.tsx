"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

interface RegisterPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  participantId: string;
  installmentId?: string;
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export function RegisterPaymentDialog({
  open,
  onOpenChange,
  participantId,
  installmentId,
}: RegisterPaymentDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: 0,
    method: "pix" as const,
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.amount <= 0) {
      toast.error("Informe um valor válido");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participantId,
          installmentId: installmentId || undefined,
          amount: formData.amount,
          method: formData.method,
          notes: formData.notes || undefined,
        }),
      });
      if (!res.ok) throw new Error("Falha ao registrar pagamento");

      toast.success("Pagamento registrado com sucesso!");
      setFormData({ amount: 0, method: "pix", notes: "" });
      onOpenChange(false);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Erro ao registrar pagamento"));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-white">Registrar Pagamento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Valor (R$)
            </label>
            <Input
              type="number"
              name="amount"
              placeholder="100.00"
              step="0.01"
              min="0.01"
              value={formData.amount}
              onChange={handleChange}
              className="bg-slate-800 border-slate-700 text-white placeholder-slate-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Método de Pagamento
            </label>
            <select
              name="method"
              value={formData.method}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              disabled={loading}
            >
              <option value="pix">PIX</option>
              <option value="cash">Dinheiro</option>
              <option value="card">Cartão</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Observações (opcional)
            </label>
            <textarea
              name="notes"
              placeholder="Notas sobre o pagamento..."
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {loading ? "Registrando..." : "Registrar Pagamento"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
