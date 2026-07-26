"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, Heart, ShoppingCart } from "lucide-react";
import { useStore } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Header({ variant = "default" }: { variant?: "default" | "shop" }) {
  const { cart, wishlist } = useStore();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);

  const { scrollY } = useScroll();
  // Starts completely transparent at 0px scroll, then smoothly fades in gradient on scroll
  const scrollOpacity = useTransform(scrollY, [0, 80], [0, 1]);
  const headerBackground = useTransform(
    scrollOpacity,
    (o) => `linear-gradient(to bottom, rgba(10, 10, 12, ${o * 0.95}) 0%, rgba(10, 10, 12, ${o * 0.5}) 60%, rgba(10, 10, 12, 0) 100%)`
  );

  useEffect(() => {
    setMounted(true);
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser(data.user);
      }
    });
  }, []);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <motion.header
      style={{
        background: headerBackground,
      }}
      className="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 pointer-events-auto"
    >
      <div className="mx-auto grid grid-cols-2 md:grid-cols-3 h-20 max-w-[1400px] items-center px-6 lg:px-12">
        
        {/* Logo */}
        <div className="flex justify-start">
          <Link href="/" className="flex items-center group">
            <div className="flex items-center justify-center transition-transform duration-500 ease-out group-hover:scale-105">
              <Image 
                src="/logo.webp" 
                alt="Klarone Logo" 
                width={110} 
                height={32} 
                className="object-contain h-7 w-auto invert" 
                style={{ width: 'auto', height: 'auto' }} 
              />
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-center">
          <nav className="flex items-center gap-8">
            {["Shop", "How it Works", "Services", "Top Picks", "FAQ"].map((item, i) => (
              <Link 
                key={i} 
                href={item === "Shop" ? "/shop" : `/#${item.toLowerCase().replace(/ /g, '-')}`} 
                className="text-[14px] font-medium text-[#A8A8A8] hover:text-white transition-colors duration-300"
              >
                {item}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center justify-end gap-5 sm:gap-6">
          <div className="flex items-center gap-5 sm:gap-6">
            {/* Wishlist */}
            <Link href="/wishlist" className="text-[#A8A8A8] hover:text-white transition-all duration-300 hover:scale-110 relative" aria-label="Wishlist">
              <Heart className="w-5 h-5" strokeWidth={1.5} />
              {mounted && wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-bold text-black shadow-sm">
                  {wishlist.length}
                </span>
              )}
            </Link>
            
            {/* Cart */}
            <Link href="/cart" className="text-[#A8A8A8] hover:text-white transition-all duration-300 hover:scale-110 relative" aria-label="Cart">
              <ShoppingCart className="w-5 h-5" strokeWidth={1.5} />
              {mounted && cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-bold text-black shadow-sm">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Profile */}
            <Link href={user ? "/profile" : "/login"} className="text-[#A8A8A8] hover:text-white transition-all duration-300 hover:scale-110" aria-label="Account">
              <User className="w-5 h-5" strokeWidth={1.5} />
            </Link>
          </div>
        </div>

      </div>
    </motion.header>
  );
}
