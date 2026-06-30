import { MailCheck } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";

export default function CheckEmailPage() {
  return (
    <AuthShell title="Check your inbox" subtitle="">
      <div className="flex flex-col items-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-teal-50">
          <MailCheck className="h-7 w-7 text-brand-teal-500" />
        </span>
        <p className="mt-5 text-sm leading-relaxed text-slate-500">
          We sent you a confirmation link. Click it to activate your account
          and claim your 3 free DIY projects.
        </p>
      </div>
    </AuthShell>
  );
}
