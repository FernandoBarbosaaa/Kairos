"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateEventDialog({
  open,
  onOpenChange,
}: CreateEventDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    eventDate: "",
    location: "",
    totalPrice: "",
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.eventDate || !formData.location || !formData.totalPrice) {
      toast.error("Preencha todos os campos");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          eventDate: formData.eventDate,
          location: formData.location,
          totalPrice: parseFloat(formData.totalPrice || "0"),
          description: formData.description || undefined,
        }),
      });
      if (!res.ok) throw new Error("Falha ao criar evento");

      toast.success("Evento criado com sucesso!");
      setFormData({ name: "", eventDate: "", location: "", totalPrice: "", description: "" });
      onOpenChange(false);
    } catch (error) {
      toast.error("Erro ao criar evento");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-white">Criar Novo Evento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Nome do Evento
            </label>
            <Input
              type="text"
              name="name"
              placeholder="Ex: Retiro 2024"
              value={formData.name}
              onChange={handleChange}
              className="bg-slate-800 border-slate-700 text-white placeholder-slate-500"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Data do Evento
            </label>
            <Input
              type="date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              className="bg-slate-800 border-slate-700 text-white"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Local
            </label>
            <Input
              type="text"
              name="location"
              placeholder="Ex: Sítio Recanto da Paz"
              value={formData.location}
              onChange={handleChange}
              className="bg-slate-800 border-slate-700 text-white placeholder-slate-500"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Valor Total do Retiro (R$)
            </label>
            <Input
              type="number"
              name="totalPrice"
              placeholder="0.00"
              step="0.01"
              min="0"
              value={formData.totalPrice}
              onChange={handleChange}
              className="bg-slate-800 border-slate-700 text-white placeholder-slate-500"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Descrição (opcional)
            </label>
            <Input
              type="text"
              name="description"
              placeholder="Detalhes do retiro..."
              value={formData.description}
              onChange={handleChange}
              className="bg-slate-800 border-slate-700 text-white placeholder-slate-500"
              disabled={loading}
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {loading ? "Criando..." : "Criar Evento"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
