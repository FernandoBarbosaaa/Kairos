"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

interface Lot {
  id: string;
  name: string;
  price: number;
  startDate: Date;
  endDate: Date;
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
  lot: Lot;
}

interface Event {
  id: string;
  name: string;
  eventDate: Date;
  location?: string;
  lots: Lot[];
  participants: Participant[];
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEventData = useCallback(async () => {
    try {
      setLoading(true);
      const [eventRes, participantsRes] = await Promise.all([
        fetch(`/api/events/${eventId}`, { cache: "no-store" }),
        fetch(`/api/participants?eventId=${eventId}`, { cache: "no-store" }),
      ]);

      if (!eventRes.ok) throw new Error("Falha ao buscar evento");
      if (!participantsRes.ok) throw new Error("Falha ao buscar participantes");

      const eventData = (await eventRes.json()) as Event;
      const participantsData = (await participantsRes.json()) as Participant[];
      setEvent(eventData);
      setParticipants(participantsData);
    } catch (error) {
      toast.error("Erro ao carregar evento");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    void loadEventData();
  }, [loadEventData]);

  async function handleDeleteParticipant(participantId: string) {
    if (!confirm("Tem certeza que deseja deletar este participante?")) return;

    try {
      const res = await fetch(`/api/participants/${participantId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Falha ao deletar participante");
      toast.success("Participante deletado com sucesso");
      await loadEventData();
    } catch (error) {
      toast.error("Erro ao deletar participante");
      console.error(error);
    }
  }

  async function handleDeleteEvent() {
    if (!confirm("Tem certeza que deseja deletar este evento? Dados de participantes serão perdidos."))
      return;

    try {
      const res = await fetch(`/api/events/${eventId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Falha ao deletar evento");
      toast.success("Evento deletado com sucesso");
      router.push("/events");
    } catch (error) {
      toast.error("Erro ao deletar evento");
      console.error(error);
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Carregando...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Evento não encontrado</p>
      </div>
    );
  }

  const statusBadgeClass = {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/events">
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white">{event.name}</h1>
          <p className="text-slate-400 mt-1">
            {new Date(event.eventDate).toLocaleDateString("pt-BR")}
          </p>
          {event.location && <p className="text-slate-400 mt-1">{event.location}</p>}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDeleteEvent}
          className="text-red-400 hover:text-red-300 border-red-500/30 hover:border-red-500/50"
        >
          Deletar Evento
        </Button>
      </div>

      <Card className="bg-slate-900/50 border-slate-800 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Lotes</h2>
          <Link href={`/events/${eventId}/lots/new`}>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 gap-2">
              <Plus className="w-4 h-4" />
              Novo Lote
            </Button>
          </Link>
        </div>
        {event.lots.length === 0 ? (
          <p className="text-slate-400">Nenhum lote cadastrado</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {event.lots.map((lot) => (
              <div key={lot.id} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <h3 className="font-semibold text-white mb-2">{lot.name}</h3>
                <p className="text-sm text-green-400 mb-2">R$ {lot.price.toFixed(2)}</p>
                <p className="text-xs text-slate-400">
                  {new Date(lot.startDate).toLocaleDateString("pt-BR")} -{" "}
                  {new Date(lot.endDate).toLocaleDateString("pt-BR")}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="bg-slate-900/50 border-slate-800 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Participantes ({participants.length})</h2>
          <Link href={`/events/${eventId}/participants/new`}>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 gap-2">
              <Plus className="w-4 h-4" />
              Adicionar Participante
            </Button>
          </Link>
        </div>
        {participants.length === 0 ? (
          <p className="text-slate-400">Nenhum participante cadastrado</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Nome</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Email</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Telefone</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Lote</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((participant) => (
                  <tr key={participant.id} className="border-b border-slate-800 hover:bg-slate-800/30">
                    <td className="py-3 px-4 text-white">{participant.fullName}</td>
                    <td className="py-3 px-4 text-slate-400">{participant.email}</td>
                    <td className="py-3 px-4 text-slate-400">{participant.phone}</td>
                    <td className="py-3 px-4 text-slate-400">{participant.lot?.name}</td>
                    <td className="py-3 px-4">
                      <Badge
                        className={
                          statusBadgeClass[participant.status as keyof typeof statusBadgeClass] ||
                          "bg-slate-700 text-slate-300"
                        }
                      >
                        {statusLabel[participant.status as keyof typeof statusLabel] || participant.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Link href={`/participants/${participant.id}`}>
                        <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300">
                          Ver
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteParticipant(participant.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
