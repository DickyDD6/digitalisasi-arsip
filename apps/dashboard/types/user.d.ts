interface User {
  id: number;
  name: string;
  email: string;
  nip: string | null;
  role: Role;
  email_verified_at: Date | null;
  // passwors (private)
  createdAt: Date;
  updatedAt: Date;
}
