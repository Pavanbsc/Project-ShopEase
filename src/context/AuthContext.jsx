import { createContext, useState, useEffect } from "react";
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load user from localStorage on mount
    const storedUserJson = localStorage.getItem("shopease_user");
    if (storedUserJson) {
      try {
        const storedUser = JSON.parse(storedUserJson);
        setUser(storedUser);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("shopease_user");
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("shopease_user");
    localStorage.removeItem("shopease_token");
    localStorage.removeItem("shopease_login_time");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
