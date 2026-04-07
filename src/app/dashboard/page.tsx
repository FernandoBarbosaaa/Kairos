"use client";

import { StatCard } from "@/components/dashboard/stat-card";
import { RecentEventsCard } from "@/components/dashboard/recent-events";
import { NewEventButton } from "@/components/dashboard/new-event-button";

export const dynamic = "force-dynamic";
import {
  TrendingUp,
  Users,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface DashboardStats {
  totalEvents: number;
  totalParticipants: number;
  totalRevenue: number;
  totalPaid: number;
  pendingPayments: number;
  latePayments: number;
  defaultingPayments: number;
}

interface RecentEvent {
  id: string;
  name: string;
  eventDate: Date;
  participants: number;
  totalRevenue: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 0,
    totalParticipants: 0,
    totalRevenue: 0,
    totalPaid: 0,
    pendingPayments: 0,
    latePayments: 0,
    defaultingPayments: 0,
  });

  const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/events", { cache: "no-store" });
        if (!res.ok) throw new Error("Falha ao buscar eventos");
        const events = await res.json();

        // Convert to RecentEvent format
        const recentEventsConverted: RecentEvent[] = events.map((event: any) => ({
          id: event.id,
          name: event.name,
          eventDate: new Date(event.eventDate),
          participants: event.participants?.length || 0,
          totalRevenue: event.participants?.reduce(
            (sum: number, p: any) => sum + (p.agreedPrice || 0),
            0
          ) || 0,
        }));

        setRecentEvents(recentEventsConverted);

        // Calculate stats
        const totalParticipants = events.reduce(
          (sum: number, e: any) => sum + (e.participants?.length || 0),
          0
        );

        const totalRevenue = events.reduce((sum: number, e: any) => {
          return (
            sum +
            (e.participants?.reduce((s: number, p: any) => s + (p.agreedPrice || 0), 0) || 0)
          );
        }, 0);

        const totalPaid = events.reduce((sum: number, e: any) => {
          return (
            sum +
            (e.participants?.reduce((s: number, p: any) => {
              const paid = p.payments?.reduce((ps: number, pay: any) => {
                return ps + (pay.status === "completed" ? pay.amount : 0);
              }, 0) || 0;
              return s + paid;
            }, 0) || 0)
          );
        }, 0);

        setStats({
          totalEvents: events.length,
          totalParticipants,
          totalRevenue,
          totalPaid,
          pendingPayments: totalRevenue - totalPaid,
          latePayments: 0,
          defaultingPayments: 0,
        });
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">
            Bem-vindo ao seu painel de controle
          </p>
        </div>
        <NewEventButton />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total de Eventos"
          value={stats.totalEvents}
          icon={<TrendingUp className="w-6 h-6" />}
          color="blue"
        />
        <StatCard
          title="Total de Participantes"
          value={stats.totalParticipants}
          icon={<Users className="w-6 h-6" />}
          color="blue"
        />
        <StatCard
          title="Total Arrecadado"
          value={`R$ ${stats.totalPaid.toFixed(2)}`}
          icon={<DollarSign className="w-6 h-6" />}
          color="green"
        />
        <StatCard
          title="Pendentes"
          value={`R$ ${stats.pendingPayments.toFixed(2)}`}
          icon={<Clock className="w-6 h-6" />}
          color="yellow"
        />
      </div>

      {/* Second Row of Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          title="Pagamentos Atrasados"
          value={`R$ ${stats.latePayments.toFixed(2)}`}
          icon={<AlertCircle className="w-6 h-6" />}
          color="yellow"
        />
        <StatCard
          title="Inadimplentes"
          value={`R$ ${stats.defaultingPayments.toFixed(2)}`}
          icon={<AlertCircle className="w-6 h-6" />}
          color="red"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Events */}
        <div className="lg:col-span-2">
          <RecentEventsCard events={recentEvents} />
        </div>

        {/* Quick Stats */}
        <Card className="bg-slate-900/50 border-slate-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Resumo Financeiro
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-400">Receita Total</p>
              <p className="text-2xl font-bold text-green-400">
                R$ {stats.totalRevenue.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Já Recebido</p>
              <p className="text-2xl font-bold text-blue-400">
                R$ {stats.totalPaid.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Pendência Total</p>
              <p className="text-2xl font-bold text-yellow-400">
                R$ {stats.pendingPayments.toFixed(2)}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
