interface LoginRequest {
	email: string;
	password: string;
}

interface LoginResponse {
	message: string;
	data: {
		user: {
			name: string;
			email: string;
			nip: string | null;
			role: UserRole;
		};
	};
}
