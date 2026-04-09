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
    <header className="fixed top-0 right-0 left-0 md:left-64 z-50 h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onMenuToggle}
          className="md:hidden flex items-center gap-2 rounded-lg px-3 py-2.5 min-h-11 text-slate-100 bg-slate-800/90 hover:bg-slate-700 border border-slate-600 shadow-sm transition"
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

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button
          className="relative p-2 hover:bg-slate-800 rounded-lg transition"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full bg-slate-800 hover:bg-slate-700 p-2 transition outline-none">
            <User className="w-5 h-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>Meu Perfil</DropdownMenuItem>
            <DropdownMenuItem>Configurações</DropdownMenuItem>
            <DropdownMenuItem className="text-red-400">Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
