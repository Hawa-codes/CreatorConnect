"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function ResetPasswordForm() {
const router = useRouter();
const searchParams = useSearchParams();

const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [errorMessage, setErrorMessage] = useState("");
const [successMessage, setSuccessMessage] = useState("");
const [isLoading, setIsLoading] = useState(false);

const recoveryFailed = searchParams.get("error") === "recovery_failed";

async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
event.preventDefault();

setErrorMessage("");
setSuccessMessage("");

if (password.length < 8) {
  setErrorMessage("Your new password must contain at least 8 characters.");
  return;
}

if (password !== confirmPassword) {
  setErrorMessage("Your passwords do not match.");
  return;
}

setIsLoading(true);

try {
  const supabase = createClient();

  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError || !sessionData.session) {
    setErrorMessage(
      "Your password-reset session is missing or has expired. Please request a new reset link."
    );
    return;
  }

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    setErrorMessage(
      "We couldn't update your password. Please try again or request a new reset link."
    );
    return;
  }

  setSuccessMessage(
    "Your password has been updated successfully. You can now log in with your new password."
  );

  setPassword("");
  setConfirmPassword("");

  window.setTimeout(() => {
    router.push("/login?password_updated=true");
    router.refresh();
  }, 1800);
} catch {
  setErrorMessage(
    "Something went wrong. Please check your connection and try again."
  );
} finally {
  setIsLoading(false);
}

}

return ( <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-12"> <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm sm:p-10"> <Link
       href="/login"
       className="inline-flex text-sm font-medium text-purple-700 transition hover:text-purple-900"
     >
← Back to login </Link>

    <div className="mt-8">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-2xl">
        🔑
      </div>

      <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
        Create a new password
      </h1>

      <p className="mt-3 leading-7 text-gray-600">
        Choose a new password for your CreatorConnect account. Use at least
        8 characters and make sure both entries match.
      </p>
    </div>

    {recoveryFailed && (
      <div
        role="alert"
        className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"
      >
        We could not verify your password-reset link. Please request a new
        one.
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

    {successMessage && (
      <div
        role="status"
        className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm leading-6 text-green-800"
      >
        {successMessage}
      </div>
    )}

    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-semibold text-gray-700"
        >
          New password
        </label>

        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your new password"
            minLength={8}
            required
            disabled={isLoading || Boolean(successMessage)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3.5 pr-20 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-600 focus:ring-4 focus:ring-purple-100 disabled:bg-gray-50"
          />

          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="absolute inset-y-0 right-4 text-sm font-semibold text-gray-500 transition hover:text-purple-700"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-2 block text-sm font-semibold text-gray-700"
        >
          Confirm new password
        </label>

        <div className="relative">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Enter your new password again"
            minLength={8}
            required
            disabled={isLoading || Boolean(successMessage)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3.5 pr-20 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-600 focus:ring-4 focus:ring-purple-100 disabled:bg-gray-50"
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword((current) => !current)
            }
            className="absolute inset-y-0 right-4 text-sm font-semibold text-gray-500 transition hover:text-purple-700"
            aria-label={
              showConfirmPassword ? "Hide password" : "Show password"
            }
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || Boolean(successMessage)}
        className="w-full rounded-xl bg-purple-700 px-4 py-3.5 font-semibold text-white transition hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Updating password..." : "Update password"}
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

export default function ResetPasswordPage() {
return (
<Suspense
fallback={ <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6"> <p className="text-gray-600">Loading reset-password page...</p> </main>
}
> <ResetPasswordForm /> </Suspense>
);
}
