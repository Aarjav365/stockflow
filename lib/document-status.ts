/**
 * Document status values for use in client components.
 * Must match the DocumentStatus enum in Prisma schema.
 */
export const DocumentStatus = {
  Draft: "Draft",
  Waiting: "Waiting",
  Ready: "Ready",
  Done: "Done",
  Canceled: "Canceled",
} as const;

export type DocumentStatusType = (typeof DocumentStatus)[keyof typeof DocumentStatus];
