"use client";

import { RoleBadge } from "@/shared/components/role-badge";
import { StatusBadge } from "@/shared/components/status-badge";
import { Role, UserStatus } from "@/shared/constants";
import { useTimeAgo } from "@/shared/hooks/use-time-ago";
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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@repo/ui/components/table";
import { Shield } from "@repo/ui/icons";
import { AddUserModal } from "../add-user-modal";
import { DeleteUserModal } from "../delete-user-modal";
import { EditUserModal } from "../edit-user-modal";

const mockData: {
	name: string;
	email: string;
	role: Role;
	user_status: UserStatus;
	last_active: string;
}[] = [
	{
		name: "Ronald Richarts",
		email: "ronald@example.com",
		role: "QC",
		user_status: "ACTIVE",
		last_active: "2026-01-16T14:00:00+07:00",
	},
	{
		name: "Kristin Watson",
		email: "kenzi.lawson@example.com",
		role: "UPLOADER",
		user_status: "ACTIVE",
		last_active: "2026-01-16T13:55:00+07:00",
	},
	{
		name: "Jenny Wilson",
		email: "jackson.graham@example.com",
		role: "QC",
		user_status: "ACTIVE",
		last_active: "2026-01-16T14:05:00+07:00",
	},
	{
		name: "Esther Howard",
		email: "debra.holt@example.com",
		role: "UPLOADER",
		user_status: "NON-ACTIVE",
		last_active: "2026-01-14T09:00:00+07:00",
	},
	{
		name: "Dianne Russell",
		email: "michael.mitc@example.com",
		role: "SBAP",
		user_status: "ACTIVE",
		last_active: "2026-01-16T13:58:00+07:00",
	},
	{
		name: "Darlene Robertson",
		email: "debbie.baker@example.com",
		role: "SBAP",
		user_status: "NON-ACTIVE",
		last_active: "2026-01-14T08:45:00+07:00",
	},
	{
		name: "Marvin McKinney",
		email: "jessica.hanson@example.com",
		role: "QC",
		user_status: "ACTIVE",
		last_active: "2026-01-16T13:59:00+07:00",
	},
	{
		name: "Guy Hawkins",
		email: "felicia.reid@example.com",
		role: "SBAP",
		user_status: "ACTIVE",
		last_active: "2026-01-16T13:57:00+07:00",
	},
	{
		name: "Kathryn Murphy",
		email: "michelle.rivera@example.com",
		role: "UPLOADER",
		user_status: "NON-ACTIVE",
		last_active: "2026-01-14T09:10:00+07:00",
	},
	{
		name: "Floyd Miles",
		email: "sara.cruz@example.com",
		role: "QC",
		user_status: "ACTIVE",
		last_active: "2026-01-16T13:56:00+07:00",
	},
];

export const UsersTableCard = () => {
	const { timeAgo } = useTimeAgo();

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
				<div className="w-80 md:w-full mx-auto">
					<Table>
						<TableHeader>
							<TableRow className="bg-accent hover:bg-accent">
								<TableHead>No.</TableHead>
								<TableHead>Name</TableHead>
								<TableHead>Email</TableHead>
								<TableHead>Role</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Last Active</TableHead>
								<TableHead>Action</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{mockData.map((data, i) => (
								<TableRow
									key={i}
									className={i % 2 === 1 ? "bg-accent hover:bg-accent/70" : ""}
								>
									<TableCell>{i + 1}</TableCell>
									<TableCell>{data.name}</TableCell>
									<TableCell>{data.email}</TableCell>
									<TableCell>
										<RoleBadge variant={data.role} asTeam>
											{data.role}
										</RoleBadge>
									</TableCell>
									<TableCell>
										<StatusBadge variant={data.user_status}>
											{data.user_status}
										</StatusBadge>
									</TableCell>
									<TableCell className="text-muted-foreground">
										{timeAgo(data.last_active)}
									</TableCell>
									<TableCell>
										<EditUserModal id={data.name} />
										<DeleteUserModal id={data.name} />
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	);
};
