import { SearchInput } from "@/shared/components/search/search-input";
import { SidebarTrigger } from "@repo/ui/components/sidebar";
import Image from "next/image";
import { NotificationsDropdown } from "@/features/notification/components/notifications-dropdown";

export const DashboardNavbar = () => {
	return (
		<nav className="z-10 flex items-center justify-between w-full p-2 shadow-sm bg-card absolute top-0 inset-x-0">
			<div className="flex items-center gap-4">
				<SidebarTrigger />
				<div className="flex items-center gap-2">
					<Image
						src={"/img/logo-univ.png"}
						alt="logo-universitas-pasundan"
						width={40}
						height={40}
						className="size-6 md:size-8"
					/>
					<Image
						src={"/img/logo-ft.png"}
						alt="logo-fakultas-teknik"
						width={40}
						height={40}
						className="size-6 md:size-8"
					/>
					<div className="flex flex-col justify-center">
						<h1 className="text-lg font-semibold md:text-xl">
							Digital Archive
						</h1>
						<p className="text-xs text-muted-foreground">
							Fakultas Teknik Universitas Pasundan
						</p>
					</div>
				</div>
			</div>

			<div className="items-center hidden gap-4 md:flex">
				<SearchInput withCommand />
				<NotificationsDropdown />
			</div>
		</nav>
	);
};
