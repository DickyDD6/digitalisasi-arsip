import { useTimeAgo } from "@/shared/hooks/use-time-ago";
import { Checkbox } from "@repo/ui/components/checkbox";
import { ColumnDef, RowData } from "@tanstack/react-table";
import {
	UserTableCellInput,
	UserTableData,
	UserTableDeleteModal,
	UserTableEditModal,
} from ".";
import { UserTableCellSelect } from "./components/user-table-cell-select";

declare module "@tanstack/react-table" {
	interface ColumnMeta<TData extends RowData, TValue> {
		isFilterable?: boolean;
		filterType?: "role" | "user_status";
	}
}

export const USER_TABLE_COLUMNS: ColumnDef<UserTableData>[] = [
	{
		id: "select",
		header: (ctx) => (
			<Checkbox
				checked={
					ctx.table.getIsAllPageRowsSelected()
						? true
						: ctx.table.getIsSomePageRowsSelected()
							? "indeterminate"
							: false
				}
				onCheckedChange={(value) =>
					ctx.table.toggleAllPageRowsSelected(!!value)
				}
				className="rounded-sm"
			/>
		),
		cell: (ctx) => (
			<Checkbox
				checked={
					ctx.row.getIsSelected()
						? true
						: ctx.row.getIsSomeSelected()
							? "indeterminate"
							: false
				}
				onCheckedChange={(value) => ctx.row.toggleSelected(!!value)}
				className="rounded-sm"
			/>
		),
	},
	{
		header: "No.",
		cell: (info) =>
			info.row.index +
			info.table.getState().pagination.pageSize *
				info.table.getState().pagination.pageIndex +
			1,
	},
	{
		header: "Name",
		accessorKey: "name",
		cell: (ctx) => <UserTableCellInput context={ctx} />,
	},
	{
		header: "Email",
		accessorKey: "email",
		cell: (ctx) => <UserTableCellInput context={ctx} type="email" />,
	},
	{
		header: "Role",
		accessorKey: "role",
		cell: (ctx) => <UserTableCellSelect context={ctx} variant="role" />,
		meta: {
			isFilterable: true,
			filterType: "role",
		},
	},
	{
		header: "Status",
		accessorKey: "user_status",
		cell: (ctx) => <UserTableCellSelect context={ctx} variant="user_status" />,
		meta: {
			isFilterable: true,
			filterType: "user_status",
		},
	},
	{
		header: "Last Active",
		accessorKey: "last_active",
		accessorFn: (ctx) => {
			const { timeAgo } = useTimeAgo();
			return timeAgo(ctx.last_active);
		},
		cell: (ctx) => ctx.cell.getValue(),
	},
	{
		header: "Action",
		cell: (ctx) => (
			<>
				<UserTableEditModal userId={ctx.row.original.id} />
				<UserTableDeleteModal id={ctx.row.original.id} />
			</>
		),
	},
];
