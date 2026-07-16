"use client";

import { AUTH_QUERY } from "@/queries/auth.query";
import { useQuery } from "@tanstack/react-query";

export const useCurrentUser = () => useQuery(AUTH_QUERY.userMeQuery());
