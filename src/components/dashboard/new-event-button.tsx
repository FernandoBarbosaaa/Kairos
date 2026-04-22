"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { CreateEventDialog } from "./create-event-dialog";

export function NewEventButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[var(--spiritual-purple)] to-[var(--spiritual-blue)] hover:shadow-lg hover:shadow-[var(--spiritual-purple)]/30 px-4 py-2 text-sm font-medium text-white transition-all duration-300"
      >
        <Plus className="w-4 h-4" />
        Novo Evento
      </button>
      <CreateEventDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
