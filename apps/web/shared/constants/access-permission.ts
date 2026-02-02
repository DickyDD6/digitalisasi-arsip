import { Role } from ".";

export const ACCESS_PERMISSION: Record<Role, string> = {
	MANAGER: "Full Access",
	QC: "Verification Documents",
	SBAP: "Read-Only",
	UPLOADER: "Upload Documents",
} as const;

export type AccessPermission =
	(typeof ACCESS_PERMISSION)[keyof typeof ACCESS_PERMISSION];
