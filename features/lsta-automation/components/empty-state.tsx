import type { Icon } from "@tabler/icons-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: Icon;
  title: string;
  description: string;
  action?: ReactNode;
  variant?: "default" | "compact";
}

export const EmptyState = ({
  icon: IconComponent,
  title,
  description,
  action,
  variant = "default",
}: EmptyStateProps) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-lg border border-dashed",
        variant === "default" ? "h-64" : "h-32"
      )}
    >
      <div className="max-w-md px-4 text-center">
        <IconComponent className="mx-auto mb-3 size-8 text-muted-foreground" />
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        {action && <div className="mt-4">{action}</div>}
      </div>
    </div>
  );
};
