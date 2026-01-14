"use client";

import {
  IconCheck,
  IconList,
  IconPlayerPlay,
  IconX,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const mockKpiData = {
  totalTasks: 1247,
  runningTasks: 3,
  completedTasks: 1198,
  failedTasks: 46,
};

export const AutomationKpiCards = () => {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Tasks</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {mockKpiData.totalTasks.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconList className="size-3" />
              All Time
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex items-center gap-2 font-medium">
            Automation tasks processed
          </div>
          <div className="text-muted-foreground">
            Across all workflows
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Running</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {mockKpiData.runningTasks}
          </CardTitle>
          <CardAction>
            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">
              <IconPlayerPlay className="size-3" />
              Active
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex items-center gap-2 font-medium">
            Currently executing
          </div>
          <div className="text-muted-foreground">
            Average runtime: 4.2s
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Completed</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {mockKpiData.completedTasks.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
              <IconCheck className="size-3" />
              Success
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex items-center gap-2 font-medium">
            96.1% success rate
          </div>
          <div className="text-muted-foreground">
            Last 30 days
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Failed</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {mockKpiData.failedTasks}
          </CardTitle>
          <CardAction>
            <Badge className="bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400">
              <IconX className="size-3" />
              Needs Attention
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex items-center gap-2 font-medium">
            12 require manual review
          </div>
          <div className="text-muted-foreground">
            34 auto-retried successfully
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
