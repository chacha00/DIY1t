import { MailCheck } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";

export default function CheckEmailPage() {
  return (
    <AuthShell title="Check your inbox" subtitle="">
      <div className="flex flex-col items-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-blue-50">
          <MailCheck className="h-7 w-7 text-brand-blue-500" />
        </span>
        <p className="mt-5 text-sm leading-relaxed text-slate-500">
          If an account exists for that email, we&apos;ve sent a password
          reset link.
        </p>
      </div>
    </AuthShell>
  );
}
