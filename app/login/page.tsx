"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
const router = useRouter();
const searchParams = useSearchParams();

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);
const [errorMessage, setErrorMessage] = useState("");
const [isLoading, setIsLoading] = useState(false);
const [isGoogleLoading, setIsGoogleLoading] = useState(false);

const confirmationFailed =
searchParams.get("error") === "confirmation_failed";

const confirmationSuccess =
searchParams.get("confirmed") === "true";

async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
event.preventDefault();

setErrorMessage("");
setIsLoading(true);

try {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    setErrorMessage(
      "Unable to log in. Check your email and password, and make sure you have confirmed your email address."
    );
    return;
  }

  router.push("/");
  router.refresh();
} catch {
  setErrorMessage(
    "Something went wrong. Please check your connection and try again."
  );
} finally {
  setIsLoading(false);
}

}

async function handleGoogleLogin() {
setErrorMessage("");
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
    setErrorMessage(
      "Google sign-in could not be started. Please try again or use your email and password."
    );
    setIsGoogleLoading(false);
  }
} catch {
  setErrorMessage(
    "Something went wrong while connecting to Google. Please try again."
  );
  setIsGoogleLoading(false);
}

}

return ( <main className="flex min-h-screen bg-white">
{/* Left branding panel */} <section className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-purple-700 p-12 text-white lg:flex xl:p-16"> <div className="absolute -right-24 top-20 h-80 w-80 rounded-full bg-purple-500/40 blur-3xl" /> <div className="absolute -bottom-20 -left-16 h-80 w-80 rounded-full bg-indigo-400/30 blur-3xl" />

    <Link href="/" className="relative z-10 inline-flex items-center gap-3">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-xl font-black text-purple-700">
        C
      </span>
      <span className="text-2xl font-bold tracking-tight">
        CreatorConnect
      </span>
    </Link>

    <div className="relative z-10 max-w-lg py-16">
      <span className="inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium">
        Your next opportunity starts here
      </span>

      <h1 className="mt-8 text-5xl font-bold leading-tight xl:text-6xl">
        Good to have
        <br />
        you back.
      </h1>

      <p className="mt-6 max-w-md text-lg leading-8 text-purple-100">
        Sign in to discover opportunities, connect with brands, and keep
        your creative journey moving forward.
      </p>

      <div className="mt-10 space-y-4">
        {[
          "Discover opportunities that fit your creativity",
          "Build meaningful brand partnerships",
          "Keep your projects moving forward",
        ].map((item) => (
          <div key={item} className="flex items-center gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm">
              ✓
            </span>
            <span className="text-sm text-purple-50">{item}</span>
          </div>
        ))}
      </div>
    </div>

    <p className="relative z-10 text-sm text-purple-200">
      Create connections. Discover possibilities.
    </p>
  </section>

  {/* Login form */}
  <section className="flex w-full items-center justify-center px-6 py-12 sm:px-10 lg:w-1/2 lg:px-12">
    <div className="w-full max-w-md">
      <Link
        href="/"
        className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-purple-700 lg:hidden"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-700 font-bold text-white">
          C
        </span>
        CreatorConnect
      </Link>

      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-purple-700">
          Welcome back
        </p>

        <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Log in to your account
        </h2>

        <p className="mt-3 text-gray-600">
          Pick up where you left off. Your next opportunity awaits.
        </p>
      </div>

      {confirmationFailed && (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"
        >
          We could not confirm your email. Please try the confirmation link
          again or request a new one.
        </div>
      )}

      {confirmationSuccess && (
        <div
          role="status"
          className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm leading-6 text-green-800"
        >
          Your email has been verified successfully. You can now log in.
        </div>
      )}

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isGoogleLoading || isLoading}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3.5 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isGoogleLoading ? (
          <span>Connecting to Google...</span>
        ) : (
          <>
            <svg
              aria-hidden="true"
              viewBox="0 0 48 48"
              className="h-5 w-5"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.06 13.22l7.98 6.19C11.93 13.72 17.48 9.5 24 9.5Z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 37.99 46.98 31.84 46.98 24.55Z"
              />
              <path
                fill="#FBBC05"
                d="M10.04 28.59A14.4 14.4 0 0 1 9.25 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.48-6.19Z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.14 1.44-4.89 2.3-8.18 2.3-6.52 0-12.07-4.22-14.04-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
              />
            </svg>
            Continue with Google
          </>
        )}
      </button>

      <div className="my-7 flex items-center gap-4">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
          Or continue with email
        </span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
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
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
            disabled={isLoading || isGoogleLoading}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-600 focus:ring-4 focus:ring-purple-100 disabled:bg-gray-50"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700"
            >
              Password
            </label>

            <Link
              href="/forgot-password"
              className="text-sm font-semibold text-purple-700 transition hover:text-purple-900"
            >
              Forgot password?
            </Link>
          </div>

          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
              disabled={isLoading || isGoogleLoading}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 pr-20 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-600 focus:ring-4 focus:ring-purple-100 disabled:bg-gray-50"
            />

            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-4 text-sm font-semibold text-gray-500 transition hover:text-purple-700"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"
          >
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || isGoogleLoading}
          className="flex w-full items-center justify-center rounded-xl bg-purple-700 px-4 py-3.5 font-semibold text-white shadow-sm transition hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-semibold text-purple-700 transition hover:text-purple-900"
        >
          Create an account
        </Link>
      </p>

      <Link
        href="/"
        className="mt-6 block text-center text-sm text-gray-500 transition hover:text-purple-700"
      >
        ← Back to homepage
      </Link>

      <p className="mt-10 text-center text-xs leading-5 text-gray-400">
        By continuing, you agree to use CreatorConnect responsibly and
        respectfully.
      </p>
    </div>
  </section>
</main>

);
}

export default function LoginPage() {
return (
<Suspense
fallback={ <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6"> <p className="text-gray-600">Loading login page...</p> </main>
}
> <LoginForm /> </Suspense>
);
}
