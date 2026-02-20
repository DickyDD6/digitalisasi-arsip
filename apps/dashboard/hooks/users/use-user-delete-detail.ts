"use client";

import { USER_QUERY } from "@/queries/user.query";
import { useQuery } from "@tanstack/react-query";

export const useUserDeleteDetail = (id: number) =>
	useQuery(USER_QUERY.userDeleteQuery(id));
