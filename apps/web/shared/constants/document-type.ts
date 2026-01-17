export const DocumentType = {
	TRANSCRIPT: "TRANSCRIPT",
	MARK: "MARK",
} as const;

export type DocumentType = (typeof DocumentType)[keyof typeof DocumentType];
