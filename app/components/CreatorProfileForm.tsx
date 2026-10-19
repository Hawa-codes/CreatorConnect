"use client";

import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

type CreatorProfile = {
  full_name: string;
  bio: string;
  location: string;
  categories: string[];
  avatar_url: string;
  instagram_url: string;
  tiktok_url: string;
  linkedin_url: string;
  portfolio_url: string;
};

type CreatorProfileFormProps = {
  initialProfile: CreatorProfile;
};

const availableCategories = [
  "Beauty",
  "Fashion",
  "Lifestyle",
  "Food",
  "Travel",
  "Fitness",
  "Technology",
  "Parenting",
  "Home & Living",
  "Other",
];

export default function CreatorProfileForm({
  initialProfile,
}: CreatorProfileFormProps) {
  const supabase = createClient();

  const [form, setForm] = useState<CreatorProfile>(initialProfile);
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  function handleCategoryChange(category: string) {
    setForm((currentForm) => {
      const alreadySelected =
        currentForm.categories.includes(category);

      return {
        ...currentForm,
        categories: alreadySelected
          ? currentForm.categories.filter(
              (item) => item !== category
            )
          : [...currentForm.categories, category],
      };
    });
  }

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setMessage(
        "Please select a JPG, PNG, or WebP image."
      );
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setMessage(
        "Your profile picture must be 2MB or smaller."
      );
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setPreviewUrl(reader.result);
        setSelectedFile(file);
        setMessage("");
      }
    };

    reader.readAsDataURL(file);
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setIsSaving(true);
    setMessage("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setMessage(
          "Your session has expired. Please log in again."
        );
        return;
      }

      let avatarUrl = form.avatar_url;

      // Upload a new profile picture if one was selected.
      if (selectedFile) {
        const fileExtension =
          selectedFile.name.split(".").pop()?.toLowerCase() ||
          "jpg";

        const filePath = `${user.id}/${crypto.randomUUID()}.${fileExtension}`;

        const { error: uploadError } = await supabase.storage
          .from("creator-avatars")
          .upload(filePath, selectedFile, {
            contentType: selectedFile.type,
            upsert: false,
          });

        if (uploadError) {
          throw new Error(
            `Profile picture upload failed: ${uploadError.message}`
          );
        }

        const { data: publicUrlData } = supabase.storage
          .from("creator-avatars")
          .getPublicUrl(filePath);

        avatarUrl = publicUrlData.publicUrl;
      }

      // Update the user's name in the main profiles table.
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: form.full_name.trim(),
        })
        .eq("id", user.id);

      if (profileError) {
        throw new Error(
          `Could not update your name: ${profileError.message}`
        );
      }

      // Save the creator-specific information.
      const { error: creatorProfileError } = await supabase
        .from("creator_profiles")
        .upsert(
          {
            user_id: user.id,
            bio: form.bio.trim(),
            location: form.location.trim(),
            categories: form.categories,
            avatar_url: avatarUrl,
            instagram_url: form.instagram_url.trim(),
            tiktok_url: form.tiktok_url.trim(),
            linkedin_url: form.linkedin_url.trim(),
            portfolio_url: form.portfolio_url.trim(),
          },
          {
            onConflict: "user_id",
          }
        );

      if (creatorProfileError) {
        throw new Error(
          `Could not save your creator profile: ${creatorProfileError.message}`
        );
      }

      setForm((currentForm) => ({
        ...currentForm,
        avatar_url: avatarUrl,
      }));

      setSelectedFile(null);
      setPreviewUrl("");
      setMessage("Your profile has been saved successfully.");
    } catch (error) {
      console.error("Error saving creator profile:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while saving your profile."
      );
    } finally {
      setIsSaving(false);
    }
  }

  const displayedAvatar = previewUrl || form.avatar_url;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      {/* Basic information */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Basic Information
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Tell brands who you are and what you create.
        </p>

        {/* Profile picture */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700">
            Profile picture
          </label>

          <div className="mt-3 flex flex-wrap items-center gap-5">
            {displayedAvatar ? (
              <Image
                src={displayedAvatar}
                alt="Your creator profile"
                width={96}
                height={96}
                unoptimized={displayedAvatar.startsWith("data:")}
                className="h-24 w-24 rounded-full border border-gray-200 object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-purple-100 text-3xl font-semibold text-purple-700">
                {form.full_name.trim().charAt(0).toUpperCase() ||
                  "C"}
              </div>
            )}

            <div>
              <input
                id="avatar"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="block w-full max-w-xs text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-purple-50 file:px-4 file:py-2 file:font-medium file:text-purple-700 hover:file:bg-purple-100"
              />

              <p className="mt-2 text-xs text-gray-500">
                JPG, PNG, or WebP. Maximum size: 2MB.
              </p>
            </div>
          </div>
        </div>

        {/* Full name */}
        <div className="mt-6">
          <label
            htmlFor="full_name"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Full name
          </label>

          <input
            id="full_name"
            name="full_name"
            type="text"
            value={form.full_name}
            onChange={handleChange}
            required
            maxLength={100}
            placeholder="Enter your full name"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
          />
        </div>

        {/* Bio */}
        <div className="mt-5">
          <label
            htmlFor="bio"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            About you
          </label>

          <textarea
            id="bio"
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows={4}
            maxLength={1000}
            placeholder="Describe yourself, your content, and what makes you unique."
            className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
          />

          <p className="mt-1 text-right text-xs text-gray-400">
            {form.bio.length}/1000 characters
          </p>
        </div>

        {/* Location */}
        <div className="mt-5">
          <label
            htmlFor="location"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Location
          </label>

          <input
            id="location"
            name="location"
            type="text"
            value={form.location}
            onChange={handleChange}
            maxLength={150}
            placeholder="e.g. Lagos, Nigeria"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
          />
        </div>
      </section>

      {/* Content categories */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Content Categories
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Select the types of content you create.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          {availableCategories.map((category) => {
            const isSelected =
              form.categories.includes(category);

            return (
              <label
                key={category}
                className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition ${
                  isSelected
                    ? "border-purple-600 bg-purple-50 text-purple-700"
                    : "border-gray-300 bg-white text-gray-600 hover:border-purple-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() =>
                    handleCategoryChange(category)
                  }
                  className="sr-only"
                />

                {category}
              </label>
            );
          })}
        </div>
      </section>

      {/* Social links */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Social Media & Portfolio
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Add your social profiles and portfolio so brands can
          discover your work.
        </p>

        <div className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="instagram_url"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Instagram URL
            </label>

            <input
              id="instagram_url"
              name="instagram_url"
              type="url"
              value={form.instagram_url}
              onChange={handleChange}
              maxLength={500}
              placeholder="https://instagram.com/yourusername"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            />
          </div>

          <div>
            <label
              htmlFor="tiktok_url"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              TikTok URL
            </label>

            <input
              id="tiktok_url"
              name="tiktok_url"
              type="url"
              value={form.tiktok_url}
              onChange={handleChange}
              maxLength={500}
              placeholder="https://tiktok.com/@yourusername"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            />
          </div>

          <div>
            <label
              htmlFor="linkedin_url"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              LinkedIn URL
            </label>

            <input
              id="linkedin_url"
              name="linkedin_url"
              type="url"
              value={form.linkedin_url}
              onChange={handleChange}
              maxLength={500}
              placeholder="https://linkedin.com/in/yourusername"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            />
          </div>

          <div>
            <label
              htmlFor="portfolio_url"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Portfolio URL
            </label>

            <input
              id="portfolio_url"
              name="portfolio_url"
              type="url"
              value={form.portfolio_url}
              onChange={handleChange}
              maxLength={500}
              placeholder="https://yourportfolio.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            />
          </div>
        </div>
      </section>

      {/* Status message */}
      {message && (
        <p
          role="status"
          aria-live="polite"
          className={`rounded-lg px-4 py-3 text-sm ${
            message ===
            "Your profile has been saved successfully."
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message}
        </p>
      )}

      {/* Save button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </form>
  );
}
