import { ArchiveStatus } from "./archive-status";

export const canQCProcess = (status: ArchiveStatus): boolean =>
  status === ArchiveStatus.PENDING;

export const canRejectWithNote = (note?: string): boolean =>
  Boolean(note && note.trim().length > 0);

export const canTransition = (
  from: ArchiveStatus,
  to: ArchiveStatus
): boolean =>
  from === ArchiveStatus.PENDING
    ? to === ArchiveStatus.VERIFIED || to === ArchiveStatus.REJECTED
    : false;
