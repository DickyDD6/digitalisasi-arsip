"use client";

import type React from "react";
import { GuestGuard } from "@/components/guest-guard";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<GuestGuard>
			<div className="min-h-screen flex items-center justify-center">
				{children}
			</div>
		</GuestGuard>
	);
}
