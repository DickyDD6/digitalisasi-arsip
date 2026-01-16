import {
	Card,
	CardContent,
	CardDescription,
	CardTitle,
} from "@repo/ui/components/card";
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
			<Card>
				<CardContent className="space-y-1">
					<CardTitle>User Management</CardTitle>
					<CardDescription>
						Manage user accounts and their roles in the system
					</CardDescription>
				</CardContent>
			</Card>

			<UsersStatsSummary />
			<UsersTableCard />
		</>
	);
};

export default ManageUserPage;
