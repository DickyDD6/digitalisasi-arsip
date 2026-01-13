import { http } from "@/shared/lib";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { login } from "../auth.api";
import { useAuthStore } from "../auth.store";
import { useEffect } from "react";
import { useRouter } from "nextjs-toploader/app";

export const useLogin = () => {
	const setSession = useAuthStore((s) => s.setSession);
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationFn: login,
		mutationKey: ["auth-login"],
		onSuccess: (data) => {
			toast.success("LogIn Success!");
			setSession(data.accessToken);
			queryClient.invalidateQueries({ queryKey: ["current-user"] });
			router.replace("/dashboard");
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};

export const useUserAuthenticated = () => {
	const token = useAuthStore((s) => s.token);
	const setUser = useAuthStore((s) => s.setUser);

	const query = useQuery({
		queryFn: async () => {
			const { data, status } = await http.get("/user/me", {
				headers: { Authorization: `Bearer ${token}` },
			});

			if (status !== 200) throw new Error("Unauthorized");

			return data;
		},
		enabled: !!token,
		queryKey: ["current-user", token],
	});

	useEffect(() => {
		if (!query.isSuccess) return;

		const data = query.data;

		setUser({
			id: data.id,
			username: data.username,
			// role adapter, karna sekarang pakai dummyjson jadi saya konversi manual disini
			// role uploader belum ada karna di dummyjson hanya ada 3 role yaitu admin, moderator dan user
			// TODO: sesuaikan dengan backend jika backend restful api sudah ready
			role:
				data.role === "admin"
					? "MANAGER"
					: data.role === "moderator"
						? "QC"
						: "SBAP",
		});
	}, [query.isSuccess, query.data, setUser]);

	return query;
};
