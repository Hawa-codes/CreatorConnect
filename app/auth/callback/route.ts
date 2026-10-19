import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);

  const code = url.searchParams.get("code");
  const authError = url.searchParams.get("error");
  const requestedNext = url.searchParams.get("next");

  // Accept only safe, local application paths.
  const next =
    requestedNext &&
    requestedNext.startsWith("/") &&
    !requestedNext.startsWith("//") &&
    !requestedNext.startsWith("/\\")
      ? requestedNext
      : null;

  // Decide where authentication errors should send the user.
  const failurePath =
  next === "/reset-password"
    ? "/forgot-password?error=recovery_failed"
    : "/login?error=confirmation_failed";

  // Handle errors returned directly by Supabase.
  if (authError) {
    return NextResponse.redirect(
      new URL(failurePath, url.origin)
    );
  }

  // A valid callback must contain an authorization code.
  if (!code) {
    return NextResponse.redirect(
      new URL(failurePath, url.origin)
    );
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );

  const { error } =
    await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Authentication callback error:", error.message);

    return NextResponse.redirect(
      new URL(failurePath, url.origin)
    );
  }

  // A password-reset link must lead to the password-reset form.
  if (next === "/reset-password") {
    return NextResponse.redirect(
      new URL("/reset-password", url.origin)
    );
  }

  // Normal email confirmation.
  return NextResponse.redirect(
    new URL("/login?confirmed=true", url.origin)
  );
}
