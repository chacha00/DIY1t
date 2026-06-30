import Link from "next/link";
import { Mail, SendHorizonal } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Input, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { requestPasswordReset } from "./actions";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Reset your password"
      subtitle="We'll email you a link to set a new password."
      footer={
        <Link href="/login" className="font-semibold text-brand-blue-600 hover:underline">
          Back to log in
        </Link>
      }
    >
      <form action={requestPasswordReset} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input id="email" name="email" type="email" required placeholder="you@example.com" className="pl-11" />
          </div>
        </div>

        <Button type="submit" className="w-full">
          <SendHorizonal className="h-4 w-4" />
          Send Reset Link
        </Button>
      </form>
    </AuthShell>
  );
}
