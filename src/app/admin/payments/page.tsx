import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { PaymentRow, type AdminPaymentRow } from "@/components/admin/PaymentRow";

interface RawPaymentRow {
  id: string;
  kind: string;
  status: string;
  amount_cents: number;
  description: string | null;
  created_at: string;
  stripe_payment_intent_id: string | null;
  profiles: { email: string } | null;
}

export default async function AdminPaymentsPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("payments")
    .select("id, kind, status, amount_cents, description, created_at, stripe_payment_intent_id, profiles(email)")
    .order("created_at", { ascending: false })
    .limit(100)
    .returns<RawPaymentRow[]>();

  const payments: AdminPaymentRow[] = (data ?? []).map((p) => ({
    id: p.id,
    kind: p.kind,
    status: p.status,
    amount_cents: p.amount_cents,
    description: p.description,
    created_at: p.created_at,
    stripe_payment_intent_id: p.stripe_payment_intent_id,
    user_email: p.profiles?.email ?? "Unknown",
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Payments</h1>
        <p className="mt-1 text-sm text-slate-500">{payments.length} payments shown</p>
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[700px] text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? (
              payments.map((p) => <PaymentRow key={p.id} payment={p} />)
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-400">
                  No payments yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
