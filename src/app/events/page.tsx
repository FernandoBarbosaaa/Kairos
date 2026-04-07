"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Eye, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Event {
  id: string;
  name: string;
  eventDate: Date;
  participants: { id: string }[];
  createdAt: Date;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    try {
      setLoading(true);
      const res = await fetch("/api/events");
      if (!res.ok) throw new Error("Falha ao buscar eventos");
      const data = await res.json();
      setEvents(data as Event[]);
    } catch (error) {
      toast.error("Erro ao carregar eventos");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja deletar este evento?")) return;

    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Falha ao deletar evento");
      toast.success("Evento deletado com sucesso");
      await loadEvents();
    } catch (error) {
      toast.error("Erro ao deletar evento");
      console.error(error);
    }
  }

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
            <h1 className="text-3xl font-bold text-white">Eventos</h1>
            <p className="text-slate-400 mt-1">Gerencie seus retiros e eventos</p>
          </div>
        </div>
        <Link href="/events/new">
          <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
            <Plus className="w-4 h-4" />
            Novo Evento
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-slate-400">Carregando eventos...</p>
        </div>
      ) : events.length === 0 ? (
        <Card className="bg-slate-900/50 border-slate-800 p-12 text-center">
          <p className="text-slate-400 mb-4">Nenhum evento cadastrado</p>
          <Link href="/events/new">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Criar Primeiro Evento
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <Card
              key={event.id}
              className="bg-slate-900/50 border-slate-800 p-6 hover:border-blue-500/50 transition"
            >
              <h3 className="text-lg font-semibold text-white mb-2">
                {event.name}
              </h3>
              <p className="text-sm text-slate-400 mb-1">
                📅 {new Date(event.eventDate).toLocaleDateString("pt-BR")}
              </p>
              <p className="text-sm text-slate-400 mb-4">
                👥 {event.participants.length} participante(s)
              </p>
              <div className="flex gap-2">
                <Link href={`/events/${event.id}`} className="flex-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-blue-400 hover:text-blue-300"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(event.id)}
                  className="flex-1 text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Remover
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
