"use client";

import { useState, useEffect } from "react";
import { User, Package, Settings, LogOut, Loader2, Mail, Phone, ChevronRight, ShieldCheck, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import NotLoggedIn from "@/components/NotLoggedIn";
import Link from "next/link";

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
      <div className="min-h-screen bg-background pt-28 pb-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
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
    <div className="min-h-screen bg-[#f8fafc] pt-28 pb-16 relative overflow-hidden font-sans">
      {/* Background ambient light */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-accent/5 to-transparent pointer-events-none"></div>

      <div className="mx-auto max-w-[1100px] px-6 lg:px-12 relative z-10">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-heading text-foreground tracking-tight">My Account</h1>
          <p className="text-muted-foreground mt-1">Manage your profile, orders, and preferences.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Profile Sidebar */}
          <div className="w-full lg:w-[280px] flex-shrink-0 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col h-full">
              {/* User Identity Area */}
              <div className="p-6 pb-5 border-b border-border bg-gradient-to-b from-secondary/50 to-transparent">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-foreground rounded-full flex items-center justify-center text-background font-bold text-lg shadow-md shrink-0">
                    {getInitials(fullName)}
                  </div>
                  <div className="overflow-hidden">
                    <h2 className="font-bold text-foreground text-lg truncate leading-tight">{fullName}</h2>
                    <p className="text-[13px] text-muted-foreground truncate mt-0.5">{user.email}</p>
                  </div>
                </div>
              </div>
              
              {/* Navigation Menu */}
              <nav className="flex flex-col p-3 flex-1 gap-1">
                <button className="flex items-center justify-between w-full text-left px-4 py-3 rounded-lg bg-accent/10 text-accent font-semibold transition-colors">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5" /> Personal Info
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </button>
                <Link href="/profile/orders" className="flex items-center justify-between w-full text-left px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground font-medium transition-colors">
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5" /> Order History
                  </div>
                </Link>
                <Link href="/profile/addresses" className="flex items-center justify-between w-full text-left px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground font-medium transition-colors">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5" /> Addresses
                  </div>
                </Link>
                <button className="flex items-center justify-between w-full text-left px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground font-medium transition-colors">
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5" /> Settings
                  </div>
                </button>
              </nav>

              <div className="p-3 border-t border-border mt-auto">
                <button 
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 font-semibold transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <div className="bg-card rounded-2xl border border-border p-8 md:p-10 shadow-sm relative overflow-hidden">
              {/* Decorative graphic */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center text-accent">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-heading text-foreground">Personal Details</h2>
                  <p className="text-sm text-muted-foreground">Manage your personal information and contact details.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-10 max-w-3xl">
                
                {/* First Name */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" /> First Name
                  </label>
                  <div className="h-12 px-4 border border-border rounded-xl flex items-center bg-secondary/50 text-foreground font-medium">
                    {firstName}
                  </div>
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" /> Last Name
                  </label>
                  <div className="h-12 px-4 border border-border rounded-xl flex items-center bg-secondary/50 text-foreground font-medium">
                    {lastName}
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" /> Email Address
                  </label>
                  <div className="h-12 px-4 border border-border rounded-xl flex items-center bg-secondary/50 text-foreground font-medium">
                    {user.email}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5 ml-1">Your email address is used for order notifications.</p>
                </div>

                {/* Phone Number */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" /> Phone Number
                  </label>
                  <div className="h-12 px-4 border border-border rounded-xl flex items-center bg-secondary/50 text-foreground font-medium">
                    {phone}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-border">
                <Button className="h-12 px-8 bg-foreground hover:bg-foreground/90 text-background rounded-xl font-semibold shadow-md hover:shadow-lg transition-all">
                  Edit Details
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
