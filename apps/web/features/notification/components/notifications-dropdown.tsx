"use client";

import {useTimeAgo} from "@/shared/hooks/use-time-ago";
import {Badge} from "@repo/ui/components/badge";
import {Button} from "@repo/ui/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import {
	Item,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from "@repo/ui/components/item";
import {
	AlertCircle,
	Bell,
	CircleCheckBig,
	Clock,
	FileText,
	Trash2,
	UserRound,
} from "@repo/ui/icons";
import {cn} from "@repo/ui/lib";
import Link from "next/link";

const mockNotification = [
	{
		title: "Document Awaiting Verification",
		description: "15 New Documents awaiting verification.",
		isRead: false,
		category: "Pending",
		createdAt: "2026-01-14T17:30:00+07:00",
	},
	{
		title: "Document Rejected",
		description: "3 Documents rejected by QC team -needs review.",
		isRead: false,
		category: "Rejected",
		createdAt: "2026-01-14T15:30:00+07:00",
	},
	{
		title: "New User Registered",
		description: "New user 'Ahmad Fauzi' is registered as the Uploader Team.",
		isRead: false,
		category: "New User",
		createdAt: "2026-01-14T14:30:00+07:00",
	},
	{
		title: "Document Verified",
		description: "Document DOC-2024-001 successfully verified.",
		isRead: true,
		category: "Verified",
		createdAt: "2026-01-14T13:30:00+07:00",
	},
	{
		title: "Document Deleted",
		description: "10 Duplicate documents removed by Admin.",
		isRead: true,
		category: "Deleted",
		createdAt: "2026-01-14T11:30:00+07:00",
	},
	{
		title: "Report Ready to Download",
		description: "December 2024 monthly report ready to download.",
		isRead: true,
		category: "Ready To Download",
		createdAt: "2026-01-13T16:30:00+07:00",
	},
];

const iconNotif = [
	{
		icon: Clock,
		category: "Pending",
		color: "text-yellow-600",
	},
	{
		icon: AlertCircle,
		category: "Rejected",
		color: "text-destructive",
	},
	{
		icon: UserRound,
		category: "New User",
		color: "text-blue-600",
	},
	{
		icon: CircleCheckBig,
		category: "Verified",
		color: "text-green-600",
	},
	{
		icon: Trash2,
		category: "Deleted",
		color: "text-muted-foreground",
	},
	{
		icon: FileText,
		category: "Ready To Download",
		color: "text-primary",
	},
];

export const NotificationsDropdown = () => {
	const {timeAgo} = useTimeAgo();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant={"ghost"} size={"icon"} className="relative">
					<Bell/>
					{mockNotification.filter((i) => i?.isRead === false).length > 0 && (
						<Badge
							variant={"destructive"}
							className="absolute p-0.5 top-3 right-3"
						/>
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="p-0 mr-2 min-w-100">
				<DropdownMenuGroup className="flex items-center justify-between px-2 border-b">
					<div className="flex items-center">
						<DropdownMenuLabel>Notifications</DropdownMenuLabel>
						<Badge>{mockNotification.filter((i) => i?.isRead === false).length}</Badge>
					</div>
					<Button variant={"link"}>Mark All Read</Button>
				</DropdownMenuGroup>
				<DropdownMenuGroup>
					{mockNotification
						.sort(
							(a, b) =>
								new Date(b.createdAt).getTime() -
								new Date(a.createdAt).getTime(),
						)
						.slice(0, 5)
						.map((item, i) => (
							<Item
								key={i}
								className={cn(
									"p-0 rounded-none not-last:border-b-border",
									!item.isRead && "bg-orange-100",
								)}
							>
								<DropdownMenuItem className="w-full rounded-none">
									<ItemMedia>
										{iconNotif
											.filter((i) => i.category === item.category)
											.map(({icon: Icon, color}, i) => (
												<Icon key={i} className={cn("size-6", color)}/>
											))}
									</ItemMedia>
									<ItemContent>
										<ItemTitle>{item.title}</ItemTitle>
										<ItemDescription>{item.description}</ItemDescription>
										<span className="flex items-center gap-1">
											<Clock/>
											{timeAgo(item.createdAt)}
										</span>
									</ItemContent>
									{!item.isRead && (
										<ItemMedia>
											<Badge variant={"destructive"} className="p-1"/>
										</ItemMedia>
									)}
								</DropdownMenuItem>
							</Item>
						))}
				</DropdownMenuGroup>
				{mockNotification.length > 5 && (
					<DropdownMenuGroup className="flex justify-center py-2 border-t">
						<DropdownMenuItem className="hover:bg-transparent!" asChild>
							<Link href={"/dashboard/notifications"}>
								<Button variant={"link"}>View all notifications</Button>
							</Link>
						</DropdownMenuItem>
					</DropdownMenuGroup>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
