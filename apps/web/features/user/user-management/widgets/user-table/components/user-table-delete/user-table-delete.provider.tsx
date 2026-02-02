import { User } from "@/features/user";
import { UserTableDeleteData } from ".";

export const adaptUserToDeleteData = (user: User): UserTableDeleteData => ({
	...user,
	user_status: "ACTIVE",
});
