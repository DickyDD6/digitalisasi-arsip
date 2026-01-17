export const DocumentStatus = {
	VERIFIED: "VERIFIED",
	REJECTED: "REJECTED",
	PENDING: "PENDING",
	DELETED: "DELETED",
	DOWNLOADED: "DOWNLOADED",
	UPLOADED: "UPLOADED",
} as const;

export type DocumentStatus =
	(typeof DocumentStatus)[keyof typeof DocumentStatus];
