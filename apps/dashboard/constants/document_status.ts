export const DOCUMENT_STATUS = {
  menunggu_verifikasi: "Menunggu Verifikasi",
  terverifikasi: "Terverifikasi",
  tidak_terverifikasi: "Tidak Terverifikasi",
} as const;

export type DocumentStatus = keyof typeof DOCUMENT_STATUS;
