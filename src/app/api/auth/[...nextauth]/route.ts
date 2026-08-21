import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
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
    })
  ],
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
