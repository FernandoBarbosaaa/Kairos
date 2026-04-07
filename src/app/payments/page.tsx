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
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Pagamentos</h1>
            <p className="text-slate-400 mt-1">Histórico de pagamentos registrados</p>
          </div>
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-slate-900/50 border-slate-800 p-6">
          <p className="text-sm text-slate-400 mb-2">Total Recebido</p>
          <p className="text-3xl font-bold text-green-400">R$ {totalReceived.toFixed(2)}</p>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800 p-6">
          <p className="text-sm text-slate-400 mb-2">Pagamentos Pendentes</p>
          <p className="text-3xl font-bold text-yellow-400">R$ {totalPending.toFixed(2)}</p>
        </Card>
      </div>

      {/* Lista de Pagamentos */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-slate-400">Carregando pagamentos...</p>
        </div>
      ) : payments.length === 0 ? (
        <Card className="bg-slate-900/50 border-slate-800 p-12 text-center">
          <p className="text-slate-400 mb-4">Nenhum pagamento registrado</p>
        </Card>
      ) : (
        <Card className="bg-slate-900/50 border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50 border-b border-slate-700">
                <tr>
                  <th className="text-left py-4 px-6 text-slate-400 font-medium">Participante</th>
                  <th className="text-left py-4 px-6 text-slate-400 font-medium">Valor</th>
                  <th className="text-left py-4 px-6 text-slate-400 font-medium">Método</th>
                  <th className="text-left py-4 px-6 text-slate-400 font-medium">Status</th>
                  <th className="text-left py-4 px-6 text-slate-400 font-medium">Data</th>
                  <th className="text-left py-4 px-6 text-slate-400 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b border-slate-800 hover:bg-slate-800/30 transition"
                  >
                    <td className="py-4 px-6 text-white font-medium">
                      {payment.participant.fullName}
                    </td>
                    <td className="py-4 px-6 text-white">R$ {payment.amount.toFixed(2)}</td>
                    <td className="py-4 px-6 text-slate-400">
                      {methodLabels[payment.method]}
                    </td>
                    <td className="py-4 px-6">
                      <Badge className={statusColors[payment.status]}>
                        {statusLabels[payment.status]}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-slate-400">
                      {new Date(payment.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="py-4 px-6">
                      <Link href={`/participants/${payment.participant.id}`}>
                        <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300">
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
