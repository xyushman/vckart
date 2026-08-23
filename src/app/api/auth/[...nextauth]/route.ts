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
      name: "Mock Login",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "testuser" },
      },
      async authorize(credentials) {
        // In a real SaaS, you would hash/verify passwords here.
        // For this immediate MVP-to-SaaS transition step, we mock a successful auth.
        
        let user = await prisma.user.findFirst({
          where: { email: 'test@vckart.com' }
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              name: "John Doe",
              email: "test@vckart.com",
            }
          });
        }

        return user;
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
    signIn: '/auth/signin',
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        // @ts-ignore
        session.user.id = token.sub;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "default_dev_secret_for_vckart",
});

export { handler as GET, handler as POST };
