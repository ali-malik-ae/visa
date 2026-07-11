import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/* ── Enums ───────────────────────────────────────────── */
export const processingTierEnum = pgEnum("processing_tier", [
  "standard",
  "express",
]);
export const applicationStatusEnum = pgEnum("application_status", [
  "draft",
  "submitted",
  "reviewing",
  "processing",
  "approved",
  "rejected",
]);
export const entryTypeEnum = pgEnum("entry_type", ["single", "multiple"]);
export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "succeeded",
  "failed",
]);

/* ── Visa Types ──────────────────────────────────────── */
export const visaTypes = pgTable("visa_types", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 200 }).notNull(),
  entry_type: entryTypeEnum("entry_type").notNull(),
  duration_days: integer("duration_days").notNull(),
  standard_price_aed: integer("standard_price_aed").notNull(),
  standard_price_usd: integer("standard_price_usd").notNull(),
  has_express: boolean("has_express").notNull().default(true),
  is_active: boolean("is_active").notNull().default(true),
  sort_order: integer("sort_order").notNull().default(0),
  sample_id: varchar("sample_id", { length: 50 }),
  created_at: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* ── Applications ────────────────────────────────────── */
export const applications = pgTable("applications", {
  id: varchar("id", { length: 20 }).primaryKey(),
  visa_type_id: integer("visa_type_id")
    .notNull()
    .references(() => visaTypes.id),
  nationality: varchar("nationality", { length: 100 }).notNull(),
  given_name: varchar("given_name", { length: 200 }).notNull(),
  surname: varchar("surname", { length: 200 }).notNull(),
  passport_number: varchar("passport_number", { length: 50 }).notNull(),
  date_of_birth: varchar("date_of_birth", { length: 10 }).notNull(),
  passport_expiry: varchar("passport_expiry", { length: 10 }).notNull(),
  travel_date: varchar("travel_date", { length: 10 }).notNull(),
  applicant_email: varchar("applicant_email", { length: 255 }),
  processing_tier: processingTierEnum("processing_tier")
    .notNull()
    .default("standard"),
  status: applicationStatusEnum("status").notNull().default("draft"),
  stripe_payment_intent_id: varchar("stripe_payment_intent_id", {
    length: 100,
  }),
  amount_paid_aed: integer("amount_paid_aed"),
  sample_id: varchar("sample_id", { length: 50 }),
  created_at: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* ── Status History (append-only) ───────────────────── */
export const statusHistory = pgTable("status_history", {
  id: serial("id").primaryKey(),
  application_id: varchar("application_id", { length: 20 })
    .notNull()
    .references(() => applications.id),
  status: applicationStatusEnum("status").notNull(),
  note: text("note"),
  changed_by_admin_id: varchar("changed_by_admin_id", { length: 100 }),
  sample_id: varchar("sample_id", { length: 50 }),
  created_at: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* ── Documents ───────────────────────────────────────── */
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  application_id: varchar("application_id", { length: 20 })
    .notNull()
    .references(() => applications.id),
  document_type: varchar("document_type", { length: 100 }).notNull(),
  r2_key: varchar("r2_key", { length: 500 }).notNull(),
  filename: varchar("filename", { length: 255 }).notNull(),
  size_bytes: integer("size_bytes").notNull(),
  sample_id: varchar("sample_id", { length: 50 }),
  uploaded_at: timestamp("uploaded_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* ── Payments ────────────────────────────────────────── */
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  application_id: varchar("application_id", { length: 20 })
    .notNull()
    .references(() => applications.id),
  stripe_payment_intent_id: varchar("stripe_payment_intent_id", {
    length: 100,
  })
    .notNull()
    .unique(),
  amount_aed: integer("amount_aed").notNull(),
  status: paymentStatusEnum("status").notNull().default("pending"),
  sample_id: varchar("sample_id", { length: 50 }),
  created_at: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* ── Auth (BetterAuth) ───────────────────────────────── */
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  role: text("role").notNull().default("consultant"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/* ── Inquiries ───────────────────────────────────────── */
export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  subject: varchar("subject", { length: 300 }).notNull(),
  message: text("message").notNull(),
  resolved: boolean("resolved").notNull().default(false),
  sample_id: varchar("sample_id", { length: 50 }),
  created_at: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* ── Site Settings (singleton row, id=1) ────────────────── */
export const siteSettings = pgTable("site_settings", {
  id: integer("id").primaryKey().default(1),
  show_usd_pricing: boolean("show_usd_pricing").notNull().default(false),
  updated_at: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
