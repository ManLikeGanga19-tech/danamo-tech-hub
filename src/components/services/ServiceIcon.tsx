import { Brush, Code2, Headphones, Megaphone, Package, Search, ServerCog, ShoppingCart, Wallet } from "lucide-react";
import type { IconKey } from "@/lib/services";

const ICONS = {
  code: Code2,
  wallet: Wallet,
  package: Package,
  cart: ShoppingCart,
  search: Search,
  brush: Brush,
  server: ServerCog,
  headphones: Headphones,
  megaphone: Megaphone,
} as const;

export function ServiceIcon({ icon, className = "h-6 w-6" }: { icon: IconKey; className?: string }) {
  const Icon = ICONS[icon];
  return <Icon className={`${className} text-blue-600 dark:text-blue-400`} aria-hidden="true" />;
}
