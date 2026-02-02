export const DOCUMENT_TYPE = {
	TRANSCRIPT: "TRANSCRIPT",
	MARK: "MARK",
} as const;

export type DocumentType = (typeof DOCUMENT_TYPE)[keyof typeof DOCUMENT_TYPE];
