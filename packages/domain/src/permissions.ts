import { ArchiveStatus } from "./archive-status";
import { Role } from "./role";

export type ArchiveAction =
  | "UPLOAD"
  | "VIEW"
  | "VERIFY"
  | "REJECT"
  | "DOWNLOAD"
  | "DELETE";

const canQC = (action: ArchiveAction, status?: ArchiveStatus): boolean =>
  action === "VIEW" ||
  ((action === "VERIFY" || action === "REJECT") &&
    status === ArchiveStatus.PENDING);

const canUploader = (action: ArchiveAction, status?: ArchiveStatus): boolean =>
  action === "UPLOAD" ||
  action === "VIEW" ||
  (action === "DELETE" && status === ArchiveStatus.REJECTED);

const canManager = (action: ArchiveAction, status?: ArchiveStatus): boolean =>
  action === "VIEW" ||
  action === "DOWNLOAD" ||
  (action === "DELETE" && status === ArchiveStatus.REJECTED);

const canSBAP = (action: ArchiveAction, status?: ArchiveStatus): boolean =>
  (action === "VIEW" || action === "DOWNLOAD") &&
  status === ArchiveStatus.VERIFIED;

const roleCheckers: Record<
  Role,
  (action: ArchiveAction, status?: ArchiveStatus) => boolean
> = {
  SUPER_ADMIN: () => true,
  MANAGER: canManager,
  QC: canQC,
  UPLOADER: canUploader,
  SBAP: canSBAP,
};

export const canAccess = (
  role: Role,
  action: ArchiveAction,
  status?: ArchiveStatus
): boolean => roleCheckers[role]?.(action, status) ?? false;
