"use client";

import { useState } from "react";
import Link from "next/link";

type BriefCardProps = {
  id: string;
  category: string;
  title: string;
  description: string;
  budget: number;
};

export default function BriefCard({
  id,
  category,
  title,
  description,
  budget,
}: BriefCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <p className="text-sm text-purple-600">{category}</p>

      <h3 className="mt-3 text-xl font-bold">{title}</h3>

      <p className="mt-3 text-gray-600">{description}</p>

      <p className="mt-5 font-semibold">
        ₦{budget.toLocaleString("en-NG")}
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href={`/briefs/${id}`}
          className="rounded-lg bg-black px-5 py-2 text-white"
        >
          View opportunity
        </Link>

        <button
          type="button"
          onClick={() => setIsSaved(!isSaved)}
          className="rounded-lg border px-5 py-2"
        >
          {isSaved ? "Saved ✓" : "Save"}
        </button>
      </div>
    </div>
  );
}