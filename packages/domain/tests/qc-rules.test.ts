import { describe, expect, it } from "vitest";
import {
  canQCProcess,
  canRejectWithNote,
  canTransition,
} from "../src/qc-rules";
import { ArchiveStatus } from "../src/archive-status";

describe("QC Rules", () => {
  it("QC hanya dapat memproses dokumen PENDING", () => {
    expect(canQCProcess(ArchiveStatus.PENDING)).toBe(true);
    expect(canQCProcess(ArchiveStatus.DRAFT)).toBe(false);
    expect(canQCProcess(ArchiveStatus.VERIFIED)).toBe(false);
    expect(canQCProcess(ArchiveStatus.REJECTED)).toBe(false);
  });

  it("Tindakan penolakan memerlukan catatan", () => {
    expect(canRejectWithNote("Ini Contoh Alasan")).toBe(true);
    expect(canRejectWithNote("   ")).toBe(false);
    expect(canRejectWithNote("")).toBe(false);
    expect(canRejectWithNote(undefined)).toBe(false);
  });

  it("QC hanya dapat bertransisi dari PENDING ke VERIFIED atau REJECTED", () => {
    expect(canTransition(ArchiveStatus.PENDING, ArchiveStatus.VERIFIED)).toBe(
      true
    );
    expect(canTransition(ArchiveStatus.PENDING, ArchiveStatus.REJECTED)).toBe(
      true
    );
    expect(canTransition(ArchiveStatus.PENDING, ArchiveStatus.DRAFT)).toBe(
      false
    );
    expect(canTransition(ArchiveStatus.VERIFIED, ArchiveStatus.PENDING)).toBe(
      false
    );
    expect(canTransition(ArchiveStatus.VERIFIED, ArchiveStatus.DRAFT)).toBe(
      false
    );
    expect(canTransition(ArchiveStatus.VERIFIED, ArchiveStatus.REJECTED)).toBe(
      false
    );
    expect(canTransition(ArchiveStatus.REJECTED, ArchiveStatus.PENDING)).toBe(
      false
    );
    expect(canTransition(ArchiveStatus.REJECTED, ArchiveStatus.VERIFIED)).toBe(
      false
    );
    expect(canTransition(ArchiveStatus.REJECTED, ArchiveStatus.DRAFT)).toBe(
      false
    );
    expect(canTransition(ArchiveStatus.DRAFT, ArchiveStatus.PENDING)).toBe(
      false
    );
    expect(canTransition(ArchiveStatus.DRAFT, ArchiveStatus.VERIFIED)).toBe(
      false
    );
    expect(canTransition(ArchiveStatus.DRAFT, ArchiveStatus.REJECTED)).toBe(
      false
    );
  });
});
