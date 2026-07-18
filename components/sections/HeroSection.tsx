import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative w-full pt-[60px] pb-[80px] lg:pt-[80px] lg:pb-[120px] bg-white overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center lg:items-start">

          {/* Left Content */}
          <div className="max-w-xl lg:pt-12">
            <h1 className="text-[56px] md:text-[64px] lg:text-[76px] font-medium leading-[1.1] tracking-tight text-surface-dark mb-6">
              Buy Technology<br />With Confidence.
            </h1>
            <p className="text-[16px] md:text-[18px] leading-relaxed text-[#666666] mb-10 max-w-[420px]">
              Personalized technology recommendations based on your goals, budget, and workflow.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-14">
              <Link
                href="/find-laptop"
                className="inline-flex items-center justify-center h-12 rounded-full bg-surface-dark px-8 text-[15px] font-medium text-white hover:bg-black transition-all"
              >
                Find My Laptop
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center h-12 rounded-full border border-hairline bg-white px-8 text-[15px] font-medium text-surface-dark hover:bg-gray-50 transition-all"
              >
                Shop Now
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" alt="User 1" className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm" />
                <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" alt="User 2" className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm" />
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" alt="User 3" className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm" />
                <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop" alt="User 4" className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm" />
              </div>
              <p className="text-[13px] text-[#888888] leading-tight max-w-[180px]">
                Join <strong className="text-[#444444] font-semibold">2,100+ professionals</strong> making better tech decisions
              </p>
            </div>
          </div>

          {/* Right Content - Auto Scrolling Masonry Grid */}
          <div className="relative w-full h-[600px] sm:h-[700px] lg:h-[750px] grid grid-cols-2 gap-4 sm:gap-6 items-start overflow-hidden">

            {/* Left Column Wrapper - Scrolls Up */}
            <div className="flex flex-col gap-4 sm:gap-6 animate-scroll-up">
              {/* Original Images */}
              <div className="relative w-full rounded-2xl overflow-hidden shadow-sm bg-gray-50 flex">
                <img src="/Hero/hero1.webp" alt="Hero Team" className="w-full h-auto block" />
              </div>
              <div className="relative w-full rounded-2xl overflow-hidden shadow-sm flex">
                <img src="/Hero/hero2.webp" alt="Person typing" className="w-full h-auto block" />
              </div>
              <div className="relative w-full rounded-2xl overflow-hidden shadow-sm flex">
                <img src="/Hero/hero3.webp" alt="Hero Workspace" className="w-full h-auto block" />
              </div>
              {/* Duplicated Images for infinite scroll */}
              <div className="relative w-full rounded-2xl overflow-hidden shadow-sm bg-gray-50 flex">
                <img src="/Hero/hero1.webp" alt="Hero Team" className="w-full h-auto block" />
              </div>
              <div className="relative w-full rounded-2xl overflow-hidden shadow-sm flex">
                <img src="/Hero/hero2.webp" alt="Person typing" className="w-full h-auto block" />
              </div>
              <div className="relative w-full rounded-2xl overflow-hidden shadow-sm flex">
                <img src="/Hero/hero3.webp" alt="Hero Workspace" className="w-full h-auto block" />
              </div>
            </div>

            {/* Right Column Wrapper - Scrolls Down */}
            <div className="flex flex-col gap-4 sm:gap-6 animate-scroll-down">
              {/* Original Images */}
              <div className="relative w-full rounded-2xl overflow-hidden shadow-sm flex">
                <img src="/Hero/hero4.webp" alt="Developer working" className="w-full h-auto block" />
              </div>
              <div className="relative w-full rounded-2xl overflow-hidden shadow-sm flex">
                <img src="/Hero/hero5.webp" alt="Business meeting" className="w-full h-auto block" />
              </div>
              <div className="relative w-full rounded-2xl overflow-hidden shadow-sm flex">
                <img src="/Hero/hero6.webp" alt="Technology" className="w-full h-auto block" />
              </div>
              {/* Duplicated Images for infinite scroll */}
              <div className="relative w-full rounded-2xl overflow-hidden shadow-sm flex">
                <img src="/Hero/hero4.webp" alt="Developer working" className="w-full h-auto block" />
              </div>
              <div className="relative w-full rounded-2xl overflow-hidden shadow-sm flex">
                <img src="/Hero/hero5.webp" alt="Business meeting" className="w-full h-auto block" />
              </div>
              <div className="relative w-full rounded-2xl overflow-hidden shadow-sm flex">
                <img src="/Hero/hero6.webp" alt="Technology" className="w-full h-auto block" />
              </div>
            </div>

            {/* White Fade Overlays (Top and Bottom) */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-linear-to-b from-white to-transparent pointer-events-none z-10"></div>
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-white via-white/80 to-transparent pointer-events-none z-10"></div>

          </div>

        </div>
      </div>
    </section>
  );
}
