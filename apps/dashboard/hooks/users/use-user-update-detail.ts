"use client";

import { USER_QUERY } from "@/queries/user.query";
import { useQuery } from "@tanstack/react-query";

export const useUserUpdateDetail = (id: number) =>
  useQuery(USER_QUERY.userUpdateQuery(id));
