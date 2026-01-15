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
import {
	NativeSelect,
	NativeSelectOption,
} from "@repo/ui/components/native-select";
import {
	ActivitySquare,
	AlertTriangle,
	Calendar,
	Clock,
	FileCheck,
	FileClock,
	FileText,
	FileX,
	Funnel,
	UserRoundCheck,
} from "@repo/ui/index";
import { cn } from "@repo/ui/lib/utils";
import { DigitalArchivesStatisticsChart } from "./_components/widgets/digital-archives-statistics-chart";
import { DocumentTypeDistributionChart } from "./_components/widgets/document-type-distribution-chart";
import { NotificationsAndAnnouncements } from "./_components/widgets/notifications-and-announcements";
import { QCStaffPerformanceStaff } from "./_components/widgets/qc-staff-performance-chart";
import { VerificationProcessStatus } from "./_components/widgets/verification-process-status";
import { Metadata } from "next";

const mockData = [
	{
		title: "Total Digitalized Documents",
		data: 32_847,
		category: "DIGITALIZED",
	},
	{
		title: "Verified",
		data: 28_234,
		category: "VERIFIED",
	},
	{
		title: "Waiting for Verification",
		data: 3_240,
		category: "PENDING",
	},
	{
		title: "Rejected",
		data: 1_373,
		category: "REJECTED",
	},
	{
		title: "Today Activity",
		data: 47,
		category: "ACTIVITY",
	},
	{
		title: "Average Verification Time",
		data: 2.3,
		category: "AVERAGE_TIME",
	},
	{
		title: "Staff Active",
		data: 8,
		category: "STAFF",
	},
	{
		title: "Urgent Documents",
		data: 15,
		category: "URGENT",
	},
];

const iconDocument = [
	{
		icon: FileText,
		category: "DIGITALIZED",
		color: "text-primary bg-orange-100",
	},
	{
		icon: FileCheck,
		category: "VERIFIED",
		color: "text-green-600 bg-green-100",
	},
	{
		icon: FileClock,
		category: "PENDING",
		color: "text-yellow-600 bg-yellow-100",
	},
	{
		icon: FileX,
		category: "REJECTED",
		color: "text-destructive bg-red-100",
	},
	{
		icon: ActivitySquare,
		category: "ACTIVITY",
		color: "text-purple-600 bg-purple-100",
	},
	{
		icon: Clock,
		category: "AVERAGE_TIME",
		color: "text-blue-600 bg-blue-100",
	},
	{
		icon: UserRoundCheck,
		category: "STAFF",
		color: "text-emerald-600 bg-emerald-100",
	},
	{
		icon: AlertTriangle,
		category: "URGENT",
		color: "text-destructive bg-red-100",
	},
];

export const metadata: Metadata = {
	title: "Dashboard - Manager",
	description:
		"Information System for Archives Management of Student's Grades and Transcripts at the Faculty of Engineering (2000-2010)",
};

const DashboardPage = async () => {
	return (
		<>
			<Card>
				<CardContent className="space-y-1">
					<CardTitle>Dashboard Manager</CardTitle>
					<CardDescription>
						Information System for Archives Management of Student&apos;s Grades
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
							<ItemDescription className="text-xs md:text-base">
								Periode Data:
							</ItemDescription>
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
				{mockData.map((data, i) => (
					<Button variant={"ghost"} key={i} className="h-auto w-auto p-0">
						<Card className="w-full h-full hover:scale-105 transition-all hover:shadow-lg hover:border-primary">
							<CardContent>
								<Item className="p-0">
									<ItemContent>
										<ItemDescription className="line-clamp-2">
											{data.title}
										</ItemDescription>
										<ItemTitle className="text-xl">{data.data}</ItemTitle>
									</ItemContent>
									<ItemMedia>
										{iconDocument
											.filter((item) => item.category === data.category)
											.map(({ icon: Icon, color }, i) => (
												<Badge
													key={i}
													className={cn(
														"rounded-md bg-primary/10 text-primary size-10",
														color,
													)}
												>
													<Icon className="size-full!" />
												</Badge>
											))}
									</ItemMedia>
								</Item>
							</CardContent>
						</Card>
					</Button>
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
