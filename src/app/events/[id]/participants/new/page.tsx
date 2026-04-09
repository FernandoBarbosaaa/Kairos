"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function NewParticipantPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    lotId: "",
    totalInstallments: 12,
  });
  const [loading, setLoading] = useState(false);
  const [lots, setLots] = useState<{ id: string; name: string; price: number }[]>([]);
  const [loadingLots, setLoadingLots] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/lots?eventId=${eventId}`, { cache: "no-store" });
        if (!cancelled && res.ok) setLots(await res.json());
      } finally {
        if (!cancelled) setLoadingLots(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [eventId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/participants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          eventId,
          lotId: formData.lotId || undefined,
          totalInstallments: formData.totalInstallments,
        }),
      });
      if (res.status === 409) {
        toast.error("Já existe um participante com este email neste evento");
        return;
      }
      if (!res.ok) throw new Error("Falha ao criar participante");
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
          <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--spiritual-purple)] to-[var(--spiritual-blue)] bg-clip-text text-transparent">Novo Participante</h1>
      </div>

      <Card className="bg-white/[0.03] border-white/[0.08] p-8 max-w-2xl backdrop-blur-sm">
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
              className="bg-white/[0.05] border-white/[0.1] text-white placeholder:text-white/40"
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
              className="bg-white/[0.05] border-white/[0.1] text-white placeholder:text-white/40"
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
              className="bg-white/[0.05] border-white/[0.1] text-white placeholder:text-white/40"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Lote *
            </label>
            <Select
              value={formData.lotId}
              onValueChange={(value) => setFormData({ ...formData, lotId: value ?? "" })}
              disabled={loadingLots || lots.length === 0}
            >
              <SelectTrigger className="bg-white/[0.05] border-white/[0.1] text-white">
                <SelectValue placeholder={loadingLots ? "Carregando lotes..." : "Selecione um lote"} />
              </SelectTrigger>
              <SelectContent className="bg-[var(--spiritual-bg-light)] border-white/[0.1]">
                {lots.map((lot) => (
                  <SelectItem key={lot.id} value={lot.id}>
                    {lot.name} — R$ {lot.price.toFixed(2)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {(!loadingLots && lots.length === 0) && (
              <p className="text-xs text-slate-400 mt-2">
                Nenhum lote cadastrado para este evento. Crie um lote antes de adicionar participantes.
              </p>
            )}
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
              disabled={
                loading ||
                !formData.fullName ||
                !formData.email ||
                !formData.phone ||
                !formData.lotId
              }
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
