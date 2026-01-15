"use client"

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
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartData = [
	{ period: 2000, mark: 1900, transcript: 200 },
	{ period: 2001, mark: 2000, transcript: 250 },
	{ period: 2002, mark: 2200, transcript: 300 },
	{ period: 2003, mark: 2400, transcript: 350 },
	{ period: 2004, mark: 2600, transcript: 400 },
	{ period: 2005, mark: 2800, transcript: 450 },
	{ period: 2006, mark: 3000, transcript: 500 },
	{ period: 2007, mark: 3200, transcript: 550 },
	{ period: 2008, mark: 3400, transcript: 600 },
	{ period: 2009, mark: 3600, transcript: 650 },
	{ period: 2010, mark: 3800, transcript: 700 },
];

const chartConfig = {
	mark: {
		label: "Mark",
		color: "var(--color-green-600)",
	},
	transcript: {
		label: "Transcript",
		color: "var(--color-blue-600)",
	},
} satisfies ChartConfig;

export const DigitalArchivesStatisticsChart = () => {
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
					<Card className="bg-primary text-primary-foreground">
						<CardContent>
							<CardTitle>Total Digitalized Documents</CardTitle>
							<span className="text-2xl font-bold">32,369</span>
							<CardDescription className="font-light text-primary-foreground">
								Period 2000-2010
							</CardDescription>
						</CardContent>
					</Card>
					<Card className="bg-blue-600 text-primary-foreground">
						<CardContent>
							<CardTitle>Transcript Document</CardTitle>
							<span className="text-2xl font-bold">3,906</span>
							<CardDescription className="font-light text-primary-foreground">
								11.0% of the total
							</CardDescription>
						</CardContent>
					</Card>
					<Card className="bg-green-600 text-primary-foreground">
						<CardContent>
							<CardTitle>Value Document</CardTitle>
							<span className="text-2xl font-bold">31,463</span>
							<CardDescription className="font-light text-primary-foreground">
								89,0% of the total
							</CardDescription>
						</CardContent>
					</Card>
				</div>

				<ChartContainer config={chartConfig} className="order-1 md:order-2">
					<BarChart accessibilityLayer data={chartData}>
						<CartesianGrid strokeDasharray={"3 3"} />
						<YAxis
							tickMargin={10}
							domain={[
								0,
								(dataMax: number) => Math.ceil(dataMax / 1000) * 1000,
							]}
							ticks={(() => {
								const max = 4000;
								const step = 1000;
								const results: number[] = [];

								for (let i = 0; i <= max; i += step) {
									results.push(i);
								}

								return results;
							})()}
						/>
						<XAxis dataKey="period" tickMargin={10} />
						<ChartTooltip content={<ChartTooltipContent />} />
						<Bar
							dataKey={"transcript"}
							fill={"var(--color-transcript)"}
							radius={4}
						/>
						<Bar dataKey={"mark"} fill={"var(--color-mark)"} radius={4} />
						<ChartLegend content={<ChartLegendContent />} />
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
};
