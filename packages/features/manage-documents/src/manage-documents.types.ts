import { Document, Role } from "@repo/domain/document";

/**
 * Dependency repository untuk feature manage documents.
 * Menggunakan abstraction agar mudah dimock.
 */
export interface DocumentRepository {
	findAll: () => Promise<Document[]>;
	deleteById: (id: string) => Promise<void>;
}

/**
 * Context user yang menjalankan aksi.
 */
export type ManagerContext = {
	role: Role;
};
