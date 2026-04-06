import Database, { type Database as DatabaseType } from "better-sqlite3";
import path from "path";

let _db: DatabaseType | null = null;

function getDb(): DatabaseType {
  if (!_db) {
    const DB_PATH = path.join(process.cwd(), "contentmill.db");
    _db = new Database(DB_PATH);
    _db.pragma("journal_mode = WAL");
    _db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT,
        plan TEXT DEFAULT 'free' CHECK(plan IN ('free', 'pro', 'unlimited')),
        stripe_customer_id TEXT,
        stripe_subscription_id TEXT,
        usage_count INTEGER DEFAULT 0,
        usage_reset_date TEXT DEFAULT (date('now', 'start of month', '+1 month')),
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      );
    `);
  }
  return _db;
}

export const queries = {
  getUserByEmail: (email: string) =>
    getDb().prepare("SELECT * FROM users WHERE email = ?").get(email),
  getUserById: (id: number) =>
    getDb().prepare("SELECT * FROM users WHERE id = ?").get(id),
  createUser: (email: string, passwordHash: string, name: string | null) =>
    getDb().prepare("INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)").run(email, passwordHash, name),
  updateUserPlan: (plan: string, stripeCustomerId: string | null, stripeSubId: string | null, userId: number) =>
    getDb().prepare("UPDATE users SET plan = ?, stripe_customer_id = ?, stripe_subscription_id = ?, updated_at = datetime('now') WHERE id = ?").run(plan, stripeCustomerId, stripeSubId, userId),
  incrementUsage: (userId: number) =>
    getDb().prepare("UPDATE users SET usage_count = usage_count + 1, updated_at = datetime('now') WHERE id = ?").run(userId),
  resetUsage: (userId: number) =>
    getDb().prepare("UPDATE users SET usage_count = 0, usage_reset_date = date('now', 'start of month', '+1 month'), updated_at = datetime('now') WHERE id = ?").run(userId),
  getUserByStripeCustomer: (customerId: string) =>
    getDb().prepare("SELECT * FROM users WHERE stripe_customer_id = ?").get(customerId),
};

export interface User {
  id: number;
  email: string;
  password_hash: string;
  name: string | null;
  plan: "free" | "pro" | "unlimited";
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  usage_count: number;
  usage_reset_date: string;
  created_at: string;
  updated_at: string;
}

export const PLAN_LIMITS = {
  free: 3,
  pro: 50,
  unlimited: Infinity,
} as const;

export default getDb;
