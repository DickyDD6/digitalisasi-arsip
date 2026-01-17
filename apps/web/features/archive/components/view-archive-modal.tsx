"use client";

import { Badge } from "@repo/ui/components/badge";
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
	ItemHeader,
	ItemMedia,
	ItemTitle,
} from "@repo/ui/components/item";
import {
	CircleCheckBig,
	Download,
	Eye,
	FileText,
	UserRound,
} from "@repo/ui/icons";
import { useState } from "react";

export const ViewArchiveModal = ({ id }: { id: string }) => {
	const [openViewModal, setOpenViewModal] = useState<boolean>(false);

	return (
		<Dialog open={openViewModal} onOpenChange={setOpenViewModal}>
			<DialogTrigger asChild>
				<Button
					variant={"ghost"}
					size={"icon"}
					className="text-blue-600 hover:bg-blue-100"
				>
					<Eye />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-4xl h-150 md:h-max overflow-y-auto">
				<DialogHeader>
					<Item className="p-0">
						<ItemMedia className="bg-blue-100 text-blue-600 rounded-md p-2">
							<FileText />
						</ItemMedia>
						<ItemContent>
							<DialogTitle asChild>
								<ItemTitle className="text-sm">Name Document {id}</ItemTitle>
							</DialogTitle>
							<DialogDescription asChild>
								<ItemDescription className="flex items-center gap-2">
									<Badge className="bg-muted text-muted-foreground">
										Transcript
									</Badge>
									<Badge className="bg-green-100 text-green-600">
										<CircleCheckBig />
										Verified
									</Badge>
								</ItemDescription>
							</DialogDescription>
						</ItemContent>
					</Item>
				</DialogHeader>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
					<div className="md:min-w-100 grid gap-5 order-2 md:order-1">
						<Item className="p-0">
							<ItemHeader className="justify-start">
								<ItemMedia>
									<FileText className="size-4 md:size-6" />
								</ItemMedia>
								<ItemTitle>Document Metadata</ItemTitle>
							</ItemHeader>
							<ItemContent className="gap-4">
								<div className="justify-between flex items-center border-b">
									<span className="text-muted-foreground">NPM</span>
									<span className="font-bold">0230400001</span>
								</div>
								<div className="justify-between flex items-center border-b">
									<span className="text-muted-foreground">Study program</span>
									<span className="font-bold">Informatics Engineering</span>
								</div>
								<div className="justify-between flex items-center border-b">
									<span className="text-muted-foreground">Graduation year</span>
									<span className="font-bold">2002</span>
								</div>
							</ItemContent>
						</Item>

						<Item className="p-0">
							<ItemHeader className="justify-start">
								<ItemMedia>
									<UserRound className="size-4 md:size-6" />
								</ItemMedia>
								<ItemTitle>Upload Information</ItemTitle>
							</ItemHeader>
							<ItemContent className="gap-4">
								<div className="justify-between flex items-center border-b">
									<span className="text-muted-foreground">Uploaded By</span>
									<span className="font-bold">Uploader-01</span>
								</div>
								<div className="justify-between flex items-center border-b">
									<span className="text-muted-foreground">Upload Date</span>
									<span className="font-bold">05/01/2006</span>
								</div>
							</ItemContent>
						</Item>

						<Item className="p-0">
							<ItemHeader className="justify-start">
								<ItemMedia>
									<CircleCheckBig className="size-4 md:size-6" />
								</ItemMedia>
								<ItemTitle>Verified Information</ItemTitle>
							</ItemHeader>
							<ItemContent className="gap-4">
								<div className="justify-between flex items-center border-b">
									<span className="text-muted-foreground">Verified By</span>
									<span className="font-bold">QC-01</span>
								</div>
								<div className="justify-between flex items-center border-b">
									<span className="text-muted-foreground">Upload Date</span>
									<span className="font-bold">07/01/2006</span>
								</div>
							</ItemContent>
						</Item>
					</div>

					<div className="md:min-w-100 min-h-80 md:min-h-125 order-1 md:order-2">
						<div className="flex flex-col items-start h-full gap-4">
							<div className="flex items-center">
								<FileText className="size-4 md:size-6" />
								<span className="font-medium leading-snug text-sm">
									Preview Document
								</span>
							</div>
							<div className="place-content-center place-items-center border h-full w-full bg-muted rounded-md">
								<div className="place-content-center place-items-center">
									<FileText />
									Preview PDF
								</div>
							</div>
						</div>
					</div>
				</div>

				<DialogFooter>
					<Button>
						<Download /> Download
					</Button>
					<Button variant={"outline"} onClick={() => setOpenViewModal(false)}>
						Close
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
