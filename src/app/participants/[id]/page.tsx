"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Pencil } from "lucide-react";

interface Installment {
  id: string;
  number: number;
  amount: number;
  dueDate: Date;
  status: string;
  paidAt?: Date;
}

interface Payment {
  id: string;
  amount: number;
  method: string;
  status: string;
  paidAt: Date;
  notes?: string;
}

interface Participant {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  status: string;
  agreedPrice: number;
  paidInstallments: number;
  totalInstallments: number;
  event: { name: string; id: string };
  lot: { name: string };
  installments: Installment[];
  payments: Payment[];
}

export default function ParticipantDetailPage() {
  const params = useParams();
  const participantId = params.id as string;

  const [participant, setParticipant] = useState<Participant | null>(null);
  const [loading, setLoading] = useState(true);

  const loadParticipantData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/participants/${participantId}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Falha ao buscar participante");
      const data = await res.json();
      setParticipant(data as Participant);
    } catch (error) {
      toast.error("Erro ao carregar participante");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [participantId]);

  useEffect(() => {
    void loadParticipantData();
  }, [loadParticipantData]);

  if (loading)
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

  const statusColors = {
    paid: "bg-green-500/20 text-green-400",
    pending: "bg-yellow-500/20 text-yellow-400",
    late: "bg-orange-500/20 text-orange-400",
    defaulting: "bg-red-500/20 text-red-400",
  };

  const statusLabel = {
    paid: "Pago",
    pending: "Pendente",
    late: "Atrasado",
    defaulting: "Inadimplente",
  };

  const totalPaid = participant.payments.reduce((sum, p) => sum + (p.status === "completed" ? p.amount : 0), 0);
  const totalRemaining = participant.agreedPrice - totalPaid;
  const progressPercentage = (totalPaid / participant.agreedPrice) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href={`/events/${participant.event.id}`}>
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">{participant.fullName}</h1>
          <p className="text-slate-400 mt-1">{participant.event.name}</p>
        </div>
        <div className="ml-auto">
          <Link href={`/participants/${participantId}/edit`}>
            <Button variant="outline" size="sm" className="gap-2">
              <Pencil className="w-4 h-4" />
              Editar
            </Button>
          </Link>
        </div>
      </div>

      {/* Informações Básicas */}
      <Card className="bg-slate-900/50 border-slate-800 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Informações Pessoais</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-400">Email</p>
            <p className="text-white">{participant.email}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Telefone</p>
            <p className="text-white">{participant.phone}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Lote</p>
            <p className="text-white">{participant.lot?.name}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Status</p>
            <Badge
              className={
                statusColors[participant.status as keyof typeof statusColors] || "bg-slate-700 text-slate-300"
              }
            >
              {statusLabel[participant.status as keyof typeof statusLabel] || participant.status}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Resumo Financeiro */}
      <Card className="bg-slate-900/50 border-slate-800 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Situação Financeira</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-slate-400">Valor Total</p>
            <p className="text-2xl font-bold text-white">R$ {participant.agreedPrice.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Já Pago</p>
            <p className="text-2xl font-bold text-green-400">R$ {totalPaid.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Falta Pagar</p>
            <p className="text-2xl font-bold text-yellow-400">R$ {totalRemaining.toFixed(2)}</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-slate-400">Progresso</span>
            <span className="text-sm font-medium text-white">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Parcelas */}
      <Card className="bg-slate-900/50 border-slate-800 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Parcelas ({participant.totalInstallments})</h2>
          <Link href={`/participants/${participantId}/payments/new`}>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 gap-2">
              <Plus className="w-4 h-4" />
              Registrar Pagamento
            </Button>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">#</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Valor</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Vencimento</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Data Pagamento</th>
              </tr>
            </thead>
            <tbody>
              {participant.installments.map((installment) => (
                <tr key={installment.id} className="border-b border-slate-800 hover:bg-slate-800/30">
                  <td className="py-3 px-4 text-white font-medium">{installment.number}</td>
                  <td className="py-3 px-4 text-white">R$ {installment.amount.toFixed(2)}</td>
                  <td className="py-3 px-4 text-slate-400">
                    {new Date(installment.dueDate).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      className={
                        statusColors[installment.status as keyof typeof statusColors] || "bg-slate-700 text-slate-300"
                      }
                    >
                      {statusLabel[installment.status as keyof typeof statusLabel] || installment.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    {installment.paidAt
                      ? new Date(installment.paidAt).toLocaleDateString("pt-BR")
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Histórico de Pagamentos */}
      {participant.payments.length > 0 && (
        <Card className="bg-slate-900/50 border-slate-800 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Histórico de Pagamentos</h2>
          <div className="space-y-3">
            {participant.payments.map((payment) => (
              <div key={payment.id} className="bg-slate-800/50 rounded-lg p-4 flex justify-between items-center">
                <div>
                  <p className="text-white font-medium">R$ {payment.amount.toFixed(2)}</p>
                  <p className="text-sm text-slate-400">
                    {new Date(payment.paidAt).toLocaleDateString("pt-BR")} - {payment.method.toUpperCase()}
                  </p>
                </div>
                <Badge className="bg-green-500/20 text-green-400">Concluído</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
