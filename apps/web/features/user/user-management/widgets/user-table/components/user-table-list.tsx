"use client";

import { Button } from "@repo/ui/components/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@repo/ui/components/table";
import { SortAsc } from "@repo/ui/icons";
import { flexRender } from "@tanstack/react-table";
import {
	UserTableListFilterSelect,
	UserTableListSkeleton,
	useUserTableContext,
} from "..";

export const UserTableList = () => {
	const { table, query } = useUserTableContext();

	if (!table || !query) return null;

	const { isLoading, isPending, isFetching } = query;

	if (isLoading || isPending || isFetching) return <UserTableListSkeleton />;

	return (
		<Table className="border-y">
			<TableHeader>
				{table.getHeaderGroups().map((headerGroup) => (
					<TableRow key={headerGroup.id}>
						{headerGroup.headers.map((header) => (
							<TableHead key={header.id}>
								<div className="flex gap-2 items-center">
									{header.id === "select" ? (
										header.isPlaceholder ? null : (
											flexRender(
												header.column.columnDef.header,
												header.getContext(),
											)
										)
									) : (
										<Button
											variant={"ghost"}
											className={
												!header.column.getCanSort()
													? "hover:bg-transparent cursor-default"
													: ""
											}
											onClick={header.column.getToggleSortingHandler()}
										>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
											{{
												asc: <SortAsc className="inline size-4 ml-2" />,
												desc: (
													<SortAsc className="inline size-4 ml-2 rotate-180" />
												),
											}[header.column.getIsSorted() as string] ?? null}
										</Button>
									)}
									{header.column.columnDef.meta?.isFilterable && (
										<UserTableListFilterSelect column={header.column} />
									)}
								</div>
							</TableHead>
						))}
					</TableRow>
				))}
			</TableHeader>
			<TableBody>
				{table.getRowModel().rows.map((row) => (
					<TableRow key={row.id}>
						{row.getVisibleCells().map((cell) => (
							<TableCell key={cell.id} className="nth-[2]:text-center">
								{flexRender(cell.column.columnDef.cell, cell.getContext())}
							</TableCell>
						))}
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};
