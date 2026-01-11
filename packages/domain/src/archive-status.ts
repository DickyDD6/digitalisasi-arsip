export enum ArchiveStatus {
	PENDING = "PENDING",
	VERIFIED = "VERIFIED",
	REJECTED = "REJECTED",
}

export const ArchiveTransition: Record<ArchiveStatus, ArchiveStatus[]> = {
	PENDING: [ArchiveStatus.VERIFIED, ArchiveStatus.REJECTED],
	VERIFIED: [],
	REJECTED: [],
};
