"use client";

import { userQueries } from "../queries/user.queries";
import { useQuery } from "@tanstack/react-query";

export const useUsersTable = (params?: UserParams) =>
  useQuery(userQueries.list(params));
