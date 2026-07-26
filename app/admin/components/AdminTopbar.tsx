"use client";

import { useState } from "react";
import { Search, Calendar, Filter, Bell, Download, ChevronDown, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { GlobalSearch } from "@/components/search/GlobalSearch";

export default function AdminTopbar() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="h-[88px] bg-[#0A0A0C]/90 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6 shrink-0 text-white z-20">
      {/* Left */}
      <div className="flex-1 max-w-md">
        <button 
          onClick={() => setSearchOpen(true)}
          className="bg-[#121215] rounded-full py-2 px-4 flex items-center justify-between border border-white/10 w-[280px] transition-all hover:border-white/20 group cursor-text"
        >
          <div className="flex items-center gap-3">
            <Search className="w-[16px] h-[16px] text-white/40 group-hover:text-white/70 transition-colors" />
            <span className="text-[13.5px] text-white/40 group-hover:text-white/80 transition-colors">Smart Search...</span>
          </div>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-white/50">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
        <GlobalSearch open={searchOpen} setOpen={setSearchOpen} />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-5">
        
        {/* Avatars */}
        <div className="hidden lg:flex items-center">
          <div className="flex -space-x-2 mr-2">
            <Avatar className="w-7 h-7 border-2 border-[#0A0A0C]">
              <AvatarImage src="/Hero/hero3.webp" className="object-cover" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <Avatar className="w-7 h-7 border-2 border-[#0A0A0C]">
              <AvatarImage src="/top/top1.webp" className="object-cover" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <Avatar className="w-7 h-7 border-2 border-[#0A0A0C]">
              <AvatarImage src="/top/top5.webp" className="object-cover" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
          <Button size="icon" className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 border-2 border-[#0A0A0C] text-white -ml-2 z-10">
            <Plus className="w-3.5 h-3.5" />
          </Button>
        </div>

        <div className="h-5 w-px bg-white/10 hidden lg:block"></div>

        {/* Date Filter */}
        <button className="hidden sm:flex items-center gap-2 text-[13.5px] font-normal text-white/70 hover:text-white transition-colors">
          <Calendar className="w-4 h-4 text-white/40" />
          Last Month
          <ChevronDown className="w-3.5 h-3.5 text-white/40" />
        </button>

        {/* Filter */}
        <button className="hidden sm:flex items-center gap-2 text-[13.5px] font-normal text-white/70 hover:text-white transition-colors">
          <Filter className="w-4 h-4 text-white/40" />
          Filter
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-white/60 hover:text-white transition-colors border border-white/10 rounded-xl bg-[#121215]">
          <Bell className="w-[17px] h-[17px]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#00A7B5] rounded-full"></span>
        </button>

        {/* Export Button */}
        <Button className="px-5 h-[40px] rounded-full bg-white hover:bg-white/90 text-black text-[13.5px] font-medium flex items-center gap-2 shadow-sm transition-all">
          <Download className="w-3.5 h-3.5" />
          Export
        </Button>

      </div>
    </header>
  );
}
