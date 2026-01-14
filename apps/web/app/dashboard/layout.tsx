import { SearchCommandShortcut } from "@/shared/components/search/search-input";
import { SidebarProvider } from "@repo/ui/components/sidebar";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import { ReactNode } from "react";
import { DashboardNavbar } from "./_components/dashboard-navbar";
import { DashboardSidebar } from "./_components/dashboard-sidebar";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
	return (
		<>
			<SidebarProvider>
				<DashboardSidebar />
				<div className="flex flex-col w-screen h-screen">
					<DashboardNavbar />
					<ScrollArea className="flex-1 overflow-y-auto">
						<main className="flex flex-col gap-5 px-5 py-2">{children}</main>
					</ScrollArea>
				</div>
			</SidebarProvider>
			<SearchCommandShortcut />
		</>
	);
};

export default DashboardLayout;
