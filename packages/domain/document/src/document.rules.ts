import { DocumentStatus } from "./document.types";

/**
 * Mengecek apakah sebuah dokumen boleh dihapus
 * berdasarkan status dokumennya.
 *
 * RULE:
 * - HANYA dokumen dengan status REJECTED yang boleh dihapus.
 *
 * @param status - Status dokumen saat ini
 * @returns true jika dokumen boleh dihapus, false jika tidak
 */
export const canDeleteDocumentByStatus = (status: DocumentStatus) =>
	status === "REJECTED";

/**
 * Menegecek apakah sebuah dokumen bersifat read-only
 *
 * RULE:
 * - Dokumen dengan status VERIFIED bersifat read-only
 * @param status - Status dokumen saat ini
 * @returns true jika dokumen tidak boleh diverifikasi
 */
export const isDocumentReadOnly = (status: DocumentStatus) =>
	status === "VERIFIED";
