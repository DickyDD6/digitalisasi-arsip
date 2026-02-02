import { AddUserModal } from "@/features/user/components/add-user-modal";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@repo/ui/components/card";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemMedia,
} from "@repo/ui/components/item";
import { Shield } from "@repo/ui/icons";
import { UserTableList, UserTablePagination, UserTableProvider } from ".";

export const UserTableWidget = () => {
	return (
		<Card>
			<CardHeader>
				<Item className="p-0">
					<ItemMedia>
						<Shield className="text-primary size-4 md:size-6" />
					</ItemMedia>
					<ItemContent>
						<CardTitle>User Management & Access rights</CardTitle>
					</ItemContent>
					<ItemActions>
						<AddUserModal />
					</ItemActions>
				</Item>
			</CardHeader>

			<CardContent className="p-0 space-y-4">
				<UserTableProvider>
					<UserTableList />
					<UserTablePagination />
				</UserTableProvider>
			</CardContent>
		</Card>
	);
};
