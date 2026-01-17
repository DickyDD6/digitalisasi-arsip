import { PageHeader } from "@/shared/components/page-header";
import { DashboardStatsSummary } from "./_components/widgets/dashboard-stats-summary";
import { DigitalArchivesStatisticsChart } from "./_components/widgets/digital-archives-statistics-chart";
import { DocumentTypeDistributionChart } from "./_components/widgets/document-type-distribution-chart";
import { NotificationsAndAnnouncements } from "./_components/widgets/notifications-and-announcements";
import { PeriodFilterCard } from "./_components/widgets/period-filter-card";
import { QCStaffPerformanceStaff } from "./_components/widgets/qc-staff-performance-chart";
import { VerificationProcessStatus } from "./_components/widgets/verification-process-status";

const DashboardPage = async () => {
	return (
		<>
			<PageHeader
				title="Dashboard Manager"
				description="Information System for Archives Management of Student's Grades and Transcripts at the Faculty of Engineering (2000-2010)"
			/>

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
