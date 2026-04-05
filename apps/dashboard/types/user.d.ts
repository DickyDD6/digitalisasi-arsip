interface User {
  id: number;
  name: string;
  email: string;
  nip: string | null;
  role: Lowercase<UserRole>;
  email_verified_at: Date | null;
  // passwors (private)
  createdAt: Date;
  updatedAt: Date;
}

interface UserSchema {
  name: string;
  email: string;
  password: string;
  role: Lowercase<UserRole>;
  nip: string | null;
}

type UserRole = "MANAGER" | "UPLOADER" | "QC" | "SBAP";

interface UserParams {
  page?: number;
  per_page?: number;
  role?: UserRole;
  search?: string;
}

interface UserStatistic {
  total_users: number;
  total_by_role: Record<Lowercase<UserRole>, number>;
  active_users: number;
  new_users: number;
}
