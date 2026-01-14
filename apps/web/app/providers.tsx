"use client";

import { AuthBootstrap } from "@/features/auth/components/auth-bootstrap";
import { AuthGuard } from "@/features/auth/components/auth-guard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PropsWithChildren } from "react";

export const TanstackQueryProvider = ({ children }: PropsWithChildren) => {
	const queryClient = new QueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<AuthBootstrap />
			<AuthGuard />
			{children}
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
};
