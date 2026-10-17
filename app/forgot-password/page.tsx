"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
const [email, setEmail] = useState("");
const [errorMessage, setErrorMessage] = useState("");
const [successMessage, setSuccessMessage] = useState("");
const [isLoading, setIsLoading] = useState(false);

async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
event.preventDefault();

setErrorMessage("");
setSuccessMessage("");
setIsLoading(true);

try {
  const supabase = createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(
    email.trim(),
    {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    }
  );

if (error) {
  console.error("Password reset error:", error);
  setErrorMessage(error.message);
  return;
}


  setSuccessMessage(
    "If an account exists for this email address, a password-reset link will be sent. Please check your inbox and spam folder."
  );
} catch {
  setErrorMessage(
    "Something went wrong. Please check your internet connection and try again."
  );
} finally {
  setIsLoading(false);
}

}

return ( <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-12"> <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm sm:p-10"> <Link
       href="/login"
       className="inline-flex items-center gap-2 text-sm font-medium text-purple-700 transition hover:text-purple-900"
     >
← Back to login </Link>

    <div className="mt-8">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-2xl">
        🔐
      </div>

      <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
        Forgot your password?
      </h1>

      <p className="mt-3 leading-7 text-gray-600">
        It happens! Enter the email address associated with your
        CreatorConnect account, and we&apos;ll help you reset your password.
      </p>
    </div>

    {successMessage && (
      <div
        role="status"
        className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm leading-6 text-green-800"
      >
        {successMessage}
      </div>
    )}

    {errorMessage && (
      <div
        role="alert"
        className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"
      >
        {errorMessage}
      </div>
    )}

    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-semibold text-gray-700"
        >
          Email address
        </label>

        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          disabled={isLoading}
          className="w-full rounded-xl border border-gray-300 px-4 py-3.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-600 focus:ring-4 focus:ring-purple-100 disabled:bg-gray-50"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-xl bg-purple-700 px-4 py-3.5 font-semibold text-white transition hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Sending reset link..." : "Send password-reset link"}
      </button>
    </form>

    <p className="mt-6 text-center text-sm text-gray-600">
      Remembered your password?{" "}
      <Link
        href="/login"
        className="font-semibold text-purple-700 transition hover:text-purple-900"
      >
        Log in
      </Link>
    </p>
  </div>
</main>

);
}
