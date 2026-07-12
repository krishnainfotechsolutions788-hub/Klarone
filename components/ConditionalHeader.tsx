"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";

export default function ConditionalHeader() {
  const pathname = usePathname();
  
  // Do not show the header on any admin routes or auth routes
  if (pathname.startsWith("/admin") || pathname === "/login" || pathname === "/register") {
    return null;
  }
  
  return <Header />;
}
