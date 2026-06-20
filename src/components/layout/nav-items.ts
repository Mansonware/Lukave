import { Home, Search, Bell, Settings, MessageCircle, type LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const primaryNav: NavItem[] = [
  { href: "/feed", label: "Início", icon: Home },
  { href: "/explore", label: "Buscar", icon: Search },
  { href: "/notifications", label: "Notificações", icon: Bell },
  { href: "/messages", label: "Mensagens", icon: MessageCircle },
  { href: "/settings", label: "Configurações", icon: Settings },
];
