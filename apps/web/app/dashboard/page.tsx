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
import { Calendar, FileText, Funnel } from "@repo/ui/index";
import { DocumentTypeDistributionChart } from "./_components/widgets/document-type-distribution-chart";
import { DigitalArchivesStatisticsChart } from "./_components/widgets/digital-archives-statistics-chart";
import { QCStaffPerformanceStaff } from "./_components/widgets/qc-staff-performance-chart";
import { VerificationProcessStatus } from "./_components/widgets/verification-process-status";
import { NotificationsAndAnnouncements } from "./_components/widgets/notifications-and-announcements";
import {
	NativeSelect,
	NativeSelectOption,
} from "@repo/ui/components/native-select";

const DashboardPage = () => {
	return (
		<>
			<Card className="border-none">
				<CardContent className="space-y-1">
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
						<ItemMedia className="my-auto translate-y-0! size-4 md:size-8">
							<Calendar />
						</ItemMedia>
						<ItemContent>
							<ItemDescription className="text-xs md:text-base">Periode Data:</ItemDescription>
						</ItemContent>
						<ItemActions className="hidden md:flex">
							<Button>Hari Ini</Button>
							<Button variant={"outline"}>Minggu Ini</Button>
							<Button variant={"outline"}>Bulan Ini</Button>
						</ItemActions>
						<ItemActions className="block md:hidden">
							<Item className="p-0">
								<ItemMedia className="size-4 md:size-8 my-auto translate-y-0!">
									<Funnel />
								</ItemMedia>
								<ItemContent>
									<NativeSelect>
										<NativeSelectOption value="today">Today</NativeSelectOption>
										<NativeSelectOption value="weeks">
											This Week
										</NativeSelectOption>
										<NativeSelectOption value="months">
											This Month
										</NativeSelectOption>
									</NativeSelect>
								</ItemContent>
							</Item>
						</ItemActions>
					</Item>
				</CardContent>
			</Card>

			<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
				{Array.from({ length: 8 }).map((_, i) => (
					<Card key={i}>
						<CardContent>
							<Item className="p-0">
								<ItemContent>
									<ItemDescription className="line-clamp-2">
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

			<div className="grid gap-4 lg:grid-cols-2">
				<DigitalArchivesStatisticsChart />
				<DocumentTypeDistributionChart />
			</div>

			<QCStaffPerformanceStaff />

			<div className="grid gap-4 lg:grid-cols-2">
				<VerificationProcessStatus />
				<NotificationsAndAnnouncements />
			</div>
		</>
	);
};

export default DashboardPage;
