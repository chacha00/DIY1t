import { Lock, KeyRound } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Input, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { updatePassword } from "./actions";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <AuthShell title="Set a new password" subtitle="Choose a strong password for your account.">
      {error && (
        <div className="mb-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form action={updatePassword} className="space-y-4">
        <div>
          <Label htmlFor="password">New Password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              placeholder="At least 8 characters"
              className="pl-11"
            />
          </div>
        </div>

        <Button type="submit" className="w-full">
          <KeyRound className="h-4 w-4" />
          Update Password
        </Button>
      </form>
    </AuthShell>
  );
}
