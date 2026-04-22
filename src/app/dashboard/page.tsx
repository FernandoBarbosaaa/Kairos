"use client";

import { StatCard } from "@/components/dashboard/stat-card";
import { RecentEventsCard } from "@/components/dashboard/recent-events";
import { NewEventButton } from "@/components/dashboard/new-event-button";

export const dynamic = "force-dynamic";
import { TrendingUp, Users, DollarSign, AlertCircle, Clock } from "lucide-react";
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

interface DashboardPayment {
  amount: number;
  status: string;
}

interface DashboardParticipant {
  agreedPrice?: number;
  payments?: DashboardPayment[];
}

interface DashboardEvent {
  id: string;
  name: string;
  eventDate: string;
  participants?: DashboardParticipant[];
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

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/events", { cache: "no-store" });
        if (!res.ok) throw new Error("Falha ao buscar eventos");
        const events = (await res.json()) as DashboardEvent[];

        // Convert to RecentEvent format
        const recentEventsConverted: RecentEvent[] = events.map((event) => ({
          id: event.id,
          name: event.name,
          eventDate: new Date(event.eventDate),
          participants: event.participants?.length || 0,
          totalRevenue: event.participants?.reduce(
            (sum, participant) => sum + (participant.agreedPrice || 0),
            0
          ) || 0,
        }));

        setRecentEvents(recentEventsConverted);

        // Calculate stats
        const totalParticipants = events.reduce(
          (sum, event) => sum + (event.participants?.length || 0),
          0
        );

        const totalRevenue = events.reduce((sum, event) => {
          return (
            sum +
            (event.participants?.reduce(
              (subtotal, participant) => subtotal + (participant.agreedPrice || 0),
              0
            ) || 0)
          );
        }, 0);

        const totalPaid = events.reduce((sum, event) => {
          return (
            sum +
            (event.participants?.reduce((subtotal, participant) => {
              const paid = participant.payments?.reduce((paymentSum, payment) => {
                return paymentSum + (payment.status === "completed" ? payment.amount : 0);
              }, 0) || 0;
              return subtotal + paid;
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
      }
    }

    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--spiritual-purple)] via-[var(--spiritual-blue)] to-[var(--spiritual-gold)] bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-white/60 mt-2">
            Gerenciamento completo do seu retiro
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
        <Card className="bg-white/[0.03] border-white/[0.08] p-6 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white mb-4">
            Resumo Financeiro
          </h3>
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-sm text-white/60">Receita Total</p>
              <p className="text-2xl font-bold text-emerald-400">
                R$ {stats.totalRevenue.toFixed(2)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-[var(--spiritual-blue)]/10 border border-[var(--spiritual-blue)]/20">
              <p className="text-sm text-white/60">Já Recebido</p>
              <p className="text-2xl font-bold text-[var(--spiritual-blue)]">
                R$ {stats.totalPaid.toFixed(2)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-[var(--spiritual-gold)]/10 border border-[var(--spiritual-gold)]/20">
              <p className="text-sm text-white/60">Pendência Total</p>
              <p className="text-2xl font-bold text-[var(--spiritual-gold)]">
                R$ {stats.pendingPayments.toFixed(2)}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
