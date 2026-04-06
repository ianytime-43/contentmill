"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { Zap, LogOut } from "lucide-react";

interface UsageData {
  plan: string;
  used: number;
  limit: number;
  canGenerate: boolean;
}

export default function Navbar() {
  const [usage, setUsage] = useState<UsageData | null>(null);

  useEffect(() => {
    fetch("/api/usage")
      .then(r => r.json())
      .then(setUsage)
      .catch(() => {});
  }, []);

  const planLabel = usage?.plan === "unlimited" ? "Unlimited" : usage?.plan === "pro" ? "Pro" : "Free";
  const planColor = usage?.plan === "unlimited" ? "text-cyan-400" : usage?.plan === "pro" ? "text-purple-400" : "text-gray-400";

  return (
    <nav className="border-b border-[#2a2a2a] bg-[#0a0a0a]/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="/" className="text-xl font-bold bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] bg-clip-text text-transparent">
          ContentMill
        </a>

        <div className="flex items-center gap-4">
          {usage && (
            <>
              <div className="flex items-center gap-2 text-sm">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-[#888]">
                  {usage.used}/{usage.limit === Infinity ? "∞" : usage.limit}
                </span>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full border border-[#2a2a2a] ${planColor}`}>
                {planLabel}
              </span>
            </>
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-1 text-sm text-[#888] hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}
