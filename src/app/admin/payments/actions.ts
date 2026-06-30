"use server";

import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";
import type { Profile, Payment } from "@/types/database";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single<Pick<Profile, "role">>();

  if (profile?.role !== "admin" && profile?.role !== "moderator") {
    throw new Error("Forbidden");
  }

  return supabase;
}

export async function refundPayment(paymentId: string) {
  const supabase = await requireAdmin();
  const db = supabase as unknown as SupabaseClient;

  const { data: payment } = await db
    .from("payments")
    .select("stripe_payment_intent_id, status")
    .eq("id", paymentId)
    .single<Pick<Payment, "stripe_payment_intent_id" | "status">>();

  if (!payment?.stripe_payment_intent_id) {
    throw new Error("No payment intent on this payment — cannot refund");
  }
  if (payment.status === "refunded") {
    return;
  }

  await getStripe().refunds.create({ payment_intent: payment.stripe_payment_intent_id });

  await db.from("payments").update({ status: "refunded" }).eq("id", paymentId);

  revalidatePath("/admin/payments");
}
