"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Phone, Mail, Globe, MessageCircle, Share2, User, Heart, ShoppingCart, LogOut, Search } from "lucide-react";
import { useStore } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";

export default function Header({ variant = "default" }: { variant?: "default" | "shop" }) {
  const router = useRouter();
  const { cart, wishlist } = useStore();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser(data.user);
      }
    });
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    router.refresh();
  };
  
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full flex flex-col transition-all duration-300">
      {/* Top Bar */}
      <div className="w-full bg-[#111111]/50 backdrop-blur-md text-gray-400 h-10 flex items-center border-b border-white/10 relative z-10">
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-6 lg:px-12 text-[12px] sm:text-[13px]">
          
          {/* Left: Contact Info */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
              <Phone className="w-3.5 h-3.5 text-[#00A7B5]" />
              <span className="font-medium tracking-wide">+91 9060557296</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
              <Mail className="w-3.5 h-3.5 text-[#00A7B5]" />
              <span className="font-medium tracking-wide">info@klarone.in</span>
            </div>
          </div>

          {/* Center: Welcome Message */}
          <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center">
            <span className="font-medium">
              Welcome to Klarone! <span className="text-white">Book your FREE consultation today.</span>
            </span>
          </div>

          {/* Right: Social Icons */}
          <div className="flex items-center gap-3">
            <Link href="#" className="text-gray-400 hover:text-[#00A7B5] transition-colors">
              <Globe className="w-3.5 h-3.5" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-[#00A7B5] transition-colors">
              <MessageCircle className="w-3.5 h-3.5" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-[#00A7B5] transition-colors">
              <Share2 className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </div>

      {/* Main Navbar */}
      <div className="w-full bg-white/80 backdrop-blur-md border-b border-transparent transition-all duration-300">
        <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-6 lg:px-12">
        
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <div className="flex items-center justify-center transition-transform group-hover:scale-105">
            <Image src="/logo.webp" alt="Klarone Logo" width={110} height={32} className="object-contain h-7 w-auto" style={{ width: 'auto', height: 'auto' }} />
          </div>
        </Link>

        {/* Desktop Navigation / Search */}
        {variant === "default" ? (
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/shop" className="text-[14px] font-medium text-[#666666] hover:text-[#111111] transition-colors relative group">
              Shop
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#111111] transition-all group-hover:w-full"></span>
            </Link>
            <Link href="/#how-it-works" className="text-[14px] font-medium text-[#666666] hover:text-[#111111] transition-colors relative group">
              How it Works
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#111111] transition-all group-hover:w-full"></span>
            </Link>
            <Link href="/#services" className="text-[14px] font-medium text-[#666666] hover:text-[#111111] transition-colors relative group">
              Services
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#111111] transition-all group-hover:w-full"></span>
            </Link>
            <Link href="/#top-picks" className="text-[14px] font-medium text-[#666666] hover:text-[#111111] transition-colors relative group">
              Top Picks
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#111111] transition-all group-hover:w-full"></span>
            </Link>
            <Link href="/#faq" className="text-[14px] font-medium text-[#666666] hover:text-[#111111] transition-colors relative group">
              FAQ
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#111111] transition-all group-hover:w-full"></span>
            </Link>
          </nav>
        ) : (
          <div className="hidden md:flex flex-1"></div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          {user ? (
            <Link href="/profile" className="text-[#666666] hover:text-[#111111] transition-colors relative group" title="Profile">
              <User className="w-5 h-5" />
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#111111] transition-all group-hover:w-full"></span>
            </Link>
          ) : (
            <Link href="/login" className="text-[#666666] hover:text-[#111111] transition-colors relative group" title="Sign In">
              <User className="w-5 h-5" />
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#111111] transition-all group-hover:w-full"></span>
            </Link>
          )}
          <Link href="/wishlist" className="text-[#666666] hover:text-[#111111] transition-colors relative group">
            <Heart className="w-5 h-5" />
            {mounted && wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#00A7B5] text-[9px] font-bold text-white shadow-sm ring-2 ring-white">
                {wishlist.length}
              </span>
            )}
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#111111] transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/cart" className="text-[#666666] hover:text-[#111111] transition-colors relative group">
            <ShoppingCart className="w-5 h-5" />
            {mounted && cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#00A7B5] text-[9px] font-bold text-white shadow-sm ring-2 ring-white">
                {cartItemCount}
              </span>
            )}
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#111111] transition-all group-hover:w-full"></span>
          </Link>
        </div>

      </div>
      </div>
    </header>
  );
}
