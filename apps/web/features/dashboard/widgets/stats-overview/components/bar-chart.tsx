"use client"

import {Bar, BarChart, CartesianGrid, XAxis, YAxis} from "recharts";
import {
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent
} from "@repo/ui/components/chart";
import React from "react";
import {
	adaptStatsOverviewBarChart,
	STATS_OVERVIEW_CHART_CONFIG,
	STATS_OVERVIEW_DATA, STATS_OVERVIEW_DATA_KEY,
	STATS_OVERVIEW_DOMAIN_YAXIS,
	STATS_OVERVIEW_TICKS_YAXIS
} from "..";

export const StatsOverviewBarChart = () => {
	return (
		<ChartContainer config={STATS_OVERVIEW_CHART_CONFIG} className="order-1 md:order-2">
			<BarChart accessibilityLayer data={adaptStatsOverviewBarChart(STATS_OVERVIEW_DATA)}>
				<CartesianGrid strokeDasharray={"3 3"}/>
				<YAxis
					tickMargin={10}
					domain={STATS_OVERVIEW_DOMAIN_YAXIS}
					ticks={STATS_OVERVIEW_TICKS_YAXIS()}
				/>
				<XAxis dataKey={STATS_OVERVIEW_DATA_KEY.PERIOD} tickMargin={10}/>
				<ChartTooltip content={<ChartTooltipContent/>}/>
				<Bar
					dataKey={STATS_OVERVIEW_DATA_KEY.TRANSCRIPT}
					fill={STATS_OVERVIEW_CHART_CONFIG[STATS_OVERVIEW_DATA_KEY.TRANSCRIPT].color}
					radius={4}
				/>
				<Bar dataKey={STATS_OVERVIEW_DATA_KEY.MARK} fill={STATS_OVERVIEW_CHART_CONFIG[STATS_OVERVIEW_DATA_KEY.MARK].color} radius={4}/>
				<ChartLegend content={<ChartLegendContent/>}/>
			</BarChart>
		</ChartContainer>
	)
}