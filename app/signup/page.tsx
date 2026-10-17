"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type AccountType = "creator" | "brand";

export default function SignupPage() {
const [accountType, setAccountType] = useState<AccountType>("creator");
const [fullName, setFullName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");

const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [errorMessage, setErrorMessage] = useState("");
const [successMessage, setSuccessMessage] = useState("");
const [isLoading, setIsLoading] = useState(false);
const [isGoogleLoading, setIsGoogleLoading] = useState(false);

async function handleSignup(event: React.FormEvent<HTMLFormElement>) {
event.preventDefault();

setErrorMessage("");
setSuccessMessage("");

if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
  setErrorMessage("Please fill in all the fields.");
  return;
}

if (password.length < 8) {
  setErrorMessage("Your password must contain at least 8 characters.");
  return;
}

if (password !== confirmPassword) {
  setErrorMessage("Your passwords do not match.");
  return;
}

setIsLoading(true);

try {
  const supabase = createClient();

  const { error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: {
        full_name: fullName.trim(),
        account_type: accountType,
      },
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    setErrorMessage(error.message);
    return;
  }

  setSuccessMessage(
    "Your account has been created. Please check your email and click the confirmation link to verify your email address before logging in."
  );

  setFullName("");
  setEmail("");
  setPassword("");
  setConfirmPassword("");
} catch {
  setErrorMessage(
    "Something went wrong. Please check your connection and try again."
  );
} finally {
  setIsLoading(false);
}

}

async function handleGoogleSignup() {
setErrorMessage("");
setSuccessMessage("");
setIsGoogleLoading(true);

try {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback?next=/`,
      queryParams: {
        access_type: "offline",
        prompt: "select_account",
      },
    },
  });

  if (error) {
    setErrorMessage(error.message);
    setIsGoogleLoading(false);
  }
} catch {
  setErrorMessage(
    "Unable to start Google sign-up. Please try again."
  );
  setIsGoogleLoading(false);
}

}

return ( <main className="min-h-screen bg-[#f8f7fc] px-4 py-8 sm:px-6 lg:px-8"> <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-3xl bg-white shadow-xl shadow-purple-950/5 lg:grid-cols-2"> <section className="relative hidden overflow-hidden bg-[#21133d] p-12 text-white lg:flex lg:flex-col lg:justify-between"> <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" /> <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" />

      <Link href="/" className="relative z-10 text-2xl font-bold tracking-tight">
        CreatorConnect<span className="text-purple-300">.</span>
      </Link>

      <div className="relative z-10 max-w-md">
        <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-purple-100">
          Your next opportunity starts here
        </span>

        <h1 className="mt-8 text-5xl font-bold leading-tight tracking-tight">
          Create. Connect.
          <span className="block text-purple-300">Grow together.</span>
        </h1>

        <p className="mt-6 text-lg leading-8 text-purple-100/80">
          A space for creative talent and ambitious brands to discover
          opportunities, build relationships, and bring ideas to life.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-lg font-semibold">For creators</p>
            <p className="mt-2 text-sm leading-6 text-purple-100/70">
              Showcase your talent and discover campaigns.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-lg font-semibold">For brands</p>
            <p className="mt-2 text-sm leading-6 text-purple-100/70">
              Find creative talent for your next big idea.
            </p>
          </div>
        </div>
      </div>

      <p className="relative z-10 text-sm text-purple-100/60">
        Your creativity deserves the right connections.
      </p>
    </section>

    <section className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-12">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-block text-sm text-gray-500 transition hover:text-purple-700 lg:hidden"
        >
          ← CreatorConnect
        </Link>

        <div className="mt-6 lg:mt-0">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-600">
            Get started
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Create your account
          </h2>

          <p className="mt-3 leading-6 text-gray-500">
            Join a community where creative ideas meet opportunity.
          </p>
        </div>

        <div className="mt-8">
          <p className="mb-3 text-sm font-semibold text-gray-800">
            I want to join as a...
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setAccountType("creator")}
              aria-pressed={accountType === "creator"}
              className={`rounded-2xl border p-4 text-left transition ${
                accountType === "creator"
                  ? "border-purple-600 bg-purple-50 ring-2 ring-purple-100"
                  : "border-gray-200 hover:border-purple-300"
              }`}
            >
              <span className="text-2xl" aria-hidden="true">
                ✨
              </span>
              <span className="mt-3 block font-semibold text-gray-900">
                Creator
              </span>
              <span className="mt-1 block text-xs leading-5 text-gray-500">
                Find campaigns and showcase my work.
              </span>
              <span className="mt-3 block text-xs font-semibold text-purple-700">
                {accountType === "creator" ? "Selected ✓" : "Select creator"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setAccountType("brand")}
              aria-pressed={accountType === "brand"}
              className={`rounded-2xl border p-4 text-left transition ${
                accountType === "brand"
                  ? "border-purple-600 bg-purple-50 ring-2 ring-purple-100"
                  : "border-gray-200 hover:border-purple-300"
              }`}
            >
              <span className="text-2xl" aria-hidden="true">
                🚀
              </span>
              <span className="mt-3 block font-semibold text-gray-900">
                Brand
              </span>
              <span className="mt-1 block text-xs leading-5 text-gray-500">
                Discover talent and launch campaigns.
              </span>
              <span className="mt-3 block text-xs font-semibold text-purple-700">
                {accountType === "brand" ? "Selected ✓" : "Select brand"}
              </span>
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={isGoogleLoading || isLoading}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 font-medium text-gray-800 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 48 48"
            className="h-5 w-5"
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              transform="translate(0 4)"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 38.04 46.98 31.94 46.98 24.55z"
            />
            <path
              fill="#FBBC05"
              d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19z"
              transform="translate(0 4)"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.14 1.45-4.89 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 43.62 14.62 48 24 48z"
              transform="translate(0 -4)"
            />
          </svg>

          {isGoogleLoading ? "Connecting to Google..." : "Continue with Google"}
        </button>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
            Or sign up with email
          </span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Full name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Enter your full name"
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Create a password"
                minLength={8}
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-20 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
              />

              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute inset-y-0 right-3 text-sm font-medium text-purple-700 hover:text-purple-900"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <p className="mt-2 text-xs text-gray-500">
              Use at least 8 characters.
            </p>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Confirm password
            </label>

            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Enter your password again"
                minLength={8}
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-20 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword((current) => !current)
                }
                className="absolute inset-y-0 right-3 text-sm font-medium text-purple-700 hover:text-purple-900"
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {errorMessage && (
            <p
              role="alert"
              className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700"
            >
              {errorMessage}
            </p>
          )}

          {successMessage && (
            <div
              role="status"
              className="rounded-xl border border-green-100 bg-green-50 p-4 text-sm leading-6 text-green-800"
            >
              {successMessage}
              <div className="mt-3">
                <Link
                  href="/login"
                  className="font-semibold underline underline-offset-4"
                >
                  Go to login
                </Link>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="w-full rounded-xl bg-purple-700 px-4 py-3.5 font-semibold text-white shadow-lg shadow-purple-700/20 transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading
              ? "Creating your account..."
              : `Create ${accountType === "creator" ? "creator" : "brand"} account`}
          </button>

          <p className="text-center text-xs leading-5 text-gray-500">
            By creating an account, you agree to use CreatorConnect
            responsibly and provide accurate information.
          </p>
        </form>

        <p className="mt-7 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-purple-700 hover:text-purple-900"
          >
            Log in
          </Link>
        </p>

        <Link
          href="/"
          className="mt-5 block text-center text-sm text-gray-500 transition hover:text-gray-900"
        >
          ← Back to homepage
        </Link>
      </div>
    </section>
  </div>
</main>

);
}
