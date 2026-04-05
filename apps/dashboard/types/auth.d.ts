interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: {
    name: string;
    email: string;
    nip: string | null;
    role: UserRole;
  };
}
