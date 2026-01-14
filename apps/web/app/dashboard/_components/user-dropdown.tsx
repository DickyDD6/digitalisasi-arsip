import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import {
	Item,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from "@repo/ui/components/item";
import { SidebarMenuButton } from "@repo/ui/components/sidebar";
import {
	CircleQuestionMarkIcon,
	Ellipsis,
	KeyRound,
	LogOut,
	UserCircle2,
	UserRound,
} from "@repo/ui/index";

export const UserDropdown = () => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="cursor-pointer group-data-[collapsible=icon]:p-0!" asChild>
				<SidebarMenuButton className="h-full" asChild>
					<Item className="group-data-[collapsible=icon]:justify-center">
						<ItemMedia className="group-data-[collapsible=icon]:self-center group-data-[collapsible=icon]:translate-y-0!">
							<UserCircle2 className="group-data-[collapsible=icon]:size-4!" />
						</ItemMedia>
						<ItemContent className="gap-px group-data-[collapsible=icon]:hidden">
							<ItemTitle>John Doe</ItemTitle>
							<ItemDescription>Manajer</ItemDescription>
						</ItemContent>
						<ItemMedia className="group-data-[collapsible=icon]:hidden">
							<Ellipsis />
						</ItemMedia>
					</Item>
				</SidebarMenuButton>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="px-0 ml-2 space-y-2">
				<DropdownMenuGroup className="border-b">
					<Item>
						<ItemContent>
							<ItemTitle>JohnDoe</ItemTitle>
							<ItemDescription className="text-xs line-clamp-1">
								jhondoe@example.com
							</ItemDescription>
						</ItemContent>
						<ItemMedia>
							<Badge>Manajer</Badge>
						</ItemMedia>
					</Item>
				</DropdownMenuGroup>
				<DropdownMenuGroup className="px-2">
					<DropdownMenuItem className="cursor-pointer">
						<UserRound />
						My Profile
					</DropdownMenuItem>
					<DropdownMenuItem className="cursor-pointer">
						<KeyRound />
						Change Password
					</DropdownMenuItem>
					<DropdownMenuItem className="cursor-pointer">
						<CircleQuestionMarkIcon />
						Help
					</DropdownMenuItem>
					<Button variant={"destructive"} className="w-full">
						<LogOut className="text-white" />
						LogOut
					</Button>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
