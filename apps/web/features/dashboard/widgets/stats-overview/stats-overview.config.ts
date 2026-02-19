import {ChartConfig} from "@repo/ui/components/chart";
import {AxisDomain} from "recharts/types/util/types";
import {StatsOverviewConfig} from ".";

export const STATS_OVERVIEW_CHART_CONFIG = {
	PERIOD: {
		label: "Period",
		color: "var(--color-green-600)",
	},
	MARK: {
		label: "Mark",
		color: "var(--color-green-600)",
	},
	TRANSCRIPT: {
		label: "Transcript",
		color: "var(--color-blue-600)",
	},
} satisfies ChartConfig

export const STATS_OVERVIEW_TICKS_YAXIS: () => number[] = (): number[] => {
	const max = 4000;
	const step = 1000;
	const results: number[] = [];

	for (let i = 0; i <= max; i += step) {
		results.push(i);
	}

	return results;
}

export const STATS_OVERVIEW_DOMAIN_YAXIS = [
	0,
	(dataMax: number) => Math.ceil(dataMax / 1000) * 1000,
] satisfies AxisDomain

export const STATS_OVERVIEW_CONFIG: StatsOverviewConfig = {
	PERIOD: {
		label: "Total Digitalized Documents",
		colorClassName: "bg-primary"
	},
	TRANSCRIPT: {
		label: "Transcript Documents",
		colorClassName: "bg-blue-600"
	},
	MARK: {
		label: "Mark Documents",
		colorClassName: "bg-green-600"
	},
}