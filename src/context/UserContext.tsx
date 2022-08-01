import React, {
  createContext, useContext, useMemo, useState
} from 'react';
import useError from '../hooks/useError';
import { loginAdmin } from '../models/auth';
import { LoginDto } from '../types/entities/auth';
import api from '../utils/api';

const defaultValue = {
  isLoggedIn: false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  login: (_: LoginDto) => {},
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
      localStorage.setItem('token', data.data.token);
      api.defaults.headers.common.Authorization = data.data.token;
    } catch (e) {
      handleError(e);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = async () => {
    setIsLoggedIn(false);
    localStorage.removeItem('token');
    delete api.defaults.headers.common.Authorization;
  };

  useMemo(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common.Authorization = token;
      setIsLoggedIn(true);
    }
  }, []);

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <UserContext.Provider value={{
      isLoggedIn, login, logout, isLoggingIn
    }}
    >
      {children}
    </UserContext.Provider>
  );
};

export function useUserContext() {
  return useContext(UserContext);
}
