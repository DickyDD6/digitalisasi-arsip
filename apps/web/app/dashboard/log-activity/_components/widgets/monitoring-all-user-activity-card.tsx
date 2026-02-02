// TODO: PINDAHKAN_KE_FEATURES - Komponen ini harus dipindahkan ke features/dashboard/widgets/
// Lokasi saat ini melanggar arsitektur berbasis fitur - komponen tidak boleh berada di direktori app/
import { RoleBadge } from "@/shared/components/role-badge";
import { StatusBadge } from "@/shared/components/status-badge";
import { DocumentStatus, Role } from "@/shared/constants";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@repo/ui/components/card";
import { Item, ItemContent, ItemMedia } from "@repo/ui/components/item";
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
import { Logs } from "@repo/ui/icons";

const mockDataTable: {
	user_role: Role;
	action: DocumentStatus;
	id_document: string;
	document_name: string;
	time: string;
}[] = [
	{
		user_role: "QC",
		action: "VERIFIED",
		id_document: "DOC-10120234",
		document_name: "Transcript_Nilai_2010_Ahmad_Fauzi.pdf",
		time: "2026-01-07T14:00:00+07:00",
	},
	{
		user_role: "UPLOADER",
		action: "UPLOADED",
		id_document: "DOC-10120231",
		document_name: "Nilai_Basis_Data_2009_Siti_Nurhaliza.pdf",
		time: "2026-01-07T14:05:00+07:00",
	},
	{
		user_role: "QC",
		action: "REJECTED",
		id_document: "DOC-10120232",
		document_name: "Transkrip_2008_Budi_Santoso.pdf",
		time: "2026-01-07T11:45:00+07:00",
	},
	{
		user_role: "UPLOADER",
		action: "DELETED",
		id_document: "DOC-10120233",
		document_name: "Nilai_Invalid_2007.pdf",
		time: "2026-01-07T12:01:00+07:00",
	},
	{
		user_role: "QC",
		action: "UPLOADED",
		id_document: "DOC-10120235",
		document_name: "Transkrip_2006_Rina_Marlina.pdf",
		time: "2026-01-07T10:00:00+07:00",
	},
	{
		user_role: "MANAGER",
		action: "VERIFIED",
		id_document: "DOC-10120236",
		document_name: "Nilai_Struktur_Data_2005.pdf",
		time: "2026-01-06T11:30:00+07:00",
	},
	{
		user_role: "SBAP",
		action: "DOWNLOADED",
		id_document: "DOC-10120237",
		document_name: "Transkrip_2004_Dedi_Kurniawan.pdf",
		time: "2026-01-06T13:05:00+07:00",
	},
	{
		user_role: "UPLOADER",
		action: "PENDING",
		id_document: "DOC-10120238",
		document_name: "Nilai_Algoritma_2003.pdf",
		time: "2026-01-06T13:30:00+07:00",
	},
	{
		user_role: "MANAGER",
		action: "VERIFIED",
		id_document: "DOC-10120239",
		document_name: "Transkrip_Nilai_2010_John_Doe.pdf",
		time: "2026-01-06T12:41:00+07:00",
	},
	{
		user_role: "SBAP",
		action: "REJECTED",
		id_document: "DOC-10120210",
		document_name: "Transkrip_Nilai_2014_Budi_Santoso.pdf",
		time: "2026-01-06T11:45:00+07:00",
	},
];

export const MonitoringAllUserActivityCard = () => {
	return (
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
									className={i % 2 === 1 ? "bg-accent hover:bg-accent/70" : ""}
								>
									<TableCell>{i + 1}</TableCell>
									<TableCell>
										<RoleBadge variant={data.user_role}>
											{data.user_role}
										</RoleBadge>
									</TableCell>
									<TableCell>
										<StatusBadge variant={data.action}>
											{data.action}
										</StatusBadge>
									</TableCell>
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
											month: "short",
											year: "numeric",
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
	);
};
