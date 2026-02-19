import {
	AdaptStatsOverviewBarChatFnc,
	AdaptStatsOverviewBarChatReturns,
	AdaptStatsOverviewFnc,
	STATS_OVERVIEW_CONFIG
} from ".";

export const adaptStatsOverview: AdaptStatsOverviewFnc = (data) =>
	data.map((d) => {
		const config = STATS_OVERVIEW_CONFIG[d.type]
		const sumRange = Object.values(d.period).reduce((acc, curr) => acc + (curr.value ?? 0), 0)
		const percentage = Math.round((sumRange / d.total) * 1000) / 10

		let description: string
		switch (d.type) {
			case "PERIOD":
				description = "Period 2000-2010"
				break;
			default:
				description = `${percentage}% of the total`
				break;
		}

		return {
			type: d.type,
			total: Number(Intl.NumberFormat("id-ID").format(d.total)),
			period: d.period,
			description,
			...config
		}
	})

export const adaptStatsOverviewBarChart: AdaptStatsOverviewBarChatFnc = (data) => {
	const years = Object.keys(data[0]?.period || {}).map(Number);

	return years.map((year) => {
		const markData = data.find((d) => d.type === "MARK");
		const transcriptData = data.find((d) => d.type === "TRANSCRIPT");

		return {
			PERIOD: year,
			MARK: markData?.period[year]?.value ?? 0,
			TRANSCRIPT: transcriptData?.period[year]?.value ?? 0,
		};
	}) as AdaptStatsOverviewBarChatReturns;
}