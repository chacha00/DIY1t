import { FolderKanban } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export default function ProjectsPage() {
  return (
    <ComingSoon
      icon={FolderKanban}
      title="Project Library"
      description="Full project browsing, search, and filters are coming soon."
    />
  );
}
