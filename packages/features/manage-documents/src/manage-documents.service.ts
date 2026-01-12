import { DocumentRepository, ManagerContext } from "./manage-documents.types";
import {
	canDeleteDocument,
	canViewDocument,
	Document,
} from "@repo/domain/document";

/**
 * Service untuk use case Manager:
 * - melihat daftar dokumen
 * - menghapus dokumen tidak terverifikasi
 */
export class ManageDocumentsService {
	constructor(private readonly repo: DocumentRepository) {}

	/**
	 * Mengambil semua dokumen yang boleh dilihat oleh Manager.
	 *
	 * @param ctx - context user (role)
	 * @returns daftar dokumen
	 * @throws Error jika tidak memiliki akses
	 */

	listDocuments = async (ctx: ManagerContext): Promise<Document[]> => {
		if (!canViewDocument(ctx.role)) throw new Error("FORBIDDEN");

		return this.repo.findAll();
	};

	/**
	 * Menghapus dokumen berdasarkan ID.
	 *
	 * @param ctx - context user (role)
	 * @param document - dokumen target
	 * @throws Error jika tidak memiliki akses
	 */
	deleteDocument = async (
		ctx: ManagerContext,
		document: Document,
	): Promise<void> => {
		if (!canDeleteDocument(ctx.role, document)) throw new Error("FORBIDDEN");

		return this.repo.deleteById(document.id);
	};
}
