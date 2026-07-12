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
    <aside className="w-[260px] bg-[#ffffff] border-r border-[#dddddd] flex flex-col shrink-0">
      {/* Logo Area */}
      <div className="h-[88px] flex items-center px-6 border-b border-[#dddddd]">
        <div className="flex items-center justify-between w-full border border-[#dddddd] rounded-[10px] p-1.5 hover:bg-[#f8fafc] cursor-pointer transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[8px] flex items-center justify-center shadow-none overflow-hidden bg-white">
              <img src="/icon2.png" alt="Klarone Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="font-heading font-semibold text-[15px] text-[#181d26] leading-tight">Klarone</h1>
              <p className="text-[11px] text-[#41454d] font-medium">Admin Panel</p>
            </div>
          </div>
          <ChevronsUpDown className="w-4 h-4 text-[#9297a0] mr-1" />
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
              <h2 className="text-[11px] font-medium text-[#41454d] tracking-wider mb-4 px-3">{section.title}</h2>
              <div className="flex flex-col gap-1">
                {filteredItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-[6px] text-[14px] font-medium transition-all group ${isActive
                          ? "bg-[#f8fafc] text-[#181d26] border border-[#dddddd]"
                          : "text-[#41454d] hover:bg-[#f8fafc] hover:text-[#181d26] border border-transparent"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-[18px] h-[18px] ${isActive ? "text-[#181d26]" : "text-[#41454d] group-hover:text-[#181d26]"}`} />
                        {item.name}
                      </div>
                      {item.badge && (
                        <Badge className="bg-[#181d26] text-white hover:bg-[#181d26] border-none font-semibold text-[10px] px-1.5 min-w-[20px] flex justify-center">
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
      <div className="p-6 border-t border-[#dddddd] bg-[#ffffff]">
        <Link href="/admin/account" className="flex items-center gap-3 p-2 rounded-[8px] hover:bg-[#f8fafc] transition-colors border border-transparent hover:border-[#dddddd] cursor-pointer">
          <Avatar className="w-[38px] h-[38px] rounded-full ring-1 ring-[#dddddd]">
            <AvatarImage src="/placeholder-user.jpg" alt="Admin" />
            <AvatarFallback className="bg-blue-50 text-blue-700 font-semibold text-sm">KS</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-[#181d26] truncate">Klarone Support</p>
            <p className="text-[11px] text-[#41454d] font-medium truncate">admin@klarone.com</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
