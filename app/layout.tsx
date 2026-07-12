import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import ConditionalHeader from "@/components/ConditionalHeader";
import { Providers } from "@/components/Providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Klarone | Clear Choices. Better Technology.",
  description: "Personalized technology recommendations based on your goals, budget, and workflow.",
  icons: {
    icon: '/icon2.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} h-full antialiased scroll-smooth`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans text-black relative bg-background selection:bg-black selection:text-white" suppressHydrationWarning>
        <Providers>
          <ConditionalHeader />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
