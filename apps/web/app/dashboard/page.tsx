import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardTitle,
} from "@repo/ui/components/card";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from "@repo/ui/components/item";
import { Calendar, FileText } from "@repo/ui/index";
import { DocumentTypeDistributionChart } from "./_components/widgets/document-type-distribution-chart";
import { DigitalArchivesStatisticsChart } from "./_components/widgets/digital-archives-statistics-chart";
import { QCStaffPerformanceStaff } from "./_components/widgets/qc-staff-performance-chart";
import { VerificationProcessStatus } from "./_components/widgets/verification-process-status";
import { NotificationsAndAnnouncements } from "./_components/widgets/notifications-and-announcements";

const DashboardPage = () => {
	return (
		<>
			<Card className="border-none">
				<CardContent>
					<CardTitle>Dashboard Manager</CardTitle>
					<CardDescription>
						Information System for Archives Management of Students&apos; Grades
						and Transcripts at the Faculty of Engineering (2000-2010)
					</CardDescription>
				</CardContent>
			</Card>

			<Card>
				<CardContent>
					<Item className="p-0">
						<ItemMedia>
							<Calendar />
						</ItemMedia>
						<ItemContent>
							<ItemDescription>Periode Data:</ItemDescription>
						</ItemContent>
						<ItemActions>
							<Button>Hari Ini</Button>
							<Button variant={"outline"}>Minggu Ini</Button>
							<Button variant={"outline"}>Bulan Ini</Button>
						</ItemActions>
					</Item>
				</CardContent>
			</Card>

			<div className="grid grid-cols-4 gap-4">
				{Array.from({ length: 8 }).map((_, i) => (
					<Card key={i}>
						<CardContent>
							<Item className="p-0">
								<ItemContent>
									<ItemDescription className="line-clamp-1">
										Total Digitalized Documents
									</ItemDescription>
									<ItemTitle className="text-xl">32,847</ItemTitle>
								</ItemContent>
								<ItemMedia>
									<Badge className="rounded-md bg-primary/10 text-primary size-10">
										<FileText className="size-full!" />
									</Badge>
								</ItemMedia>
							</Item>
						</CardContent>
					</Card>
				))}
			</div>

			<div className="grid grid-cols-2 gap-4">
				<DigitalArchivesStatisticsChart />
				<DocumentTypeDistributionChart />
			</div>

			<QCStaffPerformanceStaff />

			<div className="grid grid-cols-2 gap-4">
				<VerificationProcessStatus />
				<NotificationsAndAnnouncements />
			</div>
		</>
	);
};

export default DashboardPage;
