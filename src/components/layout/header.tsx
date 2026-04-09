"use client";

import { Bell, Menu, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  isSidebarOpen: boolean;
  onMenuToggle: () => void;
}

export function Header({ isSidebarOpen, onMenuToggle }: HeaderProps) {
  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 z-50 h-16 glass-effect flex items-center justify-between px-4 md:px-6 border-b border-white/5">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onMenuToggle}
          className="md:hidden flex items-center gap-2 rounded-lg px-3 py-2.5 min-h-11 text-white bg-white/10 hover:bg-white/20 border border-white/10 shadow-sm transition"
          aria-expanded={isSidebarOpen}
          aria-controls="app-sidebar"
          aria-label={isSidebarOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
        >
          {isSidebarOpen ? (
            <>
              <X className="w-6 h-6 shrink-0" aria-hidden />
              <span className="text-sm font-semibold">Fechar</span>
            </>
          ) : (
            <>
              <Menu className="w-6 h-6 shrink-0" aria-hidden />
              <span className="text-sm font-medium">Menu</span>
            </>
          )}
        </button>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button
          className="relative p-2 hover:bg-white/10 rounded-lg transition"
          aria-label="Notificações"
        >
          <Bell className="w-5 h-5 text-white/70 hover:text-white transition" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--spiritual-gold)] rounded-full animate-pulse" />
        </button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full bg-gradient-to-br from-[var(--spiritual-purple)] to-[var(--spiritual-blue)] hover:shadow-lg p-2 transition outline-none">
            <User className="w-5 h-5 text-white" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-[var(--spiritual-bg)] border border-white/10">
            <DropdownMenuItem className="text-white hover:text-white hover:bg-white/10">Meu Perfil</DropdownMenuItem>
            <DropdownMenuItem className="text-white hover:text-white hover:bg-white/10">Configurações</DropdownMenuItem>
            <DropdownMenuItem className="text-red-400 hover:text-red-300 hover:bg-red-950/20">Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
