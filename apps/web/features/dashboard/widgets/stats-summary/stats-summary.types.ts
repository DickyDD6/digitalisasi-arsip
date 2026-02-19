import React from "react";

export type StatsSummaryType =
	| "VERIFIED"
	| "PENDING"
	| "REJECTED"
	| "DIGITALIZED"
	| "ACTIVITY"
	| "AVERAGE_TIME"
	| "STAFF"
	| "URGENT"

export interface StatsSummaryRaw {
	type: StatsSummaryType;
	value: number;
}

interface StatsSummaryDisplayConfig {
	label: string;
	icon: React.ComponentType<{ className?: string }>;
	colorClassName: string;
}

export type StatsSummaryConfig = Record<StatsSummaryType, StatsSummaryDisplayConfig>

export interface AdaptStatsSummaryReturns extends StatsSummaryRaw, StatsSummaryDisplayConfig {}

export interface AdaptStatsSummaryFnc {
	(data: StatsSummaryRaw[]): AdaptStatsSummaryReturns[];
}
