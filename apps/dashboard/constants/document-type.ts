export const DOCUMENT_TYPE = {
  nilai: "Nilai",
  ijazah: "Ijazah",
  transkrip: "Transkrip",
  berita_acara_sidang: "Berita Acara Sidang",
} as const;

export type DocumentType = keyof typeof DOCUMENT_TYPE;
