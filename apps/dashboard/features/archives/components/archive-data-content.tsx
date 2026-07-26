"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@repo/ui/input-group";
import { Search } from "lucide-react";
import { archiveTableColumns } from "./archive-table-columns";
import { DataTableArchive } from "./data-table-archive";
import { useArchiveTable } from "../hooks/use-archive-table";
import {
  ARCHIVE_DOCUMENT_STATUS,
  ARCHIVE_DOCUMENT_TYPE,
} from "@/features/archives/constants/archive-document";

export function ArchiveDataContent() {
  const {
    pagination,
    setPagination,
    columnFilters,
    setColumnFilters,
    globalFilter,
    setGlobalFilter,
    data,
    isPending,
    isFetching,
    isError,
    filterOptionsData,
  } = useArchiveTable();

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
        columns={archiveTableColumns}
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
          document_type: Object.entries(ARCHIVE_DOCUMENT_TYPE).map(
            ([value, label]) => ({ value, label }),
          ),
          status: Object.entries(ARCHIVE_DOCUMENT_STATUS).map(
            ([value, label]) => ({ value, label }),
          ),
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
}
