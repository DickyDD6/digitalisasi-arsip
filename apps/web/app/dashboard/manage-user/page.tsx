import { PageHeader } from "@/shared/components/page-header";
import { Metadata } from "next";
import { UsersStatsSummary } from "./_components/widgets/users-stats-summary";
import { UsersTableCard } from "./_components/widgets/users-table-card";

export const metadata: Metadata = {
	title: "User Management",
	description: "Manage user accounts and their roles in the system",
};

const ManageUserPage = () => {
	return (
		<>
			<PageHeader
				title="User Management"
				description="Manage user accounts and their roles in the system"
			/>

			<UsersStatsSummary />
			<UsersTableCard />
		</>
	);
};

export default ManageUserPage;
