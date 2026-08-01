import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import type { Profile, Subscription } from "@/types/database";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: profile }, { data: subscription }, { data: monthProjects }] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, email, avatar_url, credits_balance, total_projects")
      .eq("id", user.id)
      .single<Pick<Profile, "full_name" | "email" | "avatar_url" | "credits_balance" | "total_projects">>(),
    supabase
      .from("subscriptions")
      .select("plan, status")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle<Pick<Subscription, "plan" | "status">>(),
    // Count projects created this calendar month
    supabase
      .from("projects")
      .select("id")
      .eq("user_id", user.id)
      .gte("created_at", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
  ]);

  const plan = subscription?.plan ?? "free";
  const creditsLeft = profile?.credits_balance ?? 0;
  const monthlyLimit = 3;
  const usedThisMonth = monthProjects?.length ?? 0;
  const totalProjects = profile?.total_projects ?? 0;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        plan={plan}
        creditsLeft={creditsLeft}
        usedThisMonth={usedThisMonth}
        monthlyLimit={monthlyLimit}
        totalProjects={totalProjects}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          name={profile?.full_name ?? ""}
          email={profile?.email ?? user.email ?? ""}
          avatarUrl={profile?.avatar_url}
        />
        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
