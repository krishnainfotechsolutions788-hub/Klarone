import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/shared/Footer";

export default function FindLaptopPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-white text-black overflow-hidden">
      <Header variant="shop" />
      <main className="flex-1 flex items-center justify-center mt-[120px] pb-[120px]">
        <div className="text-center px-6">
          <h1 className="text-[48px] md:text-[64px] font-medium tracking-tight text-surface-dark mb-4">
            Find My Laptop
          </h1>
          <p className="text-[18px] text-[#666666] mb-8 max-w-md mx-auto">
            Our AI-powered recommendation engine and expert consultation service is launching soon.
          </p>
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 justify-center h-12 rounded-full border border-[#dddddd] bg-white px-8 text-[15px] font-medium text-[#181d26] transition-all hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
