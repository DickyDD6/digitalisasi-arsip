"use client";

import {
	CardAction,
	CardDescription,
	CardFooter,
} from "@repo/ui/components/card";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@repo/ui/components/pagination";
import { useUserTableContext } from "../user-table.provider";

export const UserTablePagination = () => {
	const { table, query } = useUserTableContext();

	if (!table || !query?.data) return null;

	const isFiltered = table.getState().columnFilters?.length > 0;
	const pageSize = table.getState().pagination.pageSize;
	const pageIndex = table.getState().pagination.pageIndex;
	const totalRows = isFiltered
		? table.getFilteredRowModel().rows.length
		: (query.data.meta?.total ?? 0);
	const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));

	return (
		<CardFooter className="justify-between">
			{totalRows > 0 && (
				<CardDescription>
					Menampilkan <b>{totalRows === 1 ? 1 : pageIndex * pageSize + 1}</b>
					{totalRows > 1 && (
						<>
							-<b>{Math.min((pageIndex + 1) * pageSize, totalRows)}</b>
						</>
					)}{" "}
					dari <b>{totalRows}</b> data
				</CardDescription>
			)}
			<CardAction className="ml-auto">
				{!query.data || totalRows === 0 ? null : (
					<Pagination>
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious
									onClick={() => table.previousPage()}
									isActive={pageIndex > 0 && pageCount > 1}
									disabled={pageIndex === 0 || pageCount <= 1}
								>
									Previous
								</PaginationPrevious>
							</PaginationItem>
							{Array.from({ length: pageCount }).map((_, i) => (
								<PaginationItem key={i}>
									<PaginationLink
										onClick={() => table.setPageIndex(i)}
										isActive={i === pageIndex}
										disabled={pageCount <= 1}
									>
										{i + 1}
									</PaginationLink>
								</PaginationItem>
							))}
							<PaginationItem>
								<PaginationNext
									onClick={() => table.nextPage()}
									isActive={pageIndex < pageCount - 1 && pageCount > 1}
									disabled={pageIndex >= pageCount - 1}
								/>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				)}
			</CardAction>
		</CardFooter>
	);
};
