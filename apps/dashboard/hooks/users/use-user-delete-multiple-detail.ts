"use client";

import { USER_QUERY } from "@/queries/user.query";
import { useQuery } from "@tanstack/react-query";

export const useUserDeleteMultipleDetail = (ids: number[]) =>
  useQuery(USER_QUERY.userDeleteMultipleQuery(ids));
