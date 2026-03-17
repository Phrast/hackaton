export interface AuthResponse {
  token: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}
