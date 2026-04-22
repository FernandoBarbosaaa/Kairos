"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type LotOption = { id: string; name: string; price: number };
type EditableParticipant = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  lotId: string;
  totalInstallments: number;
  eventId: string;
};

export default function EditParticipantPage() {
  const params = useParams();
  const router = useRouter();
  const participantId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [participant, setParticipant] = useState<EditableParticipant | null>(null);
  const [lots, setLots] = useState<LotOption[]>([]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    lotId: "",
    totalInstallments: 12,
  });

  const backHref = useMemo(() => {
    if (participant?.id) return `/participants/${participant.id}`;
    return "/participants";
  }, [participant]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/participants/${participantId}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Falha ao carregar participante");
        const data = (await res.json()) as EditableParticipant;
        if (cancelled) return;

        setParticipant(data);
        setFormData({
          fullName: data.fullName ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
          lotId: data.lotId ?? "",
          totalInstallments: data.totalInstallments ?? 12,
        });

        const lotsRes = await fetch(`/api/lots?eventId=${data.eventId}`, { cache: "no-store" });
        if (lotsRes.ok && !cancelled) {
          setLots((await lotsRes.json()) as LotOption[]);
        }
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar participante");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [participantId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/participants/${participantId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          lotId: formData.lotId || undefined,
          totalInstallments: formData.totalInstallments,
        }),
      });

      if (res.status === 409) {
        toast.error("Já existe um participante com este email neste evento");
        return;
      }
      if (!res.ok) throw new Error("Falha ao salvar");

      toast.success("Participante atualizado");
      router.push(backHref);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar participante");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Carregando...</p>
      </div>
    );
  }

  if (!participant) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Participante não encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href={backHref}>
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white">Editar Participante</h1>
          <p className="text-slate-400 mt-1">{participant.fullName}</p>
        </div>
      </div>

      <Card className="bg-slate-900/50 border-slate-800 p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Nome Completo *</label>
            <Input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Email *</label>
            <Input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Telefone *</label>
            <Input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Lote *</label>
            <Select
              value={formData.lotId}
              onValueChange={(value) => setFormData({ ...formData, lotId: value ?? "" })}
            >
              <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                <SelectValue placeholder="Selecione um lote" />
              </SelectTrigger>
              <SelectContent>
                {lots.map((lot) => (
                  <SelectItem key={lot.id} value={lot.id}>
                    {lot.name} — R$ {lot.price.toFixed(2)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Número de Parcelas</label>
            <Input
              type="number"
              min="1"
              max="48"
              value={formData.totalInstallments}
              onChange={(e) => setFormData({ ...formData, totalInstallments: parseInt(e.target.value || "1") })}
              className="bg-slate-900 border-slate-700 text-white"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Link href={backHref} className="flex-1">
              <Button variant="outline" className="w-full">
                Cancelar
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={saving || !formData.fullName || !formData.email || !formData.phone || !formData.lotId}
              className="flex-1 bg-blue-600 hover:bg-blue-700 gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

