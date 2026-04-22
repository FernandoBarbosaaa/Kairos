"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowLeft, Eye, Pencil, Download, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { PARTICIPANTS_SHEET_URL } from "@/lib/google-sheets";

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
    const res = await fetch("/api/participants", { cache: "no-store" });
    if (!res.ok) return [];
    return (await res.json()) as Participant[];
  } catch (error) {
    console.error("Erro ao carregar participantes:", error);
    return [];
  }
}

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

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

  async function handleExportToGoogleSheets() {
    try {
      setExporting(true);

      const response = await fetch("/api/integrations/google-sheets/export", {
        method: "POST",
      });

      const result = (await response.json()) as
        | { exported: number; skipped: number; worksheet: string }
        | { error: string };

      if (!response.ok || "error" in result) {
        throw new Error("error" in result ? result.error : "Falha ao exportar participantes");
      }

      toast.success(
        `Exportação concluída: ${result.exported} novo(s), ${result.skipped} já existente(s) em ${result.worksheet}.`
      );
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível exportar para o Google Sheets"
      );
    } finally {
      setExporting(false);
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
            <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--spiritual-purple)] to-[var(--spiritual-blue)] bg-clip-text text-transparent">Participantes</h1>
            <p className="text-white/60 mt-1">Gerencie todos os participantes</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            onClick={handleExportToGoogleSheets}
            disabled={exporting}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700"
          >
            <Download className="w-4 h-4" />
            {exporting ? "Exportando..." : "Exportar para Google Sheets"}
          </Button>
          <a href={PARTICIPANTS_SHEET_URL} target="_blank" rel="noreferrer">
            <Button type="button" variant="outline" className="gap-2">
              <ExternalLink className="w-4 h-4" />
              Acessar Planilha de Participantes
            </Button>
          </a>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-white/60">Carregando participantes...</p>
        </div>
      ) : participants.length === 0 ? (
        <Card className="bg-white/[0.03] border-white/[0.08] p-12 text-center backdrop-blur-sm">
          <p className="text-white/60 mb-4">Nenhum participante cadastrado</p>
        </Card>
      ) : (
        <Card className="bg-white/[0.03] border-white/[0.08] overflow-hidden backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/[0.05] border-b border-white/[0.1]">
                <tr>
                  <th className="text-left py-4 px-6 text-white/70 font-medium">Nome</th>
                  <th className="text-left py-4 px-6 text-white/70 font-medium">Email</th>
                  <th className="text-left py-4 px-6 text-white/70 font-medium">Telefone</th>
                  <th className="text-left py-4 px-6 text-white/70 font-medium">Evento</th>
                  <th className="text-left py-4 px-6 text-white/70 font-medium">Status</th>
                  <th className="text-left py-4 px-6 text-white/70 font-medium">Progresso</th>
                  <th className="text-left py-4 px-6 text-white/70 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((participant) => (
                  <tr
                    key={participant.id}
                    className="border-b border-white/[0.05] hover:bg-white/[0.05] transition"
                  >
                    <td className="py-4 px-6 text-white font-medium">{participant.fullName}</td>
                    <td className="py-4 px-6 text-white/70">{participant.email}</td>
                    <td className="py-4 px-6 text-white/70">{participant.phone}</td>
                    <td className="py-4 px-6 text-white/70">{participant.event.name}</td>
                    <td className="py-4 px-6">
                      <Badge className={statusColors[participant.status]}>
                        {statusLabels[participant.status]}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-white/70">
                      {participant.paidInstallments}/{participant.totalInstallments}
                    </td>
                    <td className="py-4 px-6 flex gap-2">
                      <Link href={`/participants/${participant.id}`}>
                        <Button size="sm" variant="ghost" className="text-[var(--spiritual-blue)] hover:text-[var(--spiritual-purple)] hover:bg-white/[0.1]">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={`/participants/${participant.id}/edit`}>
                        <Button size="sm" variant="ghost" className="text-white/60 hover:text-white hover:bg-white/[0.1]">
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(participant.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-950/20"
                      >
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
