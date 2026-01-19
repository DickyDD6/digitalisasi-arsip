import {MetricCard, MetricCardContent, MetricCardTitle, MetricCardValue, MetricGrid,} from "@/shared/components/metric";
import {cn} from "@repo/ui/lib";

const mockData = [
	{
		title: "Total Activity Today",
		count: 47,
		color: "text-foreground",
	},
	{
		title: "Document Upload",
		count: 18,
		color: "text-blue-600",
	},
	{
		title: "Verified",
		count: 23,
		color: "text-green-600",
	},
	{
		title: "Rejected",
		count: 6,
		color: "text-destructive",
	},
];

export const MonitoringStatsSummaryCard = () => {
	return (
		<MetricGrid>
			{mockData.map((data, i) => (
				<MetricCard key={i}>
					<MetricCardContent>
						<MetricCardTitle>{data.title}</MetricCardTitle>
						<MetricCardValue className={cn(data.color)}>
							{data.count}
						</MetricCardValue>
					</MetricCardContent>
				</MetricCard>
			))}
		</MetricGrid>
	);
};
