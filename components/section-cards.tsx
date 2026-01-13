import {
  IconAlertTriangle,
  IconCheck,
  IconClock,
  IconFileDescription,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const SectionCards = () => {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Pending Diffs</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            10,600
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconFileDescription className="size-3" />
              Draft + Preview
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            8,420 drafts, 2,180 in preview
          </div>
          <div className="text-muted-foreground">
            Avg age: 142.35 hours
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Pending Conflicts</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            5,840
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-warning-foreground">
              <IconAlertTriangle className="size-3" />
              Needs Review
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            1,240 high priority
          </div>
          <div className="text-muted-foreground">
            Across 1,842 documents
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Conflicts Resolved</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            9,250
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-success-foreground">
              <IconCheck className="size-3" />
              Completed
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            6,950 accepted, 2,300 rejected
          </div>
          <div className="text-muted-foreground">
            75.1% acceptance rate
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Avg Review Time</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            8.45h
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconClock className="size-3" />
              Median: 5.32h
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            8 active reviewers
          </div>
          <div className="text-muted-foreground">
            1,496 reviews this week
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
