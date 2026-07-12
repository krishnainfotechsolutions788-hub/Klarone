"use client";

import Link from "next/link";
import { UserX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotLoggedIn({
  title = "You are not logged in",
  message = "Please sign in to access this page and view your personal data."
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16 flex items-center justify-center">
      <div className="bg-white p-12 rounded-2xl border border-gray-100 shadow-sm max-w-md w-full text-center flex flex-col items-center">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <UserX className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-[#111111] mb-3">{title}</h2>
        <p className="text-gray-500 mb-8">{message}</p>
        <Link href="/login" className="w-full">
          <Button className="w-full h-12 bg-[#111111] hover:bg-[#222222] text-white rounded-lg font-medium transition-all shadow-md">
            Sign In
          </Button>
        </Link>
      </div>
    </div>
  );
}
