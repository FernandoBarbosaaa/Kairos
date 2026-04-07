"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { useState, useEffect } from "react";

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

  useEffect(() => {
    // TODO: Carregar eventos do banco
    setLoading(false);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Eventos</h1>
          <p className="text-slate-400 mt-1">Gerencie seus eventos</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
          <Plus className="w-4 h-4" />
          Novo Evento
        </Button>
      </div>

      {loading ? (
        <p className="text-slate-400">Carregando...</p>
      ) : events.length === 0 ? (
        <Card className="bg-slate-900/50 border-slate-800 p-12 text-center">
          <p className="text-slate-400 mb-4">Nenhum evento cadastrado</p>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Criar Primeiro Evento
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <Card
              key={event.id}
              className="bg-slate-900/50 border-slate-800 p-6 hover:border-slate-700 transition"
            >
              <h3 className="text-lg font-semibold text-white mb-2">
                {event.name}
              </h3>
              <p className="text-sm text-slate-400 mb-4">
                {event.participants.length} participantes
              </p>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 text-blue-400 hover:text-blue-300"
                >
                  <Edit2 className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
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
