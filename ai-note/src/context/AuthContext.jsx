import { createContext, useContext, useEffect, useState } from "react";
const API_BASE = "http://localhost:8000/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    user: null,
    isAuthenticated: false,
  });

  const authCheck = async () => {
    try {
      const res = await fetch(API_BASE + "/auth/check", {
        method: "GET",
        credentials: "include",
      });
      console.log("Response from auth check:", res.body);
      if (res.ok) {
        const data = await res.json();
        setAuthState({
          user: data.user,
          isAuthenticated: true,
        });
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
        });
      }
    } catch (err) {
      setAuthState({
        user: null,
        isAuthenticated: false,
      });
    }
  };
  

  useEffect(() => {
    console.log("Checking authentication status...");
    authCheck(); 
  }, []);

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthCheck() {
  return useContext(AuthContext);
}
