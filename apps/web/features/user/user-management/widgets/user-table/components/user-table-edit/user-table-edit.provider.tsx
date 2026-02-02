"use client";

import { useGetUserById } from "@/features/user";
import { Role, UserStatus } from "@/shared/constants";
import { buildPartialPayload, zodValidator } from "@/shared/form-utils";
import { useForm } from "@tanstack/react-form";
import React, { useMemo } from "react";
import {
	adaptUserToEditFormData,
	UserTableEditFormApi,
	UserTableEditFormSchema,
} from ".";

const UserTableEditContext = React.createContext<UserTableEditFormApi | null>(
	null,
);

export const UserTableEditProvider = ({
	userId,
	...props
}: React.PropsWithChildren<{
	userId: number;
}>) => {
	const { data } = useGetUserById(userId);

	const userData = useMemo(() => {
		if (!data?.data) return;
		return adaptUserToEditFormData(data.data);
	}, [data]);

	const userTableEditForm = useForm({
		defaultValues: {
			name: userData?.name || "",
			email: userData?.email || "",
			password: "",
			nip: userData?.nip || "",
			role: (userData?.role as Role) || "",
			user_status: (userData?.user_status as UserStatus) || "",
		},
		validators: {
			onSubmit: (value) =>
				zodValidator(value, UserTableEditFormSchema.partial()),
		},
		onSubmit: ({ value }) =>
			console.log(
				buildPartialPayload(value, userTableEditForm.state.fieldMeta),
			),
	});

	return <UserTableEditContext.Provider value={userTableEditForm} {...props} />;
};

export const useUserTableEditContext = () => {
	const context = React.useContext(UserTableEditContext);
	if (!context) {
		throw new Error(
			"useUserTableEditContext must be used within UserTableEditProvider",
		);
	}
	return { formApi: context };
};
