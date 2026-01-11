import { ArchiveStatus } from "@repo/domain/archive-status";

export interface ArchiveItem {
	id: string;
	filename: string;
	npm: string;
	prodi: string;
	tahun: number;
	status: ArchiveStatus;
	uploadedAt: string;
}
