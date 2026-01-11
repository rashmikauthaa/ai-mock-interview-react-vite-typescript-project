import type { Interview, UserAnswer } from "@/types";

/**
 * Export interview data as CSV
 */
export const exportToCSV = (data: Interview[] | UserAnswer[], filename: string) => {
  if (data.length === 0) {
    throw new Error("No data to export");
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
        const value = row[header as keyof typeof row];
        // Handle nested objects and arrays
        if (value && typeof value === "object") {
          return JSON.stringify(value).replace(/"/g, '""');
        }
        // Handle dates
        if (value && typeof value === "object" && "toDate" in value) {
          return (value as { toDate: () => Date }).toDate().toISOString();
        }
        return String(value || "").replace(/"/g, '""');
      })
        .map((val) => `"${val}"`)
        .join(",")
    ),
  ].join("\n");

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}_${new Date().toISOString().split("T")[0]}.csv`);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export interview feedback as formatted text
 */
export const exportFeedbackAsText = (
  interview: Interview,
  feedbacks: UserAnswer[]
) => {
  const content = [
    `Interview Report: ${interview.position}`,
    `Generated: ${new Date().toLocaleDateString()}`,
    "",
    "=".repeat(50),
    "",
    `Position: ${interview.position}`,
    `Description: ${interview.description}`,
    `Experience Required: ${interview.experience} years`,
    `Tech Stack: ${interview.techStack}`,
    "",
    "=".repeat(50),
    "",
    "FEEDBACK SUMMARY",
    "=".repeat(50),
    "",
    ...feedbacks.map((feedback, index) => [
      `Question ${index + 1}:`,
      feedback.question,
      "",
      "Your Answer:",
      feedback.user_ans,
      "",
      "Correct Answer:",
      feedback.correct_ans,
      "",
      `Rating: ${feedback.rating}/10`,
      "",
      "Feedback:",
      feedback.feedback,
      "",
      "-".repeat(50),
      "",
    ]),
    "",
    `Average Rating: ${(
      feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length
    ).toFixed(1)}/10`,
  ]
    .flat()
    .join("\n");

  const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `Interview_Feedback_${interview.position.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.txt`
  );
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
