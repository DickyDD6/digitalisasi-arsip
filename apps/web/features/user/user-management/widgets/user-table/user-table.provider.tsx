"use client";

import { useGetAllUsers, User } from "@/features/user";
import { ApiResponse } from "@/shared/types";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@repo/ui/components/empty";
import { FilterX } from "@repo/ui/icons";
import { keepPreviousData, UseQueryResult } from "@tanstack/react-query";
import {
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	PaginationState,
	Table,
	useReactTable,
} from "@tanstack/react-table";
import {
	createContext,
	PropsWithChildren,
	useContext,
	useMemo,
	useState,
} from "react";
import { adaptUsersToTableData, USER_TABLE_COLUMNS, UserTableData } from ".";

const UserTableContext = createContext<{
	table?: Table<UserTableData>;
	query?: UseQueryResult<ApiResponse<User[]>>;
}>({ table: undefined, query: undefined });

export const useUserTableContext = () => {
	const context = useContext(UserTableContext);

	if (!context) {
		throw new Error(
			"useUserTableContext must be used within a UserTableProvider",
		);
	}

	return context;
};

export const UserTableProvider = (props: PropsWithChildren) => {
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});

	const users = useGetAllUsers(
		{ page: pagination.pageIndex + 1, per_page: pagination.pageSize },
		{
			queryKey: ["users", pagination],
			placeholderData: keepPreviousData,
			staleTime: 5 * 60 * 1000,
		},
	);

	const tableData = useMemo(
		() => adaptUsersToTableData(users.data?.data ?? []),
		[users.data],
	);

	const table = useReactTable({
		columns: USER_TABLE_COLUMNS,
		data: tableData,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		manualPagination: true,
		state: {
			pagination,
		},
		getRowId: (row) => row.id.toString(),
		enableRowSelection: true,
		onPaginationChange: setPagination,
		pageCount: users.data?.meta ? users.data.meta.last_page : 0,
		rowCount: users.data?.meta ? users.data.meta.total : 0,
	});

	return (
		<UserTableContext.Provider value={{ table, query: users }}>
			{props.children}
			{!users.data ||
			users.isFetching ||
			users.isLoading ||
			users.isPending ||
			table.getFilteredRowModel().rows.length > 0 ? null : (
				<Empty>
					<EmptyHeader>
						<EmptyMedia variant={"icon"}>
							<FilterX />
						</EmptyMedia>
						<EmptyTitle>
							{(() => {
								const roleFilter = table.getColumn("role")?.getFilterValue();
								const statusFilter = table
									.getColumn("user_status")
									?.getFilterValue();

								switch (true) {
									case !!roleFilter && !!statusFilter:
										return `Peran ${roleFilter} dengan status ${statusFilter} tidak ditemukan`;
									case !!roleFilter:
										return `Peran ${roleFilter} tidak ditemukan`;
									case !!statusFilter:
										return `Status ${statusFilter} tidak ditemukan`;
									default:
										return "Data tidak ditemukan";
								}
							})()}
						</EmptyTitle>
						<EmptyDescription>
							Sesuaikan kembali filter untuk melihat lebih banyak data.
						</EmptyDescription>
					</EmptyHeader>
				</Empty>
			)}
		</UserTableContext.Provider>
	);
};
