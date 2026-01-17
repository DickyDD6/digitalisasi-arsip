import {
	Card,
	CardContent,
	CardDescription,
	CardTitle,
} from "@repo/ui/components/card";
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
			<Card>
				<CardContent className="space-y-1">
					<CardTitle>System Log Activity</CardTitle>
					<CardDescription>
						Monitoring and audit trail of all user activities
					</CardDescription>
				</CardContent>
			</Card>
			<MonitoringFilterCard />
			<MonitoringStatsSummaryCard />
			<MonitoringAllUserActivityCard />
		</>
	);
};

export default LogActivityPage;
