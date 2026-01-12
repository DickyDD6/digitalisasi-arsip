import { describe, expect, it } from "vitest";
import { canDeleteDocument, canViewDocument } from "../src/document.policies";
import { Document } from "../src/document.types";

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

describe("document.policies", () => {
	describe("canViewDocument", () => {
		it("Hanya MANAGER yang boleh melihat dokumen.", () => {
			expect(canViewDocument("MANAGER")).toBe(true);
		});

		it("Role selain MANAGER tidak dapat melihat dokumen.", () => {
			expect(canViewDocument("QC")).toBe(false);
			expect(canViewDocument("SBAP")).toBe(false);
			expect(canViewDocument("UPLOADER")).toBe(false);
		});
	});

	describe("canDeleteDocument", () => {
		it("Hanya MANAGER yang dapat menghapus dokumen.", () => {
			expect(canDeleteDocument("MANAGER", mockDocuments[0])).toBe(true);
		});

		it("MANAGER tidak dapat menghapus dokumen VERIFIED.", () => {
			expect(canDeleteDocument("MANAGER", mockDocuments[1])).toBe(false);
		});

		it("Role selain MANAGER tidak dapat menghapus dokumen.", () => {
			expect(canDeleteDocument("QC", mockDocuments[0])).toBe(false);
			expect(canDeleteDocument("SBAP", mockDocuments[0])).toBe(false);
			expect(canDeleteDocument("UPLOADER", mockDocuments[0])).toBe(false);
		});
	});
});
