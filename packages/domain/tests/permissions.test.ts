import { describe, expect, it } from "vitest";
import { ArchiveAction, canAccess } from "../src/permissions";
import { Role } from "../src/role";
import { ArchiveStatus } from "../src/archive-status";

describe("Archive Permissions", () => {
  it("QC hanya dapat memverifikasi arsip PENDING", () => {
    expect(canAccess(Role.QC, "VERIFY", ArchiveStatus.PENDING)).toBe(true);
    expect(canAccess(Role.QC, "VERIFY", ArchiveStatus.VERIFIED)).toBe(false);
    expect(canAccess(Role.QC, "VERIFY", ArchiveStatus.REJECTED)).toBe(false);
  });

  it("Uploader hanya dapat menghapus arsip yang REJECTED", () => {
    expect(canAccess(Role.UPLOADER, "DELETE", ArchiveStatus.REJECTED)).toBe(true);
    expect(canAccess(Role.UPLOADER, "DELETE", ArchiveStatus.VERIFIED)).toBe(false);
    expect(canAccess(Role.UPLOADER, "DELETE", ArchiveStatus.PENDING)).toBe(false);
  });

  it("Pegawai SBAP hanya dapat melihat arsip yang sudah VERIFIED", () => {
    expect(canAccess(Role.SBAP, "VIEW", ArchiveStatus.VERIFIED)).toBe(true);
    expect(canAccess(Role.SBAP, "VIEW", ArchiveStatus.REJECTED)).toBe(false);
    expect(canAccess(Role.SBAP, "VIEW", ArchiveStatus.PENDING)).toBe(false);
  });

  it("Super Admin bisa melakukan semuanya", () => {
    const actions: ArchiveAction[] = [
			"VIEW", "DOWNLOAD", "UPLOAD", "DELETE", "VERIFY", "REJECT"
		];

		const statuses: ArchiveStatus[] = [
			ArchiveStatus.PENDING,
			ArchiveStatus.VERIFIED,
			ArchiveStatus.REJECTED,
		];

		for (const action of actions) {
			for (const status of statuses) {
				expect(canAccess(Role.SUPER_ADMIN, action, status)).toBe(true);
			}
		}
  })
});
