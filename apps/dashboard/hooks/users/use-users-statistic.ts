"use client";

import { USER_QUERY } from "@/queries/user.query";
import { useQuery } from "@tanstack/react-query";

export const useUsersStatistic = () =>
  useQuery(USER_QUERY.usersStatisticQuery());
