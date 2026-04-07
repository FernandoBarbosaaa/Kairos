"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Eye } from "lucide-react";
import { useState, useEffect } from "react";

interface Participant {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  status: "paid" | "pending" | "late" | "defaulting";
  agreedPrice: number;
  paidInstallments: number;
  totalInstallments: number;
}

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Carregar participantes
    setLoading(false);
  }, []);

  const statusColors = {
    paid: "bg-green-500/20 text-green-400",
    pending: "bg-yellow-500/20 text-yellow-400",
    late: "bg-orange-500/20 text-orange-400",
    defaulting: "bg-red-500/20 text-red-400",
  };

  const statusLabels = {
    paid: "Pago",
    pending: "Pendente",
    late: "Atrasado",
    defaulting: "Inadimplente",
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Participantes</h1>
          <p className="text-slate-400 mt-1">Gerencie participantes e pagamentos</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
          <Plus className="w-4 h-4" />
          Novo Participante
        </Button>
      </div>

      {loading ? (
        <p className="text-slate-400">Carregando...</p>
      ) : participants.length === 0 ? (
        <Card className="bg-slate-900/50 border-slate-800 p-12 text-center">
          <p className="text-slate-400">Nenhum participante cadastrado</p>
        </Card>
      ) : (
        <Card className="bg-slate-900/50 border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-800 bg-slate-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                    Parcelas
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {participants.map((participant) => (
                  <tr
                    key={participant.id}
                    className="hover:bg-slate-800/30 transition"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-white">
                          {participant.fullName}
                        </p>
                        <p className="text-sm text-slate-400">
                          {participant.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={statusColors[participant.status]}>
                        {statusLabels[participant.status]}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-white font-medium">
                      R$ {participant.agreedPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {participant.paidInstallments}/{participant.totalInstallments}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
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
