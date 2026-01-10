export enum ArchiveStatus {
  DRAFT = "DRAFT",
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
  REJECTED = "REJECTED",
}

export const ArchiveTransition: Record<ArchiveStatus, ArchiveStatus[]> = {
  DRAFT: [ArchiveStatus.PENDING],
  PENDING: [ArchiveStatus.VERIFIED, ArchiveStatus.REJECTED],
  VERIFIED: [],
  REJECTED: [],
};
