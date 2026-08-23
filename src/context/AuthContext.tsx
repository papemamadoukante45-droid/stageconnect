import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { User, UserRole } from '@/types';
import { authApi } from '@/api/auth';
import { TOKEN_KEY, REFRESH_KEY } from '@/api/client';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  registerStudent: (data: import('@/types').RegisterStudentFormData) => Promise<User>;
  registerCompany: (data: import('@/types').RegisterCompanyFormData) => Promise<User>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_KEY);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
    localStorage.setItem(TOKEN_KEY, res.access);
    localStorage.setItem(REFRESH_KEY, res.refresh);
    setUser(res.user);
    return res.user;
  }, []);

  const registerStudent = useCallback(async (data: import('@/types').RegisterStudentFormData) => {
    const res = await authApi.registerStudent(data);
    localStorage.setItem(TOKEN_KEY, res.access);
    localStorage.setItem(REFRESH_KEY, res.refresh);
    setUser(res.user);
    return res.user;
  }, []);

  const registerCompany = useCallback(async (data: import('@/types').RegisterCompanyFormData) => {
    const res = await authApi.registerCompany(data);
    localStorage.setItem(TOKEN_KEY, res.access);
    localStorage.setItem(REFRESH_KEY, res.refresh);
    setUser(res.user);
    return res.user;
  }, []);

  const logout = useCallback(() => {
    authApi.logout().catch(() => {});
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    setUser(null);
  }, []);

  const hasRole = useCallback((role: UserRole | UserRole[]) => {
    if (!user) return false;
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(user.role);
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        registerStudent,
        registerCompany,
        logout,
        isAuthenticated: !!user,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
