import { describe, expect, it } from "vitest";
import {
	getPendingArchives,
	rejectArchive,
	verifyArchive,
} from "../src/qc.service";
import { Role } from "@repo/domain/role";

describe("QC Service (Mock)", () => {
	it("QC dapat mengambil daftar arsip pending", async () => {
		const res = await getPendingArchives(Role.QC);
		expect(res.length).toBeGreaterThan(0);
	});

	it("Non-QC tidak dapat memverifikasi arsip", async () => {
		await expect(verifyArchive(Role.SBAP, "1")).rejects.toThrow("Unauthorized");
		await expect(verifyArchive(Role.MANAGER, "1")).rejects.toThrow("Unauthorized");
		await expect(verifyArchive(Role.UPLOADER, "1")).rejects.toThrow("Unauthorized");
	});

	it("Reject gagal jika catatan kosong", async () => {
		await expect(rejectArchive(Role.QC, "1", { note: "" })).rejects.toThrow();
	});
});
