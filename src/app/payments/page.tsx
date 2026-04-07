"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Eye } from "lucide-react";
import { useState, useEffect } from "react";

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
    // TODO: Carregar pagamentos
    setLoading(false);
  }, []);

  const statusColors = {
    pending: "bg-yellow-500/20 text-yellow-400",
    completed: "bg-green-500/20 text-green-400",
    failed: "bg-red-500/20 text-red-400",
  };

  const methodLabels = {
    pix: "PIX",
    cash: "Dinheiro",
    card: "Cartão",
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Pagamentos</h1>
          <p className="text-slate-400 mt-1">Histórico e registro de pagamentos</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
          <Plus className="w-4 h-4" />
          Registrar Pagamento
        </Button>
      </div>

      {loading ? (
        <p className="text-slate-400">Carregando...</p>
      ) : payments.length === 0 ? (
        <Card className="bg-slate-900/50 border-slate-800 p-12 text-center">
          <p className="text-slate-400">Nenhum pagamento registrado</p>
        </Card>
      ) : (
        <Card className="bg-slate-900/50 border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-800 bg-slate-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                    Participante
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                    Método
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {payments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="hover:bg-slate-800/30 transition"
                  >
                    <td className="px-6 py-4 text-white font-medium">
                      {payment.participant.fullName}
                    </td>
                    <td className="px-6 py-4 font-semibold text-green-400">
                      R$ {payment.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      {methodLabels[payment.method]}
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={statusColors[payment.status]}>
                        {payment.status === "completed"
                          ? "Confirmado"
                          : payment.status === "pending"
                          ? "Pendente"
                          : "Falhou"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {new Date(payment.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
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
