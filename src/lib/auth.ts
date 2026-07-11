import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { db } from "./db";
import { account, session, user, verification } from "./db/schema";
import { sendPasswordResetEmail } from "./resend";
import { isAuthorizedStaffEmail } from "./staff-email";

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
      status: {
        type: ["pending", "active", "banned"],
        required: false,
        defaultValue: "pending", // new self-service signups need admin approval
        input: false,
      },
      email_alerts: {
        type: "boolean",
        required: false,
        defaultValue: true,
        input: true, // self-service preference, not a privilege — user-settable
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    // New accounts start "pending" and can't sign in yet — don't hand out a
    // session at signup time, or a pending account would get dashboard access
    // via the signup response before ever reaching the sign-in status check.
    autoSignIn: false,
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail({
        to: user.email,
        userName: user.name ?? "Team Member",
        resetUrl: url,
      });
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const email = ctx.body?.email as string | undefined;
        if (!email || !isAuthorizedStaffEmail(email)) {
          throw new APIError("BAD_REQUEST", {
            message: "Please use your @visati.ae work email to sign up.",
          });
        }
        return;
      }

      if (ctx.path === "/sign-in/email") {
        const email = ctx.body?.email as string | undefined;
        if (!email) return;
        const existing = await ctx.context.internalAdapter.findUserByEmail(email);
        const status = (existing?.user as Record<string, unknown> | undefined)?.status;
        if (status === "pending") {
          throw new APIError("FORBIDDEN", {
            message: "Your account is pending admin approval.",
          });
        }
        if (status === "banned") {
          throw new APIError("FORBIDDEN", {
            message: "Your account has been banned. Contact your administrator.",
          });
        }
      }
    }),
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
