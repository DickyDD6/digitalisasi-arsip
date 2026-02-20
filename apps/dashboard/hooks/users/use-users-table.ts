import { USER_QUERY } from "@/queries/user.query";
import { useQuery } from "@tanstack/react-query";

export const useUsersTable = (params?: UserParams) =>
	useQuery(USER_QUERY.usersTableQuery(params));
