"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

interface Installment {
  id: string;
  number: number;
  amount: number;
  status: string;
}

interface Participant {
  id: string;
  fullName: string;
  agreedPrice: number;
  installments: Installment[];
}

export default function NewPaymentPage() {
  const params = useParams();
  const router = useRouter();
  const participantId = params.id as string;

  const [participant, setParticipant] = useState<Participant | null>(null);
  const [formData, setFormData] = useState({
    amount: "",
    method: "pix",
    installmentId: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const loadParticipantData = useCallback(async () => {
    try {
      const res = await fetch(`/api/participants/${participantId}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Falha ao buscar participante");
      const data = await res.json();
      setParticipant(data as Participant);
    } catch (error) {
      toast.error("Erro ao carregar participante");
      console.error(error);
    } finally {
      setLoadingData(false);
    }
  }, [participantId]);

  useEffect(() => {
    void loadParticipantData();
  }, [loadParticipantData]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participantId,
          amount: parseFloat(formData.amount),
          method: formData.method,
          installmentId: formData.installmentId || undefined,
          notes: formData.notes || undefined,
        }),
      });
      if (!res.ok) throw new Error("Falha ao registrar pagamento");
      toast.success("Pagamento registrado com sucesso!");
      router.push(`/participants/${participantId}`);
    } catch (error) {
      toast.error("Erro ao registrar pagamento");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loadingData)
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Carregando...</p>
      </div>
    );

  if (!participant)
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Participante não encontrado</p>
      </div>
    );

  const pendingInstallments = participant.installments.filter((i) => i.status === "pending");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href={`/participants/${participantId}`}>
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Registrar Pagamento</h1>
          <p className="text-slate-400 mt-1">{participant.fullName}</p>
        </div>
      </div>

      <Card className="bg-slate-900/50 border-slate-800 p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Valor do Pagamento *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-slate-400">R$</span>
              <Input
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="0,00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 pl-8"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Método de Pagamento
            </label>
            <select
              value={formData.method}
              onChange={(e) => setFormData({ ...formData, method: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-md px-3 py-2"
            >
              <option value="pix">PIX</option>
              <option value="cash">Dinheiro</option>
              <option value="card">Cartão</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Parcela (opcional)
            </label>
            <select
              value={formData.installmentId}
              onChange={(e) => setFormData({ ...formData, installmentId: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-md px-3 py-2"
            >
              <option value="">Selecionar parcela...</option>
              {pendingInstallments.map((installment) => (
                <option key={installment.id} value={installment.id}>
                  Parcela {installment.number} - R$ {installment.amount.toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Observações
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Adicionar observações (opcional)"
              rows={3}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-md px-3 py-2 placeholder:text-slate-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Link href={`/participants/${participantId}`} className="flex-1">
              <Button variant="outline" className="w-full">
                Cancelar
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={loading || !formData.amount}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Registrando..." : "Registrar Pagamento"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
