"use client";

import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { DOCUMENT_TYPE } from "@/constants/document-type";
import { DOCUMENT_STATUS } from "@/constants/document_status";
import { http } from "@/lib/http";
import { useQuery } from "@tanstack/react-query";
import { ColumnFiltersState, PaginationState } from "@tanstack/react-table";
import { Search } from "lucide-react";
import { useState } from "react";
import { columns } from "../lib/table-columns";
import { DataTableArchive } from "./data-table-archive";

export const ArchiveDataContent = () => {
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>("");

	const { data, isPending, isFetching, isError } = useQuery({
		queryKey: [
			"archive-data",
			pagination.pageIndex,
			pagination.pageSize,
			columnFilters,
			globalFilter,
		],
		queryFn: async () => {
			const { data } = await http.get<ApiResponse<ArchiveDocument[]>>(
				"/api/documents",
				{
					params: {
						page: pagination.pageIndex + 1,
						per_page: pagination.pageSize,
						search: globalFilter,
						...Object.fromEntries(
							columnFilters.map((filter) => [filter.id, filter.value]),
						),
					},
				},
			);
			return data;
		},
		placeholderData: (previousData) => previousData,
	});

	const { data: filterOptionsData } = useQuery({
		queryKey: ["archive-filter-options"],
		queryFn: async () => {
			const res = await http.get<ApiResponse<ArchiveDocument[]>>(
				"/api/documents",
				{
					params: {
						per_page: 10 * (data?.meta?.total || 1000),
					},
				},
			);
			return res.data;
		},
		staleTime: 5 * 60 * 1000,
		select: ({ data }) =>
			data.map((item) => ({
				mata_kuliah: item.mata_kuliah,
				tahun_ajaran: item.tahun_ajaran,
			})),
	});

	return (
		<>
			<div className="px-6">
				<InputGroup className="w-md">
					<InputGroupAddon>
						<Search />
					</InputGroupAddon>
					<InputGroupInput
						placeholder="Cari berdasarkan nama file, npm, atau mata kuliah..."
						value={globalFilter}
						onChange={(e) => {
							setGlobalFilter(String(e.target.value));
							setPagination((prev) => ({ ...prev, pageIndex: 0 }));
						}}
					/>
				</InputGroup>
			</div>

			<DataTableArchive
				columns={columns}
				data={data?.data || []}
				pagination={pagination}
				setPagination={setPagination}
				totalItems={data?.meta?.total || 0}
				isError={isError}
				isPending={isPending}
				isFetching={isFetching}
				columnFilters={columnFilters}
				setColumnFilters={setColumnFilters}
				globalFilter={globalFilter}
				setGlobalFilter={setGlobalFilter}
				filterOptions={{
					document_type: Object.entries(DOCUMENT_TYPE).map(
						([value, label]) => ({ value, label }),
					),
					status: Object.entries(DOCUMENT_STATUS).map(([value, label]) => ({
						value,
						label,
					})),
					mata_kuliah: filterOptionsData
						? Array.from(
								new Set(filterOptionsData.map((item) => item.mata_kuliah)),
							)
								.map((mata_kuliah) => ({
									value: mata_kuliah,
									label: mata_kuliah,
								}))
								.filter((option) => option.value)
						: [],
					tahun_ajaran: filterOptionsData
						? Array.from(
								new Set(filterOptionsData.map((item) => item.tahun_ajaran)),
							)
								.map((tahun_ajaran) => ({
									value: tahun_ajaran,
									label: tahun_ajaran,
								}))
								.filter((option) => option.value)
						: [],
				}}
			/>
		</>
	);
};
