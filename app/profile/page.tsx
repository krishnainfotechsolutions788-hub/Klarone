"use client";

import { useState, useEffect } from "react";
import { User, Package, Settings, LogOut, Loader2, Mail, Phone, ChevronRight, ShieldCheck, MapPin, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import NotLoggedIn from "@/components/NotLoggedIn";
import Link from "next/link";
import { motion } from "framer-motion";

const itemUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] as const } 
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
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
    <div className="min-h-screen bg-[#000000] text-white relative overflow-hidden pt-32 pb-24">
      {/* Background Vignette Effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-20 brightness-[0.7]"
        style={{ backgroundImage: "url('/tech-landscape.png')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
        
        {/* Header Hero Title */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-col items-start mb-12 sm:mb-16"
        >
          <motion.div variants={itemUpVariants} className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1A1A1A] border border-white/10 mb-6 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00A7B5]"></span>
            <span className="text-[12px] font-medium text-white/80 tracking-wide">Account Workspace</span>
          </motion.div>

          <motion.h1 
            variants={itemUpVariants}
            className="text-[36px] sm:text-[48px] lg:text-[56px] font-normal text-white leading-tight tracking-tight mb-2"
          >
            My Account & Profile
          </motion.h1>
          <motion.p 
            variants={itemUpVariants}
            className="text-base sm:text-lg text-white/60 max-w-[600px]"
          >
            Manage your personal identity specs, order history, and security preferences.
          </motion.p>
        </motion.div>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-col lg:flex-row gap-8 items-start"
        >
          
          {/* Profile Sidebar */}
          <motion.div variants={itemUpVariants} className="w-full lg:w-[320px] flex-shrink-0">
            <div className="bg-[#111113]/90 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
              
              {/* User Identity Area */}
              <div className="p-6 pb-6 border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#00A7B5] to-teal-700 rounded-full flex items-center justify-center text-white font-medium text-lg shadow-lg shrink-0 border border-white/20">
                    {getInitials(fullName)}
                  </div>
                  <div className="overflow-hidden min-w-0">
                    <h2 className="font-medium text-white text-lg truncate leading-tight">{fullName}</h2>
                    <p className="text-[12.5px] text-white/50 truncate mt-0.5 font-normal">{user.email}</p>
                  </div>
                </div>
              </div>
              
              {/* Navigation Menu */}
              <nav className="flex flex-col p-4 flex-1 gap-2">
                <button className="flex items-center justify-between w-full text-left px-4 py-3.5 rounded-2xl bg-white/10 border border-white/15 text-white font-medium transition-all shadow-sm">
                  <div className="flex items-center gap-3 text-sm">
                    <User className="w-4 h-4 text-[#00A7B5]" /> Personal Details
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/50" />
                </button>

                <Link href="/profile/orders" className="flex items-center justify-between w-full text-left px-4 py-3.5 rounded-2xl text-white/60 hover:text-white hover:bg-white/5 font-normal text-sm transition-all border border-transparent hover:border-white/10">
                  <div className="flex items-center gap-3">
                    <Package className="w-4 h-4 text-white/40" /> Order History
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </Link>

                <Link href="/profile/addresses" className="flex items-center justify-between w-full text-left px-4 py-3.5 rounded-2xl text-white/60 hover:text-white hover:bg-white/5 font-normal text-sm transition-all border border-transparent hover:border-white/10">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-white/40" /> Delivery Addresses
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </Link>

                <button className="flex items-center justify-between w-full text-left px-4 py-3.5 rounded-2xl text-white/60 hover:text-white hover:bg-white/5 font-normal text-sm transition-all border border-transparent hover:border-white/10">
                  <div className="flex items-center gap-3">
                    <Settings className="w-4 h-4 text-white/40" /> Account Settings
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </button>
              </nav>

              <div className="p-4 border-t border-white/10 mt-auto">
                <button 
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-2xl text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 font-medium text-xs transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>

            </div>
          </motion.div>

          {/* Main Content Area */}
          <motion.div variants={itemUpVariants} className="flex-1 w-full">
            <div className="bg-[#111113]/90 backdrop-blur-xl rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
              
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-[#00A7B5] shadow-inner">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-medium text-white tracking-tight">Personal Details</h2>
                  <p className="text-xs sm:text-sm text-white/50 font-normal">Manage your verified contact info and hardware preferences.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                
                {/* First Name */}
                <div className="space-y-2">
                  <label className="text-xs font-normal text-white/50 uppercase tracking-wider flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-[#00A7B5]" /> First Name
                  </label>
                  <div className="h-12 px-4 bg-[#0A0A0C] border border-white/10 rounded-2xl flex items-center text-white font-normal text-sm">
                    {firstName}
                  </div>
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <label className="text-xs font-normal text-white/50 uppercase tracking-wider flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-[#00A7B5]" /> Last Name
                  </label>
                  <div className="h-12 px-4 bg-[#0A0A0C] border border-white/10 rounded-2xl flex items-center text-white font-normal text-sm">
                    {lastName || "Not set"}
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-normal text-white/50 uppercase tracking-wider flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#00A7B5]" /> Verified Email Address
                  </label>
                  <div className="h-12 px-4 bg-[#0A0A0C] border border-white/10 rounded-2xl flex items-center text-white font-normal text-sm">
                    {user.email}
                  </div>
                  <p className="text-[11.5px] text-white/40 mt-1">Used for order confirmations and direct tech recommendation updates.</p>
                </div>

                {/* Phone Number */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-normal text-white/50 uppercase tracking-wider flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#00A7B5]" /> Phone Number
                  </label>
                  <div className="h-12 px-4 bg-[#0A0A0C] border border-white/10 rounded-2xl flex items-center text-white font-normal text-sm">
                    {phone}
                  </div>
                </div>

              </div>

              <div className="flex justify-end pt-6 border-t border-white/10">
                <Button className="h-11 px-7 bg-white hover:bg-white/90 text-black rounded-full font-medium text-xs transition-all shadow-lg flex items-center gap-2 cursor-pointer">
                  <Edit3 className="w-4 h-4" /> Edit Profile Details
                </Button>
              </div>

            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
