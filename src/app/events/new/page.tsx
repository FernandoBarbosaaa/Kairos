"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { createEvent } from "@/actions/events";

export default function NewEventPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    eventDate: "",
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await createEvent({
        name: formData.name,
        eventDate: formData.eventDate,
      });
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
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-white">Novo Evento</h1>
      </div>

      <Card className="bg-slate-900/50 border-slate-800 p-8 max-w-2xl">
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
              className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
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
              className="bg-slate-900 border-slate-700 text-white"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Link href="/events" className="flex-1">
              <Button variant="outline" className="w-full">
                Cancelar
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={loading || !formData.name || !formData.eventDate}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Criando..." : "Criar Evento"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
