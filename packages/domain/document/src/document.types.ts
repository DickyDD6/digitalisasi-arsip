/**
 * Status validasi sebuah dokumen arsip akademik.
 *
 * Digunakan untuk menentukan state dokumen
 * dalam alur digitalisasi dan verifikasi.
 */
export type DocumentStatus =
	| "PENDING" // Dokumen menunggu proses verifikasi
	| "VERIFIED" // Dokumen telah diverifikasi dan valid
	| "REJECTED"; // Dokumen ditolak / tidak valid

/**
 * Representasi entitas Dokumen dalam domain.
 *
 * Entitas ini bersifat domain-level:
 * - Tidak bergantung pada API
 * - Tidak bergantung pada database
 * - Tidak bergantung pada UI
 */
export type Document = {
	/**
	 * ID unik dokumen.
	 * Biasanya berasal dari backend atau sistem penyimpanan.
	 */
	id: string;

	/**
	 * Judul atau nama dokumen arsip.
	 * Contoh: "Transkrip Nilai 2019"
	 */
	title: string;

	/**
	 * Status validasi dokumen saat ini.
	 */
	status: DocumentStatus;

	/**
	 * Waktu dokumen diunggah ke sistem.
	 */
	uploadedAt: Date;
};

/**
 * Role pengguna dalam sistem arsip akademik.
 *
 * Digunakan pada domain policy
 * untuk menentukan hak akses dan kewenangan.
 */
export type Role = "MANAGER" | "QC" | "UPLOADER" | "SBAP" | "SUPER_ADMIN";
