import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    _stripe = new Stripe(key);
  }
  return _stripe;
}

export const PRICE_IDS = {
  pro: process.env.STRIPE_PRO_PRICE_ID || "price_pro_placeholder",
  unlimited:
    process.env.STRIPE_UNLIMITED_PRICE_ID || "price_unlimited_placeholder",
} as const;
