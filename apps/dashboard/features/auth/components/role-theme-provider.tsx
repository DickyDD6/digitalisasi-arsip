"use client";

import React, { useEffect } from "react";
import { UserRole } from "@/config/rbac";

interface RoleThemeProviderProps {
  role?: UserRole;
  children: React.ReactNode;
}

export const RoleThemeProvider: React.FC<RoleThemeProviderProps> = ({
  role,
  children,
}) => {
  useEffect(() => {
    const root = document.documentElement;
    if (role) {
      root.setAttribute("data-role", role);
    } else {
      root.setAttribute("data-role", "default");
    }
  }, [role]);

  return <>{children}</>;
};
