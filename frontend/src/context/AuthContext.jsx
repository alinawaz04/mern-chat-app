/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

export const AuthContext = createContext();

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (username, password) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Login failed");
    }

    setAuthUser(data);
    localStorage.setItem("chat-user", JSON.stringify(data));
    return data;
  };

  const signup = async (userData) => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Signup failed");
    }

    setAuthUser(data);
    localStorage.setItem("chat-user", JSON.stringify(data));
    return data;
  };

  const logout = async () => {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Logout failed");
    }

    setAuthUser(null);
    localStorage.removeItem("chat-user");
  };

  // Check for saved user on load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("chat-user"));
        if (storedUser) {
          setAuthUser(storedUser);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);
  return (
    <AuthContext.Provider value={{ authUser, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
