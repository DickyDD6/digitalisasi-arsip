import { create } from "zustand";
import { EditProfileMeStore } from "./edit-profile-me.types";

export const useEditProfileMeStore = create<EditProfileMeStore>((set) => ({
	editProfileMe: false,
	toggleEditProfileMe: () =>
		set((state) => ({ editProfileMe: !state.editProfileMe })),
}));
