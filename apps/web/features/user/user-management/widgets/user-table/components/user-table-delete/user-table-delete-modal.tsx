"use client";

import { useGetUserById } from "@/features/user/user.hook";
import { Alert, AlertDescription, AlertTitle } from "@repo/ui/components/alert";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
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
import { Trash2 } from "@repo/ui/icons";
import { useMemo, useState } from "react";
import { adaptUserToDeleteData } from ".";
import { ROLE, USER_STATUS } from "@/shared/constants";

export const UserTableDeleteModal = ({ id }: { id: number }) => {
	const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

	const { data } = useGetUserById(id);

	const userData = useMemo(() => {
		if (!data?.data) return;

		return adaptUserToDeleteData(data.data);
	}, [data]);

	return (
		<Dialog open={openDeleteModal} onOpenChange={setOpenDeleteModal}>
			<DialogTrigger asChild>
				<Button
					variant={"ghost"}
					size={"icon"}
					className="text-destructive hover:bg-red-100"
				>
					<Trash2 />
				</Button>
			</DialogTrigger>
			<DialogContent className="h-150 md:h-max">
				<DialogHeader>
					<Item className="p-0">
						<ItemMedia className="bg-red-100 text-destructive rounded-md p-2">
							<Trash2 />
						</ItemMedia>
						<ItemContent className="items-start">
							<DialogTitle asChild>
								<ItemTitle className="text-sm">
									Konfirmasi Hapus Pengguna
								</ItemTitle>
							</DialogTitle>
							<DialogDescription asChild>
								<ItemDescription className="text-xs">
									Tindakan Ini Tidak Dapat Dibatalkan
								</ItemDescription>
							</DialogDescription>
						</ItemContent>
					</Item>
				</DialogHeader>

				<p className="text-muted-foreground text-sm">
					Apakah Anda yakin ingin menghapus pengguna berikut dari Sistem?:
				</p>
				<Card className="bg-muted border-border">
					<CardContent className="space-y-2">
						<div className="justify-between flex items-center">
							<span className="text-muted-foreground">Student Name</span>
							<span className="font-bold">{userData?.name}</span>
						</div>
						<div className="justify-between flex items-center">
							<span className="text-muted-foreground">NPM</span>
							<span className="font-bold">
								{userData?.nip ?? (
									<span className="text-xs text-muted-foreground">
										~belum diterapkan
									</span>
								)}
							</span>
						</div>
						<div className="justify-between flex items-center">
							<span className="text-muted-foreground">Email</span>
							<span className="font-bold">{userData?.email}</span>
						</div>
						<div className="justify-between flex items-center">
							<span className="text-muted-foreground">Role</span>
							<Badge className="bg-green-600">
								{ROLE[userData?.role.toUpperCase() as keyof typeof ROLE]}
							</Badge>
						</div>
						<div className="justify-between flex items-center">
							<span className="text-muted-foreground">Status</span>
							<Badge className="text-green-600 bg-green-100">
								{
									USER_STATUS[
										userData?.user_status.toUpperCase() as keyof typeof USER_STATUS
									]
								}
							</Badge>
						</div>
					</CardContent>
				</Card>

				<Alert variant={"destructive"}>
					<Trash2 />
					<AlertTitle>Perhatian!</AlertTitle>
					<AlertDescription>
						Pengguna yang dihapus akan kehilangan akses ke sistem. Data yang
						terkait dengan pengguna ini akan tetap disimpan untuk tujuan audit.
					</AlertDescription>
				</Alert>

				<DialogFooter>
					<Button variant={"outline"} onClick={() => setOpenDeleteModal(false)}>
						Batal
					</Button>
					<Button variant={"destructive"}>
						<Trash2 /> Hapus Pengguna
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
