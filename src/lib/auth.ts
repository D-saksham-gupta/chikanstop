import NextAuth, { type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "./mongodb";
import User from "@/models/User";

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log("Missing credentials");
            return null;
          }

          await dbConnect();

          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            console.log("User not found");
            return null;
          }

          if (!user.password) {
            console.log("User has no password (OAuth user)");
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password,
          );

          if (!isPasswordValid) {
            console.log("Invalid password");
            return null;
          }

          console.log("User authenticated successfully");
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await dbConnect();

        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          const isAdmin = user.email === process.env.ADMIN_EMAIL;

          await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            role: isAdmin ? "admin" : "user",
            emailVerified: new Date(),
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        await dbConnect();
        const dbUser = await User.findOne({ email: user.email });

        if (dbUser) {
          token.id = dbUser._id.toString();
          token.role = dbUser.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/api/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
};

// Export handlers and auth function
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
