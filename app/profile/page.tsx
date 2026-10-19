import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import CreatorProfileForm from "@/app/components/CreatorProfileForm";

async function CreatorProfileContent() {
  await connection();

  const supabase = await createClient();

  // 1. Check whether the user is logged in.
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  // 2. Get the user's account information.
  const { data: account, error: accountError } = await supabase
    .from("profiles")
    .select("account_type, full_name")
    .eq("id", user.id)
    .single();

  if (accountError || !account) {
    redirect("/login");
  }

  // 3. Only creators can access this page.
  if (account.account_type === "brand") {
    redirect("/brand-dashboard");
  }

  if (account.account_type !== "creator") {
    redirect("/login");
  }

  // 4. Load the creator's existing profile information.
  const { data: creatorProfile, error: creatorProfileError } =
    await supabase
      .from("creator_profiles")
      .select(
        "bio, location, categories, avatar_url, instagram_url, tiktok_url, linkedin_url, portfolio_url"
      )
      .eq("user_id", user.id)
      .maybeSingle();

  if (creatorProfileError) {
    throw new Error("Unable to load your creator profile.");
  }

  // 5. Prepare the initial values for the form.
  const initialProfile = {
    full_name:
      account.full_name ?? user.user_metadata?.full_name ?? "",
    bio: creatorProfile?.bio ?? "",
    location: creatorProfile?.location ?? "",
    categories: creatorProfile?.categories ?? [],
    avatar_url: creatorProfile?.avatar_url ?? "",
    instagram_url: creatorProfile?.instagram_url ?? "",
    tiktok_url: creatorProfile?.tiktok_url ?? "",
    linkedin_url: creatorProfile?.linkedin_url ?? "",
    portfolio_url: creatorProfile?.portfolio_url ?? "",
  };

  return (
    <main className="min-h-screen bg-[#F8F7FC] px-5 py-8 text-gray-900 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/creator-dashboard"
          className="text-sm font-medium text-purple-700 hover:text-purple-900"
        >
          ← Back to dashboard
        </Link>

        <header className="mb-8 mt-6">
          <p className="text-sm font-medium uppercase tracking-widest text-purple-700">
            CreatorConnect
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Build your creator profile
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
            Introduce yourself to brands, showcase your interests, and share
            your professional links.
          </p>
        </header>

        <CreatorProfileForm initialProfile={initialProfile} />

        <p className="mt-6 text-center text-xs text-gray-400">
          CreatorConnect · Create connections. Discover possibilities.
        </p>
      </div>
    </main>
  );
}

export default function CreatorProfilePage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#F8F7FC] text-gray-600">
          Loading your profile...
        </main>
      }
    >
      <CreatorProfileContent />
    </Suspense>
  );
}
