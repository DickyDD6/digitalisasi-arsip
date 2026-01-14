export const Roles = {
	MANAGER: "MANAGER",
	UPLOADER: "UPLODAER",
	QC: "QC",
	SBAP: "SBAP",
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];
