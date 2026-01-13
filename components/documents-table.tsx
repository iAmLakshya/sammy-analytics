import { Badge } from "@/components/ui/badge"
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

type DocumentData = {
  title: string
  analysisRuns: number
  totalConflicts: number
  pendingConflicts: number
  acceptedConflicts: number
  rejectedConflicts: number
}

const documentsData: DocumentData[] = [
  {
    title: "End of year: Important dates and EOY guidance",
    analysisRuns: 378,
    totalConflicts: 921,
    pendingConflicts: 356,
    acceptedConflicts: 423,
    rejectedConflicts: 142,
  },
  {
    title: "Check your company's Secretary of State status",
    analysisRuns: 102,
    totalConflicts: 618,
    pendingConflicts: 234,
    acceptedConflicts: 289,
    rejectedConflicts: 95,
  },
  {
    title: "Dismiss and rehire US employees (for admins)",
    analysisRuns: 182,
    totalConflicts: 540,
    pendingConflicts: 198,
    acceptedConflicts: 256,
    rejectedConflicts: 86,
  },
  {
    title: "Dismiss and rehire employees",
    analysisRuns: 122,
    totalConflicts: 400,
    pendingConflicts: 145,
    acceptedConflicts: 189,
    rejectedConflicts: 66,
  },
  {
    title: "Run a dismissal payroll",
    analysisRuns: 112,
    totalConflicts: 384,
    pendingConflicts: 142,
    acceptedConflicts: 178,
    rejectedConflicts: 64,
  },
]

export const DocumentsTable = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents With Most Updates</CardTitle>
        <CardDescription>
          Top documents by conflict activity in the last 30 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document</TableHead>
              <TableHead className="text-right">Analysis Runs</TableHead>
              <TableHead className="text-right">Total Conflicts</TableHead>
              <TableHead className="text-right">Pending</TableHead>
              <TableHead className="text-right">Accepted</TableHead>
              <TableHead className="text-right">Rejected</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documentsData.map((doc) => (
              <TableRow key={doc.title}>
                <TableCell className="max-w-[300px] truncate font-medium">
                  {doc.title}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {doc.analysisRuns}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {doc.totalConflicts}
                </TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant="outline"
                    className="tabular-nums text-warning-foreground"
                  >
                    {doc.pendingConflicts}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant="outline"
                    className="tabular-nums text-success-foreground"
                  >
                    {doc.acceptedConflicts}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant="outline"
                    className="tabular-nums text-destructive"
                  >
                    {doc.rejectedConflicts}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
