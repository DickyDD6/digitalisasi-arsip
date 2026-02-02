import React from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@repo/ui/components/card";
import {StatsOverviewBarChart} from "@/features/dashboard/widgets/stats-overview/components/bar-chart";
import {adaptStatsOverview, STATS_OVERVIEW_DATA} from ".";
import {cn} from "@repo/ui/lib/utils";

export const StatsOverviewWidget = () => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Digital Archives Statistics (2000-2010)</CardTitle>
				<CardDescription>
					Annual distribution of documents that have been digitized
				</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-5">
				<div className="grid order-2 gap-4 md:grid-cols-3 md:order-1">
					{adaptStatsOverview(STATS_OVERVIEW_DATA).map(data => (
						<Card key={data.type} className={cn("text-primary-foreground", data.colorClassName)}>
							<CardContent>
								<CardTitle>{data.label}</CardTitle>
								<span className="text-2xl font-bold">{data.total}</span>
								<CardDescription className="font-light text-primary-foreground">
									{data.description}
								</CardDescription>
							</CardContent>
						</Card>
					))}
				</div>

				<StatsOverviewBarChart/>
			</CardContent>
		</Card>
	);
};