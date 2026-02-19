export const ROLE = {
  MANAGER: "manager",
  UPLOADER: "uploader",
  QC: "qc",
  SBAP: "sbap",
} as const;

export type Role = (typeof ROLE)[keyof typeof ROLE];
