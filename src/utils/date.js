import { format, parseISO } from "date-fns";

export function formatDate(value, pattern = "MMM d, yyyy") {
  if (!value) {
    return "Not set";
  }

  const date = typeof value === "string" ? parseISO(value) : value;
  return Number.isNaN(date.getTime()) ? "Invalid date" : format(date, pattern);
}

export function formatDateTime(value) {
  return formatDate(value, "MMM d, yyyy h:mm a");
}
