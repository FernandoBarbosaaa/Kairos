"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { createLot } from "@/actions/lots";

export default function NewLotPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await createLot({
        name: formData.name,
        price: parseFloat(formData.price),
        startDate: formData.startDate,
        endDate: formData.endDate,
        eventId,
      });
      toast.success("Lote criado com sucesso!");
      router.push(`/events/${eventId}`);
    } catch (error) {
      toast.error("Erro ao criar lote");
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
        <h1 className="text-3xl font-bold text-white">Novo Lote</h1>
      </div>

      <Card className="bg-slate-900/50 border-slate-800 p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Nome do Lote *
            </label>
            <Input
              type="text"
              required
              placeholder="Ex: Lote Early Bird"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Preço *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-slate-400">R$</span>
              <Input
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="0,00"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 pl-8"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Data Início *
              </label>
              <Input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="bg-slate-900 border-slate-700 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Data Fim *
              </label>
              <Input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="bg-slate-900 border-slate-700 text-white"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Link href={`/events/${eventId}`} className="flex-1">
              <Button variant="outline" className="w-full">
                Cancelar
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={loading || !formData.name || !formData.price || !formData.startDate || !formData.endDate}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Criando..." : "Criar Lote"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
