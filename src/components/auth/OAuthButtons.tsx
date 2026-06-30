"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.82-.07-1.6-.2-2.36H12v4.47h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.54-5.17 3.54-8.74Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.95-2.9l-3.88-3a7.4 7.4 0 0 1-4.07 1.14c-3.13 0-5.78-2.11-6.73-4.96H1.27v3.1A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.28a7.2 7.2 0 0 1 0-4.56v-3.1H1.27a12 12 0 0 0 0 10.76l4-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.76 0 3.34.6 4.59 1.79l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.27 6.62l4 3.1C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="currentColor">
      <path d="M16.36 1.43c0 1.14-.46 2.2-1.2 2.98-.8.85-2.1 1.5-3.18 1.42a3.4 3.4 0 0 1 .9-2.84c.83-.95 2.27-1.62 3.48-1.56ZM20.4 17.2c-.45 1.04-.67 1.5-1.25 2.43-.81 1.3-1.95 2.92-3.36 2.93-1.25.02-1.57-.81-3.26-.8-1.69.01-2.04.82-3.29.8-1.41-.02-2.49-1.48-3.3-2.78C3.6 16.93 3.05 12.6 4.93 9.6c.96-1.53 2.55-2.5 4.16-2.52 1.34-.03 2.6.9 3.42.9.81 0 2.34-1.12 3.95-.95.67.03 2.56.27 3.78 2.04-3.16 1.74-2.64 6.23.16 8.13Z" />
    </svg>
  );
}

export function OAuthButtons() {
  const [loadingProvider, setLoadingProvider] = useState<"google" | "apple" | null>(null);

  async function signInWith(provider: "google" | "apple") {
    setLoadingProvider(provider);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) setLoadingProvider(null);
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={() => signInWith("google")}
        disabled={loadingProvider !== null}
        className="flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50"
      >
        <GoogleIcon />
        Google
      </button>
      <button
        type="button"
        onClick={() => signInWith("apple")}
        disabled={loadingProvider !== null}
        className="flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50"
      >
        <AppleIcon />
        Apple
      </button>
    </div>
  );
}
