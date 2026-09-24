import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api, ApiError } from "../services/api";
import type { AuthUser, StudentProfile } from "../types";

interface AuthContextValue {
  user: AuthUser | null;
  profile: StudentProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (data: { email: string; password: string; fullName: string; studentId?: string; department?: string; polytechnic?: string; level?: string }) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    try {
      const me = await api.get<{ id: string; email: string; role: "STUDENT" | "ADMIN"; profile: StudentProfile | null }>("/auth/me");
      setUser({ id: me.id, email: me.email, role: me.role, fullName: me.profile?.fullName });
      setProfile(me.profile);
    } catch {
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(email: string, password: string) {
    const res = await api.post<{ user: AuthUser }>("/auth/login", { email, password });
    setUser(res.user);
    await refresh();
    return res.user;
  }

  async function register(data: { email: string; password: string; fullName: string; studentId?: string; department?: string; polytechnic?: string; level?: string }) {
    const res = await api.post<{ user: AuthUser }>("/auth/register", data);
    setUser(res.user);
    await refresh();
  }

  async function logout() {
    await api.post("/auth/logout");
    setUser(null);
    setProfile(null);
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export { ApiError };