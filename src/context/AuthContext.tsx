import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { User } from '../types';
import {
  authApi,
  userApi,
  getStoredTokens,
  setStoredTokens,
  clearStoredTokens,
} from '../services/api';

// ===========================================
// AUTH CONTEXT - Mood Tracker
// ===========================================

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// -----------------------------
// Auth Provider
// -----------------------------
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      const tokens = getStoredTokens();
      
      if (tokens?.access_token) {
        try {
          const userData = await userApi.getMe();
          setUser(userData);
        } catch (error) {
          // Token invalid or expired, clear storage
          clearStoredTokens();
        }
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Login
  const login = useCallback(async (email: string, password: string) => {
    const tokens = await authApi.login(email, password);
    setStoredTokens(tokens);
    
    const userData = await userApi.getMe();
    setUser(userData);
  }, []);

  // Register
  const register = useCallback(async (email: string, password: string, name: string) => {
    // First register the user
    await authApi.register(email, password, name);
    
    // Then log them in
    await login(email, password);
  }, [login]);

  // Logout
  const logout = useCallback(() => {
    clearStoredTokens();
    setUser(null);
  }, []);

  // Update user (used after profile updates)
  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// -----------------------------
// Hook
// -----------------------------
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
