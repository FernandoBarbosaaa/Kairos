"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function NewEventPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    eventDate: "",
    location: "",
    description: "",
    totalPrice: "",
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          eventDate: formData.eventDate,
          location: formData.location,
          description: formData.description || undefined,
          totalPrice: parseFloat(formData.totalPrice || "0"),
        }),
      });
      if (!res.ok) throw new Error("Falha ao criar evento");
      toast.success("Evento criado com sucesso!");
      router.push("/events");
    } catch (error) {
      toast.error("Erro ao criar evento");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/events">
          <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--spiritual-purple)] to-[var(--spiritual-blue)] bg-clip-text text-transparent">Novo Evento</h1>
      </div>

      <Card className="bg-white/[0.03] border-white/[0.08] p-8 max-w-2xl backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Nome do Evento *
            </label>
            <Input
              type="text"
              required
              placeholder="Ex: Retiro Espiritual 2026"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-white/[0.05] border-white/[0.1] text-white placeholder:text-white/40"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Data do Evento *
            </label>
            <Input
              type="date"
              required
              value={formData.eventDate}
              onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
              className="bg-white/[0.05] border-white/[0.1] text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Local *
            </label>
            <Input
              type="text"
              required
              placeholder="Ex: Sítio Recanto da Paz"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="bg-white/[0.05] border-white/[0.1] text-white placeholder:text-white/40"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Descrição
            </label>
            <Input
              type="text"
              placeholder="Detalhes do retiro (opcional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-white/[0.05] border-white/[0.1] text-white placeholder:text-white/40"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Valor Total do Retiro *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-white/60">R$</span>
              <Input
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="0,00"
                value={formData.totalPrice}
                onChange={(e) => setFormData({ ...formData, totalPrice: e.target.value })}
                className="bg-white/[0.05] border-white/[0.1] text-white placeholder:text-white/40 pl-8"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Link href="/events" className="flex-1">
              <Button variant="outline" className="w-full">
                Cancelar
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={
                loading ||
                !formData.name ||
                !formData.eventDate ||
                !formData.location ||
                !formData.totalPrice
              }
              className="flex-1 bg-gradient-to-r from-[var(--spiritual-purple)] to-[var(--spiritual-blue)] hover:shadow-lg hover:shadow-[var(--spiritual-purple)]/30"
            >
              {loading ? "Criando..." : "Criar Evento"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
