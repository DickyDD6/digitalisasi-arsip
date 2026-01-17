import { SearchInput } from "@/shared/components/search/search-input";
import { StatusBadge } from "@/shared/components/status-badge";
import { DocumentStatus, DocumentType } from "@/shared/constants";
import { Button } from "@repo/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@repo/ui/components/card";
import { Checkbox } from "@repo/ui/components/checkbox";
import { Item, ItemContent, ItemMedia } from "@repo/ui/components/item";
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
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@repo/ui/components/table";
import { Download, FileText, Funnel } from "@repo/ui/icons";
import { Metadata } from "next";
import { DeleteArchiveModal } from "./_components/delete-archive-modal";
import { ViewArchiveModal } from "./_components/view-archive-modal";

const mockData: {
	id: string;
	npm: string;
	student_name: string;
	type: DocumentType;
	subject: string;
	year: string;
	status: DocumentStatus;
}[] = [
	{
		id: "DOC-001",
		npm: "0230400001",
		student_name: "Brooklyn Simmons",
		type: "TRANSCRIPT",
		subject: "Pemrograman Web",
		year: "2002",
		status: "VERIFIED",
	},
	{
		id: "DOC-002",
		npm: "0230400002",
		student_name: "Darlene Robertson",
		type: "MARK",
		subject: "Matematika Diskrit",
		year: "2002",
		status: "VERIFIED",
	},
	{
		id: "DOC-003",
		npm: "0330400003",
		student_name: "Cody Fisher",
		type: "TRANSCRIPT",
		subject: "Struktur Data",
		year: "2003",
		status: "PENDING",
	},
	{
		id: "DOC-004",
		npm: "0330400004",
		student_name: "Esther Howard",
		type: "TRANSCRIPT",
		subject: "Basis Data",
		year: "2003",
		status: "REJECTED",
	},
	{
		id: "DOC-005",
		npm: "0430400005",
		student_name: "Jenny Wilson",
		type: "TRANSCRIPT",
		subject: "Jaringan Komputer",
		year: "2004",
		status: "VERIFIED",
	},
	{
		id: "DOC-006",
		npm: "0430400006",
		student_name: "Kristin Watson",
		type: "TRANSCRIPT",
		subject: "Algoritma",
		year: "2004",
		status: "PENDING",
	},
	{
		id: "DOC-007",
		npm: "0530400007",
		student_name: "Guy Hawkins",
		type: "MARK",
		subject: "Sistem Operasi",
		year: "2005",
		status: "REJECTED",
	},
	{
		id: "DOC-008",
		npm: "0530400008",
		student_name: "Kathryn Murphy",
		type: "MARK",
		subject: "Pemrograman Lanjut",
		year: "2005",
		status: "VERIFIED",
	},
	{
		id: "DOC-009",
		npm: "0630400009",
		student_name: "Ronald Richards",
		type: "MARK",
		subject: "Kecerdasan Buatan",
		year: "2006",
		status: "PENDING",
	},
	{
		id: "DOC-010",
		npm: "0630400010",
		student_name: "Savannah Nguyen",
		type: "TRANSCRIPT",
		subject: "Rekayasa Perangkat Lunak",
		year: "2006",
		status: "VERIFIED",
	},
];

export const metadata: Metadata = {
	title: "Manage Archive",
	description:
		"View, download, and delete student grade documents and transcripts.",
};

const ManageArchivePage = () => {
	return (
		<>
			<Card>
				<CardContent className="space-y-1">
					<CardTitle>Manage Archive</CardTitle>
					<CardDescription>
						View, download, and delete student grade documents and transcripts.
					</CardDescription>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-1">
						<FileText className="text-primary size-4 md:size-6" /> Digital
						Archive Documents
					</CardTitle>
					<CardDescription>
						Student Grade Documents and Transcripts (2000-2010)
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col items-center w-full gap-5 px-0">
					<div className="flex flex-col px-6 md:flex-row gap-2 w-full md:items-center md:justify-between">
						<SearchInput />

						<div className="flex items-center gap-2">
							<Item className="p-0">
								<ItemMedia>
									<Funnel className="size-4 md:size-6" />
								</ItemMedia>
								<ItemContent>
									<NativeSelect>
										<NativeSelectOption value={"all_status"}>
											All Status
										</NativeSelectOption>
										<NativeSelectOption value={"verified"}>
											Verified
										</NativeSelectOption>
										<NativeSelectOption value={"rejected"}>
											rejected
										</NativeSelectOption>
										<NativeSelectOption value={"pending"}>
											Pending
										</NativeSelectOption>
									</NativeSelect>
								</ItemContent>
							</Item>

							<NativeSelect>
								<NativeSelectOption>All Year</NativeSelectOption>
								<NativeSelectOption value={"2000"}>2000</NativeSelectOption>
								<NativeSelectOption value={"2001"}>2001</NativeSelectOption>
								<NativeSelectOption value={"2002"}>2002</NativeSelectOption>
								<NativeSelectOption value={"2003"}>2003</NativeSelectOption>
								<NativeSelectOption value={"2004"}>2004</NativeSelectOption>
								<NativeSelectOption value={"2005"}>2005</NativeSelectOption>
								<NativeSelectOption value={"2006"}>2006</NativeSelectOption>
								<NativeSelectOption value={"2007"}>2007</NativeSelectOption>
								<NativeSelectOption value={"2008"}>2008</NativeSelectOption>
								<NativeSelectOption value={"2009"}>2009</NativeSelectOption>
								<NativeSelectOption value={"2010"}>2010</NativeSelectOption>
							</NativeSelect>
						</div>
					</div>

					<div className="w-80 md:w-full">
						<Table>
							<TableHeader>
								<TableRow className="bg-accent hover:bg-accent">
									<TableHead>
										<Checkbox className="border-border" />
									</TableHead>
									<TableHead>ID Document</TableHead>
									<TableHead>NPM</TableHead>
									<TableHead>Student Name</TableHead>
									<TableHead>Type</TableHead>
									<TableHead>Subject</TableHead>
									<TableHead>Year</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Action</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{mockData.map((data, i) => (
									<TableRow
										key={i}
										className={
											(i + 1) % 2 === 0 ? "bg-accent hover:bg-accent/50" : ""
										}
									>
										<TableCell>
											<Checkbox
												className={(i + 1) % 2 === 0 ? "border-border" : ""}
											/>
										</TableCell>
										<TableCell>{data.id}</TableCell>
										<TableCell>{data.npm}</TableCell>
										<TableCell>{data.student_name}</TableCell>
										<TableCell>
											<StatusBadge variant={data.type}>{data.type}</StatusBadge>
										</TableCell>
										<TableCell>{data.subject}</TableCell>
										<TableCell>{data.year}</TableCell>
										<TableCell>
											<StatusBadge variant={data.status}>
												{data.status}
											</StatusBadge>
										</TableCell>
										<TableCell>
											<ViewArchiveModal id={data.id} />
											<Button
												variant={"ghost"}
												size={"icon"}
												className="text-green-600 hover:bg-green-100"
											>
												<Download />
											</Button>
											<DeleteArchiveModal id={data.id} />
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>

					<div className="flex flex-col md:flex-row gap-2 items-center justify-between w-full">
						<p className="text-xs text-muted-foreground">
							Showing 10 of {mockData.length} Documents
						</p>
						<Pagination className="justify-end">
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

export default ManageArchivePage;
