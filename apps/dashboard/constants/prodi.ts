export const PRODI = {
  "Teknik Informatika": "Teknik Informatika",
  "Teknologi Pangan": "Teknologi Pangan",
  "Teknik Industri": "Teknik Industri",
  "Teknik Mesin": "Teknik Mesin",
  "Teknik Lingkungan": "Teknik Lingkungan",
  "Perencanaan Wilayah dan Kota": "Perencanaan Wilayah dan Kota",
} as const;

export type Prodi = keyof typeof PRODI;
