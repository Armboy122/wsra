import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";

const prisma = new PrismaClient();

export const AuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "ชื่อครู", type: "text" },
        password: { label: "รหัสผ่าน", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const user = await prisma.teacher.findFirst({
          where: {
            name: credentials.name,
            password: credentials.password,
          },
        });

        if (user) {
          return {
            id: user.id.toString(),
            name: user.name,
            role: user.role,
          };
        } else {
          throw new Error("Invalid password");
        }
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user && 'role' in user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',  // ระบุหน้า login custom
  },
};