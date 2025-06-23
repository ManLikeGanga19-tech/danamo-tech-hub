"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { account, databases } from "@/lib/appwriteServices";
import { Permission, Role, Query } from "appwrite";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar1 } from "@/components/navbar/Navbar";
import Footer from "@/components/Footer/Footer";

// Define custom interface for Appwrite user
interface AppwriteUser {
  $id: string;
  name: string;
  email: string;
  [key: string]: unknown; // Allow additional properties
}

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

    // Fetch user and profile data
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await account.get();
                console.log("Fetched user:", userData.$id);
                setUser(userData);
                setEmail(userData.email || "");

                const profile = await databases.listDocuments(
                    "6840196a001ea51cd944",
                    "68482e0c00163d490722",
                    [Query.equal("userId", userData.$id)]
                );
                console.log("Fetched profile:", profile.documents);
                if (profile.documents.length > 0) {
                    const data = profile.documents[0];
                    setFirstName(data.firstName || "");
                    setLastName(data.lastName || "");
                    setPhone(data.phone || "");
                    setBio(data.bio || "");
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching user data:", err);
                setError("Failed to load user data. Please log in or try again.");
                setLoading(false);
            }
        };
        fetchUser();
    }, [router]);

    // Validate inputs
    const validateInputs = () => {
        if (!firstName.trim()) {
            setError("First name is required.");
            return false;
        }
        if (!lastName.trim()) {
            setError("Last name is required.");
            return false;
        }
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Invalid email format.");
            return false;
        }
        if (phone && !/^\+?[1-9]\d{1,14}$/.test(phone)) {
            setError("Invalid phone number format (e.g., +1234567890).");
            return false;
        }
        return true;
    };

    // Handle form submission
    const handleSave = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setError("");
        setSuccess("");
        if (!validateInputs()) return;

        try {
            if (!user) throw new Error("No user logged in");
            const fullName = `${ firstName } ${ lastName } `.trim();
            if (fullName !== user.name) {
                await account.updateName(fullName);
                console.log("Updated name:", fullName);
            }
            if (email && email !== user.email) {
                throw new Error("Email updates require password authentication. Contact support.");
            }

            const profile = await databases.listDocuments(
                "6840196a001ea51cd944",
                "68482e0c00163d490722",
                [Query.equal("userId", user.$id)]
            );
            console.log("Profile exists:", profile.documents.length > 0);
            if (profile.documents.length > 0) {
                await databases.updateDocument(
                    "6840196a001ea51cd944",
                    "68482e0c00163d490722",
                    profile.documents[0].$id,
                    { firstName, lastName, email, phone, bio, profileSetup: true }
                );
                console.log("Profile updated for userId:", user.$id);
            } else {
                await databases.createDocument(
                    "6840196a001ea51cd944",
                    "68482e0c00163d490722",
                    user.$id,
                    {
                        userId: user.$id,
                        firstName,
                        lastName,
                        email,
                        phone,
                        bio,
                        profileSetup: true,
                    },
                    [
                        Permission.read(Role.user(user.$id)),
                        Permission.write(Role.user(user.$id)),
                        Permission.delete(Role.user(user.$id)),
                    ]
                );
                console.log("Profile created for userId:", user.$id);
            }

            setUser({ ...user, name: fullName });
            setSuccess("Profile updated successfully!");
            setFirstName("");
            setLastName("");
            setPhone("");
            setBio("");
            setIsSubmitted(true);
            router.push('/'); // Redirect to dashboard to trigger greeting popover
        } catch (err: unknown) {
            console.error("Error saving changes:", {
                message: err instanceof Error ? err.message : String(err),
                code: err instanceof Error && 'code' in err ? err.code : undefined,
                type: err instanceof Error && 'type' in err ? err.type : undefined,
                response: err instanceof Error && 'response' in err ? err.response : undefined,
            });
            setError(`Failed to save changes: ${ err instanceof Error ? err.message : String(err) } `);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-gray-100 to-white dark:from-[#0e0e15] dark:to-[#1E1E2F]">
                <div className="relative flex items-center justify-center">
                    <div className="absolute h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                    <div className="h-12 w-12 animate-pulse rounded-full bg-blue-600/20"></div>
                </div>
            </div>
        );
    }

    if (!user && error) {
        return (
            <div className="max-w-2xl mx-auto p-6">
                <p className="text-red-500">{error}</p>
                <Button onClick={() => router.push("/login")} className="mt-4">
                    Go to Login
                </Button>
            </div>
        );
    }

    return (
        <>
            <Navbar1 />
            <div className="bg-background text-foreground min-h-screen items-center justify-center flex flex-col bg-gradient-to-b from-white to-gray-100 dark:from-[#1E1E2F] dark:to-[#0e0e15]">
                <div className="max-w-2xl w-full px-6">
                    <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-6">
                        Account <span className="text-black dark:text-white"> Settings</span>
                    </h1>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    {success && <p className="text-green-500 mb-4">{success}</p>}
                    <form className="space-y-6">
                        {/* Personal Information */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Personal Information</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-gray-700 dark:text-gray-300">First Name</Label>
                                    <Input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        placeholder="First Name"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label className="text-gray-700 dark:text-gray-300">Last Name</Label>
                                    <Input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        placeholder="Last Name"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label className="text-gray-700 dark:text-gray-300">Email Address</Label>
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="email@example.com"
                                        disabled
                                    />
                                    <p className="text-sm text-gray-500 mt-1">Contact support to change email.</p>
                                </div>
                                <div>
                                    <Label className="text-gray-700 dark:text-gray-300">Phone</Label>
                                    <Input
                                        type="text"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="+254722991133"
                                    />
                                </div>
                                <div className="col-span-1 sm:col-span-2">
                                    <Label className="text-gray-700 dark:text-gray-300">Bio</Label>
                                    <Input
                                        type="text"
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        placeholder="Your role or bio"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-4">
                            
                            <Button
                                asChild
                                onClick={handleSave}
                                className={`bg-white text-blue-600 border border-blue-600 dark:border-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-600 hover:text-white dark:bg-gray-900 dark:text-white dark:hover:bg-blue-600 dark:hover:text-white ${ isSubmitted ? 'opacity-50 cursor-not-allowed' : '' } `}
                            >
                                <button type="button" disabled={isSubmitted}>
                                    Save Changes
                                </button>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
}
