"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface RecentEventProps {
  events: Array<{
    id: string;
    name: string;
    eventDate: Date;
    participants: number;
    totalRevenue: number;
  }>;
}

export function RecentEventsCard({ events }: RecentEventProps) {
  return (
    <Card className="bg-slate-900/50 border-slate-800 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Eventos Recentes</h3>
      <div className="space-y-4">
        {events.length === 0 ? (
          <p className="text-slate-400 text-center py-8">Nenhum evento criado</p>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition"
            >
              <div className="flex-1">
                <p className="font-medium text-white">{event.name}</p>
                <p className="text-sm text-slate-400">
                  {formatDistanceToNow(event.eventDate, {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400">
                  {event.participants} participantes
                </p>
                <p className="font-semibold text-green-400">
                  R$ {event.totalRevenue.toFixed(2)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
