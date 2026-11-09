"use client";

import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth/AuthContext";
import { apiFetch } from "@/lib/api/client";

const Navbar1 = lazy(() =>
  import("@/components/Navbar/Navbar").then(module => ({ default: module.Navbar1 }))
);

const Footer = lazy(() => import("@/components/Footer/Footer"));

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/;

export default function AccountSettings() {
  const { user, loading, refresh } = useAuth();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    const parts = (user.full_name || "").trim().split(/\s+/);
    setFirstName(parts[0] || "");
    setLastName(parts.slice(1).join(" ") || "");
    setEmail(user.email || "");
    setPhone(user.phone || "");
    setBio(user.bio || "");
  }, [user]);

  const validateInputs = useCallback(() => {
    if (!firstName.trim()) { setError("First name is required."); return false; }
    if (email && !EMAIL_REGEX.test(email)) { setError("Invalid email format."); return false; }
    if (phone && !PHONE_REGEX.test(phone)) { setError("Invalid phone number format (e.g., +254722991133)."); return false; }
    return true;
  }, [firstName, email, phone]);

  const handleSave = useCallback(async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!validateInputs()) return;

    setSaving(true);
    try {
      const full_name = `${firstName} ${lastName}`.trim();
      await apiFetch("/auth/me", {
        method: "PATCH",
        body: JSON.stringify({ full_name, phone, bio }),
      });
      await refresh();
      setSuccess("Profile updated successfully!");
      setTimeout(() => router.push("/"), 1000);
    } catch (err: unknown) {
      setError(`Failed to save changes: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setSaving(false);
    }
  }, [firstName, lastName, phone, bio, validateInputs, refresh, router]);

  const LoadingSpinner = useMemo(() => (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-[#0e0e15] dark:to-[#1E1E2F]">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        <div className="h-12 w-12 animate-pulse rounded-full bg-blue-600/20"></div>
      </div>
    </div>
  ), []);

  if (loading) return LoadingSpinner;

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-6 mt-24 text-center">
        <p className="text-red-500 mb-4">You must be logged in to view this page.</p>
        <Button onClick={() => router.push("/login")}>Go to Login</Button>
      </div>
    );
  }

  return (
    <>
      <Suspense fallback={<div className="h-16 bg-gray-200 animate-pulse" />}>
        <Navbar1 />
      </Suspense>

      <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-[#1E1E2F] dark:to-[#0e0e15] py-16">
        <div className="max-w-2xl w-full mx-auto px-4 sm:px-6">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              Account <span className="text-black dark:text-white">Settings</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400">Update your personal information and profile details.</p>
          </div>

          {error && <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 rounded-md"><p className="text-red-600 dark:text-red-400 text-sm">{error}</p></div>}
          {success && <div className="mb-6 p-4 bg-green-50 dark:bg-green-950/30 border-l-4 border-green-500 rounded-md"><p className="text-green-600 dark:text-green-400 text-sm">{success}</p></div>}

          <div className="bg-white dark:bg-[#1E1E2F] p-8 md:p-10 rounded-2xl shadow-xl shadow-blue-500/5 border border-gray-100 dark:border-gray-800">
            <form className="space-y-6">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">Personal Information</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-gray-700 dark:text-gray-300 font-medium">First Name</Label>
                    <Input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" required className="rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-gray-700 dark:text-gray-300 font-medium">Last Name</Label>
                    <Input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" className="rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium">Email Address</Label>
                    <Input id="email" type="email" value={email} disabled className="rounded-xl bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-70 cursor-not-allowed" />
                    <p className="text-xs text-gray-500 mt-1">Contact support to change email.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300 font-medium">Phone Number</Label>
                    <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+254722991133" className="rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700" />
                  </div>
                  <div className="col-span-1 sm:col-span-2 space-y-2">
                    <Label htmlFor="bio" className="text-gray-700 dark:text-gray-300 font-medium">Bio / Role</Label>
                    <Input id="bio" type="text" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="e.g. Senior Developer, Project Manager" className="rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-gray-100 dark:border-gray-800">
                <Button
                  asChild
                  className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-blue-600/20 text-base px-8 py-6 rounded-xl"
                >
                  <button type="button" onClick={handleSave} disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Suspense fallback={<div className="h-64 bg-gray-200 animate-pulse" />}>
        <Footer />
      </Suspense>
    </>
  );
}