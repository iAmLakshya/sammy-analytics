import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type WeekdayData = {
  day: string
  reviews: number
  reviewers: number
  avgTime: string
}

const weekdayData: WeekdayData[] = [
  { day: "Monday", reviews: 1456, reviewers: 8, avgTime: "8.67h" },
  { day: "Tuesday", reviews: 1678, reviewers: 8, avgTime: "7.92h" },
  { day: "Wednesday", reviews: 1842, reviewers: 8, avgTime: "9.15h" },
  { day: "Thursday", reviews: 1723, reviewers: 8, avgTime: "8.34h" },
  { day: "Friday", reviews: 1534, reviewers: 7, avgTime: "10.23h" },
  { day: "Saturday", reviews: 289, reviewers: 3, avgTime: "15.67h" },
  { day: "Sunday", reviews: 228, reviewers: 2, avgTime: "18.45h" },
]

const maxReviews = Math.max(...weekdayData.map((d) => d.reviews))

export const WeekdayActivity = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity by Day of Week</CardTitle>
        <CardDescription>
          Review patterns across the week
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Day</TableHead>
              <TableHead className="text-right">Reviews</TableHead>
              <TableHead className="text-right">Reviewers</TableHead>
              <TableHead className="text-right">Avg Time</TableHead>
              <TableHead>Activity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {weekdayData.map((day) => (
              <TableRow key={day.day}>
                <TableCell className="font-medium">{day.day}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {day.reviews.toLocaleString()}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {day.reviewers}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {day.avgTime}
                </TableCell>
                <TableCell>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${(day.reviews / maxReviews) * 100}%` }}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
