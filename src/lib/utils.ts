import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function getInitials(name: string): string {
  if (!name) return "??"
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "todo":
      return "bg-[#58a6ff]"
    case "in_progress":
      return "bg-[#d29922]"
    case "done":
      return "bg-[#3fb950]"
    default:
      return "bg-[#8b949e]"
  }
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case "high":
      return "bg-[#f85149]"
    case "medium":
      return "bg-[#d29922]"
    case "low":
      return "bg-[#3fb950]"
    default:
      return "bg-[#8b949e]"
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case "todo":
      return "To Do"
    case "in_progress":
      return "In Progress"
    case "done":
      return "Done"
    default:
      return status
  }
}

export function getPriorityLabel(priority: string): string {
  switch (priority) {
    case "high":
      return "High"
    case "medium":
      return "Medium"
    case "low":
      return "Low"
    default:
      return priority
  }
}

export function calculateProjectProgress(completedTasks: number, totalTasks: number): number {
  if (totalTasks === 0) return 0
  return Math.round((completedTasks / totalTasks) * 100)
}

export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength) + "..."
}

export function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}
