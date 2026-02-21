interface User {
  id: number;
  name: string;
  email: string;
  nip: string | null;
  role: UserRole;
  email_verified_at: Date | null;
  // passwors (private)
  createdAt: Date;
  updatedAt: Date;
}

interface UserSchema {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  nip: string | null;
}

type UserRole = "MANAGER" | "UPLOADER" | "QC" | "SBAP";

interface UserParams {
  page?: number;
  per_page?: number;
  role?: UserRole;
  search?: string;
}
