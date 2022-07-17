import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loginAdmin } from "../model/auth";
import { LoginDto } from "../types/entities/auth";
import api from "../utils/api";

const defaultValue = {
  isLoggedIn: false,
  login: (body: LoginDto) => {},
  logout: () => {},
};

const UserContext = createContext(defaultValue);

export const UserStore = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const login = async (body: LoginDto) => {
    try {
      const { data } = await loginAdmin(body);
      setIsLoggedIn(true);
      localStorage.setItem("token", data.data.token);
    } catch (e) {
      console.log(e);
    }
  };

  const logout = async () => {
    setIsLoggedIn(false);
  };

  useMemo(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = token;
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <UserContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export function useUserContext() {
  return useContext(UserContext);
}
