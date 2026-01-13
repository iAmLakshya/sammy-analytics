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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Reviewer = {
  rank: number
  reviews: number
  accepted: number
  rejected: number
  corrections: number
  avgTime: string
}

const reviewersData: Reviewer[] = [
  { rank: 1, reviews: 1842, accepted: 1156, rejected: 686, corrections: 89, avgTime: "6.45h" },
  { rank: 2, reviews: 1567, accepted: 982, rejected: 585, corrections: 76, avgTime: "8.12h" },
  { rank: 3, reviews: 1423, accepted: 889, rejected: 534, corrections: 71, avgTime: "9.78h" },
  { rank: 4, reviews: 1289, accepted: 805, rejected: 484, corrections: 62, avgTime: "7.34h" },
  { rank: 5, reviews: 1156, accepted: 723, rejected: 433, corrections: 54, avgTime: "11.23h" },
]

const getRankDisplay = (rank: number) => {
  if (rank === 1) return "🥇"
  if (rank === 2) return "🥈"
  if (rank === 3) return "🥉"
  return `#${rank}`
}

export const ReviewersLeaderboard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Reviewers</CardTitle>
        <CardDescription>
          Most active reviewers in the last 30 days
        </CardDescription>
        <CardAction>
          <Badge variant="outline">Leaderboard</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead className="text-right">Reviews</TableHead>
              <TableHead className="text-right">Accepted</TableHead>
              <TableHead className="text-right">Rejected</TableHead>
              <TableHead className="text-right">Corrections</TableHead>
              <TableHead className="text-right">Avg Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviewersData.map((reviewer) => (
              <TableRow key={reviewer.rank}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{getRankDisplay(reviewer.rank)}</span>
                    <span className="text-muted-foreground">User {reviewer.rank}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium tabular-nums">
                  {reviewer.reviews.toLocaleString()}
                </TableCell>
                <TableCell className="text-right tabular-nums text-success-foreground">
                  {reviewer.accepted.toLocaleString()}
                </TableCell>
                <TableCell className="text-right tabular-nums text-destructive">
                  {reviewer.rejected.toLocaleString()}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {reviewer.corrections}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {reviewer.avgTime}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
