"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ScrollParagraphProps {
  text: string;
}

function ScrollParagraph({ text }: ScrollParagraphProps) {
  const elementRef = useRef<HTMLParagraphElement>(null);

  // Track paragraph position relative to the middle reading area of the screen
  const { scrollYProgress } = useScroll({
    target: elementRef,
    offset: ["start 0.85", "end 0.25"],
  });

  // Sharp focus curve: fades in to 1 in center, then fades back down to 0.38 when scrolling out
  const opacity = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [0.38, 1, 1, 0.38]);
  const color = useTransform(
    scrollYProgress, 
    [0, 0.35, 0.65, 1], 
    ["rgba(255,255,255,0.38)", "rgba(255,255,255,1)", "rgba(255,255,255,1)", "rgba(255,255,255,0.38)"]
  );

  return (
    <motion.p
      ref={elementRef}
      style={{ opacity, color }}
      className="text-[20px] sm:text-[24px] lg:text-[28px] font-medium leading-[1.38] tracking-[-0.01em] max-w-[620px] text-left transition-colors duration-150"
    >
      {text}
    </motion.p>
  );
}

export default function ScrollIntroSection() {
  const paragraphs = [
    "Klarone is a technology guidance platform that turns confusing specifications into clear, confident decisions for your exact workflow.",
    "It understands your real requirements, keeps budget context, and surfaces transparent recommendations so professionals and students can trust what they buy.",
    "From coding to creative design to enterprise ops, Klarone handles the busywork and triggers real actions so decisions keep moving without tab switching."
  ];

  return (
    <section 
      className="relative w-full bg-[#000000] text-white pt-16 pb-40 sm:pb-56 px-6 flex flex-col items-center overflow-hidden"
    >
      <div className="w-full max-w-[680px] flex flex-col items-start">
        {/* Top Minimal Intro Pill */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1A1A1A] border border-white/10 mb-14 shadow-sm"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-white/60"></span>
          <span className="text-[12px] font-normal text-white/70 tracking-wide">Intro</span>
        </motion.div>

        {/* Scroll Highlighted Text Blocks */}
        <div className="w-full flex flex-col gap-12 sm:gap-16">
          {paragraphs.map((pText, idx) => (
            <ScrollParagraph
              key={idx}
              text={pText}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
