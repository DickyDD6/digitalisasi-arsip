import { Role } from "@/constants";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  data: {
    user: {
      name: string;
      email: string;
      nip: string | null;
      role: Role;
    };
  };
}

export interface LoginErrorsResponse {
  email: string[];
  password: string[];
}

export interface LoginErrorDataResponse {
  locked_until?: Date;
  message: string;
  retry_after?: number;
}
