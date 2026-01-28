import { storage } from "@/lib/storage";
import { setAuthToken } from "@/lib/api/client";

// AsyncStorage-based authentication service for offline/demo flows.

export interface LocalUser {
  id: string;
  username: string;
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  location?: string;
  farm_size?: string;
  created_at: string;
}

export interface AuthResponse {
  success: boolean;
  user?: LocalUser;
  token?: string;
  message?: string;
}

class LocalAuthService {
  private usersKey = "farmiq_users";
  private currentUserKey = "farmiq_current_user";
  private tokenKey = "farmiq_token";

  private generateToken(): string {
    return `token_${Math.random().toString(36).slice(2, 11)}_${Date.now()}`;
  }

  private async getUsers(): Promise<LocalUser[]> {
    const raw = await storage.getItem(this.usersKey);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as LocalUser[];
    } catch {
      return [];
    }
  }

  private async saveUsers(users: LocalUser[]): Promise<void> {
    await storage.setItem(this.usersKey, JSON.stringify(users));
  }

  async register(
    username: string,
    email: string,
    password: string,
    full_name: string,
    phone: string = "",
    location: string = "",
    farm_size: string = ""
  ): Promise<AuthResponse> {
    try {
      const users = await this.getUsers();

      if (users.find((user) => user.username === username)) {
        return { success: false, message: "Username already exists" };
      }

      if (users.find((user) => user.email === email)) {
        return { success: false, message: "Email already exists" };
      }

      const newUser: LocalUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        username,
        email,
        password,
        full_name,
        phone,
        location,
        farm_size,
        created_at: new Date().toISOString(),
      };

      users.push(newUser);
      await this.saveUsers(users);

      return { success: true, user: newUser, message: "Registration successful" };
    } catch (error) {
      return { success: false, message: `Registration failed: ${(error as Error).message}` };
    }
  }

  async login(username: string, password: string): Promise<AuthResponse> {
    try {
      const users = await this.getUsers();
      const user = users.find((u) => u.username === username && u.password === password);

      if (!user) {
        return { success: false, message: "Invalid username or password" };
      }

      const token = this.generateToken();

      await storage.setItem(this.currentUserKey, JSON.stringify(user));
      await storage.setItem(this.tokenKey, token);
      await setAuthToken(token);

      return { success: true, user, token, message: "Login successful" };
    } catch (error) {
      return { success: false, message: `Login failed: ${(error as Error).message}` };
    }
  }

  async getCurrentUser(): Promise<LocalUser | null> {
    const raw = await storage.getItem(this.currentUserKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as LocalUser;
    } catch {
      return null;
    }
  }

  async getCurrentToken(): Promise<string | null> {
    return storage.getItem(this.tokenKey);
  }

  async logout(): Promise<void> {
    await storage.removeItem(this.currentUserKey);
    await storage.removeItem(this.tokenKey);
    await setAuthToken(null);
  }

  async isLoggedIn(): Promise<boolean> {
    const [user, token] = await Promise.all([this.getCurrentUser(), this.getCurrentToken()]);
    return !!user && !!token;
  }

  async clearAllData(): Promise<void> {
    await storage.removeItem(this.usersKey);
    await storage.removeItem(this.currentUserKey);
    await storage.removeItem(this.tokenKey);
    await setAuthToken(null);
  }
}

export const localAuthService = new LocalAuthService();
