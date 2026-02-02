import {
	FileText,
	FolderArchive,
	LayoutDashboard,
	Logs,
	UsersRound,
} from "@repo/ui/icons";

export const sidebarItems = [
	{
		label: "Dashboard",
		link: "/dashboard",
		icon: LayoutDashboard,
	},
	{
		label: "Pengelolaan Arsip",
		link: "/dashboard/manage-archive",
		icon: FolderArchive,
	},
	{
		label: "Aktivitas Log",
		link: "/dashboard/log-activity",
		icon: Logs,
	},
	{
		label: "Pengelolaan Pengguna",
		link: "/dashboard/manage-user",
		icon: UsersRound,
	},
	{
		label: "Laporan",
		link: "/dashboard/report",
		icon: FileText,
	},
];
