export interface LoginCredentials {
  email: string;
  password: string;
}

export type LoginRequest = LoginCredentials;

export interface LoginResponse {
  message?: string;
  data?: {
    user: User;
    token?: string;
  };
  user?: User;
}

export type AuthUser = User;
