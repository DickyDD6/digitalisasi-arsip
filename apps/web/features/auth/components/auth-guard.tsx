"use client";

import { useRouter } from "nextjs-toploader/app";
import { useEffect, useRef } from "react";
import { useAuthStore } from "../auth.store";

export const AuthGuard = () => {
	// const user = useAuthStore((s) => s.user);
	// const router = useRouter();
	// const redirectedRef = useRef(false);

	// useEffect(() => {
	// 	if (!user && !redirectedRef.current) {
	// 		redirectedRef.current = true;
	// 		router.replace("/login");
	// 	}
	// }, [user, router]);

	return null;
};
