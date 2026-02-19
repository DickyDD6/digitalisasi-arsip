import { UserManagementContent } from "@/features/user";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "User Management",
	description: "Manage user accounts and their roles in the system",
};

const ManageUserPage = () => <UserManagementContent />;

export default ManageUserPage;
