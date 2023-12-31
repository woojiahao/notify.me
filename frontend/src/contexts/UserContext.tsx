/* eslint-disable */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import User, { defaultUser } from "../models/user";
import api from "../api/api";
import { AxiosError } from "axios";

// Use this context to store and access the authenticated user data across all components and
// pages
interface UserContextInterface {
  accessToken: token;
  refreshToken: token;
  user: User;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<number>;
  register: (name: string, email: string, password: string) => Promise<number>;
  logout: () => void;
  hasExpired: () => Promise<boolean>;
}

type token = string | null;

/* eslint-disable no-unused-vars */
const UserContext = createContext<UserContextInterface>({
  accessToken: null,
  refreshToken: null,
  user: defaultUser,
  isLoading: true,
  login: function (_email: string, _password: string) {
    throw new Error("Function not implemented");
  },
  register: function (_email: string, _password: string) {
    throw new Error("Function not implemented");
  },
  logout: function () {
    throw new Error("Function not implemented");
  },
  hasExpired: function () {
    throw new Error("Function not implemented");
  },
});
/* eslint-enable no-unused-vars */

export function UserProvider({ children }: React.PropsWithChildren) {
  // Setup listener for localStorage value changes so that we can update the context accordingly
  const [accessToken, setAccessToken] = useState<token>(null);
  const [refreshToken, setRefreshToken] = useState<token>(null);
  const [user, setUser] = useState<User>(defaultUser);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useLayoutEffect(() => {
    const at = localStorage.getItem("access_token");
    const rt = localStorage.getItem("refresh_token");

    // Read initial values of localStorage
    if (at) setAccessToken(at);
    if (rt) setRefreshToken(rt);

    const userString = localStorage.getItem("user");
    if (userString) setUser(JSON.parse(userString));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const handleLocalStorageChanged = () => {
      // If any of the local storage items update, we update the context values
      // TODO: Setup axios to read from context, not directly from storage
      const at = localStorage.getItem("access_token");
      const rt = localStorage.getItem("refresh_token");

      if (at !== accessToken) setAccessToken(at);
      if (rt !== refreshToken) setRefreshToken(rt);

      const userString = localStorage.getItem("user");
      if (userString && JSON.parse(userString) !== user)
        setUser(JSON.parse(userString));
      setIsLoading(false);
    };

    const handleLocalStorageCleared = () => {
      console.log("hi");
      if (!localStorage.getItem("access_token")) setAccessToken(null);
      if (!localStorage.getItem("refresh_token")) setRefreshToken(null);
      if (!localStorage.getItem("user")) setUser(defaultUser);
    };

    window.addEventListener("local_storage_change", handleLocalStorageChanged);
    window.addEventListener("local_storage_cleared", handleLocalStorageCleared);

    return () => {
      window.removeEventListener(
        "local_storage_changed",
        handleLocalStorageChanged
      );
      window.removeEventListener(
        "local_storage_cleared",
        handleLocalStorageCleared
      );
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await api.post("/user/login", {
        email: email,
        password: password,
      });

      if (response.status === 200) {
        interface LoginResponse {
          access: string;
          refresh: string;
          user: User;
        }

        const data = response.data as LoginResponse;
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        localStorage.setItem("user", JSON.stringify(data.user));
        const event = new Event("local_storage_change");
        dispatchEvent(event);
      }
      return response.status;
    } catch (e) {
      const error = e as AxiosError;
      if (!error.response) return 500;
      return error.response.status;
    }
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      try {
        const response = await api.post("/user/register", {
          name: name,
          email: email,
          password: password,
        });
        return response.status;
      } catch (e) {
        const error = e as AxiosError;
        if (!error.response) return 500;
        return error.response.status;
      }
    },
    []
  );

  const logout = useCallback(async () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    const event = new Event("local_storage_cleared");
    dispatchEvent(event);
  }, []);

  const hasExpired = useCallback(async () => {
    console.log(accessToken);
    if (accessToken === null) {
      return true;
    }

    try {
      const token = JSON.parse(atob(accessToken.split(".")[1]));
      if (token.exp * 1000 < Date.now()) {
        return true;
      }
    } catch {
      return true;
    }

    return false;
  }, []);

  return (
    <UserContext.Provider
      value={{
        accessToken,
        refreshToken,
        user,
        isLoading,
        login,
        register,
        logout,
        hasExpired,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUserContext = () => useContext(UserContext);
