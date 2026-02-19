interface ArchiveDocument {
	id: number;
	document_type: string;
	file_name: string;
	file_size: number;
	file_size_formatted: string;
	prodi: Prodi;
	tahun_ajaran: string;
	mata_kuliah: string;
	kelas: string;
	tahun_lulus: string;
	npm: string;
	status: DocumentStatus;
	verification_note: string | null;
	uploaded_by_name: string;
	verified_by_name: string;
	verified_at: Date | null;
	created_at: Date;
	updated_at: Date;
}
