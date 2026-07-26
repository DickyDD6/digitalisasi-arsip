import type { DocumentItem } from "../types/dashboard.types";
import { ARCHIVE_DOCUMENT_TYPE } from "@/features/archives/constants/archive-document";

/**
 * Returns human-readable Indonesian document category label from API document_type / category code
 */
export function getDocCategory(doc: DocumentItem): string {
  const rawType = doc.document_type || doc.category || "";
  if (!rawType) return "-";

  // Check constant mapping enum first (GRADE -> Nilai, TRANSCRIPT -> Transkrip, CERTIFICATE -> Ijazah, SIDANG -> Berita Acara Sidang)
  if (ARCHIVE_DOCUMENT_TYPE[rawType as keyof typeof ARCHIVE_DOCUMENT_TYPE]) {
    return ARCHIVE_DOCUMENT_TYPE[rawType as keyof typeof ARCHIVE_DOCUMENT_TYPE];
  }

  const lower = rawType.toLowerCase();
  if (lower.includes("grade") || lower.includes("nilai")) return "Nilai";
  if (lower.includes("transcript") || lower.includes("transkrip"))
    return "Transkrip";
  if (lower.includes("certificate") || lower.includes("ijazah"))
    return "Ijazah";
  if (lower.includes("sidang")) return "Berita Acara Sidang";

  return rawType;
}

/**
 * Normalizes document status string from API into unified status key.
 * IMPORTANT: Checks pending/waiting statuses FIRST to prevent "menunggu_verifikasi"
 * from matching sub-strings of "verified".
 */
export function getNormalizedStatus(
  doc: DocumentItem,
): "pending" | "verified" | "rejected" {
  const s = (doc.status || "").toLowerCase().trim();

  // Check pending / waiting statuses explicitly FIRST
  if (
    s === "pending" ||
    s === "menunggu_verifikasi" ||
    s === "menunggu verifikasi" ||
    s === "menunggu" ||
    s.startsWith("menunggu")
  ) {
    return "pending";
  }

  // Check verified statuses
  if (
    s === "verified" ||
    s === "terverifikasi" ||
    s === "diverifikasi" ||
    s === "diverifikaksi"
  ) {
    return "verified";
  }

  // Check rejected statuses
  if (
    s === "rejected" ||
    s === "ditolak" ||
    s === "tidak_terverifikasi" ||
    s === "tidak terverifikasi"
  ) {
    return "rejected";
  }

  return "pending";
}

/**
 * Returns uploader name strictly from API response.
 * Returns "-" if not provided by backend.
 */
export function getUploaderName(doc: DocumentItem): string {
  if (doc.uploaded_by_name) return doc.uploaded_by_name;
  if (doc.uploader?.name) return doc.uploader.name;
  return "-";
}

/**
 * Returns QC verifier name strictly from API response.
 * Returns "-" if not provided by backend.
 */
export function getVerifierName(doc: DocumentItem): string {
  if (doc.verified_by_name) return doc.verified_by_name;
  return "-";
}

/**
 * Returns formatted file size strictly from API response.
 * Returns "-" if not provided by backend.
 */
export function getFileSizeFormatted(doc: DocumentItem): string {
  if (doc.file_size_formatted) return doc.file_size_formatted;
  if (typeof doc.file_size === "number" && doc.file_size > 0) {
    return `${(doc.file_size / (1024 * 1024)).toFixed(1)} MB`;
  }
  if (typeof doc.file_size === "string" && doc.file_size) {
    return doc.file_size;
  }
  return "-";
}

/**
 * Returns formatted date string from created_at / verified_at timestamp.
 * Returns "-" if not provided by backend.
 */
export function getFormattedDate(dateVal?: string | Date | null): string {
  if (!dateVal) return "-";
  try {
    return new Date(dateVal).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(dateVal);
  }
}
