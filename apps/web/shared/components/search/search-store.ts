import { create } from "zustand";

export const useSearchCommandStore = create<{
	open: boolean;
	openSearchCommand: () => void;
	closeSearchCommand: () => void;
	toggleSearchCommand: () => void;
}>()((set) => ({
	open: false,
	openSearchCommand: () => set({ open: true }),
	closeSearchCommand: () => set({ open: false }),
	toggleSearchCommand: () => set((state) => ({ open: !state.open })),
}));
