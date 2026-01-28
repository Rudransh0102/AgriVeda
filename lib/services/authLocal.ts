import { storage } from "@/lib/storage";

// Very simple local auth for offline/mobile-only mode
// NOT secure; for demo/offline purposes only.

const USERS_KEY = "auth.users"; // map of username -> user record with hashed-ish password
const CURRENT_USER_KEY = "auth.user";

type UserRecord = {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  phone?: string;
  location?: string;
  farm_size?: string;
  passwordHash: string; // naive: stored as string
  created_at: string;
};

function hash(pw: string) {
  // extremely naive hash; replace with real hashing if needed
  let h = 0;
  for (let i = 0; i < pw.length; i++) h = (h * 31 + pw.charCodeAt(i)) | 0;
  return String(h);
}

async function loadUsers(): Promise<Record<string, UserRecord>> {
  const raw = await storage.getItem(USERS_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, UserRecord>;
  } catch {
    return {};
  }
}

async function saveUsers(map: Record<string, UserRecord>) {
  await storage.setItem(USERS_KEY, JSON.stringify(map));
}

export type RegisterPayload = {
  username: string;
  email: string;
  password: string;
  full_name?: string;
  phone?: string;
  location?: string;
  farm_size?: string;
};

export type LoginPayload = { username: string; password: string };

export type PublicUser = Omit<UserRecord, "passwordHash">;

export const authLocal = {
  async register(payload: RegisterPayload): Promise<PublicUser> {
    const users = await loadUsers();
    const username = payload.username.trim().toLowerCase();
    if (!username || !payload.password) {
      throw new Error("Username and password required");
    }
    if (users[username]) {
      throw new Error("User already exists");
    }

    const id = Date.now();
    const record: UserRecord = {
      id,
      username,
      email: payload.email,
      full_name: payload.full_name,
      phone: payload.phone,
      location: payload.location,
      farm_size: payload.farm_size,
      passwordHash: hash(payload.password),
      created_at: new Date().toISOString(),
    };
    users[username] = record;
    await saveUsers(users);
    await storage.setItem(CURRENT_USER_KEY, JSON.stringify(record));
    return authLocal.me();
  },

  async login(
    payload: LoginPayload,
  ): Promise<{ token: string; user: PublicUser }> {
    const users = await loadUsers();
    const username = payload.username.trim().toLowerCase();
    const record = users[username];
    if (!record) throw new Error("User not found. Please register.");
    if (record.passwordHash !== hash(payload.password))
      throw new Error("Invalid credentials");

    await storage.setItem(CURRENT_USER_KEY, JSON.stringify(record));
    const token = `local-${record.id}-${Math.random().toString(36).slice(2)}`;
    return { token, user: authLocal._public(record) };
  },

  async logout(): Promise<void> {
    await storage.removeItem(CURRENT_USER_KEY);
  },

  async me(): Promise<PublicUser> {
    const raw = await storage.getItem(CURRENT_USER_KEY);
    if (!raw) throw new Error("Not authenticated");
    const record: UserRecord = JSON.parse(raw);
    return authLocal._public(record);
  },

  _public(record: UserRecord): PublicUser {
    const { passwordHash, ...rest } = record;
    return rest;
  },
};
