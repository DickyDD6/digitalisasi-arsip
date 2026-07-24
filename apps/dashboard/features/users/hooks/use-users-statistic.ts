"use client";

import { userQueries } from "../queries/user.queries";
import { useQuery } from "@tanstack/react-query";

export const useUsersStatistic = () => useQuery(userQueries.statistics());
