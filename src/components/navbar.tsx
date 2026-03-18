// components/navbar.tsx
"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";

export default function Navbar() {
  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-blue-600">
              CareerPath-AI
            </Link>
            <div className="hidden gap-6 md:flex">
              <Link href="/" className={cn("text-sm text-slate-600 hover:text-slate-900 transition-colors")}>
                Home
              </Link>
              <Link href="/analyze" className={cn("text-sm text-slate-600 hover:text-slate-900 transition-colors")}>
                Analyze
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
