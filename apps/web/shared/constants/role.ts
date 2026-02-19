export const ROLE = {
	MANAGER: "MANAGER",
	UPLOADER: "UPLOADER",
	QC: "QC",
	SBAP: "SBAP",
} as const;

export type Role = (typeof ROLE)[keyof typeof ROLE];
