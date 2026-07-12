import Link from "next/link";
import Image from "next/image";
import { Globe, Mail, MessageCircle, Share2 } from "lucide-react";

export default function Footer() {
  const footerLinks = {
    Platform: [
      { name: "How it Works", href: "#how-it-works" },
      { name: "Recommendations", href: "#examples" },
      { name: "Marketplace", href: "#gallery" },
      { name: "Community", href: "#community" },
    ],
    Resources: [
      { name: "Buying Guides", href: "#" },
      { name: "Technology Tips", href: "#" },
      { name: "Help Center", href: "#" },
      { name: "Blog", href: "#" },
    ],
    Company: [
      { name: "About Us", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
    ],
  };

  return (
    <footer className="w-full bg-white border-t border-[#f1f3f5] pt-16 pb-8">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 flex flex-col items-start">
            <Link href="/" className="flex items-center group mb-6">
              <div className="flex items-center justify-center">
                <Image src="/logo.webp" alt="Klarone Logo" width={140} height={40} className="object-contain h-10 w-auto" style={{ width: 'auto', height: 'auto' }} />
              </div>
            </Link>
            <p className="text-[15px] text-[#666666] leading-relaxed max-w-sm mb-8">
              Klarone helps people discover, choose, and manage the right technology with confidence.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="w-10 h-10 rounded-full bg-surface-soft border border-[#e2e8f0] flex items-center justify-center text-[#444444] hover:bg-surface-dark hover:text-white hover:border-surface-dark transition-all">
                <Globe className="w-4 h-4" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-center text-[#444444] hover:bg-[#181d26] hover:text-white hover:border-[#181d26] transition-all">
                <MessageCircle className="w-4 h-4" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-center text-[#444444] hover:bg-[#181d26] hover:text-white hover:border-[#181d26] transition-all">
                <Mail className="w-4 h-4" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-center text-[#444444] hover:bg-[#181d26] hover:text-white hover:border-[#181d26] transition-all">
                <Share2 className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="flex flex-col">
              <h4 className="text-[16px] font-medium text-[#181d26] mb-6">{category}</h4>
              <ul className="flex flex-col gap-4">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-[14px] text-[#666666] hover:text-[#181d26] transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#f1f3f5] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[14px] text-[#888888]">
            &copy; {new Date().getFullYear()} Klarone. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#privacy" className="text-[14px] text-[#888888] hover:text-[#111111] transition-colors">Privacy</Link>
            <Link href="#terms" className="text-[14px] text-[#888888] hover:text-[#111111] transition-colors">Terms</Link>
            <Link href="#cookies" className="text-[14px] text-[#888888] hover:text-[#111111] transition-colors">Cookies</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
