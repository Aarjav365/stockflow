import { faker } from "@faker-js/faker";

export type Task = {
  id: string;
  code: string;
  title: string;
  status: "todo" | "in-progress" | "done" | "cancelled";
  label: "bug" | "feature" | "documentation";
  priority: "low" | "medium" | "high";
};

export const statuses = [
  { value: "todo", label: "Todo" },
  { value: "in-progress", label: "In Progress" },
  { value: "done", label: "Done" },
  { value: "cancelled", label: "Cancelled" },
] as const;

export const labels = [
  { value: "bug", label: "Bug" },
  { value: "feature", label: "Feature" },
  { value: "documentation", label: "Documentation" },
] as const;

export const priorities = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
] as const;

export function generateTasks(count: number): Task[] {
  return Array.from({ length: count }, (_, i) => ({
    id: faker.string.uuid(),
    code: `TASK-${(i + 1).toString().padStart(4, "0")}`,
    title: faker.hacker.phrase().replace(/^./, (l) => l.toUpperCase()),
    status: faker.helpers.arrayElement(["todo", "in-progress", "done", "cancelled"]) as Task["status"],
    label: faker.helpers.arrayElement(["bug", "feature", "documentation"]) as Task["label"],
    priority: faker.helpers.arrayElement(["low", "medium", "high"]) as Task["priority"],
  }));
}

export const tasks = generateTasks(100);
