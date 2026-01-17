import { Role } from "@/shared/constants";

export interface LoginRequest {
	username: string;
	password: string;
}

export interface LoginResponse {
	id: number;
	username: string;
	role: Role;
	accessToken: string;
}

export type CurrentUser = Omit<LoginResponse, "accessToken">;

// NOTE: Token hanya sementara untuk menggantikan HttpOnly Cookie
// karna dummyjson tidak ada menyiapkan HttpOnly Cookie
// TODO: Hapus token dari AuthState jika backend ready dan menggunakan HttpOnly Cookie
type AuthState = {
	token: string | null;
	user: Omit<LoginResponse, "accessToken"> | null;
};

interface AuthAction {
	setSession: (token: string) => void;
	setUser: (user: AuthState["user"]) => void;
	clear: () => void;
}

export type AuthStore = AuthState & AuthAction;
