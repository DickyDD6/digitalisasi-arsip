"use client";

import { Button } from "@repo/ui/components/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@repo/ui/components/dialog";
import {
	Item,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from "@repo/ui/components/item";
import { Pencil } from "@repo/ui/icons";
import { useState } from "react";
import { UserTableEditForm, UserTableEditProvider } from ".";

export const UserTableEditModal = ({ userId }: { userId: number }) => {
	const [openEditModal, setOpenEditModal] = useState<boolean>(false);

	return (
		<UserTableEditProvider userId={userId}>
			<Dialog open={openEditModal} onOpenChange={setOpenEditModal}>
				<DialogTrigger asChild>
					<Button
						type="button"
						variant={"ghost"}
						size={"icon"}
						className="text-blue-600 hover:bg-blue-100"
					>
						<Pencil />
					</Button>
				</DialogTrigger>
				<DialogContent className="max-h-[85vh] md:max-w-2/3! overflow-y-auto">
					<DialogHeader>
						<Item className="p-0">
							<ItemMedia className="p-2 bg-blue-100 text-blue-600 rounded-md">
								<Pencil className="size-4 md:size-6" />
							</ItemMedia>
							<ItemContent>
								<DialogTitle asChild>
									<ItemTitle>Edit Data Pengguna</ItemTitle>
								</DialogTitle>
								<DialogDescription asChild>
									<ItemDescription>Perbarui Informasi Pengguna</ItemDescription>
								</DialogDescription>
							</ItemContent>
						</Item>
					</DialogHeader>

					<UserTableEditForm />

					<DialogFooter>
						<Button
							type="button"
							variant={"outline"}
							onClick={() => setOpenEditModal(false)}
						>
							Batal
						</Button>
						<Button type="submit" form="user-table-edit-form">
							<Pencil />
							Edit Pengguna
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</UserTableEditProvider>
	);
};
