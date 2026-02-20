"use client";

import { Button } from "@/components/ui/button";
import {
	DataTableColumnHeader,
	DataTablePagination,
} from "@/components/ui/data-table";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ROLE } from "@/constants/role";
import { useUsersTable } from "@/hooks/users/use-users-table";
import { useQueryClient } from "@tanstack/react-query";
import {
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	PaginationState,
	useReactTable,
} from "@tanstack/react-table";
import { CloudAlert, Loader2, UserRoundX } from "lucide-react";
import { useState } from "react";
import { tableUsersColumn } from "../_lib/table-users-column";
import { DeleteUserModal } from "./ui/delete-user-modal";

export const DataTableUsers = () => {
	const [roleFilter, setRoleFilter] = useState<UserRole | undefined>();
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});

	const queryClient = useQueryClient();

	const { data, isLoading, isError, refetch, isFetching, isPending } =
		useUsersTable({
			role: roleFilter,
			page: pagination.pageIndex + 1,
			per_page: pagination.pageSize,
		});

	const currentUser = queryClient.getQueryData<User>(["current", "user"]);

	// eslint-disable-next-line react-hooks/incompatible-library
	const table = useReactTable({
		data: data?.users || [],
		columns: tableUsersColumn,
		defaultColumn: {
			cell: ({ getValue }) => {
				const value = getValue();
				return typeof value === "string" ? value : "-";
			},
		},
		manualFiltering: true,
		manualPagination: true,
		pageCount: data
			? Math.ceil((data.meta?.total || 0) / pagination.pageSize)
			: 0,
		state: {
			columnFilters: [
				{
					id: "role",
					value: roleFilter,
				},
			],
			pagination,
		},
		onColumnFiltersChange: (updater) => {
			const newFilters =
				typeof updater === "function"
					? updater(table.getState().columnFilters)
					: updater;

			const roleFilter =
				(newFilters.find((f) => f.id === "role")?.value as UserRole) || "";
			setRoleFilter(roleFilter);
		},
		enableRowSelection: (row) =>
			(!!row.id || !!row.index) &&
			row.original.role !== ROLE.MANAGER &&
			row.original.id !== currentUser?.id,
		onPaginationChange: setPagination,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

	return (
		<>
			{table.getSelectedRowModel().rows.length > 1 && (
				<div className="flex items-center justify-between gap-2 py-2 px-4 border rounded-md">
					<span className="text-sm">
						{table.getSelectedRowModel().rows.length} dari {table.getRowCount()}{" "}
						baris dipilih
					</span>

					<div className="flex gap-4">
						<DeleteUserModal
							id={table
								.getSelectedRowModel()
								.rows.map((row) => row.original.id)}
						/>
					</div>
				</div>
			)}

			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<TableHead key={header.id}>
									{header.column.getCanSort() ? (
										<div className="flex gap-1 items-center">
											<DataTableColumnHeader
												column={header.column}
												title={header.column.columnDef.header as string}
											/>
											{header.column.getCanFilter() && (
												<Select
													value={roleFilter}
													onValueChange={(value) =>
														setRoleFilter(
															value === "all" ? undefined : (value as UserRole),
														)
													}
												>
													<SelectTrigger>
														<SelectValue placeholder="Filter Peran" />
													</SelectTrigger>
													<SelectContent position={"popper"}>
														<SelectGroup>
															<SelectLabel>Filter Peran</SelectLabel>
															<SelectItem value="all">Semua Peran</SelectItem>
															{Object.entries(ROLE).map(([key, value]) => (
																<SelectItem key={key} value={value}>
																	{key}
																</SelectItem>
															))}
														</SelectGroup>
													</SelectContent>
												</Select>
											)}
										</div>
									) : header.isPlaceholder ? null : (
										flexRender(
											header.column.columnDef.header,
											header.getContext(),
										)
									)}
								</TableHead>
							))}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{isLoading ? (
						<TableRow>
							<TableCell
								colSpan={table.getAllColumns().length}
								className="h-24 text-center"
							>
								<div className="flex flex-col gap-2 items-center justify-center">
									<Loader2 className="animate-spin" />
									Sedang Memuat Data...
								</div>
							</TableCell>
						</TableRow>
					) : isError ? (
						<TableRow>
							<TableCell
								colSpan={table.getAllColumns().length}
								className="h-24 text-center"
							>
								<Empty>
									<EmptyHeader>
										<EmptyMedia>
											<CloudAlert />
										</EmptyMedia>
										<EmptyTitle>Gagal memuat data</EmptyTitle>
										<EmptyDescription>
											Terjadi kesalahan saat mengambil data pengguna.
										</EmptyDescription>
									</EmptyHeader>
									<EmptyContent>
										<Button variant={"outline"} onClick={() => refetch()}>
											Muat Ulang Data
										</Button>
									</EmptyContent>
								</Empty>
							</TableCell>
						</TableRow>
					) : table.getRowModel().rows.length > 0 ? (
						table.getRowModel().rows.map((row) => (
							<TableRow key={row.id}>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell
								colSpan={table.getAllColumns().length}
								className="h-24 text-center"
							>
								<Empty>
									<EmptyHeader>
										<EmptyMedia>
											<UserRoundX />
										</EmptyMedia>
										<EmptyTitle>Belum ada pengguna</EmptyTitle>
										<EmptyDescription>
											Tambahkan pengguna untuk mulai mengelola akses.
										</EmptyDescription>
									</EmptyHeader>
									<EmptyContent>
										<Button>Tambah Pengguna</Button>
									</EmptyContent>
								</Empty>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>

			<DataTablePagination
				{...{
					table,
					isFetching,
					isPending,
				}}
			/>
		</>
	);
};
