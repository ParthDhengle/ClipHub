// lib/auth-context.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth } from './firebase';
import { User, onAuthStateChanged } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    setUser(user); // null if no user is logged in
    setLoading(false); // Loading becomes false once auth state is determined
  });
  return () => unsubscribe();
}, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}