import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/shared/Footer";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import NotLoggedIn from "@/components/NotLoggedIn";

export default async function OrderConfirmationPage({ params }: { params: Promise<{ order_number: string }> }) {
  const { order_number } = await params;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return (
      <div className="min-h-screen bg-background flex flex-col font-sans">
        <Header variant="shop" />
        <main className="flex-1 w-full mx-auto px-4 py-12 pt-32">
          <NotLoggedIn 
            title="Sign in to view orders" 
            message="You need an account to view order details."
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Header variant="shop" />
      
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center pt-32 pb-20">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-8 relative">
          <CheckCircle2 className="w-12 h-12 text-emerald-600" />
          <div className="absolute inset-0 border-4 border-emerald-500 rounded-full animate-ping opacity-20"></div>
        </div>
        
        <h1 className="text-4xl font-bold font-heading mb-4 text-foreground">Order Confirmed!</h1>
        <p className="text-lg text-muted-foreground max-w-md mb-2">
          Thank you for choosing Klarone. Your order has been placed successfully.
        </p>
        
        <div className="bg-secondary/50 border border-border rounded-xl p-6 mb-10 min-w-[300px]">
          <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold mb-2">Order Number</p>
          <p className="text-2xl font-mono font-bold text-foreground">{order_number}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/shop" className="h-12 px-8 bg-foreground hover:bg-foreground/90 text-background rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors">
            Continue Shopping
          </Link>
          <Link href="/profile" className="h-12 px-8 bg-background border-2 border-border hover:border-accent text-foreground rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors">
            <Package className="w-4 h-4" /> View My Profile
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
