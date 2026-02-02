"use client";

import { Skeleton } from "@repo/ui/components/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@repo/ui/components/table";
import { useUserTableContext } from "..";

export const UserTableListSkeleton = () => {
	const { table } = useUserTableContext();

	if (!table) return null;

	return (
		<Table>
			<TableHeader>
				<TableRow>
					{table.getHeaderGroups().map((headerGroup) =>
						headerGroup.headers.map((header) => (
							<TableHead key={header.id} className="group/cell-header">
								<Skeleton className="h-2 group-first/cell-header:h-5 group-first/cell-header:w-5 group-nth-[2]/cell-header:w-8 group-nth-[3]/cell-header:w-10 group-nth-[4]/cell-header:w-10 group-nth-[5]/cell-header:w-8 group-nth-[6]/cell-header:w-12 group-nth-[7]/cell-header:w-28 group-last/cell-header:w-16" />
							</TableHead>
						)),
					)}
				</TableRow>
			</TableHeader>
			<TableBody>
				{Array.from({ length: table.getState().pagination.pageSize }).map(
					(_, rowIndex) => (
						<TableRow key={rowIndex} className="group/row-body">
							{Array.from({ length: table.getAllColumns().length - 1 }).map(
								(_, cellIndex) => (
									<TableCell
										key={cellIndex}
										className="group/cell-body nth-[2]:place-items-center"
									>
										<Skeleton className="h-2 group-first/cell-body:h-5 group-first/cell-body:w-5 group-nth-[2]/cell-body:h-5 group-nth-[2]/cell-body:w-5 group-nth-[3]/cell-body:w-44 group-nth-[4]/cell-body:w-80 group-nth-[5]/cell-body:h-4 group-odd/row-body:group-nth-[5]/cell-body:w-28 group-even/row-body:group-nth-[5]/cell-body:w-20 group-nth-[6]/cell-body:h-4 group-nth-[6]/cell-body:w-20 group-even/row-body:group-nth-[7]/cell-body:w-40 group-odd/row-body:group-nth-[7]/cell-body:w-32 w-full" />
									</TableCell>
								),
							)}
							<TableCell>
								<div className="flex gap-2 justify-center">
									<Skeleton className="h-8 w-8" />
									<Skeleton className="h-8 w-8" />
								</div>
							</TableCell>
						</TableRow>
					),
				)}
			</TableBody>
		</Table>
	);
};
