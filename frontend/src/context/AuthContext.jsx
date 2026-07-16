import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../apis";

const AuthContext = createContext(null);

const SESSION_KEY = "gat_session";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY);
    if (!session) {
      setLoading(false);
      return;
    }

    const parsed = JSON.parse(session);
    setUser(parsed);
    setLoading(false);
  }, []);

  const signup = async ({ name, email, phone, password }) => {
    try {
      const { data } = await api.post("/auth/signup", { name, email, phone, password });
      const session = { id: data.user.id, name: data.user.name, email: data.user.email, phone: data.user.phone, createdAt: data.user.createdAt, token: data.token };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      setUser(session);
      return session;
    } catch (error) {
      throw new Error(error?.response?.data?.message || "Unable to create account");
    }
  };

  const login = async ({ email, password }) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      const session = { id: data.user.id, name: data.user.name, email: data.user.email, phone: data.user.phone, createdAt: data.user.createdAt, token: data.token };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      setUser(session);
      return session;
    } catch (error) {
      throw new Error(error?.response?.data?.message || "Invalid email or password.");
    }
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
