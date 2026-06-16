import { useCallback, useMemo, useState } from "react";
import apiClient from "../api/axios.js";
import { AuthContext } from "./authContext.js";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await apiClient.get("/auth/me");
      setUser(response.data);
      return response.data;
    } catch (error) {
      setUser(null);
      throw error;
    }
  }, []);

  const loginWithGithub = useCallback(async () => {
    setIsLoading(true);
    try {
       window.location.href =
        "http://localhost:5000/api/auth/github";
        
    } catch (error) {
      window.alert("Login failed. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiClient.post('/auth/logout')
    } finally {
      setUser(null)
    }
  }, [])

  const value = useMemo(
    () => ({ user, isLoading, loginWithGithub, fetchCurrentUser, logout }),
    [user, isLoading, loginWithGithub, fetchCurrentUser, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
