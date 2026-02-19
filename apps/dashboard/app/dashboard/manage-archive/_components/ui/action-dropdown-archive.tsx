"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import React from "react";
import { DeleteArchiveModal } from "./delete-archive-modal";
import { DownloadArchiveModal } from "./download-archive-modal";
import { ViewArchiveModal } from "./view-archive-modal";

export const ActionDropdownArchive = ({
	row,
}: {
	row: Row<ArchiveDocument>;
}) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon-sm">
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				onCloseAutoFocus={(e) => e.preventDefault()}
				className="grid gap-2"
			>
				<DropdownMenuItem asChild>
					<ViewArchiveModal id={row.original.id} />
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<DownloadArchiveModal id={row.original.id} />
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<DeleteArchiveModal id={row.original.id} />
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
