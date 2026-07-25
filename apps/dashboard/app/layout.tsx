import type { Metadata } from "next";
import { Poppins, Noto_Sans, Inter } from "next/font/google";
import "@repo/ui/globals.css";
import { favicons } from "@/config/favicons";
import { TanstackProvider } from "./tanstack-provider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ConsoleSecurity } from "@/shared/components/console-security";
import NextTopLoader from "nextjs-toploader";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { cn } from "@/shared/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "Digital Arsip",
    template: "%s | Digital Arsip",
  },
  description:
    "Sistem pengarsipan digital yang dikembangkan untuk mendukung pengelolaan dokumen akademik di Fakultas Teknik Universitas Pasundan. Sistem ini memberikan pengelolaan, struktur, dan keamanan yang terpusat untuk arsip transkrip, nilai, ijazah, dan proses perkara, sebagai bagian dari pengembangan proyek Akhir.",
  manifest: "/manifest",
  icons: favicons,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body className={`${poppins.className}`}>
        <NextTopLoader color="var(--primary)" showSpinner={false} />
        <ConsoleSecurity />
        <TanstackProvider>
          <TooltipProvider>{children}</TooltipProvider>
          <ReactQueryDevtools initialIsOpen={false} />
          <Toaster
            position="top-right"
            richColors
            theme="light"
            closeButton
            visibleToasts={3}
          />
        </TanstackProvider>
      </body>
    </html>
  );
}
