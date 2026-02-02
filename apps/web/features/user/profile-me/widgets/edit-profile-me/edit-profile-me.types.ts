import { Role } from "@/shared/constants";

export interface EditProfileMe {
	id: number;
	name: string;
	email: string;
	role: Role;
}

interface EditProfileMeState {
	editProfileMe: boolean;
}

interface EditProfileMeActions {
	toggleEditProfileMe: () => void;
}

export interface EditProfileMeStore
	extends EditProfileMeState, EditProfileMeActions {}
