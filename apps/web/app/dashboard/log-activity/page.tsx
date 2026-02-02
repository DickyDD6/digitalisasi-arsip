import {
	PageDescription,
	PageHeader,
	PageTitle,
} from "@/shared/components/page-header";
import { Metadata } from "next";
import { MonitoringAllUserActivityCard } from "./_components/widgets/monitoring-all-user-activity-card";
import { MonitoringFilterCard } from "./_components/widgets/monitoring-filter-card";
import { MonitoringStatsSummaryCard } from "./_components/widgets/monitoring-stats-summary-card";

export const metadata: Metadata = {
	title: "Log Activity",
	description: "Monitoring and audit trail of all user activities",
};

const LogActivityPage = () => {
	return (
		<>
			<PageHeader>
				<PageTitle>Log Activity</PageTitle>
				<PageDescription>
					Monitoring and audit trail of all user activities
				</PageDescription>
			</PageHeader>
			<MonitoringFilterCard />
			<MonitoringStatsSummaryCard />
			<MonitoringAllUserActivityCard />
		</>
	);
};

export default LogActivityPage;
