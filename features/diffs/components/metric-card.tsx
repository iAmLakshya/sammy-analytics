import { type Icon } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

type BadgeVariant = "default" | "success" | "warning" | "destructive"

type MetricCardProps = {
  label: string
  value: string
  badge?: string
  badgeVariant?: BadgeVariant
  description: string
  icon?: Icon
}

const badgeStyles: Record<BadgeVariant, string> = {
  default: "text-muted-foreground",
  success: "text-success-foreground",
  warning: "text-warning-foreground",
  destructive: "text-destructive",
}

export const MetricCard = ({
  label,
  value,
  badge,
  badgeVariant = "default",
  description,
  icon: Icon,
}: MetricCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="flex items-center gap-2 text-3xl tabular-nums">
          {value}
          {badge && (
            <Badge
              variant="outline"
              className={cn("text-xs", badgeStyles[badgeVariant])}
            >
              {badge}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardFooter className="text-xs text-muted-foreground">
        {Icon && <Icon className="mr-1 size-3" />}
        {description}
      </CardFooter>
    </Card>
  )
}
