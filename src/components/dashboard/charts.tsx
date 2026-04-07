"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";

interface RevenueChartProps {
  data: Array<{
    month: string;
    revenue: number;
    received: number;
  }>;
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <Card className="bg-slate-900/50 border-slate-800 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Receita por Mês</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="month" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #475569",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "#f1f5f9" }}
          />
          <Legend />
          <Bar dataKey="revenue" fill="#3b82f6" name="Total" />
          <Bar dataKey="received" fill="#10b981" name="Recebido" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

interface DefaultingChartProps {
  data: Array<{
    month: string;
    defaulting: number;
    late: number;
  }>;
}

export function DefaultingChart({ data }: DefaultingChartProps) {
  return (
    <Card className="bg-slate-900/50 border-slate-800 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Inadimplência</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="month" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #475569",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "#f1f5f9" }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="defaulting"
            stroke="#ef4444"
            name="Inadimplentes"
          />
          <Line
            type="monotone"
            dataKey="late"
            stroke="#f97316"
            name="Atrasados"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
