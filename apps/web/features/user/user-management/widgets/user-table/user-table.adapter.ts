import { User } from "@/features/user";
import { UserTableData } from ".";
import { Role, USER_STATUS } from "@/shared/constants";

export const adaptUsersToTableData = (data: User[]): UserTableData[] =>
	data.map((user) => ({
		...user,
		role: user.role.toUpperCase() as Role,
		user_status: USER_STATUS.ACTIVE,
		last_active: new Date("2026-01-24"),
	}));
