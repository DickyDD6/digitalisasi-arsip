import {
	PageDescription,
	PageHeader,
	PageTitle,
} from "@/shared/components/page-header";
import React from "react";
import { UserTableWidget } from ".";

export const UserManagementContent = () => {
	return (
		<>
			<PageHeader>
				<PageTitle>Pengelolaan Pengguna</PageTitle>
				<PageDescription>
					Mengelola akun pengguna dan peran-perannya dalam sistem
				</PageDescription>
			</PageHeader>

			<UserTableWidget />
		</>
	);
};
