import NextAuth, { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { Client, Account, Databases, ID } from "appwrite";

// Define Google profile interface
interface GoogleProfile {
  email?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
}

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const account = new Account(client);
const databases = new Databases(client);

const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Appwrite Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "your-email@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          await account.createEmailPasswordSession(credentials.email, credentials.password);
          const user = await account.get();
          return {
            id: user.$id,
            email: user.email,
            name: user.name || null,
          };
        } catch (error) {
          console.error("Appwrite login error:", error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ account: providerAccount, profile }) {
      if (providerAccount?.provider === "google") {
        try {
          const email = (profile as GoogleProfile)?.email;
          const name = (profile as GoogleProfile)?.name || "";

          if (!email) {
            console.error("Google sign-in error: Missing email in profile");
            return false;
          }

          // Try to get current session — if exists, do nothing
          try {
            await account.get();
          } catch {
            // User doesn't exist in Appwrite — try to create
            try {
              await account.create(ID.unique(), email, ID.unique(), name);
              console.log("New Appwrite user created for Google login:", email);
            } catch (err: unknown) {
              if (err instanceof Error && "code" in err && err.code === 409) {
                console.log("Appwrite user already exists, skipping creation.");
              } else {
                console.error("Failed to create Appwrite user:", err);
                return false;
              }
            }


            // Create a basic user_profiles doc (safe, non-blocking)
            try {
              await databases.createDocument(
                "6840196a001ea51cd944",
                "68482e0c00163d490722",
                ID.unique(),
                {
                  userId: email,
                  firstName: (profile as GoogleProfile)?.given_name || "",
                  lastName: (profile as GoogleProfile)?.family_name || "",
                  profileSetup: false,
                  hasSeenGreeting: false,
                }
              );
            } catch (err) {
              console.warn("Optional: failed to create user_profiles doc:", err);
            }
          }

          return true;
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error("Google sign-in error:", {
              message: error.message,
              stack: error.stack,
            });
          } else {
            console.error("Google sign-in error:", error);
          }
          return false;
        }

      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }) {
      if (token?.user) {
        session.user = token.user as User;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // Optional: custom login page
    error: "/login",  // Optional: redirect error back to login
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
