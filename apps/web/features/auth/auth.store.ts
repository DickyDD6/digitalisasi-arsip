import { create } from "zustand";
import { AuthStore } from "./auth.types";

export const useAuthStore = create<AuthStore>()((set) => ({
	token: null,
	user: null,
	setSession: (token) => set({ token }),
	setUser: (user) => set({ user }),
	clear: () => set({ user: null }),
}));
