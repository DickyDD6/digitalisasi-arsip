"use client";

import { GuestGuard } from "@/components/guest-guard";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GuestGuard>
      <div className="min-h-screen place-items-center place-content-center">
        {children}
      </div>
    </GuestGuard>
  );
}
