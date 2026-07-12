import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Split: Visual Branding (Hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden">
        
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/Hero/hero3.webp" 
            alt="Workspace Background" 
            fill 
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-[#111111]/80 backdrop-blur-sm"></div>
        </div>

        {/* Subtle Background Pattern/Gradient */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#00A7B5] opacity-[0.25] blur-[120px] rounded-full pointer-events-none z-0" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#00A7B5] opacity-[0.2] blur-[150px] rounded-full pointer-events-none z-0" />

        <div className="relative z-10 flex items-center gap-3">
          <Link href="/">
            <Image 
              src="/logo.webp" 
              alt="Klarone Logo" 
              width={140} 
              height={40} 
              className="object-contain h-8 w-auto brightness-0 invert" 
              style={{ width: 'auto', height: 'auto' }} 
            />
          </Link>
        </div>

        <div className="relative z-10 max-w-lg mb-16">
          <h1 className="text-[42px] font-bold leading-[1.1] mb-6 tracking-tight text-white">
            Clear Choices.<br />
            <span className="text-[#00A7B5]">Better Technology.</span>
          </h1>
          <p className="text-[17px] text-zinc-400 leading-relaxed font-light">
            Join thousands of students, developers, and professionals making smarter hardware decisions with personalized recommendations.
          </p>
        </div>

        <div className="relative z-10 text-[13px] text-zinc-500 font-medium tracking-wide">
          © {new Date().getFullYear()} KLARONE TECHNOLOGIES
        </div>
      </div>

      {/* Right Split: Authentication Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 xl:p-24 relative bg-white">
        {/* Mobile Header (Only visible on small screens) */}
        <div className="absolute top-8 left-8 flex lg:hidden items-center gap-2">
          <Link href="/">
            <Image 
              src="/logo.webp" 
              alt="Klarone Logo" 
              width={110} 
              height={32} 
              className="object-contain h-7 w-auto" 
              style={{ width: 'auto', height: 'auto' }} 
            />
          </Link>
        </div>

        <div className="w-full max-w-[420px]">
          {children}
        </div>
      </div>
    </div>
  );
}
