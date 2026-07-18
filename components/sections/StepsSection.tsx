import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function StepsSection() {
  return (
    <section id="how-it-works" className="w-full py-[80px] lg:py-[120px] bg-white">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center">

          {/* Left Content - Large Image */}
          <div className="relative w-full rounded-3xl overflow-hidden shadow-sm flex items-center justify-center bg-gray-50">
            <img src="/img2.webp" alt="Expert Guidance" className="w-full h-auto block" />
          </div>

          {/* Right Content - Steps */}
          <div className="flex flex-col">
            <h2 className="text-[40px] md:text-[48px] font-medium leading-[1.1] tracking-tight text-surface-dark mb-6">
              Get the best laptop for you, advised by experts in 3 steps
            </h2>
            <p className="text-[16px] md:text-[18px] text-[#666666] mb-12 max-w-[480px]">
              A simple, transparent process designed to help you find the perfect technology without the confusion.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Step 1 */}
              <div className="flex flex-col justify-between bg-surface-soft p-8 rounded-2xl border border-transparent hover:border-[#e2e8f0] transition-colors">
                <div>
                  <span className="text-[14px] font-bold text-[#888888] mb-2 block">01</span>
                  <h3 className="text-[20px] font-medium text-surface-dark mb-3">Tell us your requirements</h3>
                  <p className="text-[14px] text-[#666666] leading-relaxed">
                    Share your workflow, budget, and specific needs. No technical jargon required.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col justify-between bg-surface-soft p-8 rounded-2xl border border-transparent hover:border-[#e2e8f0] transition-colors">
                <div>
                  <span className="text-[14px] font-bold text-[#888888] mb-2 block">02</span>
                  <h3 className="text-[20px] font-medium text-surface-dark mb-3">Receive recommendations</h3>
                  <p className="text-[14px] text-[#666666] leading-relaxed">
                    Get hand-picked options analyzed by our team that actually fit your use case, clearly explained.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col justify-between bg-surface-soft p-8 rounded-2xl border border-transparent hover:border-[#e2e8f0] transition-colors">
                <div>
                  <span className="text-[14px] font-bold text-[#888888] mb-2 block">03</span>
                  <h3 className="text-[20px] font-medium text-surface-dark mb-3">Choose with confidence</h3>
                  <p className="text-[14px] text-[#666666] leading-relaxed">
                    Make your purchase knowing you've selected the absolute best device for your money.
                  </p>
                </div>
              </div>

              {/* CTA Card */}
              <Link href="/find-laptop" className="relative flex flex-col justify-center items-center text-center p-8 rounded-2xl group cursor-pointer overflow-hidden transition-all shadow-sm">
                {/* Background Logo */}
                <div className="absolute inset-0 z-0 bg-surface-dark">
                  <img src="/logo.webp" alt="Klarone Logo" className="w-full h-full object-contain p-8 opacity-40 scale-125 group-hover:scale-110 transition-transform duration-700" />
                </div>
                {/* Semi-transparent black overlay */}
                <div className="absolute inset-0 z-10 bg-black/60 group-hover:bg-black/70 transition-colors duration-300"></div>

                {/* Content */}
                <div className="relative z-20 flex flex-col items-center">
                  <h3 className="text-[24px] font-medium text-white mb-4 drop-shadow-md">Find My Laptop</h3>
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform border border-white/30">
                    <ArrowRight className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Link>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
