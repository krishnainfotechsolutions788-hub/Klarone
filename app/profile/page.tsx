"use client";

import { useState, useEffect } from "react";
import { User, Package, Settings, LogOut, Loader2, ChevronRight, MapPin, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import NotLoggedIn from "@/components/NotLoggedIn";
import Link from "next/link";
import { motion } from "framer-motion";

const itemUpVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.4, ease: [0.215, 0.61, 0.355, 1] as const } 
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05
    }
  }
};

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();
          
        setUser({
          ...data.user,
          profile: profileData || {}
        });
      }
      setLoading(false);
    }
    getUser();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000000] text-white pt-32 pb-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#00A7B5]" />
      </div>
    );
  }

  if (!user) {
    return <NotLoggedIn />;
  }

  const firstName = user.profile?.first_name || user.user_metadata?.first_name || user.email?.split("@")[0] || "User";
  const lastName = user.profile?.last_name || user.user_metadata?.last_name || "";
  const fullName = `${firstName} ${lastName}`.trim();
  const phone = user.profile?.phone || user.user_metadata?.phone || "Not provided";
  const getInitials = (name: string) => name.substring(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-[#000000] text-white relative overflow-hidden">
      <main className="flex-1 mt-32 sm:mt-36 pb-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          
          {/* Header Title Section matching Shop Page */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="pb-8 border-b border-white/10 mb-8"
          >
            <motion.h1 
              variants={itemUpVariants}
              className="text-[32px] sm:text-[40px] font-medium tracking-tight text-white"
            >
              My Account & Profile
            </motion.h1>
            <motion.p 
              variants={itemUpVariants}
              className="text-[14.5px] text-white/60 mt-1 max-w-xl"
            >
              Manage your personal details, order history, and preferences.
            </motion.p>
          </motion.div>

          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col lg:flex-row gap-10 items-start"
          >
            
            {/* Profile Sidebar */}
            <motion.div variants={itemUpVariants} className="w-full lg:w-[240px] flex-shrink-0 self-start">
              
              {/* User Identity Header */}
              <div className="flex items-center gap-3 pb-5 mb-4 border-b border-white/10">
                <div className="w-10 h-10 bg-[#18181A] rounded-full flex items-center justify-center text-white font-medium text-xs shrink-0 border border-white/15">
                  {getInitials(fullName)}
                </div>
                <div className="overflow-hidden min-w-0">
                  <h2 className="font-medium text-white text-[14px] truncate">{fullName}</h2>
                  <p className="text-[12px] text-white/50 truncate mt-0.5">{user.email}</p>
                </div>
              </div>
              
              {/* Navigation Items */}
              <nav className="flex flex-col gap-1 mb-6">
                <button className="flex items-center justify-between w-full text-left px-3 py-2.5 rounded-xl bg-white/10 text-white font-medium text-[13.5px] transition-colors">
                  <div className="flex items-center gap-2.5">
                    <User className="w-4 h-4 text-[#00A7B5]" /> Personal Details
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/40" />
                </button>

                <Link href="/profile/orders" className="flex items-center justify-between w-full text-left px-3 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 font-normal text-[13.5px] transition-colors">
                  <div className="flex items-center gap-2.5">
                    <Package className="w-4 h-4 text-white/40" /> Order History
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/20" />
                </Link>

                <Link href="/profile/addresses" className="flex items-center justify-between w-full text-left px-3 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 font-normal text-[13.5px] transition-colors">
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-white/40" /> Delivery Addresses
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/20" />
                </Link>

                <button className="flex items-center justify-between w-full text-left px-3 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 font-normal text-[13.5px] transition-colors">
                  <div className="flex items-center gap-2.5">
                    <Settings className="w-4 h-4 text-white/40" /> Account Settings
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/20" />
                </button>
              </nav>

              <div className="pt-3 border-t border-white/10">
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 font-normal text-[13.5px] transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>

            </motion.div>

            {/* Main Content Details Panel */}
            <motion.div variants={itemUpVariants} className="flex-1 w-full">
              
              <div className="pb-4 mb-6 border-b border-white/10">
                <h2 className="text-[18px] font-medium text-white tracking-tight">Personal Details</h2>
                <p className="text-[13.5px] text-white/50 mt-0.5">Your personal contact and identity information.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                
                {/* First Name */}
                <div className="space-y-1.5">
                  <label className="text-[12.5px] font-normal text-white/50">
                    First Name
                  </label>
                  <div className="h-11 px-3.5 bg-[#141416] border border-white/10 rounded-xl flex items-center text-white text-[14px]">
                    {firstName}
                  </div>
                </div>

                {/* Last Name */}
                <div className="space-y-1.5">
                  <label className="text-[12.5px] font-normal text-white/50">
                    Last Name
                  </label>
                  <div className="h-11 px-3.5 bg-[#141416] border border-white/10 rounded-xl flex items-center text-white text-[14px]">
                    {lastName || "Not set"}
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[12.5px] font-normal text-white/50">
                    Email Address
                  </label>
                  <div className="h-11 px-3.5 bg-[#141416] border border-white/10 rounded-xl flex items-center text-white text-[14px]">
                    {user.email}
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[12.5px] font-normal text-white/50">
                    Phone Number
                  </label>
                  <div className="h-11 px-3.5 bg-[#141416] border border-white/10 rounded-xl flex items-center text-white text-[14px]">
                    {phone}
                  </div>
                </div>

              </div>

              <div className="flex justify-end pt-5 border-t border-white/10">
                <Button className="h-10 px-6 bg-white hover:bg-white/90 text-black rounded-full font-medium text-[13px] transition-all shadow-sm flex items-center gap-2 cursor-pointer">
                  <Edit3 className="w-4 h-4" /> Edit Details
                </Button>
              </div>

            </motion.div>

          </motion.div>
        </div>
      </main>
    </div>
  );
}
