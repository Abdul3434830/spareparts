import type { NextAuthConfig } from "next-auth";

type Role = "CUSTOMER" | "WHOLESALE" | "ADMIN";

export const authConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isApproved = user.isApproved;
        token.phone = user.phone;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = (token.id as string) || (token.sub as string);
        session.user.role = (token.role as Role) || Role.CUSTOMER;
        session.user.isApproved = (token.isApproved as boolean) || false;
        session.user.phone = (token.phone as string) || null;
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
