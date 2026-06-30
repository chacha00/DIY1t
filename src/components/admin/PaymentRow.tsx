"use client";

import { useState, useTransition } from "react";
import { Undo2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { refundPayment } from "@/app/admin/payments/actions";

function formatCents(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export interface AdminPaymentRow {
  id: string;
  kind: string;
  status: string;
  amount_cents: number;
  description: string | null;
  created_at: string;
  stripe_payment_intent_id: string | null;
  user_email: string;
}

export function PaymentRow({ payment }: { payment: AdminPaymentRow }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleRefund() {
    setError(null);
    startTransition(async () => {
      try {
        await refundPayment(payment.id);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Refund failed");
      }
    });
  }

  const canRefund = payment.status === "succeeded" && payment.stripe_payment_intent_id;

  return (
    <tr className="border-b border-slate-100 last:border-0">
      <td className="px-4 py-3">
        <p className="text-sm font-semibold text-slate-800">{payment.user_email}</p>
        <p className="text-xs text-slate-400">{payment.description ?? payment.kind}</p>
      </td>
      <td className="px-4 py-3 text-sm font-semibold text-slate-700">{formatCents(payment.amount_cents)}</td>
      <td className="px-4 py-3">
        <Badge color={payment.status === "succeeded" ? "teal" : payment.status === "refunded" ? "orange" : "slate"}>
          {payment.status}
        </Badge>
      </td>
      <td className="px-4 py-3 text-xs text-slate-400">
        {new Date(payment.created_at).toLocaleDateString()}
      </td>
      <td className="px-4 py-3 text-right">
        {canRefund && (
          <Button variant="outline" size="sm" onClick={handleRefund} disabled={isPending}>
            <Undo2 className="h-3.5 w-3.5" />
            Refund
          </Button>
        )}
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </td>
    </tr>
  );
}
