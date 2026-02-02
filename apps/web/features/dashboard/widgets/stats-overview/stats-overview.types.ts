export const STATS_OVERVIEW_DATA_KEY = {
	PERIOD: "PERIOD",
	MARK: "MARK",
	TRANSCRIPT: "TRANSCRIPT",
} as const

export type StatsOverviewType = (typeof STATS_OVERVIEW_DATA_KEY)[keyof typeof STATS_OVERVIEW_DATA_KEY]

export type StatsOverviewRaw = {
	type: StatsOverviewType;
	total: number;
	period: Record<number, { value: number }>
}

export type StatsOverviewDisplayConfig = {
	label: string;
	colorClassName: string;
}

export type StatsOverviewConfig = Record<StatsOverviewType, StatsOverviewDisplayConfig>

export interface AdaptStatsOverviewReturns extends StatsOverviewRaw, StatsOverviewDisplayConfig {
	description: string;
}

export interface AdaptStatsOverviewFnc {
	(data: StatsOverviewRaw[]): AdaptStatsOverviewReturns[];
}

export type AdaptStatsOverviewBarChatReturns = Record<StatsOverviewType, number>[]

export interface AdaptStatsOverviewBarChatFnc {
	(data: StatsOverviewRaw[]): AdaptStatsOverviewBarChatReturns;
}