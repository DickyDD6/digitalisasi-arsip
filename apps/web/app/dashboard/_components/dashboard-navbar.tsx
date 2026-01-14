import { SearchInput } from "@/shared/components/search/search-input";
import { Button } from "@repo/ui/components/button";
import { SidebarTrigger } from "@repo/ui/components/sidebar";
import { Bell } from "@repo/ui/index";
import Image from "next/image";
import { NotificationsDropdown } from "./notifications-dropdown";

export const DashboardNavbar = () => {
	return (
		<nav className="flex items-center justify-between w-full p-2 shadow-sm bg-card">
			<div className="flex items-center gap-4">
				<SidebarTrigger />
				<div className="flex items-center gap-2">
					<Image
						src={"/img/logo-univ.png"}
						alt="logo-universitas-pasundan"
						width={40}
						height={40}
					/>
					<Image
						src={"/img/logo-ft.png"}
						alt="logo-fakultas-teknik"
						width={40}
						height={40}
					/>
					<div className="flex flex-col justify-center">
						<h1 className="text-xl font-semibold">Digital Archive</h1>
						<p className="text-xs text-muted-foreground">
							Fakultas Teknik Universitas Pasundan
						</p>
					</div>
				</div>
			</div>

			<div className="flex items-center gap-4">
				<SearchInput withCommand />

				<NotificationsDropdown />
			</div>
		</nav>
	);
};
