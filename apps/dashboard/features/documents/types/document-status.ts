/**
 * Resolves a raw document status string (from API) into a typed status.
 * API stores: 'menunggu verifikasi', 'terverifikasi', 'tidak terverifikasi'
 */
export type DocumentStatus = "pending" | "verified" | "rejected";

export function resolveDocumentStatus(rawStatus: unknown): DocumentStatus {
  const s = String(rawStatus).toLowerCase().trim();
  if (s.includes("terverifikasi") && !s.includes("tidak")) return "verified";
  if (s.includes("tidak") || s.includes("reject")) return "rejected";
  return "pending";
}

export const DOCUMENT_STATUS_LABEL: Record<DocumentStatus, string> = {
  pending: "Menunggu Verifikasi",
  verified: "Terverifikasi",
  rejected: "Ditolak",
};

export const DOCUMENT_STATUS_BADGE_CLASS: Record<DocumentStatus, string> = {
  verified: "bg-[#DCFCE7] text-[#00A63E] border-emerald-200",
  rejected: "bg-[#FFE2E2] text-[#E7000B] border-rose-200",
  pending: "bg-[#FEF9C2] text-[#D08700] border-amber-200",
};
