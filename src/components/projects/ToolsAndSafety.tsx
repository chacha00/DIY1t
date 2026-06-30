import { Wrench, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { ToolItem } from "@/types/database";

export function ToolsAndSafety({ tools, safetyWarnings }: { tools: ToolItem[]; safetyWarnings: string[] }) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
          <Wrench className="h-4.5 w-4.5 text-brand-blue-500" />
          Required Tools
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {tools.map((tool, i) => (
            <Badge key={i} color={tool.required ? "blue" : "slate"}>
              {tool.name}
              {!tool.required && " (optional)"}
            </Badge>
          ))}
        </div>
      </Card>

      {safetyWarnings.length > 0 && (
        <Card className="border-brand-orange-100 bg-brand-orange-50/40 p-6">
          <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
            <ShieldAlert className="h-4.5 w-4.5 text-brand-orange-500" />
            Safety Warnings
          </h2>
          <ul className="mt-4 space-y-2">
            {safetyWarnings.map((warning, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange-400" />
                {warning}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
