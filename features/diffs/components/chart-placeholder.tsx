import { IconChartLine, type Icon } from "@tabler/icons-react";

import { Skeleton } from "@/components/ui/skeleton";

type ChartPlaceholderProps = {
  icon?: Icon;
  title: string;
  subtitle?: string;
};

export const ChartPlaceholder = ({
  icon: Icon = IconChartLine,
  title,
  subtitle,
}: ChartPlaceholderProps) => {
  return (
    <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed">
      <div className="text-center text-muted-foreground">
        {Icon ? (
          <Icon className="mx-auto mb-2 size-8" />
        ) : (
          <Skeleton className="mx-auto mb-2 size-8" />
        )}
        <p className="text-sm">{title}</p>
        {subtitle && <p className="text-xs">{subtitle}</p>}
      </div>
    </div>
  );
};
