'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { LogOut, User as UserIcon } from 'lucide-react';

export default function Navbar() {
  const { user, signInWithGoogle, signOut, loading } = useAuth();

  return (
    <nav className="border-b border-gray-800 bg-black py-4 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link href="/" className="text-2xl font-bold tracking-tight text-white">
          Stack<span className="text-blue-500">Forge</span>
        </Link>
        <div className="hidden space-x-6 md:flex">
          <Link href="/analyse" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Analyse</Link>
          <Link href="/recommend" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Recommend</Link>
          <Link href="/implement" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Implement</Link>
          <Link href="/upgrade" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Upgrade</Link>
        </div>
        <div className="flex items-center gap-4">
          {!loading && (
            user ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">
                  <UserIcon className="w-4 h-4" />
                  <span className="max-w-[150px] truncate">{user.email}</span>
                </div>
                <button 
                  onClick={() => signOut()}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => signInWithGoogle()}
                className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20 active:scale-95"
              >
                Sign In
              </button>
            )
          )}
          {loading && (
            <div className="w-20 h-8 bg-zinc-800 animate-pulse rounded-lg"></div>
          )}
        </div>
      </div>
    </nav>
  );
}
