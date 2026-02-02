import { Toaster } from "@repo/ui/components/sonner";
import "@repo/ui/globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { TanstackQueryProvider } from "./providers";
import { ReactNode } from "react";

export const metadata: Metadata = {
	title: {
		default: "Digital Archive",
		template: "%s | Digital Archive",
	},
	description:
		"Archive digitization dashboard system developed to support academic document management within the Faculty of Engineering, Pasundan University. This system provides centralized, structured, and secure archive management for transcripts, course grades, diplomas, and trial minutes, as part of the development of the Final Project.",
};

const poppins = Poppins({
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={poppins.className}>
				<NextTopLoader showSpinner={false} color="var(--primary)" />
				<TanstackQueryProvider>{children}</TanstackQueryProvider>
				<Toaster richColors theme="light" position="top-right" />
			</body>
		</html>
	);
}
