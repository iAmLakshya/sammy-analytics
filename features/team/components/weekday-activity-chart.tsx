"use client"

import { useMemo } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Cell,
  ReferenceLine,
} from "recharts"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"

import type { WeekdayActivity } from "../types"

const chartConfig = {
  reviews_completed: {
    label: "Reviews",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

interface WeekdayActivityChartProps {
  data: WeekdayActivity[]
  isLoading?: boolean
}

export const WeekdayActivityChart = ({
  data,
  isLoading,
}: WeekdayActivityChartProps) => {
  // Sort by day_number to ensure correct order (Mon-Sun)
  const chartData = useMemo(() => {
    const sorted = [...data].sort((a, b) => {
      // Adjust Sunday (0) to be last
      const aNum = a.day_number === 0 ? 7 : a.day_number
      const bNum = b.day_number === 0 ? 7 : b.day_number
      return aNum - bNum
    })
    return sorted.map((day) => ({
      ...day,
      day: day.day_of_week.slice(0, 3), // Mon, Tue, etc.
      isWeekend: day.day_number === 0 || day.day_number === 6,
    }))
  }, [data])

  const avgReviews = useMemo(() => {
    const total = data.reduce((acc, d) => acc + d.reviews_completed, 0)
    return Math.round(total / data.length)
  }, [data])

  const weekdayAvg = useMemo(() => {
    const weekdayData = data.filter(
      (d) => d.day_number !== 0 && d.day_number !== 6
    )
    const total = weekdayData.reduce((acc, d) => acc + d.reviews_completed, 0)
    return Math.round(total / weekdayData.length)
  }, [data])

  const weekendDrop = useMemo(() => {
    const weekendData = data.filter(
      (d) => d.day_number === 0 || d.day_number === 6
    )
    const weekendAvg =
      weekendData.reduce((acc, d) => acc + d.reviews_completed, 0) /
      weekendData.length
    return Math.round(((weekdayAvg - weekendAvg) / weekdayAvg) * 100)
  }, [data, weekdayAvg])

  const peakDay = useMemo(() => {
    return data.reduce(
      (max, day) =>
        day.reviews_completed > max.reviews_completed ? day : max,
      data[0]
    )
  }, [data])

  if (isLoading) {
    return <WeekdayActivityChartSkeleton />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity by Day of Week</CardTitle>
        <CardDescription>
          Review patterns across the week showing peak days and weekend coverage
        </CardDescription>
        <CardAction>
          <Badge variant="outline">
            {weekendDrop}% weekend drop
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip
              cursor={{ fill: "var(--muted)", opacity: 0.3 }}
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => {
                    if (payload && payload.length > 0) {
                      return payload[0].payload.day_of_week
                    }
                    return ""
                  }}
                  formatter={(value, name, item) => {
                    const payload = item.payload
                    return (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between gap-4">
                          <span>Reviews</span>
                          <span className="font-medium tabular-nums">
                            {Number(value).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4 text-muted-foreground">
                          <span>Reviewers</span>
                          <span className="font-medium tabular-nums">
                            {payload.unique_reviewers}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4 text-muted-foreground">
                          <span>Avg Time</span>
                          <span className="font-medium tabular-nums">
                            {payload.avg_review_time_hours}h
                          </span>
                        </div>
                      </div>
                    )
                  }}
                />
              }
            />
            <ReferenceLine
              y={avgReviews}
              stroke="var(--muted-foreground)"
              strokeDasharray="3 3"
              label={{
                value: `Avg: ${avgReviews}`,
                position: "insideTopRight",
                fill: "var(--muted-foreground)",
                fontSize: 12,
              }}
            />
            <Bar dataKey="reviews_completed" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.isWeekend
                      ? "hsl(var(--chart-5))"
                      : entry.day_of_week === peakDay?.day_of_week
                        ? "hsl(var(--chart-3))"
                        : "hsl(var(--chart-2))"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-chart-3" />
            <span className="text-muted-foreground">Peak Day:</span>
            <span className="font-medium">{peakDay?.day_of_week}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-chart-2" />
            <span className="text-muted-foreground">Weekday Avg:</span>
            <span className="font-medium tabular-nums">
              {weekdayAvg.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-chart-5" />
            <span className="text-muted-foreground">Weekend</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const WeekdayActivityChartSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="mt-2 h-4 w-72" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[280px] w-full" />
      </CardContent>
    </Card>
  )
}
