"use client";

import { CellContext } from "@tanstack/react-table";
import { UserTableData } from "../user-table.types";
import { ComponentProps, useState } from "react";
import { Input } from "@repo/ui/components/input";

export const UserTableCellInput = ({
	context,
	type = "text",
}: {
	context: CellContext<UserTableData, unknown>;
	type?: ComponentProps<"input">["type"];
}) => {
	const [value, setValue] = useState<string>(context.getValue<string>());
	const [editable, setEditable] = useState<boolean>(false);

	return !editable ? (
		<span onDoubleClick={() => setEditable(true)} className="select-none">
			{value}
		</span>
	) : (
		<Input
			type={type}
			value={value}
			onChange={(e) => setValue(e.target.value)}
			onBlur={() => {
				setEditable(false);
				setValue(context.getValue<string>());
			}}
			onKeyDown={(e) => {
				if (e.key === "Enter") {
					setEditable(false);
					setValue(value);
				}
			}}
			autoFocus
			autoComplete={type === "email" ? "email" : "off"}
		/>
	);
};
