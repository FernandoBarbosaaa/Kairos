"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { createParticipant } from "@/actions/participants";

export default function NewParticipantPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    totalInstallments: 12,
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await createParticipant({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        eventId,
        totalInstallments: formData.totalInstallments,
      });
      toast.success("Participante criado com sucesso!");
      router.push(`/events/${eventId}`);
    } catch (error) {
      toast.error("Erro ao criar participante");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href={`/events/${eventId}`}>
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-white">Novo Participante</h1>
      </div>

      <Card className="bg-slate-900/50 border-slate-800 p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Nome Completo *
            </label>
            <Input
              type="text"
              required
              placeholder="Ex: João da Silva"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Email *
            </label>
            <Input
              type="email"
              required
              placeholder="Ex: joao@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Telefone *
            </label>
            <Input
              type="tel"
              required
              placeholder="Ex: 11999999999"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Número de Parcelas
            </label>
            <Input
              type="number"
              min="1"
              max="48"
              value={formData.totalInstallments}
              onChange={(e) =>
                setFormData({ ...formData, totalInstallments: parseInt(e.target.value) })
              }
              className="bg-slate-900 border-slate-700 text-white"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Link href={`/events/${eventId}`} className="flex-1">
              <Button variant="outline" className="w-full">
                Cancelar
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={loading || !formData.fullName || !formData.email || !formData.phone}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Criando..." : "Criar Participante"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
