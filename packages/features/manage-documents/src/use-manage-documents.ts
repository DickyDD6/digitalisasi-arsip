import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ManageDocumentsService } from "./manage-documents.service";
import { mockDocumentRepository } from "./mock-documents.repository";
import { Document } from "@repo/domain/document";

/**
 * Hook untuk Manager dalam mengelola dokumen.
 * Menyediakan:
 * - list dokumen
 * - hapus dokumen
 */
export function useManageDocuments() {
	const queryClient = useQueryClient();
	const service = new ManageDocumentsService(mockDocumentRepository);

	/**
	 * Query: ambil daftar dokumen
	 */
	const documentsQuery = useQuery({
		queryKey: ["manager-documents"],
		queryFn: () => service.listDocuments({ role: "MANAGER" }),
	});

	/**
	 * Mutation: hapus dokumen
	 */
	const deleteDocumentMutation = useMutation({
		mutationFn: (document: Document) =>
			service.deleteDocument({ role: "MANAGER" }, document),
		onSuccess: () =>
			queryClient.invalidateQueries({
				queryKey: ["manager-documents"],
			}),
	});

	return {
		documents: documentsQuery.data ?? [],
		isLoading: documentsQuery.isLoading,
		error: documentsQuery.error,
		deleteDocument: deleteDocumentMutation.mutate,
		isDeleting: deleteDocumentMutation.isPending,
	};
}
