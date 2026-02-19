import { User } from "@/features/user";
import { UserStatus } from "@/shared/constants";

export interface UserTableData extends User {
	user_status: UserStatus;
	last_active: Date;
}
