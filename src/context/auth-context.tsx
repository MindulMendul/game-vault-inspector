
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

// This is a placeholder for the Supabase client, which we'll setup later
// when the user connects their Supabase project
interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in from localStorage
    const storedUser = localStorage.getItem('boardgame-admin');
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('boardgame-admin');
      }
    }
    
    setLoading(false);
  }, []);

  // Placeholder for Supabase login
  const login = async (email: string, password: string): Promise<void> => {
    try {
      // This is a placeholder for the Supabase auth
      // Will be replaced when user connects to Supabase
      if (email === 'admin@example.com' && password === 'password') {
        const mockUser = { id: '1', email: email };
        setUser(mockUser);
        localStorage.setItem('boardgame-admin', JSON.stringify(mockUser));
        navigate('/games');
        toast.success('Login successful!');
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    // Placeholder for Supabase logout
    localStorage.removeItem('boardgame-admin');
    setUser(null);
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
