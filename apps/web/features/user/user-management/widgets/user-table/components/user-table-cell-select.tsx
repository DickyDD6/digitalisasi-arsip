"use client";

import { CellContext } from "@tanstack/react-table";
import { UserTableData } from "../user-table.types";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { RoleBadge } from "@/shared/components/role-badge";
import { ROLE, Role } from "@/shared/constants/role";
import { USER_STATUS } from "@/shared/constants";
import { StatusBadge } from "@/shared/components/status-badge";
import { useState } from "react";

export const UserTableCellSelect = ({
	context,
	variant,
}: {
	context: CellContext<UserTableData, unknown>;
	variant: "role" | "user_status";
}) => {
	const [value, setValue] = useState<string>(context.getValue<string>());
	const selectList = Object.entries(
		{ role: ROLE, user_status: USER_STATUS }[variant],
	);
	const selectedRole = Object.fromEntries(
		selectList.map(([key, val]) => [val, key]),
	);
	const selectedStatus = Object.fromEntries(
		selectList.map(([key, val]) => [val, key]),
	);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				{variant === "role" ? (
					<RoleBadge variant={selectedRole[value] as keyof typeof ROLE}>
						{selectedRole[value]}
					</RoleBadge>
				) : (
					<StatusBadge
						variant={selectedStatus[value] as keyof typeof USER_STATUS}
					>
						{selectedStatus[value]}
					</StatusBadge>
				)}
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				{selectList.map(([key, val]) =>
					variant === "role" ? (
						<DropdownMenuItem key={val} onClick={() => setValue(val)}>
							<RoleBadge variant={key as keyof typeof ROLE}>{val}</RoleBadge>
						</DropdownMenuItem>
					) : (
						<DropdownMenuItem key={val} onClick={() => setValue(val)}>
							<StatusBadge variant={key as keyof typeof USER_STATUS}>
								{val}
							</StatusBadge>
						</DropdownMenuItem>
					),
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
