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
          "fixed left-0 top-0 z-40 h-screen w-64 max-w-[85vw] bg-gradient-to-b from-slate-950 to-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-out shadow-2xl md:shadow-none",
          "md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Menu lateral"
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <CalendarDays className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-white text-lg">Kairos</span>
          </Link>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="md:hidden rounded-lg p-2.5 min-h-11 min-w-11 flex items-center justify-center text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 transition"
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
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                )}
              >
                <Icon className="w-5 h-5" />
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
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-slate-400 hover:text-white"
          >
            <Settings className="w-5 h-5" />
            <span className="text-sm">Configurações</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-950"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Sair</span>
          </Button>
        </div>
      </aside>
    </>
  );
}
