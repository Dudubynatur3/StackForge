import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";

export const dynamic = 'force-dynamic';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StackForge | Build the Portfolio That Gets You Hired",
  description: "Precision-engineered project guidance for Cloud and DevOps Engineers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-gray-100 min-h-screen flex flex-col`}>
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <footer className="border-t border-gray-800 py-8 text-center text-sm text-gray-500 bg-black">
            &copy; 2026 StackForge. All rights reserved.
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
