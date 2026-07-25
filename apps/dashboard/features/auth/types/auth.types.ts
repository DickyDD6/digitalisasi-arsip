export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    name: string;
    email: string;
    nip: string | null;
    role: UserRole;
  };
}
