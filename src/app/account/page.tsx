"use client";

import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense } from "react";
import { useRouter } from "next/navigation";
import { account, databases } from "@/lib/appwriteServices";
import { Permission, Role, Query } from "appwrite";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Lazy load heavy components - Fixed Footer import
const Navbar1 = lazy(() =>
    import("@/components/Navbar/Navbar").then(module => ({
        default: module.Navbar1
    }))
);

const Footer = lazy(() => import("@/components/Footer/Footer"));

// Define custom interface for Appwrite user
interface AppwriteUser {
    $id: string;
    name: string;
    email: string;
    [key: string]: unknown;
}

// Constants for database IDs to avoid magic strings
const DATABASE_ID = "6840196a001ea51cd944";
const COLLECTION_ID = "68482e0c00163d490722";

// Validation patterns
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/;

export default function AccountSettings() {
    const [user, setUser] = useState<AppwriteUser | null>(null);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [bio, setBio] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const router = useRouter();

    // Memoized validation function
    const validateInputs = useCallback(() => {
        if (!firstName.trim()) {
            setError("First name is required.");
            return false;
        }
        if (!lastName.trim()) {
            setError("Last name is required.");
            return false;
        }
        if (email && !EMAIL_REGEX.test(email)) {
            setError("Invalid email format.");
            return false;
        }
        if (phone && !PHONE_REGEX.test(phone)) {
            setError("Invalid phone number format (e.g., +1234567890).");
            return false;
        }
        return true;
    }, [firstName, lastName, email, phone]);

    // Memoized fetch profile function
    const fetchUserProfile = useCallback(async (userId: string) => {
        try {
            const profile = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID,
                [Query.equal("userId", userId)]
            );
            return profile.documents;
        } catch (err) {
            console.error("Error fetching profile:", err);
            throw err;
        }
    }, []);

    // Memoized update profile function
    const updateUserProfile = useCallback(async (profileData: any, documentId?: string) => {
        if (documentId) {
            return await databases.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                documentId,
                profileData
            );
        } else {
            return await databases.createDocument(
                DATABASE_ID,
                COLLECTION_ID,
                "unique()", // Let Appwrite generate unique ID
                profileData,
                [
                    Permission.read(Role.user(profileData.userId)),
                    Permission.write(Role.user(profileData.userId)),
                    Permission.delete(Role.user(profileData.userId)),
                ]
            );
        }
    }, []);

    // Fetch user and profile data
    useEffect(() => {
        let mounted = true;

        const fetchUser = async () => {
            try {
                const userData = await account.get();
                if (!mounted) return;

                console.log("Fetched user:", userData.$id);
                setUser(userData);
                setEmail(userData.email || "");

                const profile = await fetchUserProfile(userData.$id);
                if (!mounted) return;

                console.log("Fetched profile:", profile);
                if (profile.length > 0) {
                    const data = profile[0];
                    setFirstName(data.firstName || "");
                    setLastName(data.lastName || "");
                    setPhone(data.phone || "");
                    setBio(data.bio || "");
                }
                setLoading(false);
            } catch (err) {
                if (!mounted) return;
                console.error("Error fetching user data:", err);
                setError("Failed to load user data. Please log in or try again.");
                setLoading(false);
            }
        };

        fetchUser();

        return () => {
            mounted = false;
        };
    }, [router, fetchUserProfile]);

    // Handle form submission
    const handleSave = useCallback(async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (!validateInputs()) return;

        try {
            if (!user) throw new Error("No user logged in");

            const fullName = `${firstName} ${lastName}`.trim();

            // Update name if changed
            if (fullName !== user.name) {
                await account.updateName(fullName);
                console.log("Updated name:", fullName);
            }

            if (email && email !== user.email) {
                throw new Error("Email updates require password authentication. Contact support.");
            }

            // Fetch existing profile
            const profile = await fetchUserProfile(user.$id);
            console.log("Profile exists:", profile.length > 0);

            const profileData = {
                firstName,
                lastName,
                email,
                phone,
                bio,
                profileSetup: true
            };

            // Update or create profile
            if (profile.length > 0) {
                await updateUserProfile(profileData, profile[0].$id);
                console.log("Profile updated for userId:", user.$id);
            } else {
                await updateUserProfile({
                    ...profileData,
                    userId: user.$id
                });
                console.log("Profile created for userId:", user.$id);
            }

            setUser({ ...user, name: fullName });
            setSuccess("Profile updated successfully!");
            setIsSubmitted(true);

            // Use setTimeout to avoid potential state update during render
            setTimeout(() => {
                router.push('/');
            }, 1000);

        } catch (err: unknown) {
            console.error("Error saving changes:", {
                message: err instanceof Error ? err.message : String(err),
                code: err instanceof Error && 'code' in err ? err.code : undefined,
            });
            setError(`Failed to save changes: ${err instanceof Error ? err.message : String(err)}`);
        }
    }, [user, firstName, lastName, email, phone, bio, validateInputs, fetchUserProfile, updateUserProfile, router]);

    // Memoized loading component
    const LoadingSpinner = useMemo(() => (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-gray-100 to-white dark:from-[#0e0e15] dark:to-[#1E1E2F]">
            <div className="relative flex items-center justify-center">
                <div className="absolute h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                <div className="h-12 w-12 animate-pulse rounded-full bg-blue-600/20"></div>
            </div>
        </div>
    ), []);

    // Memoized error component
    const ErrorComponent = useMemo(() => (
        <div className="max-w-2xl mx-auto p-6">
            <p className="text-red-500">{error}</p>
            <Button onClick={() => router.push("/login")} className="mt-4">
                Go to Login
            </Button>
        </div>
    ), [error, router]);

    if (loading) {
        return LoadingSpinner;
    }

    if (!user && error) {
        return ErrorComponent;
    }

    return (
        <>
            <Suspense fallback={<div className="h-16 bg-gray-200 animate-pulse" />}>
                <Navbar1 />
            </Suspense>

            <div className="bg-background text-foreground min-h-screen items-center justify-center flex flex-col bg-gradient-to-b from-white to-gray-100 dark:from-[#1E1E2F] dark:to-[#0e0e15]">
                <div className="max-w-2xl w-full px-4 sm:px-6">
                    <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-6">
                        Account <span className="text-black dark:text-white"> Settings</span>
                    </h1>
                    {error && <p className="text-red-500 mb-4 text-sm sm:text-base">{error}</p>}
                    {success && <p className="text-green-500 mb-4 text-sm sm:text-base">{success}</p>}
                    <form className="space-y-6">
                        {/* Personal Information */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Personal Information</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName" className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                                        First Name
                                    </Label>
                                    <Input
                                        id="firstName"
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        placeholder="First Name"
                                        required
                                        className="w-full"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName" className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                                        Last Name
                                    </Label>
                                    <Input
                                        id="lastName"
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        placeholder="Last Name"
                                        required
                                        className="w-full"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                                        Email Address
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="email@example.com"
                                        disabled
                                        className="w-full"
                                    />
                                    <p className="text-xs sm:text-sm text-gray-500 mt-1">Contact support to change email.</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                                        Phone
                                    </Label>
                                    <Input
                                        id="phone"
                                        type="text"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="+254722991133"
                                        className="w-full"
                                    />
                                </div>
                                <div className="col-span-1 sm:col-span-2 space-y-2">
                                    <Label htmlFor="bio" className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                                        Bio
                                    </Label>
                                    <Input
                                        id="bio"
                                        type="text"
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        placeholder="Your role or bio"
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-4">
                            <Button
                                onClick={handleSave}
                                className={`bg-white text-blue-600 border border-blue-600 dark:border-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-600 hover:text-white dark:bg-gray-900 dark:text-white dark:hover:bg-blue-600 dark:hover:text-white ${isSubmitted ? 'opacity-50 cursor-not-allowed' : ''
                                    } w-full sm:w-auto`}
                            // Fixed: Remove disabled prop and handle it via className and onClick
                            >
                                {isSubmitted ? "Saved!" : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            <Suspense fallback={<div className="h-64 bg-gray-200 animate-pulse" />}>
                <Footer />
            </Suspense>
        </>
    );
}