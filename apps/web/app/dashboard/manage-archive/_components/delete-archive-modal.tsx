"use client";

import { Alert, AlertDescription, AlertTitle } from "@repo/ui/components/alert";
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
import { Trash2 } from "@repo/ui/index";
import { useState } from "react";

export const DeleteArchiveModal = ({ id }: { id: string }) => {
	const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

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
								<ItemTitle className="text-sm">Confirm Delete Document</ItemTitle>
							</DialogTitle>
							<DialogDescription asChild>
								<ItemDescription className="text-xs">
									This Action Can&apos;t Be Undone
								</ItemDescription>
							</DialogDescription>
						</ItemContent>
					</Item>
				</DialogHeader>

				<p className="text-muted-foreground text-sm">
					Are you sure you want to delete the following documents?:
				</p>
				<Card className="bg-muted border-border">
					<CardContent className="space-y-2">
						<div className="justify-between flex items-center">
							<span className="text-muted-foreground">ID Document</span>
							<span className="font-bold">{id}</span>
						</div>
						<div className="justify-between flex items-center">
							<span className="text-muted-foreground">Student Name</span>
							<span className="font-bold">John Doe</span>
						</div>
						<div className="justify-between flex items-center">
							<span className="text-muted-foreground">NPM</span>
							<span className="font-bold">0230400001</span>
						</div>
						<div className="justify-between flex items-center">
							<span className="text-muted-foreground">Type</span>
							<span className="font-bold">Transcript</span>
						</div>
						<div className="justify-between flex items-center">
							<span className="text-muted-foreground">Year</span>
							<span className="font-bold">2002</span>
						</div>
					</CardContent>
				</Card>

				<Alert variant={"destructive"}>
					<Trash2 />
					<AlertTitle>Attention!</AlertTitle>
					<AlertDescription>
						Documents that have been deleted cannot be restored. Make sure you
						have verified this document before deleting.
					</AlertDescription>
				</Alert>

				<DialogFooter>
					<Button variant={"outline"} onClick={() => setOpenDeleteModal(false)}>
						Cancel
					</Button>
					<Button variant={"destructive"}>
						<Trash2 /> Yes, Delete Document
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
