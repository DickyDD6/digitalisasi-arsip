import {
	PageDescription,
	PageHeader,
	PageTitle,
} from "@/shared/components/page-header";
import { DocumentTypeDistributionChart } from "./_components/widgets/document-type-distribution-chart";
import { NotificationsAndAnnouncements } from "./_components/widgets/notifications-and-announcements";
import { PeriodFilterCard } from "./_components/widgets/period-filter-card";
import { QCStaffPerformanceStaff } from "./_components/widgets/qc-staff-performance-chart";
import { VerificationProcessStatus } from "./_components/widgets/verification-process-status";
import { StatsOverviewWidget, StatsSummaryWidget } from "@/features/dashboard";

const DashboardPage = async () => {
	return (
		<>
			<PageHeader>
				<PageTitle>Dashboard Manager</PageTitle>
				<PageDescription>
					Information System for Archives Management of Student's Grades and
					Transcripts at the Faculty of Engineering (2000-2010)'
				</PageDescription>
			</PageHeader>

			<PeriodFilterCard />
			<StatsSummaryWidget />

			<div className="grid gap-4 lg:grid-cols-2">
				<StatsOverviewWidget />
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
