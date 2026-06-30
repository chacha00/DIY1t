import { Heart } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export default function SavedPage() {
  return (
    <ComingSoon
      icon={Heart}
      title="Saved Projects"
      description="Collections and saved projects are coming soon."
    />
  );
}
