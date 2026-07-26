"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";

export default function ConditionalHeader() {
  const pathname = usePathname();
  
  // Do not show the header on any admin routes, auth routes, or the chat UI
  if (pathname.startsWith("/admin") || pathname === "/login" || pathname === "/register" || pathname === "/find-laptop") {
    return null;
  }
  
  const isShopRoute = pathname.startsWith("/shop");
  
  return <Header variant={isShopRoute ? "shop" : "default"} />;
}
