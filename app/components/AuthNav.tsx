"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthNav() {
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function checkSession() {
      const { data, error } = await supabase.auth.getSession();

      setIsLoggedIn(!error && Boolean(data.session));
      setIsCheckingSession(false);
    }

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(Boolean(session));
      setIsCheckingSession(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Logout error:", error.message);
        setIsLoggingOut(false);
        return;
      }

      setIsLoggedIn(false);
      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Unexpected logout error:", error);
      setIsLoggingOut(false);
    }
  }

  if (isCheckingSession) {
    return (
      <div
        className="h-10 w-24 animate-pulse rounded-lg bg-gray-100"
        aria-label="Checking login status"
      />
    );
  }

  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="rounded-lg bg-black px-5 py-2 text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoggingOut ? "Logging out..." : "Log out"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/login"
        className="rounded-lg bg-black px-5 py-2 text-white transition hover:bg-gray-800"
      >
        Log in
      </Link>

      <Link
        href="/signup"
        className="rounded-lg border border-gray-300 px-5 py-2 transition hover:bg-gray-50"
      >
        Sign up
      </Link>
    </div>
  );
}
