import { Role } from "@/shared/constants";

export interface LoginRequest {
	email: string;
	password: string;
}

interface AuthUser {
	id: number;
	name: string;
	email: string;
	role: Role;
}

export interface LoginResponse {
	message: string;
	data: {
		user: AuthUser;
	};
}
