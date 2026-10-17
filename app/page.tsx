import { Suspense } from "react";
import BriefCard from "./components/BriefCard";
import AuthNav from "./components/AuthNav";
import { supabase } from "@/lib/supabase";

async function OpportunitiesSection() {
  const { data: opportunities, error } = await supabase
    .from("opportunities")
    .select("*")
    .order("id");

  if (error) {
    console.error("Error fetching opportunities:", error.message);
  }

  return (
    <section id="opportunities" className="bg-gray-50 px-8 py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold">
          Opportunities for creators
        </h2>

        <p className="mt-4 text-center text-gray-600">
          Find your next brand partnership right here.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {error ? (
            <p className="col-span-full text-center text-red-600">
              Unable to load opportunities. Please try again later.
            </p>
          ) : opportunities && opportunities.length > 0 ? (
            opportunities.map((opportunity) => (
              <BriefCard
                key={opportunity.id}
                id={String(opportunity.id)}
                category={opportunity.category}
                title={opportunity.title}
                description={opportunity.description}
                budget={Number(opportunity.budget)}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-600">
              No opportunities are available yet.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <nav className="flex items-center justify-between border-b px-8 py-5">
  <h1 className="text-2xl font-bold">CreatorConnect</h1>

  <div className="flex gap-6">
    <a href="#opportunities">Opportunities</a>
    <a href="#about">About</a>
  </div>

  <AuthNav />
</nav>

      <section className="px-8 py-24 text-center">
        <h2 className="mx-auto max-w-3xl text-4xl font-bold md:text-6xl">
          Your creativity deserves the right opportunities.
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          Discover brand opportunities, showcase your creativity, and build
          meaningful partnerships with brands.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <a
            href="#opportunities"
            className="rounded-lg bg-black px-6 py-3 text-white"
          >
            Explore opportunities
          </a>

          <a
            href="/signup"
            className="rounded-lg border border-gray-300 px-6 py-3"
          >
            Join CreatorConnect
          </a>
        </div>
      </section>

      <Suspense
        fallback={
          <section
            id="opportunities"
            className="bg-gray-50 px-8 py-16"
          >
            <div className="mx-auto max-w-6xl text-center">
              <h2 className="text-3xl font-bold">
                Opportunities for creators
              </h2>
              <p className="mt-4 text-gray-600">
                Loading opportunities...
              </p>
            </div>
          </section>
        }
      >
        <OpportunitiesSection />
      </Suspense>

      <section id="about" className="px-8 py-16 text-center">
        <h2 className="text-2xl font-bold">
          Built for creators and brands
        </h2>

        <p className="mt-4 text-gray-600">
          CreatorConnect brings creative talent and growing brands together.
        </p>
      </section>
    </main>
  );
}