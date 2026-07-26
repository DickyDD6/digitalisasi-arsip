import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authQueries } from "../queries/auth.queries";
import { authService } from "../services/auth.service";
import { LoginCredentials } from "../types/auth.types";

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const userQuery = useQuery(authQueries.userMe());

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: (data) => {
      const user =
        data?.data?.user ?? (data as unknown as { user?: User })?.user;
      if (user) {
        queryClient.setQueryData(["auth", "me"], user);
        if (typeof window !== "undefined") {
          document.documentElement.setAttribute(
            "data-role",
            user.role || "default",
          );
        }
        toast.success("Login Berhasil", {
          description: `Selamat datang kembali, ${user.name}!`,
        });
      }
      router.push("/");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await authService.logout();
    },
    onSuccess: () => {
      queryClient.setQueryData(["auth", "me"], null);
      queryClient.removeQueries({ queryKey: ["auth"] });
      if (typeof window !== "undefined") {
        document.documentElement.setAttribute("data-role", "default");
        window.location.href = "/login";
      }
    },
    onError: () => {
      queryClient.setQueryData(["auth", "me"], null);
      queryClient.removeQueries({ queryKey: ["auth"] });
      if (typeof window !== "undefined") {
        document.documentElement.setAttribute("data-role", "default");
        window.location.href = "/login";
      }
    },
  });

  return {
    user: userQuery.data,
    isLoading: userQuery.isLoading,
    isError: userQuery.isError,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
  };
}
