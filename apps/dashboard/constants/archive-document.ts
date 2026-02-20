export const ARCHIVE_DOCUMENT_TYPE: Record<
	ArchiveDocumentTypeKey,
	ArchiveDocumentType
> = {
	GRADE: "Nilai",
	CERTIFICATE: "Ijazah",
	TRANSCRIPT: "Transkrip",
	SIDANG: "Berita Acara Sidang",
} as const;

export const ARCHIVE_DOCUMENT_STATUS: Record<
	ArchiveDocumentStatusKey,
	ArchiveDocumentStatus
> = {
	PENDING: "Menunggu Verifikasi",
	VERIFIED: "Diverifikaksi",
	REJECTED: "Menunggu Verifikasi",
} as const;
