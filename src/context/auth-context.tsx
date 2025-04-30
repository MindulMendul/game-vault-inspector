import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BranchManager } from "../types/database.types";
import { loginBranchManager } from "../services/supabase.service";

// This is a placeholder for the Supabase client, which we'll setup later
// when the user connects their Supabase project
interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: BranchManager | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<BranchManager | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in from localStorage
    const storedUser = localStorage.getItem("boardgame-admin");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("boardgame-admin");
      }
    }

    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    try {
      const user = await loginBranchManager(username, password);
      if (user) {
        setUser(user);
        localStorage.setItem("boardgame-admin", JSON.stringify(user));
        navigate("/admin/dashboard");
        toast.success("로그인 성공!");
      } else {
        throw new Error("잘못된 사용자 이름 또는 비밀번호입니다");
      }
    } catch (error) {
      toast.error("로그인 실패. 인증 정보를 확인해주세요.");
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    localStorage.removeItem("boardgame-admin");
    setUser(null);
    navigate("/admin/login");
    toast.success("로그아웃되었습니다");
  };

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
