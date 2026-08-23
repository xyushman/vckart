import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/db";

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Email/Password Login",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email.toLowerCase();
        
        // 1. Check if trying to login as ADMIN
        if (email === process.env.ADMIN_EMAIL && credentials.password === process.env.ADMIN_PASSWORD) {
          let admin = await prisma.user.findUnique({ where: { email } });
          if (!admin) {
            admin = await prisma.user.create({
              data: {
                name: "Administrator",
                email: email,
                role: "ADMIN"
              }
            });
          }
          return admin;
        }

        // 2. Check if trying to login as DEMO
        if (email === "demo@vckart.com") {
           let demo = await prisma.user.findUnique({ where: { email } });
           if (!demo) {
             demo = await prisma.user.create({
               data: { name: "Demo User", email: email, role: "DEMO" }
             });
           }
           return demo;
        }

        // 3. Normal User (Mock fallback for MVP)
        // In a real app, hash/verify password against DB here.
        if (email === "test@vckart.com" && credentials.password === "password") {
          let user = await prisma.user.findUnique({ where: { email } });
          if (!user) {
            user = await prisma.user.create({
              data: { name: "Test User", email: email, role: "USER" }
            });
          }
          return user;
        }

        return null;
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    })
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // @ts-ignore
        token.role = user.role;
      } else {
        // Look up the user's latest role from the database to keep token fresh
        if (token.email) {
          const dbUser = await prisma.user.findUnique({ where: { email: token.email }});
          if (dbUser) {
            token.role = dbUser.role;
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        // @ts-ignore
        session.user.id = token.id as string;
        // @ts-ignore
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "default_dev_secret_for_vckart",
});

export { handler as GET, handler as POST };
