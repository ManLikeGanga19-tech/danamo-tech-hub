import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyIdToken } from "@/lib/firebaseAdmin";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,  
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        token: { label: "Firebase Token", type: "text" },
      },
      async authorize(credentials: { token?: string } | undefined) {
        if (!credentials?.token) return null;

        try {
          const decodedToken = await verifyIdToken(credentials.token);
          return {
            id: decodedToken.uid,
            email: decodedToken.email,
            name: decodedToken.name || null,
          };
        } catch (err) {
          console.error("Token verification failed:", err);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }): Promise<JWT> {
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
      if (token?.user) session.user = token.user;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
