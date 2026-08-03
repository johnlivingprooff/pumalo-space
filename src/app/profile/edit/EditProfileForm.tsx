"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface ProfileData {
  name: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  bio: string | null;
}

export default function EditProfileForm({ profile }: { profile: ProfileData }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    displayName: profile.name ?? "",
    firstName: profile.firstName ?? "",
    lastName: profile.lastName ?? "",
    phone: profile.phone ?? "",
    bio: profile.bio ?? "",
  });

  const set =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push("/profile");
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Personal Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <Input
            label="First Name"
            value={form.firstName}
            onChange={set("firstName")}
            placeholder="First name"
            fullWidth
          />
          <Input
            label="Last Name"
            value={form.lastName}
            onChange={set("lastName")}
            placeholder="Last name"
            fullWidth
          />
        </div>

        <div className="mb-4">
          <Input
            label="Display Name"
            value={profile.name}
            disabled
            hint="Display name is managed by your account provider"
            fullWidth
          />
        </div>

        <div className="mb-4">
          <Input
            label="Email"
            value={profile.email}
            disabled
            hint="Email cannot be changed here"
            fullWidth
          />
        </div>

        <div className="mb-4">
          <Input
            label="Phone"
            value={form.phone}
            onChange={set("phone")}
            placeholder="+1 (555) 123-4567"
            fullWidth
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            value={form.bio}
            onChange={set("bio")}
            placeholder="Tell us about yourself..."
            rows={4}
            className="block w-full px-4 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-500 transition-colors duration-200 bg-white text-gray-600 placeholder:text-gray-400 resize-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/profile")}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={saving}>
          Save Changes
        </Button>
      </div>
    </form>
  );
}
