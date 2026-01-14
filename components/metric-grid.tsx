import { cn } from "@/lib/utils";

type MetricItem = {
  label: string;
  value: string;
  subtext?: string;
  highlight?: boolean;
};

type MetricGridProps = {
  items: MetricItem[];
  columns?: 3 | 4 | 5;
};

const columnClasses = {
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  5: "md:grid-cols-5",
};

export const MetricGrid = ({ items, columns = 3 }: MetricGridProps) => {
  return (
    <div className={cn("grid grid-cols-2 gap-4", columnClasses[columns])}>
      {items.map((item) => (
        <div
          key={item.label}
          className={cn(
            "rounded-lg border p-4",
            item.highlight && "border-destructive/50"
          )}
        >
          <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
            {item.label}
          </div>
          <div
            className={cn(
              "text-2xl font-semibold tabular-nums",
              item.highlight && "text-destructive"
            )}
          >
            {item.value}
          </div>
          {item.subtext && (
            <div className="text-xs text-muted-foreground">{item.subtext}</div>
          )}
        </div>
      ))}
    </div>
  );
};
