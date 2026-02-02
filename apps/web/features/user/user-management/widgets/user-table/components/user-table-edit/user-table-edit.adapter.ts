import { User } from "@/features/user";
import { UserTableEditFormData } from ".";

export const adaptUserToEditFormData = (user: User): UserTableEditFormData => ({
	...user,
	password: "",
	user_status: "ACTIVE",
});
