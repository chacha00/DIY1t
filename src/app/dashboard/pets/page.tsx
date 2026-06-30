import { PawPrint } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export default function PetsPage() {
  return (
    <ComingSoon
      icon={PawPrint}
      title="Pet Profiles"
      description="Save unlimited pet profiles with measurements for pet-related DIY projects."
    />
  );
}
