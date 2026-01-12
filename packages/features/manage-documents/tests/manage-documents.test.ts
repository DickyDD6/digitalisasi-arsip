import { Document } from "@repo/domain/document";
import { describe, expect, it, vi } from "vitest";
import { DocumentRepository } from "../src/manage-documents.types";
import { ManageDocumentsService } from "../src/manage-documents.service";

export const mockDocuments: Document[] = [
	{
		id: "1",
		title: "Doc Rejected",
		status: "REJECTED",
		uploadedAt: new Date(),
	},
	{
		id: "2",
		title: "Doc Verified",
		status: "VERIFIED",
		uploadedAt: new Date(),
	},
];

describe("ManageDocumentsService", () => {
	const repo: DocumentRepository = {
		findAll: vi.fn(async () => mockDocuments),
		deleteById: vi.fn(async () => {}),
	};

	const service = new ManageDocumentsService(repo);

	it("Hanya MANAGER yang dapat list dokumen.", async () => {
		const result = await service.listDocuments({ role: "MANAGER" });

		expect(result).toHaveLength(2);
	});

	it("Role selain MANAGER tidak dapat list dokumen.", async () => {
		await expect(service.listDocuments({ role: "SBAP" })).rejects.toThrow(
			"FORBIDDEN",
		);
	});

	it("Hanya MANAGER yang dapat menghapus dokumen.", async () => {
		await service.deleteDocument({ role: "MANAGER" }, mockDocuments[0]);

		expect(repo.deleteById).toHaveBeenCalledWith("1");
	});

	it("MANAGER tidak dapat menghapus dokumen yang sudah VERIFIED", async () => {
		await expect(
			service.deleteDocument({ role: "MANAGER" }, mockDocuments[1]),
		).rejects.toThrow("FORBIDDEN");
	});
});
