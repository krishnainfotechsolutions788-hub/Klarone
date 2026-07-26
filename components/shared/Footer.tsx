import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const footerSections = [
    {
      title: "Product",
      links: [
        { name: "Homepage", href: "/" },
        { name: "Changelog", href: "/#changelog" },
        { name: "Pricing", href: "/#pricing" },
        { name: "Get started", href: "/find-laptop" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "/#about" },
        { name: "Careers", href: "#" },
        { name: "Blog", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Terms of use", href: "#terms" },
        { name: "Privacy policy", href: "#privacy" },
        { name: "Cookie policy", href: "#cookies" },
      ],
    },
  ];

  return (
    <footer className="relative w-full bg-[#000000] text-white overflow-hidden">
      
      {/* Mountain Landscape Dunes Banner above footer content */}
      <div className="relative w-full h-[260px] sm:h-[380px] overflow-hidden pointer-events-none">
        <img 
          src="/footer-mountains.png" 
          alt="Mountain Dunes Horizon" 
          className="w-full h-full object-cover object-center brightness-[1.05]"
        />
        {/* Soft top gradient to dissolve any straight edge seamlessly */}
        <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-[#000000] via-[#000000]/60 to-transparent" />
        {/* Soft bottom edge transition into footer links */}
        <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#000000] via-[#000000]/70 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1240px] px-6 lg:px-10 pt-10 pb-12">

        {/* Top Grid: Logo on left, Column Links on right */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 items-start">

          {/* Left Column - Klarone Image Logo matching Header */}
          <div className="md:col-span-5 flex flex-col items-start">
            <Link href="/" className="flex items-center group">
              <div className="flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <Image 
                  src="/logo.webp" 
                  alt="Klarone Logo" 
                  width={110} 
                  height={32} 
                  className="object-contain h-7 w-auto invert" 
                  style={{ width: 'auto', height: 'auto' }} 
                />
              </div>
            </Link>
          </div>

          {/* Right Columns - Product, Company, Legal Links */}
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {footerSections.map((section) => (
              <div key={section.title} className="flex flex-col gap-4">
                <h4 className="text-[13.5px] font-medium text-white/90 tracking-wide">{section.title}</h4>
                <ul className="flex flex-col gap-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href} 
                        className="text-[13.5px] text-white/50 hover:text-white transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom Horizontal Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          
          {/* Left Copyright */}
          <p className="text-[13px] text-white/50 tracking-tight">
            © Klarone, Inc., {new Date().getFullYear()}. All rights reserved
          </p>

          {/* Right Social Icons */}
          <div className="flex items-center gap-5 text-white/60">
            {/* Custom Thunderbolt / Zap Icon */}
            <Link href="#" className="hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 2L3 14h7v8l10-12h-7z" />
              </svg>
            </Link>
            {/* Facebook SVG */}
            <Link href="#" className="hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </Link>
            {/* LinkedIn SVG */}
            <Link href="#" className="hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </Link>
            {/* X / Twitter SVG */}
            <Link href="#" className="hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </Link>
            {/* Instagram SVG */}
            <Link href="#" className="hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </Link>
          </div>

        </div>

      </div>
    </footer>
  );
}
