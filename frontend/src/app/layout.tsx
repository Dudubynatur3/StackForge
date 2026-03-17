import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StackForge | AI-Powered DevOps Portfolio Builder",
  description: "Generate production-grade implementation plans and upgrade your Cloud/DevOps projects with AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-gray-100 min-h-screen flex flex-col antialiased`}>
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <footer className="border-t border-gray-800 py-12 text-center text-sm text-gray-500 bg-black">
            <div className="container mx-auto px-4">
              <p className="mb-2 text-gray-400 font-bold tracking-widest uppercase text-xs">StackForge AI Platform</p>
              &copy; 2026. Precision-engineered for Cloud Engineers.
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
