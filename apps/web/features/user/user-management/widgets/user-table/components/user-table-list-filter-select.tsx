import { Role, ROLE, USER_STATUS } from "@/shared/constants";
import { Button } from "@repo/ui/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Funnel } from "@repo/ui/icons";
import { Column } from "@tanstack/react-table";
import { UserTableData } from "../user-table.types";
import { RoleBadge } from "@/shared/components/role-badge";
import { StatusBadge } from "@/shared/components/status-badge";

export const UserTableListFilterSelect = ({
	column,
}: {
	column: Column<UserTableData, unknown>;
}) => {
	const { filterType } = column.columnDef.meta ?? {};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					size={column.getFilterValue() ? "sm" : "icon"}
				>
					{column.getFilterValue() ? (
						<>
							{column.getFilterValue()?.toString()}
							<Funnel />
						</>
					) : (
						<Funnel />
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem asChild>
					<Button
						variant={"ghost"}
						size={"sm"}
						className="w-full justify-start"
						onClick={() => column.setFilterValue("")}
					>
						{filterType === "role" ? "Semua Role" : "Semua Status"}
					</Button>
				</DropdownMenuItem>
				{Object.entries(
					{ role: ROLE, user_status: USER_STATUS }[filterType!],
				).map(([key, value]) => (
					<DropdownMenuItem
						key={key}
						onClick={() => column.setFilterValue(value)}
					>
						{filterType === "role" ? (
							<RoleBadge variant={key as keyof typeof ROLE}>{value}</RoleBadge>
						) : (
							<StatusBadge variant={key as keyof typeof USER_STATUS}>
								{value}
							</StatusBadge>
						)}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
