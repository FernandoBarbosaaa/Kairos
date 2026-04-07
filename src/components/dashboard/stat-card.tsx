"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: "up" | "down";
  color?: "blue" | "green" | "yellow" | "red";
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  color = "blue",
}: StatCardProps) {
  const colorClasses = {
    blue: "bg-blue-500/10 text-blue-400",
    green: "bg-green-500/10 text-green-400",
    yellow: "bg-yellow-500/10 text-yellow-400",
    red: "bg-red-500/10 text-red-400",
  };

  return (
    <Card className="p-6 bg-slate-900/50 border-slate-800 hover:border-slate-700 transition">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-slate-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>{icon}</div>
      </div>
      {trend && (
        <div className="mt-4">
          <Badge variant="outline" className={trend === "up" ? "text-green-400" : "text-red-400"}>
            {trend === "up" ? "↑" : "↓"} este mês
          </Badge>
        </div>
      )}
    </Card>
  );
}
