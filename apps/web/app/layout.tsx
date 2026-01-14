import { Toaster } from "@repo/ui/components/sonner";
import "@repo/ui/globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { TanstackQueryProvider } from "./providers";

export const metadata: Metadata = {
	title: "Digital Archive",
	description:
		"Sistem dashboard digitalisasi arsip yang dikembangkan untuk mendukung pengelolaan dokumen akademik di lingkungan Fakultas Teknik Universitas Pasundan. Sistem ini menyediakan pengelolaan arsip terpusat, terstruktur, dan aman untuk transkrip nilai, nilai mata kuliah, ijazah, serta berita acara sidang, sebagai bagian dari pengembangan Tugas Akhir.",
};

const poppins = Poppins({
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
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
