"use client";

import { userQueries } from "../queries/user.queries";
import { useQuery } from "@tanstack/react-query";

export const useUserDeleteDetail = (id: number) =>
  useQuery(userQueries.detail(id));

export const useUserDeleteMultipleDetail = (ids: number[]) =>
  useQuery(userQueries.detail(ids[0] ?? 0));

export const useUserUpdateDetail = (id: number) =>
  useQuery(userQueries.detail(id));
