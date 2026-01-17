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
		label: "Archive Management",
		link: "/dashboard/manage-archive",
		icon: FolderArchive,
	},
	{
		label: "Log Activity",
		link: "/dashboard/log-activity",
		icon: Logs,
	},
	{
		label: "User Management",
		link: "/dashboard/manage-user",
		icon: UsersRound,
	},
	{
		label: "Report",
		link: "/dashboard/report",
		icon: FileText,
	},
];
