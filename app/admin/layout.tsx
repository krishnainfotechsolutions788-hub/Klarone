import AdminSidebar from "@/app/admin/components/AdminSidebar";
import AdminTopbar from "@/app/admin/components/AdminTopbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 flex w-full overflow-hidden font-sans text-white bg-[#000000] relative">
      {/* Subtle Background Horizon Glow matching Landing Page */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <img 
          src="/Hero/tech-landscape.png" 
          alt="Tech Horizon Landscape" 
          className="w-full h-full object-cover object-center opacity-15 brightness-[0.6] contrast-[1.2]" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#000000]/80 via-[#000000]/95 to-[#000000]" />
      </div>

      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-transparent">
          {children}
        </main>
      </div>
    </div>
  );
}
