"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { createParticipant } from "@/actions/participants";

interface CreateParticipantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
}

export function CreateParticipantDialog({
  open,
  onOpenChange,
  eventId,
}: CreateParticipantDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    totalInstallments: 12,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "totalInstallments" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.phone) {
      toast.error("Preencha todos os campos");
      return;
    }

    setLoading(true);
    try {
      await createParticipant({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        eventId,
        totalInstallments: formData.totalInstallments,
      });

      toast.success("Participante adicionado com sucesso!");
      setFormData({ fullName: "", email: "", phone: "", totalInstallments: 12 });
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Erro ao adicionar participante");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-white">Adicionar Participante</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Nome Completo
            </label>
            <Input
              type="text"
              name="fullName"
              placeholder="João Silva"
              value={formData.fullName}
              onChange={handleChange}
              className="bg-slate-800 border-slate-700 text-white placeholder-slate-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email
            </label>
            <Input
              type="email"
              name="email"
              placeholder="joao@example.com"
              value={formData.email}
              onChange={handleChange}
              className="bg-slate-800 border-slate-700 text-white placeholder-slate-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Telefone
            </label>
            <Input
              type="tel"
              name="phone"
              placeholder="(11) 98765-4321"
              value={formData.phone}
              onChange={handleChange}
              className="bg-slate-800 border-slate-700 text-white placeholder-slate-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Número de Parcelas
            </label>
            <select
              name="totalInstallments"
              value={formData.totalInstallments}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              disabled={loading}
            >
              {Array.from({ length: 48 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num} parcelas
                </option>
              ))}
            </select>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {loading ? "Adicionando..." : "Adicionar Participante"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
