import { Settings } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export default function SettingsPage() {
  return (
    <ComingSoon
      icon={Settings}
      title="Settings"
      description="Profile, notification preferences, and account settings are coming soon."
    />
  );
}
