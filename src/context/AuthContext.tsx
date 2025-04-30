import React, { createContext, useContext, useState } from "react";
import { BranchManager } from "../types/database.types";
import { loginBranchManager } from "../services/supabase.service";

type AuthContextType = {
  manager: BranchManager | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [manager, setManager] = useState<BranchManager | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const manager = await loginBranchManager(username, password);
      if (manager) {
        setManager(manager);
      } else {
        setError("로그인에 실패했습니다.");
      }
    } catch (err) {
      setError("로그인 중 오류가 발생했습니다.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setManager(null);
  };

  return <AuthContext.Provider value={{ manager, login, logout, isLoading, error }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
