"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";

interface Payment {
  id: string;
  participant: {
    id: string;
    fullName: string;
  };
  amount: number;
  method: "pix" | "cash" | "card";
  status: "pending" | "completed" | "failed";
  paidAt: Date | null;
  createdAt: Date;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, []);

  async function loadPayments() {
    try {
      setLoading(true);
      const response = await fetch("/api/payments");
      if (response.ok) {
        const data = await response.json();
        setPayments(data);
      }
    } catch (error) {
      toast.error("Erro ao carregar pagamentos");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const statusColors = {
    pending: "bg-yellow-500/20 text-yellow-400",
    completed: "bg-green-500/20 text-green-400",
    failed: "bg-red-500/20 text-red-400",
  };

  const statusLabels = {
    pending: "Pendente",
    completed: "Concluído",
    failed: "Falhou",
  };

  const methodLabels = {
    pix: "PIX",
    cash: "Dinheiro",
    card: "Cartão",
  };

  const totalReceived = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = payments
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--spiritual-purple)] to-[var(--spiritual-blue)] bg-clip-text text-transparent">Pagamentos</h1>
            <p className="text-white/60 mt-1">Histórico de pagamentos registrados</p>
          </div>
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-white/[0.03] border-white/[0.08] p-6 backdrop-blur-sm">
          <p className="text-sm text-white/60 mb-2">Total Recebido</p>
          <p className="text-3xl font-bold text-emerald-400">R$ {totalReceived.toFixed(2)}</p>
        </Card>
        <Card className="bg-white/[0.03] border-white/[0.08] p-6 backdrop-blur-sm">
          <p className="text-sm text-white/60 mb-2">Pagamentos Pendentes</p>
          <p className="text-3xl font-bold text-[var(--spiritual-gold)]">R$ {totalPending.toFixed(2)}</p>
        </Card>
      </div>

      {/* Lista de Pagamentos */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-white/60">Carregando pagamentos...</p>
        </div>
      ) : payments.length === 0 ? (
        <Card className="bg-white/[0.03] border-white/[0.08] p-12 text-center backdrop-blur-sm">
          <p className="text-white/60 mb-4">Nenhum pagamento registrado</p>
        </Card>
      ) : (
        <Card className="bg-white/[0.03] border-white/[0.08] overflow-hidden backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/[0.05] border-b border-white/[0.1]">
                <tr>
                  <th className="text-left py-4 px-6 text-white/70 font-medium">Participante</th>
                  <th className="text-left py-4 px-6 text-white/70 font-medium">Valor</th>
                  <th className="text-left py-4 px-6 text-white/70 font-medium">Método</th>
                  <th className="text-left py-4 px-6 text-white/70 font-medium">Status</th>
                  <th className="text-left py-4 px-6 text-white/70 font-medium">Data</th>
                  <th className="text-left py-4 px-6 text-white/70 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b border-white/[0.05] hover:bg-white/[0.05] transition"
                  >
                    <td className="py-4 px-6 text-white font-medium">
                      {payment.participant.fullName}
                    </td>
                    <td className="py-4 px-6 text-white">R$ {payment.amount.toFixed(2)}</td>
                    <td className="py-4 px-6 text-white/70">
                      {methodLabels[payment.method]}
                    </td>
                    <td className="py-4 px-6">
                      <Badge className={statusColors[payment.status]}>
                        {statusLabels[payment.status]}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-white/70">
                      {new Date(payment.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="py-4 px-6">
                      <Link href={`/participants/${payment.participant.id}`}>
                        <Button size="sm" variant="ghost" className="text-[var(--spiritual-blue)] hover:text-[var(--spiritual-purple)] hover:bg-white/[0.1]">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
