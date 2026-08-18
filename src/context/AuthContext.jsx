import React, { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "../utils/api.js";

const TOKEN_KEY = "now_showing_token";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setReady(true);
      return;
    }

    apiRequest("/api/auth/me")
      .then(({ user }) => setUser(user))
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
      })
      .finally(() => setReady(true));
  }, []);

  const saveSession = ({ token, user }) => {
    localStorage.setItem(TOKEN_KEY, token);
    setUser(user);
  };

  const signup = async (values) => {
    const result = await apiRequest("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(values),
    });
    saveSession(result);
  };

  const login = async (values) => {
    const result = await apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(values),
    });
    saveSession(result);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, ready, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
