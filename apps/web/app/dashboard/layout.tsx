import { SearchCommandShortcut } from "@/shared/components/search/search-input";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import { SidebarProvider } from "@repo/ui/components/sidebar";
import { Metadata } from "next";
import { ReactNode } from "react";
import { DashboardNavbar } from "./_components/dashboard-navbar";
import { DashboardSidebar } from "./_components/dashboard-sidebar";

export const metadata: Metadata = {
	title: {
		default: "Dashboard",
		template: "Dashboard - %s | Digital Archive",
	},
	description:
		"Archive digitization dashboard system developed to support academic document management within the Faculty of Engineering, Pasundan University. This system provides centralized, structured, and secure archive management for transcripts, course grades, diplomas, and trial minutes, as part of the development of the Final Project.",
};

const DashboardLayout = ({ children }: { children: ReactNode }) => {
	return (
		<>
			<SidebarProvider>
				<DashboardSidebar />
				<div className="w-screen h-screen relative">
					<DashboardNavbar />
					<ScrollArea className="h-full min-h-0">
						<main className="flex flex-col gap-5 px-4 py-20 pb-2">
							{children}
						</main>
					</ScrollArea>
				</div>
			</SidebarProvider>
			<SearchCommandShortcut />
		</>
	);
};

export default DashboardLayout;
