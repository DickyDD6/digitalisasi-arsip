import {
	canDeleteDocumentByStatus,
	isDocumentReadOnly,
} from "../src/document.rules";
import { describe, expect, it } from "vitest";

describe("document.rules", () => {
	describe("canDeleteDocumentByStatus", () => {
		it("returns true for REJECTED", () => {
			expect(canDeleteDocumentByStatus("REJECTED")).toBe(true);
		});

		it("returns true for PENDING", () => {
			expect(canDeleteDocumentByStatus("PENDING")).toBe(false);
		});

		it("returns true for VERIFIED", () => {
			expect(canDeleteDocumentByStatus("VERIFIED")).toBe(false);
		});
	});

	describe("isDocumentReadOnly", () => {
		it("returns true for VERIFIED", () => {
			expect(isDocumentReadOnly("VERIFIED")).toBe(true);
		});

		it("returns true for PENDING", () => {
			expect(isDocumentReadOnly("PENDING")).toBe(false);
		});

		it("returns true for REJECTED", () => {
			expect(isDocumentReadOnly("REJECTED")).toBe(false);
		});
	});
});
