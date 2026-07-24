"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { authQueries } from "@/features/auth/queries/auth.queries";
import { Flasher } from "./flasher";

export const GuestGuard = ({ children }: { children: React.ReactNode }) => {
	const router = useRouter();

	const {
		data: user,
		isLoading,
		isSuccess,
	} = useQuery({
		...authQueries.userMe(),
		retry: false,
	});

	React.useEffect(() => {
		if (isSuccess && user) {
			router.replace("/");
		}
	}, [isSuccess, user, router]);

	if (isLoading) {
		return <Flasher />;
	}

	if (user) {
		return null;
	}

	return <>{children}</>;
};
