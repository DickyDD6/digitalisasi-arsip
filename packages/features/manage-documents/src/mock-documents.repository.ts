import { DocumentRepository } from "./manage-documents.types";

/**
 * Mock repository untuk dokumen.
 * Digunakan sementara sebelum backend siap.
 */
export const mockDocumentRepository: DocumentRepository = {
	findAll: async () => {
		return [
			{
				id: "1",
				title: "Dokumen Ditolak",
				status: "REJECTED",
				uploadedAt: new Date(),
			},
			{
				id: "2",
				title: "Dokumen Terverifikasi",
				status: "VERIFIED",
				uploadedAt: new Date(),
			},
		];
	},

	deleteById: async (id) => {
		console.log(`Mock delete dokumen dengan id: ${id}`);
	},
};
