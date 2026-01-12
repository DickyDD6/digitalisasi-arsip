import { canDeleteDocumentByStatus } from "./document.rules";
import { Document, Role } from "./document.types";

/**
 * Mengecek apakah user dengan role tertentu
 * boleh MELIHAT sebuah dokumen.
 *
 * POLICY:
 * - Manager boleh melihat SEMUA dokumen.
 *
 * @param role Role user saat ini
 * @returns true jika boleh melihat dokumen
 */
export const canViewDocument = (role: Role) => role === "MANAGER";

/**
 * Mengecek apakah user dengan role tertentu
 * boleh MENGHAPUS sebuah dokumen
 *
 * POLICY:
 * - Hanya MANAGER yang boleh menghapus dokumen.
 * - Dokumen HARUS berstatus REJECTED.
 *
 * @param role Role user saat ini
 * @param document Dokumen yang akan dihapus
 * @returns true jika boleh menghapus dokumen
 */
export const canDeleteDocument = (role: Role, document: Document) =>
	role !== "MANAGER" ? false : canDeleteDocumentByStatus(document.status);
