import {
	Card,
	CardContent,
	CardDescription,
	CardTitle,
} from "@repo/ui/components/card";
import { Metadata } from "next";
import { DigitalArchivesStatisticsChart } from "./_components/widgets/digital-archives-statistics-chart";
import { DocumentTypeDistributionChart } from "./_components/widgets/document-type-distribution-chart";
import { NotificationsAndAnnouncements } from "./_components/widgets/notifications-and-announcements";
import { PeriodFilterCard } from "./_components/widgets/period-filter-card";
import { QCStaffPerformanceStaff } from "./_components/widgets/qc-staff-performance-chart";
import { VerificationProcessStatus } from "./_components/widgets/verification-process-status";
import { DashboardStatsSummary } from "./_components/widgets/dashboard-stats-summary";

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

			<PeriodFilterCard />
			<DashboardStatsSummary />

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
