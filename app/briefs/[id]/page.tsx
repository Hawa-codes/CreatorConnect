import { Suspense } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type OpportunityPageProps = {
  params: Promise<{ id: string }>;
};

async function OpportunityDetails({ id }: { id: string }) {
  const { data: opportunity, error } = await supabase
    .from("opportunities")
    .select("*")
    .eq("id", Number(id))
    .maybeSingle();

  if (error) {
    console.error("Error fetching opportunity:", error.message);

    return (
      <main className="p-10 text-center">
        <h1 className="text-2xl font-bold">
          Unable to load opportunity
        </h1>

        <Link
          href="/"
          className="mt-4 inline-block text-purple-600"
        >
          Return home
        </Link>
      </main>
    );
  }

  if (!opportunity) {
    return (
      <main className="p-10 text-center">
        <h1 className="text-2xl font-bold">
          Opportunity not found
        </h1>

        <Link
          href="/"
          className="mt-4 inline-block text-purple-600"
        >
          Return home
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-3xl rounded-2xl border bg-white p-8 shadow-sm">
        <Link href="/" className="text-sm text-purple-600">
          ← Back to opportunities
        </Link>

        <p className="mt-8 text-sm font-medium text-purple-600">
          {opportunity.category}
        </p>

        <h1 className="mt-3 text-3xl font-bold">
          {opportunity.title}
        </h1>

        <p className="mt-4 text-gray-600">
          {opportunity.description}
        </p>

        <p className="mt-6 text-xl font-bold">
          ₦{Number(opportunity.budget).toLocaleString("en-NG")}
        </p>

        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-bold">
            Campaign requirements
          </h2>

          <p className="mt-3 text-gray-600">
            {opportunity.requirements}
          </p>
        </div>

        <button
          type="button"
          className="mt-8 rounded-lg bg-black px-6 py-3 text-white"
        >
          Apply for opportunity
        </button>
      </div>
    </main>
  );
}

export default function OpportunityPage({
  params,
}: OpportunityPageProps) {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gray-50 px-6 py-16">
          <div className="mx-auto max-w-3xl rounded-2xl border bg-white p-8 shadow-sm">
            <p className="text-center text-gray-600">
              Loading opportunity details...
            </p>
          </div>
        </main>
      }
    >
      <OpportunityPageContent params={params} />
    </Suspense>
  );
}

async function OpportunityPageContent({
  params,
}: OpportunityPageProps) {
  const { id } = await params;

  return <OpportunityDetails id={id} />;
}