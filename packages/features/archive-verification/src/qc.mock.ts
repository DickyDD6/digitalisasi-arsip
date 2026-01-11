import { ArchiveStatus } from "@repo/domain/archive-status";
import { ArchiveItem } from "./qc.type";

export const mockPendingArchives: ArchiveItem[] = [
	{
		id: "1",
		filename: "transkrip_2020.pdf",
		npm: "203040001",
		prodi: "Teknik Informatika",
		tahun: 2020,
		status: ArchiveStatus.PENDING,
		uploadedAt: "2024-12-01",
	},
	{
		id: "2",
		filename: "nilai_mk_algoritma.pdf",
		npm: "203040002",
		prodi: "Teknik Informatika",
		tahun: 2021,
		status: ArchiveStatus.PENDING,
		uploadedAt: "2024-12-03",
	},
];
