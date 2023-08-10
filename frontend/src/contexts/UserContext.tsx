import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import User, { defaultUser } from "../models/user";
import api from "../api/api";

// Use this context to store and access the authenticated user data across all components and
// pages
interface UserContextInterface {
  accessToken: token;
  refreshToken: token;
  user: User;
  login: (email: string, password: string) => void;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

type token = string | null;

const UserContext = createContext<UserContextInterface>({
  accessToken: null,
  refreshToken: null,
  user: defaultUser,
  login: function (_email: string, _password: string) {
    throw new Error("Function not implemented");
  },
  register: function (_email: string, _password: string) {
    throw new Error("Function not implemented");
  },
  logout: function () {
    throw new Error("Function not implemented");
  },
});

export function UserProvider({ children }: React.PropsWithChildren) {
  // Setup listener for localStorage value changes so that we can update the context accordingly
  const [accessToken, setAccessToken] = useState<token>(null);
  const [refreshToken, setRefreshToken] = useState<token>(null);
  const [user, setUser] = useState<User>(defaultUser);

  useEffect(() => {
    document.addEventListener("storage", () => {
      // If any of the local storage items update, we update the context values
      // TODO: Setup axios to read from context, not directly from storage
      if (localStorage.getItem("access_token") !== accessToken)
        setAccessToken(localStorage.getItem("access_token"));
      if (localStorage.getItem("refresh_token") !== refreshToken)
        setRefreshToken(localStorage.getItem("refresh_token"));

      const userString = localStorage.getItem("user");
      if (userString && JSON.parse(userString) !== user)
        setAccessToken(userString);
    });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
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
    }
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    const response = await api.post("/user/register", {
      email: email,
      password: password,
    });
    return response.status === 201;
  }, []);

  const logout = useCallback(async () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
  }, []);

  return (
    <UserContext.Provider
      value={{ accessToken, refreshToken, user, login, register, logout }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUserContext = () => useContext(UserContext);
