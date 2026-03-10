import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMeApi, loginApi, logoutApi, type User } from "@/api/auth";
import { tokenStorage } from "./tokenStorage";
import type { LoginFormValues } from "@/schemas/auth";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (values: LoginFormValues) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const queryClient = useQueryClient();
  const [ready, setReady] = useState(false);

  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["me"],
    queryFn: getMeApi,
    enabled: tokenStorage.hasTokens(),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    setReady(true);
  }, []);

  const login = useCallback(
    async (values: LoginFormValues) => {
      await loginApi(values);
      await refetch();
    },
    [refetch],
  );

  const logout = useCallback(async () => {
    await logoutApi();
    queryClient.clear();
  }, [queryClient]);

  if (!ready) return null;

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isAuthenticated: !!user,
        isLoading: tokenStorage.hasTokens() && isLoading,
        login,
        logout,
        refetchUser: () => refetch(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
