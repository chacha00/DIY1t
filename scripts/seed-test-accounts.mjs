/**
 * Creates two test accounts with active subscriptions.
 * Run once: node scripts/seed-test-accounts.mjs
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

// Parse .env.local
const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf-8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => l.split("=").map((s) => s.trim()))
);

const supabaseUrl = env["NEXT_PUBLIC_SUPABASE_URL"];
const serviceKey = env["SUPABASE_SERVICE_ROLE_KEY"];

if (!supabaseUrl || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const admin = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const TEST_ACCOUNTS = [
  {
    email: "test-diyplus@diy1t.com",
    password: "TestDIYPlus2024!",
    full_name: "Test DIY+ User",
    plan: "monthly_unlimited",
    label: "DIY+",
  },
  {
    email: "test-makerpro@diy1t.com",
    password: "TestMakerPro2024!",
    full_name: "Test Maker Pro User",
    plan: "annual_unlimited",
    label: "Maker Pro",
  },
];

for (const account of TEST_ACCOUNTS) {
  console.log(`\nCreating ${account.label} test account: ${account.email}`);

  // 1. Create auth user (upsert by deleting first if exists)
  const { data: existingUsers } = await admin.auth.admin.listUsers();
  const existing = existingUsers?.users?.find((u) => u.email === account.email);
  if (existing) {
    console.log(`  ↳ User already exists (${existing.id}), skipping auth creation`);
    var userId = existing.id;
  } else {
    const { data: created, error: authErr } = await admin.auth.admin.createUser({
      email: account.email,
      password: account.password,
      email_confirm: true,
      user_metadata: { full_name: account.full_name },
    });
    if (authErr) { console.error("  ✗ Auth error:", authErr.message); continue; }
    var userId = created.user.id;
    console.log(`  ✓ Auth user created: ${userId}`);
  }

  // 2. Upsert profile
  const { error: profileErr } = await admin
    .from("profiles")
    .upsert({ id: userId, email: account.email, full_name: account.full_name }, { onConflict: "id" });
  if (profileErr) console.warn("  ⚠ Profile upsert:", profileErr.message);
  else console.log("  ✓ Profile upserted");

  // 3. Upsert subscription (mock — no real Stripe subscription)
  const periodEnd = new Date();
  periodEnd.setFullYear(periodEnd.getFullYear() + 1);

  // Delete any existing subscription first, then insert fresh
  await admin.from("subscriptions").delete().eq("user_id", userId);

  const { error: subErr } = await admin
    .from("subscriptions")
    .insert({
      user_id: userId,
      stripe_subscription_id: `test_sub_${account.plan}_${userId.slice(0, 8)}`,
      stripe_customer_id: `test_cus_${userId.slice(0, 8)}`,
      plan: account.plan,
      status: "active",
      current_period_start: new Date().toISOString(),
      current_period_end: periodEnd.toISOString(),
      cancel_at_period_end: false,
    });
  if (subErr) console.error("  ✗ Subscription upsert:", subErr.message);
  else console.log(`  ✓ Subscription set to ${account.plan}`);

  console.log(`  → Login: ${account.email} / ${account.password}`);
}

console.log("\nDone.\n");
