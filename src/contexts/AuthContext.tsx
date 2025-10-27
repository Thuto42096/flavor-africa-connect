import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  avatar?: string;
  joinedDate: string;
  role?: 'customer' | 'business_owner';
  businessId?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, phone?: string, role?: 'customer' | 'business_owner') => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isBusinessOwner: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('tastelocal_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // For now, simulate login with localStorage
    const users = JSON.parse(localStorage.getItem('tastelocal_users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('tastelocal_user', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string, phone?: string, role: 'customer' | 'business_owner' = 'customer'): Promise<boolean> => {
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('tastelocal_users') || '[]');
    const existingUser = users.find((u: any) => u.email === email);

    if (existingUser) {
      return false; // User already exists
    }

    // Create new user
    const newUser = {
      id: `user_${Date.now()}`,
      name,
      email,
      phone,
      password, // In production, this would be hashed
      joinedDate: new Date().toISOString(),
      role,
      ...(role === 'business_owner' && { businessId: `business_${Date.now()}` }),
    };

    users.push(newUser);
    localStorage.setItem('tastelocal_users', JSON.stringify(users));

    // Log them in
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('tastelocal_user', JSON.stringify(userWithoutPassword));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tastelocal_user');
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isBusinessOwner: user?.role === 'business_owner',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

