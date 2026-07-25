import type React from "react";
import { AuthGuard } from "@/features/auth/components/auth-guard";
import { SidebarProvider } from "@repo/ui/sidebar";
import { DashboardNavbar } from "@/features/layout/components/dashboard-navbar";
import { DashboardSidebar } from "@/features/layout/components/dashboard-sidebar";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<AuthGuard>
			<SidebarProvider>
				<DashboardSidebar />
				<div className="w-full h-screen flex flex-col transition-all duration-300 ease-in-out peer-data-[state=collapsed]:md:w-[calc(100vw-var(--sidebar-width-icon))] peer-data-[state=expanded]:md:w-[calc(100vw-var(--sidebar-width))]">
					<DashboardNavbar />
					<main className="flex-1 overflow-y-auto overflow-x-hidden">
						<div className="flex flex-col gap-5 px-4 py-4 pb-2 min-h-full">
							{children}
						</div>
					</main>
				</div>
			</SidebarProvider>
		</AuthGuard>
	);
}
