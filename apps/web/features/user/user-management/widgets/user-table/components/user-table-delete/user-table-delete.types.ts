import { User } from "@/features/user";
import { UserStatus } from "@/shared/constants";

export interface UserTableDeleteData extends Omit<User, "password"> {
	user_status: UserStatus;
}
