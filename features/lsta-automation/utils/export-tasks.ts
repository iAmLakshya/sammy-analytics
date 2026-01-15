import type { LstaTask } from "../types";

export const exportTasksToCsv = (tasks: LstaTask[], filename?: string) => {
  const headers = [
    "Company ID",
    "LE ID",
    "Certificate",
    "Special Case",
    "Submitted",
    "Status",
    "Created At",
  ];

  const rows = tasks.map((task) => [
    task.companyId,
    task.leId,
    task.certificate ?? "",
    task.specialCase ? "Yes" : "No",
    task.submitted ? "Yes" : "No",
    task.status,
    task.createdAt,
  ]);

  const csv = [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download =
    filename ?? `lsta-tasks-${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};
