"use client";

import { useState, useEffect } from "react";
import { Account, OAuthProvider } from "appwrite";
import { Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { appwriteClient } from "@/lib/appwriteServices";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);

  const account = new Account(appwriteClient);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        await account.get();
        router.push("/");
      } catch {
        setLoading(false);
      }
    };
    checkSession();
  }, [account, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      try {
        await account.deleteSession("current");
      } catch {
        // Ignore if no session exists
      }
      await account.createEmailPasswordSession(email, password);
      router.push("/");
    } catch (err: unknown) {
      console.error("Appwrite login error:", err);
      const errorMessage = err instanceof Error ? err.message : "Login failed.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = (provider: OAuthProvider) => {
    console.log("NEXT_PUBLIC_APP_URL:", process.env.NEXT_PUBLIC_APP_URL);
    account.createOAuth2Session(
      provider,
      `${process.env.NEXT_PUBLIC_APP_URL}/`, // Note: This should be updated to /api/appwrite/callback as per previous fix
      `${process.env.NEXT_PUBLIC_APP_URL}/login`
    );
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

  return (
    <section className="min-h-screen w-full flex flex-col md:flex-row transition-colors duration-700 bg-gradient-to-b from-gray-100 to-white dark:from-[#0e0e15] dark:to-[#1E1E2F]">
      <div className="w-full md:w-1/2 flex justify-center items-center p-6">
        <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-2xl border border-blue-400 bg-gradient-to-b from-gray-100 to-white dark:from-[#0e0e15] dark:to-[#1E1E2F]">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-blue-600 dark:text-white mb-2">
              Wel<span className="text-black dark:text-blue-400">come</span>
            </h2>
            <p className="text-black dark:text-gray-300 text-sm">Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
              <p className="text-red-600 text-sm flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Email</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <input
                  type="email"
                  className="pl-10 w-full py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Password</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="pl-10 w-full py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="***"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                          clipRule="evenodd"
                        />
                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <Button
              asChild
              className="w-full bg-white text-blue-600 border border-blue-600 dark:border-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-600 hover:text-white dark:bg-gray-900 dark:text-white dark:hover:bg-blue-600 dark:hover:text-white"
            >
              <button type="submit" disabled={loading}>
                Sign In
              </button>
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-300 text-sm">Or sign in with</p>
          </div>

          <div className="mt-3 space-y-3">
            <Button
              asChild
              className="w-full bg-white text-blue-600 border border-blue-600 dark:border-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-600 hover:text-white dark:bg-gray-900 dark:text-white dark:hover:bg-blue-600 dark:hover:text-white"
            >
              <button
                onClick={() => handleOAuthLogin(OAuthProvider.Google)}
                disabled={loading}
                aria-label="Sign in with Google"
              >
                <svg className="h-5 w-5 mx-auto" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032 s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2 C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.854h-9.426V10.239z" />
                </svg>
              </button>
            </Button>

            <Button
              asChild
              className="w-full bg-white text-blue-600 border border-blue-600 dark:border-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-600 hover:text-white dark:bg-gray-900 dark:text-white dark:hover:bg-blue-600 dark:hover:text-white"
            >
              <button
                onClick={() => handleOAuthLogin(OAuthProvider.Facebook)}
                disabled={loading}
                aria-label="Sign in with Facebook"
              >
                <svg className="h-5 w-5 mx-auto" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
            </Button>
          </div>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600 dark:text-gray-300">
              Don&apos;t have an account?{" "}
              <a href="/signup" className="font-medium text-blue-600 hover:text-blue-400">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="hidden md:block w-full md:w-1/2 relative">
        <Image src="/signin-img.jpg" alt="Sign in" fill className="object-cover" priority />
      </div>
    </section>
  );
}