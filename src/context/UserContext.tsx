import React, { createContext, useContext, useMemo, useState } from "react";
import useError from "../hooks/useError";
import { loginAdmin } from "../model/auth";
import { LoginDto } from "../types/entities/auth";
import api from "../utils/api";

const defaultValue = {
  isLoggedIn: false,
  login: (body: LoginDto) => {},
  logout: () => {},
  isLoggingIn: false,
};

const UserContext = createContext(defaultValue);

export const UserStore = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const { handleError } = useError();

  const login = async (body: LoginDto) => {
    try {
      setIsLoggingIn(true);
      const { data } = await loginAdmin(body);
      setIsLoggedIn(true);
      localStorage.setItem("token", data.data.token);
      api.defaults.headers.common["Authorization"] = data.data.token;
    } catch (e) {
      handleError(e);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = async () => {
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  };

  useMemo(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = token;
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <UserContext.Provider value={{ isLoggedIn, login, logout, isLoggingIn }}>
      {children}
    </UserContext.Provider>
  );
};

export function useUserContext() {
  return useContext(UserContext);
}
