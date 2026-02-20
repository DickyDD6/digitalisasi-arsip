"use client";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { FolderArchive, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import { SIDEBAR_ITEMS } from "../_lib/sidebar-items";
import Link from "next/link";

export const DashboardSidebar = () => {
	const pathname = usePathname();

	return (
		<Sidebar collapsible="icon" className="border-none shadow-sm">
			<SidebarHeader className="shadow-sm py-3.5">
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton className="hover:bg-transparent focus:bg-transparent active:bg-transparent cursor-default overflow-visible group-data-[collapsible=icon]:overflow-hidden p-0 group-data-[collapsible=icon]:p-0!">
							<div className="h-full px-1 rounded-md bg-primary place-content-center">
								<FolderArchive className="text-primary-foreground size-5" />
							</div>
							<div className="leading-2">
								<h2 className="-mt-1 text-xl font-semibold">Dashboard</h2>
								<p className="text-muted-foreground">Manager</p>
							</div>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{/* <SidebarMenuItem className="block mb-4 border md:hidden">
								<SearchInput withCommand />
							</SidebarMenuItem> */}
							{SIDEBAR_ITEMS.map((item, i) => (
								<SidebarMenuItem key={i}>
									<SidebarMenuButton isActive={pathname === item.link} asChild>
										<Link href={item.link}>
											<item.icon />
											{item.label}
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild>
							<Link href={"/dashboard/settings"}>
								<Settings />
								Pengaturan Sistem
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
					{/* <SidebarMenuItem>
						<UserDropdown />
					</SidebarMenuItem> */}
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
};
