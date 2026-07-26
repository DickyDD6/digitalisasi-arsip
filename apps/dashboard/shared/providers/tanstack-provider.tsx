"use client";

import { getQueryClient } from "@/shared/lib/query-instance";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";

export const TanstackProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const queryClient = getQueryClient();
  return <QueryClientProvider client={queryClient} {...{ children }} />;
};
