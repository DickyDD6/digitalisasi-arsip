import { Role } from "@/shared/constants";

export interface User {
	id: number;
	name: string;
	email: string;
	nip: string;
	role: Role;
	createdAt: Date;
	updatedAt: Date;
}
