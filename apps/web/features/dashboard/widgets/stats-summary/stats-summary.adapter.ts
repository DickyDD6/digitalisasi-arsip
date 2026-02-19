import {AdaptStatsSummaryFnc, STATS_SUMMARY_CONFIG} from ".";

export const adaptStatsSummary: AdaptStatsSummaryFnc = (data) =>
	data.map(({type, value}) => {
		const config = STATS_SUMMARY_CONFIG[type]

		return {
			type,
			value,
			label: config.label,
			icon: config.icon,
			colorClassName: config.colorClassName
		}
	})