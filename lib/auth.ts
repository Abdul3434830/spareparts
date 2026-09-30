import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { authConfig } from "@/auth.config";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const validated = loginSchema.safeParse(credentials);
          if (!validated.success) {
            return null;
          }

          const { email, password } = validated.data;
          const user = await db.user.findUnique({
            where: { email: email.toLowerCase() },
          });

          if (!user || !user.password) {
            return null;
          }

          const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch) {
            return null;
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            isApproved: user.isApproved,
            phone: user.phone,
          };
        } catch (error) {
          console.error("Auth authorization error:", error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.AUTH_SECRET || "default_care_spare_parts_auth_secret_replace_in_prod",
});
