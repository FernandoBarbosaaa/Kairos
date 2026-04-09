"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  CreditCard,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Eventos",
    href: "/events",
    icon: CalendarDays,
  },
  {
    name: "Participantes",
    href: "/participants",
    icon: Users,
  },
  {
    name: "Pagamentos",
    href: "/payments",
    icon: CreditCard,
  },
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-30 bg-black/60 transition-opacity md:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      <aside
        id="app-sidebar"
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 max-w-[85vw] flex flex-col transition-transform duration-200 ease-out shadow-2xl md:shadow-none",
          "bg-gradient-to-b from-[var(--spiritual-bg)] via-[var(--spiritual-bg)] to-[var(--spiritual-bg-dark)]",
          "border-r border-white/5",
          "md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Menu lateral"
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--spiritual-purple)] to-[var(--spiritual-blue)] flex items-center justify-center shadow-lg">
              <span className="text-xl font-bold text-white">K</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-white text-lg leading-tight">Kairos</span>
              <span className="text-xs text-[var(--spiritual-gold)] font-medium">Retiro</span>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="md:hidden rounded-lg p-2.5 min-h-11 min-w-11 flex items-center justify-center text-white bg-white/10 hover:bg-white/20 border border-white/10 transition"
            aria-label="Fechar menu lateral"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group",
                  isActive
                    ? "bg-gradient-to-r from-[var(--spiritual-purple)] to-[var(--spiritual-blue)] text-white shadow-lg"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className={cn("w-5 h-5 transition-transform", isActive && "group-hover:scale-110")} />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="md:hidden px-4 pb-2">
          <Button
            type="button"
            variant="secondary"
            className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white border-0"
            onClick={() => setIsOpen(false)}
          >
            Fechar menu
          </Button>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-white/70 hover:text-white hover:bg-white/5 transition-all"
          >
            <Settings className="w-5 h-5" />
            <span className="text-sm">Configurações</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-red-400/70 hover:text-red-300 hover:bg-red-950/20 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Sair</span>
          </Button>
        </div>
      </aside>
    </>
  );
}
