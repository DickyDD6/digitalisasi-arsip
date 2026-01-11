import { Role } from "@repo/domain/role";
import { canAccess } from "@repo/domain/permissions";
import { ArchiveItem } from "./qc.type";
import { mockPendingArchives } from "./qc.mock";
import { ArchiveStatus } from "@repo/domain/archive-status";
import { RejectArchiveSchema } from "./qc.schema";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getPendingArchives = async (
	role: Role,
): Promise<ArchiveItem[]> => {
	if (!canAccess(role, "VIEW")) {
		throw new Error("Unauthorized");
	}

	await delay(300);
	return mockPendingArchives;
};

export const verifyArchive = async (
	role: Role,
	archiveId: string,
): Promise<void> => {
	if (!canAccess(role, "VERIFY", ArchiveStatus.PENDING)) {
		throw new Error("Unauthorized");
	}

	await delay(300);
};

export const rejectArchive = async (
	role: Role,
	archiveId: string,
	input: { note: string },
): Promise<void> => {
	RejectArchiveSchema.parse(input);

	if (!canAccess(role, "REJECT", ArchiveStatus.PENDING)) {
		throw new Error("Unauthorized");
	}

	await delay(300);
};
