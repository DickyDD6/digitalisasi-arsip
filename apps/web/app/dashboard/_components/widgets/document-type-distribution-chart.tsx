"use client"

// TODO: PINDAHKAN_KE_FEATURES - Komponen ini harus dipindahkan ke features/dashboard/widgets/
// Lokasi saat ini melanggar arsitektur berbasis fitur - komponen tidak boleh berada di direktori app/
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@repo/ui/components/card";
import {
	ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@repo/ui/components/chart";
import React from "react";
import { Pie, PieChart } from "recharts";

const chartData = [
	{
		label: "mark-transcript",
		document: 3245,
		fill: "var(--color-mark-transcript)",
	},
	{
		label: "affidavit",
		document: 1423,
		fill: "var(--color-affidavit)",
	},
	{
		label: "academic",
		document: 1534,
		fill: "var(--color-academic)",
	},
	{
		label: "certificate",
		document: 1876,
		fill: "var(--color-certificate)",
	},
	{
		label: "degree",
		document: 2156,
		fill: "var(--color-degree)",
	},
];

const chartConfig = {
	document: {
		label: "Document Distributions",
	},
	"mark-transcript": {
		label: "Mark Transcript",
		color: "var(--primary)",
	},
	affidavit: {
		label: "Affidavit",
		color: "var(--color-red-600)",
	},
	academic: {
		label: "KRS/KHS",
		color: "var(--color-blue-600)",
	},
	certificate: {
		label: "Certificate",
		color: "var(--color-yellow-600)",
	},
	degree: {
		label: "Degree",
		color: "var(--color-green-600)",
	},
} satisfies ChartConfig;

export const DocumentTypeDistributionChart = () => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Document Type Distribution</CardTitle>
				<CardDescription>Based on Document Category</CardDescription>
			</CardHeader>
			<CardContent className="space-y-5">
				<ChartContainer config={chartConfig}>
					<PieChart>
						<ChartTooltip content={<ChartTooltipContent hideLabel />} />
						<Pie
							data={chartData}
							dataKey={"document"}
							label={({ percent }: { percent: number }) =>
								`${(percent * 100).toFixed(1)}%`
							}
							nameKey={"label"}
						/>
						<ChartLegend
							className="grid grid-cols-2 gap-2 mt-4"
							content={<ChartLegendContent withValue />}
						/>
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
};
