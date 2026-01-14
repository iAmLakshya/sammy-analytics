import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type PriorityLevel = {
  name: string;
  count: number;
  pending: number;
  colorClass: string;
  percentage: number;
};

const priorities: PriorityLevel[] = [
  {
    name: "High Priority",
    count: 2850,
    pending: 1240,
    colorClass: "bg-destructive",
    percentage: 19,
  },
  {
    name: "Medium Priority",
    count: 6420,
    pending: 2580,
    colorClass: "bg-warning",
    percentage: 42,
  },
  {
    name: "Low Priority",
    count: 5820,
    pending: 2020,
    colorClass: "bg-info",
    percentage: 39,
  },
];

export const PriorityBreakdown = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Conflicts by Priority</CardTitle>
        <CardDescription>
          Distribution across high, medium, and low priority
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {priorities.map((priority) => (
            <div key={priority.name}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`size-3 rounded-full ${priority.colorClass}`}
                  />
                  <span className="text-sm font-medium">{priority.name}</span>
                </div>
                <span className="text-sm tabular-nums text-muted-foreground">
                  {priority.count.toLocaleString()} (
                  {priority.pending.toLocaleString()} pending)
                </span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full ${priority.colorClass}`}
                  style={{ width: `${priority.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
