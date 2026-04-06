import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { queries, User } from "./db";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        action: { label: "Action", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        const { email, password, name, action } = credentials;

        if (action === "signup") {
          const existing = queries.getUserByEmail(email) as User | undefined;
          if (existing) {
            throw new Error("Email already registered");
          }

          const hash = await bcrypt.hash(password, 12);
          const result = queries.createUser(email, hash, name || null);
          const user = queries.getUserById(
            result.lastInsertRowid as number
          ) as User;

          return { id: String(user.id), email: user.email, name: user.name };
        }

        // Login
        const user = queries.getUserByEmail(email) as User | undefined;
        if (!user) {
          throw new Error("No account found with this email");
        }

        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) {
          throw new Error("Invalid password");
        }

        return { id: String(user.id), email: user.email, name: user.name };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET || "dev-secret-change-in-production",
};
