import Stripe from "stripe";

let _stripe: Stripe | null = null;

/** Lazily instantiated so builds/imports don't fail before STRIPE_SECRET_KEY is configured. */
export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
      apiVersion: "2026-06-24.dahlia",
    });
  }
  return _stripe;
}
