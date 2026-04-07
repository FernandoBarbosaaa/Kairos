"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowLeft, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { prisma } from "@/lib/prisma";

interface Participant {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  status: "paid" | "pending" | "late" | "defaulting";
  agreedPrice: number;
  paidInstallments: number;
  totalInstallments: number;
  event: { name: string; id: string };
}

async function getAllParticipants(): Promise<Participant[]> {
  try {
    const participants = await prisma.participant.findMany({
      include: {
        event: {
          select: { name: true, id: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    return participants as Participant[];
  } catch (error) {
    console.error("Erro ao carregar participantes:", error);
    return [];
  }
}

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadParticipants();
  }, []);

  async function loadParticipants() {
    try {
      setLoading(true);
      const data = await getAllParticipants();
      setParticipants(data);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar participantes");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja deletar este participante?")) return;

    try {
      const response = await fetch(`/api/participants/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast.success("Participante deletado com sucesso");
        await loadParticipants();
      } else {
        toast.error("Erro ao deletar participante");
      }
    } catch (error) {
      toast.error("Erro ao deletar participante");
      console.error(error);
    }
  }

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
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Participantes</h1>
            <p className="text-slate-400 mt-1">Gerencie todos os participantes</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-slate-400">Carregando participantes...</p>
        </div>
      ) : participants.length === 0 ? (
        <Card className="bg-slate-900/50 border-slate-800 p-12 text-center">
          <p className="text-slate-400 mb-4">Nenhum participante cadastrado</p>
        </Card>
      ) : (
        <Card className="bg-slate-900/50 border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50 border-b border-slate-700">
                <tr>
                  <th className="text-left py-4 px-6 text-slate-400 font-medium">Nome</th>
                  <th className="text-left py-4 px-6 text-slate-400 font-medium">Email</th>
                  <th className="text-left py-4 px-6 text-slate-400 font-medium">Telefone</th>
                  <th className="text-left py-4 px-6 text-slate-400 font-medium">Evento</th>
                  <th className="text-left py-4 px-6 text-slate-400 font-medium">Status</th>
                  <th className="text-left py-4 px-6 text-slate-400 font-medium">Progresso</th>
                  <th className="text-left py-4 px-6 text-slate-400 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((participant) => (
                  <tr
                    key={participant.id}
                    className="border-b border-slate-800 hover:bg-slate-800/30 transition"
                  >
                    <td className="py-4 px-6 text-white font-medium">{participant.fullName}</td>
                    <td className="py-4 px-6 text-slate-400">{participant.email}</td>
                    <td className="py-4 px-6 text-slate-400">{participant.phone}</td>
                    <td className="py-4 px-6 text-slate-400">{participant.event.name}</td>
                    <td className="py-4 px-6">
                      <Badge className={statusColors[participant.status]}>
                        {statusLabels[participant.status]}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-slate-400">
                      {participant.paidInstallments}/{participant.totalInstallments}
                    </td>
                    <td className="py-4 px-6 flex gap-2">
                      <Link href={`/participants/${participant.id}`}>
                        <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(participant.id)}
                        className="text-red-400 hover:text-red-300"
                      
                        <Trash2 className="w-4 h-4" />
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
