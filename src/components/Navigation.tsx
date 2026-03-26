"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function Navigation() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="flex items-center justify-between p-4 bg-soft-sky-blue dark:bg-dark-card shadow-sm sticky top-0 z-50">
      <div className="flex gap-4 items-center">
        <Link href="/" className="text-electric-blue font-bold text-xl">L&apos;Élan</Link>
        <div className="hidden md:flex gap-4 ml-8">
          <Link href="/dashboard" className="hover:text-electric-blue transition-colors">Dashboard</Link>
          <Link href="/" className="hover:text-electric-blue transition-colors">Learn</Link>
          <Link href="/salon" className="hover:text-electric-blue transition-colors">Le Salon</Link>
          <Link href="/carnet" className="hover:text-electric-blue transition-colors">Carnet</Link>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {session ? (
          <button onClick={() => signOut()} className="text-sm font-medium hover:text-electric-blue transition-colors">
            Sign Out
          </button>
        ) : (
          <Link href="/auth/signin" className="text-sm font-medium hover:text-electric-blue transition-colors">
            Sign In
          </Link>
        )}
        {mounted ? (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full bg-white dark:bg-gray-800 shadow hover:scale-105 transition-transform"
            aria-label="Toggle Dark Mode"
          >
            {theme === "dark" ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-electric-blue" />}
          </button>
        ) : (
          <div className="w-9 h-9" />
        )}
      </div>
    </nav>
  );
}
