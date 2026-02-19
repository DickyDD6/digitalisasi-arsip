"use client";

import { Field } from "@repo/ui/components/field";
import {
	UserTableEditFieldEmail,
	UserTableEditFieldName,
	UserTableEditFieldNIP,
	UserTableEditFieldPassword,
	UserTableEditFieldRole,
	UserTableEditFieldUserStatus,
	useUserTableEditContext,
} from ".";

export const UserTableEditForm = () => {
	const { formApi } = useUserTableEditContext();

	if (!formApi) return null;

	return (
		<form
			id="user-table-edit-form"
			onSubmit={async (e) => {
				e.preventDefault();
				await formApi.handleSubmit();
			}}
		>
			<div className="grid md:grid-cols-2 gap-4">
				<Field>
					<UserTableEditFieldName />
					<UserTableEditFieldRole />
					<UserTableEditFieldPassword />
				</Field>
				<Field>
					<UserTableEditFieldEmail />
					<UserTableEditFieldNIP />
					<UserTableEditFieldUserStatus />
				</Field>
			</div>
		</form>
	);
};
