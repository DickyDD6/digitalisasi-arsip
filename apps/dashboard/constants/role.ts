export const ROLE: Record<UserRole, Lowercase<UserRole>> = {
  MANAGER: "manager",
  UPLOADER: "uploader",
  QC: "qc",
  SBAP: "sbap",
} as const;
