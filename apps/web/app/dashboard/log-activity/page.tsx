"use client";

import { Button } from "@repo/ui/components/button";
import { Calendar as CalendarComponent } from "@repo/ui/components/calendar";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@repo/ui/components/card";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@repo/ui/components/input-group";
import {
	Item,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from "@repo/ui/components/item";
import {
	NativeSelect,
	NativeSelectOption,
} from "@repo/ui/components/native-select";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@repo/ui/components/pagination";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@repo/ui/components/popover";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@repo/ui/components/table";
import { Calendar, Funnel, Logs } from "@repo/ui/index";
import { cn } from "@repo/ui/lib/utils";
import { useState } from "react";

const mockData = [
	{
		title: "Total Activity Today",
		count: 47,
		color: "text-foreground",
	},
	{
		title: "Document Upload",
		count: 18,
		color: "text-blue-600",
	},
	{
		title: "Verified",
		count: 23,
		color: "text-green-600",
	},
	{
		title: "Rejected",
		count: 6,
		color: "text-destructive",
	},
];

const mockDataTable = [
	{
		user_role: "QC-01",
		action: "Verified",
		id_document: "DOC-10120234",
		document_name: "Transcript_Nilai_2010_Ahmad_Fauzi.pdf",
		time: "2026-01-07T14:00:00+07:00",
	},
	{
		user_role: "Uploader-01",
		action: "Uploaded",
		id_document: "DOC-10120231",
		document_name: "Nilai_Basis_Data_2009_Siti_Nurhaliza.pdf",
		time: "2026-01-07T14:05:00+07:00",
	},
	{
		user_role: "QC-02",
		action: "Rejected",
		id_document: "DOC-10120232",
		document_name: "Transkrip_2008_Budi_Santoso.pdf",
		time: "2026-01-07T11:45:00+07:00",
	},
	{
		user_role: "Uploader-02",
		action: "Deleted",
		id_document: "DOC-10120233",
		document_name: "Nilai_Invalid_2007.pdf",
		time: "2026-01-07T12:01:00+07:00",
	},
	{
		user_role: "QC-03",
		action: "Uploaded",
		id_document: "DOC-10120235",
		document_name: "Transkrip_2006_Rina_Marlina.pdf",
		time: "2026-01-07T10:00:00+07:00",
	},
	{
		user_role: "Manajer Arsip",
		action: "Verified",
		id_document: "DOC-10120236",
		document_name: "Nilai_Struktur_Data_2005.pdf",
		time: "2026-01-06T11:30:00+07:00",
	},
	{
		user_role: "Pegawai SBAP",
		action: "Downloaded",
		id_document: "DOC-10120237",
		document_name: "Transkrip_2004_Dedi_Kurniawan.pdf",
		time: "2026-01-06T13:05:00+07:00",
	},
	{
		user_role: "Uploader-03",
		action: "Verified",
		id_document: "DOC-10120238",
		document_name: "Nilai_Algoritma_2003.pdf",
		time: "2026-01-06T13:30:00+07:00",
	},
	{
		user_role: "Manajer Arsip",
		action: "Verified",
		id_document: "DOC-10120239",
		document_name: "Transkrip_Nilai_2010_John_Doe.pdf",
		time: "2026-01-06T12:41:00+07:00",
	},
	{
		user_role: "Pegawai SBAP",
		action: "Rejected",
		id_document: "DOC-10120210",
		document_name: "Transkrip_Nilai_2014_Budi_Santoso.pdf",
		time: "2026-01-06T11:45:00+07:00",
	},
];

// export const metadata: Metadata = {
// 	title: "Log Activity",
// };

const LogActivityPage = () => {
	const [openPopoverDate, setOpenPopoverDate] = useState<boolean>(false);
	const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);

	return (
		<>
			<Card>
				<CardContent className="space-y-1">
					<CardTitle>System Log Activity</CardTitle>
					<CardDescription>
						Monitoring and audit trail of all user activities
					</CardDescription>
				</CardContent>
			</Card>

			<Card>
				<CardContent className="flex flex-col md:flex-row gap-2 justify-between">
					<Item className="p-0 items-start md:items-center">
						<ItemMedia className="mt-2 md:mt-0">
							<Funnel className="size-4 md:size-6" />
						</ItemMedia>
						<ItemContent className="flex-col md:flex-row">
							<NativeSelect classNameContainer="w-full">
								<NativeSelectOption value={"all-role"}>
									All Role
								</NativeSelectOption>
								<NativeSelectOption value={"manager"}>
									Manager
								</NativeSelectOption>
								<NativeSelectOption value={"qc"}>QC</NativeSelectOption>
								<NativeSelectOption value={"uploader"}>
									UPLOADER
								</NativeSelectOption>
								<NativeSelectOption value={"sbap"}>SBAP</NativeSelectOption>
							</NativeSelect>

							<NativeSelect classNameContainer="w-full">
								<NativeSelectOption value={"all-action"}>
									All Action
								</NativeSelectOption>
								<NativeSelectOption value={"verified"}>
									Verified
								</NativeSelectOption>
								<NativeSelectOption value={"rejected"}>
									Rejected
								</NativeSelectOption>
								<NativeSelectOption value={"deleted"}>
									Deleted
								</NativeSelectOption>
								<NativeSelectOption value={"downloaded"}>
									Downloaded
								</NativeSelectOption>
								<NativeSelectOption value={"uploaded"}>
									Uploaded
								</NativeSelectOption>
							</NativeSelect>

							<Popover open={openPopoverDate} onOpenChange={setOpenPopoverDate}>
								<PopoverTrigger>
									<InputGroup>
										<InputGroupAddon>
											<Calendar />
										</InputGroupAddon>
										<InputGroupInput
											type="text"
											placeholder="DD/MM/YYYY"
											value={
												dateFilter
													? String(
															new Date(dateFilter).toLocaleDateString("id-ID", {
																day: "2-digit",
																month: "2-digit",
																year: "2-digit",
															}),
														)
													: ""
											}
											onChange={() => {}}
										/>
									</InputGroup>
								</PopoverTrigger>
								<PopoverContent
									className="p-0 overflow-hidden w-auto"
									align="start"
								>
									<CalendarComponent
										mode="single"
										selected={dateFilter}
										onSelect={(date) => {
											setDateFilter(date);
											setOpenPopoverDate(false);
										}}
									/>
								</PopoverContent>
							</Popover>
						</ItemContent>
					</Item>

					<Button variant={"secondary"}>Reset</Button>
				</CardContent>
			</Card>

			<div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
				{mockData.map((data, i) => (
					<Button key={i} className="p-0 h-auto w-auto" variant={"ghost"}>
						<Card className="w-full h-full hover:scale-105 transition-all hover:shadow-lg hover:border-primary">
							<CardContent>
								<Item className="p-0">
									<ItemContent className="items-start">
										<ItemDescription className="line-clamp-2">
											{data.title}
										</ItemDescription>
										<ItemTitle className={cn("text-xl", data.color)}>
											{data.count}
										</ItemTitle>
									</ItemContent>
								</Item>
							</CardContent>
						</Card>
					</Button>
				))}
			</div>

			<Card>
				<CardHeader>
					<Item className="p-0">
						<ItemMedia>
							<Logs className="text-primary size-4 md:size-6" />
						</ItemMedia>
						<ItemContent>
							<CardTitle>Monitoring all user activities</CardTitle>
						</ItemContent>
					</Item>
				</CardHeader>
				<CardContent className="p-0 space-y-4">
					<div className="w-80 md:w-full mx-auto">
						<Table>
							<TableHeader>
								<TableRow className="bg-accent hover:bg-accent">
									<TableHead>No.</TableHead>
									<TableHead>User Role</TableHead>
									<TableHead>Action</TableHead>
									<TableHead>ID Document</TableHead>
									<TableHead>Document Name</TableHead>
									<TableHead>Time</TableHead>
									<TableHead>Date</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{mockDataTable.map((data, i) => (
									<TableRow
										key={i}
										className={
											i % 2 === 1 ? "bg-accent hover:bg-accent/70" : ""
										}
									>
										<TableCell>{i + 1}</TableCell>
										<TableCell>{data.user_role}</TableCell>
										<TableCell>{data.action}</TableCell>
										<TableCell>{data.id_document}</TableCell>
										<TableCell>{data.document_name}</TableCell>
										<TableCell>
											{new Date(data.time).toLocaleTimeString("id-ID", {
												hour: "2-digit",
												minute: "2-digit",
											})}
										</TableCell>
										<TableCell>
											{new Date(data.time).toLocaleDateString("id-ID", {
												day: "2-digit",
												month: "2-digit",
												year: "2-digit",
											})}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>

					<div className="px-6 flex flex-col md:flex-row gap-2 justify-between items-center">
						<p className="text-muted-foreground text-xs">
							Showing 1-10 of {mockDataTable.length} documents
						</p>

						<Pagination>
							<PaginationContent>
								<PaginationItem>
									<PaginationPrevious />
								</PaginationItem>
								<PaginationItem>
									<PaginationLink isActive href="#">
										1
									</PaginationLink>
								</PaginationItem>
								<PaginationItem>
									<PaginationLink href="#">2</PaginationLink>
								</PaginationItem>
								<PaginationItem>
									<PaginationLink href="#">3</PaginationLink>
								</PaginationItem>
								<PaginationItem>
									<PaginationEllipsis />
								</PaginationItem>
								<PaginationItem>
									<PaginationNext />
								</PaginationItem>
							</PaginationContent>
						</Pagination>
					</div>
				</CardContent>
			</Card>
		</>
	);
};

export default LogActivityPage;
