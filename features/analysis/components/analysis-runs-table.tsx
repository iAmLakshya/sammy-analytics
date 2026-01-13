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

type AnalysisRun = {
  date: string
  totalRuns: number
  withConflicts: number
  detected: number
  avgPerRun: number
}

const analysisData: AnalysisRun[] = [
  { date: "Jan 12", totalRuns: 412, withConflicts: 298, detected: 289, avgPerRun: 0.97 },
  { date: "Jan 11", totalRuns: 234, withConflicts: 167, detected: 156, avgPerRun: 0.93 },
  { date: "Jan 10", totalRuns: 478, withConflicts: 356, detected: 342, avgPerRun: 0.96 },
  { date: "Jan 9", totalRuns: 423, withConflicts: 312, detected: 298, avgPerRun: 0.95 },
  { date: "Jan 8", totalRuns: 567, withConflicts: 428, detected: 412, avgPerRun: 0.96 },
]

export const AnalysisRunsTable = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Conflict Detection Metrics</CardTitle>
        <CardDescription>
          Recent daily breakdown of analysis effectiveness
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Total Runs</TableHead>
              <TableHead className="text-right">With Conflicts</TableHead>
              <TableHead className="text-right">Detected</TableHead>
              <TableHead className="text-right">Avg/Run</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {analysisData.map((row) => (
              <TableRow key={row.date}>
                <TableCell>{row.date}</TableCell>
                <TableCell className="text-right tabular-nums">{row.totalRuns}</TableCell>
                <TableCell className="text-right tabular-nums">{row.withConflicts}</TableCell>
                <TableCell className="text-right tabular-nums">{row.detected}</TableCell>
                <TableCell className="text-right tabular-nums">{row.avgPerRun}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
