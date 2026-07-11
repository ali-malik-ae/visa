import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { account, session, user, verification } from "./db/schema";
import { sendPasswordResetEmail } from "./resend";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, session, account, verification },
  }),
  user: {
    additionalFields: {
      role: {
        type: ["consultant", "admin"],
        required: false,
        defaultValue: "consultant",
        input: false, // server-owned — never settable via signup/update requests
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail({
        to: user.email,
        userName: user.name ?? "Team Member",
        resetUrl: url,
      });
    },
  },
  secret: process.env.BETTER_AUTH_SECRET ?? "build-time-placeholder-replace-in-production",
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ],
  rateLimit: {
    enabled: true,
    window: 60,
    max: 60,
    storage: "memory", // single-container deployment — no Redis configured
    customRules: {
      "/sign-in/email": { window: 60, max: 5 },
      "/sign-up/email": { window: 60, max: 3 },
      "/forget-password": { window: 60, max: 3 },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
