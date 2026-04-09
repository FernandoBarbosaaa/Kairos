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
    blue: "bg-[var(--spiritual-blue)]/10 text-[var(--spiritual-blue)]",
    green: "bg-emerald-500/10 text-emerald-400",
    yellow: "bg-[var(--spiritual-gold)]/10 text-[var(--spiritual-gold)]",
    red: "bg-red-500/10 text-red-400",
  };

  return (
    <Card className="p-6 bg-white/[0.03] border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.05] transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-white/60 mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]} backdrop-blur-sm`}>{icon}</div>
      </div>
      {trend && (
        <div className="mt-4">
          <Badge variant="outline" className={trend === "up" ? "text-emerald-400 border-emerald-400/30" : "text-red-400 border-red-400/30"}>
            {trend === "up" ? "↑" : "↓"} este mês
          </Badge>
        </div>
      )}
    </Card>
  );
}
