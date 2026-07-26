"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  MessageSquare,
  Mail,
  BarChart2,
  GitMerge,
  Activity,
  UserCircle,
  Settings,
  Users2,
  Tags,
  Bookmark,
  ShieldAlert,
  ChevronsUpDown,
  type LucideIcon
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth"; // Added useAuth hook for RBAC

type NavItem = {
  name: string;
  href: string;
  icon: LucideIcon;
  permission?: string;
  badge?: number;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const NAV_ITEMS: NavSection[] = [
  {
    title: "MAIN",
    items: [
      { name: "Dashboard", href: "/admin", icon: LayoutDashboard, permission: "dashboard.view" },
      { name: "Order", href: "/admin/order", icon: ShoppingCart, permission: "orders.view" },
      { name: "Customer", href: "/admin/customer", icon: Users, permission: "users.view" },
      { name: "Chat", href: "/admin/chat", icon: MessageSquare, badge: 2 },
    ]
  },
  {
    title: "CATALOG",
    items: [
      { name: "Products", href: "/admin/product", icon: Package, permission: "products.view" },
      { name: "Categories", href: "/admin/categories", icon: Tags, permission: "products.view" },
      { name: "Brands", href: "/admin/brands", icon: Bookmark, permission: "products.view" },
      { name: "Master Catalog", href: "/admin/knowledge-catalog", icon: Bookmark, permission: "products.view" },
    ]
  },
  {
    title: "OTHER",
    items: [
      { name: "Email", href: "/admin/email", icon: Mail, badge: 3 },
      { name: "Analytics", href: "/admin/analytics", icon: BarChart2, permission: "analytics.view" },
      { name: "Integration", href: "/admin/integration", icon: GitMerge, permission: "settings.view" },
      { name: "Performance", href: "/admin/performance", icon: Activity, permission: "settings.view" },
    ]
  },
  {
    title: "ACCOUNT",
    items: [
      { name: "Users", href: "/admin/users", icon: Users2, permission: "users.view" },
      { name: "Members", href: "/admin/members", icon: Users, permission: "roles.view" },
      { name: "Account", href: "/admin/account", icon: UserCircle },
      { name: "Setting", href: "/admin/setting", icon: Settings, permission: "settings.view" },
    ]
  }
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { hasPermission, isLoading } = useAuth();

  return (
    <aside className="w-[260px] bg-[#0A0A0C]/90 backdrop-blur-xl border-r border-white/10 flex flex-col shrink-0 text-white z-20">
      {/* Logo Area */}
      <div className="h-[88px] flex items-center px-6 border-b border-white/10">
        <div className="flex items-center justify-between w-full border border-white/10 rounded-[12px] p-2 bg-[#121215] hover:bg-[#18181C] cursor-pointer transition-all shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[8px] flex items-center justify-center overflow-hidden bg-white/10 border border-white/10">
              <img src="/logo.webp" alt="Klarone Logo" className="w-full h-full object-contain p-1 invert" />
            </div>
            <div>
              <h1 className="font-heading font-medium text-[14.5px] text-white leading-tight">Klarone</h1>
              <p className="text-[11px] text-white/50 font-normal">Admin Platform</p>
            </div>
          </div>
          <ChevronsUpDown className="w-4 h-4 text-white/40 mr-1" />
        </div>
      </div>

      {/* Nav Links */}
      <div className="flex-1 overflow-y-auto py-6 px-6 no-scrollbar">
        {NAV_ITEMS.map((section, idx) => {
          // Filter items based on permission
          const filteredItems = section.items.filter(item => {
            // Bypass permission check for now so options don't disappear
            return true;
          });

          if (filteredItems.length === 0) return null;

          return (
            <div key={idx} className="mb-8 last:mb-0">
              <h2 className="text-[10.5px] font-medium text-white/40 tracking-wider mb-3 px-3 uppercase">{section.title}</h2>
              <div className="flex flex-col gap-1">
                {filteredItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13.5px] font-normal transition-all group ${isActive
                          ? "bg-white/10 text-white border border-white/15 shadow-sm"
                          : "text-white/60 hover:bg-white/5 hover:text-white border border-transparent"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-[17px] h-[17px] ${isActive ? "text-[#00A7B5]" : "text-white/40 group-hover:text-white/80"}`} />
                        {item.name}
                      </div>
                      {item.badge && (
                        <Badge className="bg-[#00A7B5] text-black hover:bg-[#00A7B5] border-none font-medium text-[10px] px-1.5 min-w-[18px] flex justify-center">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-white/10 bg-[#0A0A0C]">
        <Link href="/admin/account" className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 cursor-pointer">
          <Avatar className="w-[36px] h-[36px] rounded-full ring-1 ring-white/20">
            <AvatarImage src="/placeholder-user.jpg" alt="Admin" />
            <AvatarFallback className="bg-white/10 text-white font-medium text-xs">KS</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-white truncate">Klarone Admin</p>
            <p className="text-[11px] text-white/40 font-normal truncate">admin@klarone.com</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
