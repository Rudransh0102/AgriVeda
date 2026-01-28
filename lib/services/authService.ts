import { apiRequest, setAuthToken } from "@/lib/api/client";

export interface UserCreate {
  username: string;
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  location?: string;
  farm_size?: string;
}

export interface UserLogin {
  username: string;
  password: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  full_name: string;
  phone?: string;
  location?: string;
  farm_size?: string;
  is_active: boolean;
  created_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

class AuthService {
  async register(userData: UserCreate): Promise<UserResponse> {
    return apiRequest<UserResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: UserLogin): Promise<Token> {
    const token = await apiRequest<Token>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (token?.access_token) {
      await setAuthToken(token.access_token);
    }

    return token;
  }

  async logout(): Promise<void> {
    await setAuthToken(null);
  }

  async getCurrentUser(): Promise<UserResponse> {
    return apiRequest<UserResponse>("/api/auth/me", { auth: true });
  }

  async updateUser(userData: Partial<UserResponse>): Promise<UserResponse> {
    return apiRequest<UserResponse>("/api/auth/me", {
      method: "PUT",
      auth: true,
      body: JSON.stringify(userData),
    });
  }
}

export const authService = new AuthService();
