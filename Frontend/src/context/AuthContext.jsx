import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authAPI } from "../api/services";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("srm_user")); } catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("srm_token");
    if (!token) { setLoading(false); return; }
    authAPI.getProfile()
      .then(({ data }) => setUser(data.data))
      .catch(() => { localStorage.removeItem("srm_token"); localStorage.removeItem("srm_user"); })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    localStorage.setItem("srm_token", data.data.token);
    localStorage.setItem("srm_user", JSON.stringify(data.data.user));
    setUser(data.data.user);
    return data.data.user;
  }, []);

  const register = useCallback(async (payload) => {
    const { data } = await authAPI.register(payload);
    localStorage.setItem("srm_token", data.data.token);
    localStorage.setItem("srm_user", JSON.stringify(data.data.user));
    setUser(data.data.user);
    return data.data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("srm_token");
    localStorage.removeItem("srm_user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
