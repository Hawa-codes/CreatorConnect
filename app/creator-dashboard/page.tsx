import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import { connection } from "next/server";

const navigation = [
  { label: "Overview", icon: "◫", href: "/creator-dashboard", active: true },
  { label: "Discover", icon: "⌕", href: "#discover", active: false },
  { label: "My applications", icon: "▤", href: "#applications", active: false },
  { label: "Saved opportunities", icon: "♡", href: "#saved", active: false },
  { label: "My profile", icon: "◎", href: "/profile", active: false },
];

const stats = [
  { label: "Applications sent", value: "—", note: "Coming soon", icon: "↗" },
  { label: "In conversation", value: "—", note: "Coming soon", icon: "◎" },
  { label: "Completed projects", value: "—", note: "Coming soon", icon: "✓" },
];

async function CreatorDashboardContent() {
    await connection();
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  // Fetch the authenticated user's account type
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("account_type")
    .eq("id", user.id)
    .single();

  // Don't display the dashboard if the profile cannot be verified
  if (profileError || !profile) {
    redirect("/login");
  }

  // Redirect users to the dashboard matching their account type
  if (profile.account_type === "brand") {
    redirect("/brand-dashboard");
  }

  if (profile.account_type !== "creator") {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[#F8F7FC] text-gray-900">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white px-5 py-7 md:flex md:flex-col">
          <Link href="/" className="flex items-center gap-3 px-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-700 text-lg font-bold text-white">
              C
            </span>

            <span className="text-xl font-bold tracking-tight">
              CreatorConnect
            </span>
          </Link>

          <div className="mb-3 mt-12 px-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Workspace
          </div>

          <nav className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                  item.active
                    ? "bg-purple-50 text-purple-700"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span className="w-5 text-center text-lg">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto rounded-2xl bg-purple-50 p-4">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-lg text-purple-700">
              ✦
            </div>

            <h3 className="font-semibold text-gray-900">
              Your next big opportunity
            </h3>

            <p className="mt-2 text-xs leading-5 text-gray-500">
              Complete your creator profile to get ready for brand
              collaborations.
            </p>

            <Link
              href="#profile"
              className="mt-4 inline-block text-sm font-semibold text-purple-700 hover:text-purple-900"
            >
              Complete profile →
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <div className="min-w-0 flex-1">
          <header className="flex items-center justify-between border-b border-gray-200 bg-white px-5 py-5 sm:px-8 lg:px-10">
            <div>
              <p className="text-sm text-gray-500">Creator workspace</p>
              <h1 className="mt-1 text-lg font-bold sm:text-xl">
                Dashboard
              </h1>
            </div>

            <Link
              href="/"
              className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
            >
              Visit website
            </Link>
          </header>

          <div className="mx-auto max-w-7xl space-y-8 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
            {/* Welcome */}
            <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-purple-800 to-purple-600 p-6 text-white sm:p-9">
              <div className="max-w-2xl">
                <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-purple-100">
                  YOUR CREATOR SPACE
                </span>

                <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                  Make your creativity count.
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-6 text-purple-100 sm:text-base">
                  Discover brands that align with your style, explore
                  opportunities, and build meaningful collaborations.
                </p>

                <Link
                  href="#discover"
                  className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-purple-800 transition hover:bg-purple-50"
                >
                  Explore opportunities <span>→</span>
                </Link>
              </div>
            </section>

            {/* Stats */}
            <section>
              <div className="mb-5">
                <h2 className="text-lg font-bold">Your activity</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Your collaboration progress at a glance.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {stats.map((stat) => (
                  <article
                    key={stat.label}
                    className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-500">
                        {stat.label}
                      </p>

                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-lg text-purple-700">
                        {stat.icon}
                      </span>
                    </div>

                    <p className="mt-5 text-3xl font-bold">{stat.value}</p>
                    <p className="mt-2 text-xs text-gray-400">{stat.note}</p>
                  </article>
                ))}
              </div>
            </section>

            {/* Discover opportunities */}
            <section
              id="discover"
              className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8"
            >
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-lg font-bold">
                    Discover opportunities
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Find projects that match your creative interests.
                  </p>
                </div>

                <span className="w-fit rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">
                  Coming soon
                </span>
              </div>

              <div className="mt-7 rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-5 py-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-2xl text-purple-700">
                  ✦
                </div>

                <h3 className="mt-4 font-semibold">
                  Your next collaboration starts here
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                  Opportunities will appear here as brands publish briefs.
                  You will be able to explore projects and apply when you
                  find the right fit.
                </p>
              </div>
            </section>

            {/* Applications */}
            <section
              id="applications"
              className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8"
            >
              <div>
                <h2 className="text-lg font-bold">Recent applications</h2>

                <p className="mt-1 text-sm text-gray-500">
                  Keep track of the opportunities you apply for.
                </p>
              </div>

              <div className="py-10 text-center">
                <p className="text-sm font-medium text-gray-600">
                  No application activity yet.
                </p>

                <p className="mt-2 text-sm text-gray-400">
                  Your applications will appear here once the feature is
                  connected.
                </p>
              </div>
            </section>

            <footer className="pb-3 text-center text-xs text-gray-400">
              CreatorConnect · Create connections. Discover possibilities.
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CreatorDashboard() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#F8F7FC] text-gray-600">
          Loading your dashboard...
        </main>
      }
    >
      <CreatorDashboardContent />
    </Suspense>
  );
}