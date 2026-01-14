"use client";

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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@repo/ui/components/table";
import { Badge } from "@repo/ui/components/badge";
import {
	NativeSelect,
	NativeSelectOption,
} from "@repo/ui/components/native-select";
import { Item, ItemContent, ItemMedia } from "@repo/ui/components/item";
import { Funnel } from "@repo/ui/index";

const chartData = [
	{
		user: "QC-01",
		verified: 234,
		rejected: 12,
	},
	{
		user: "QC-02",
		verified: 198,
		rejected: 15,
	},
	{
		user: "QC-03",
		verified: 215,
		rejected: 9,
	},
	{
		user: "QC-04",
		verified: 187,
		rejected: 18,
	},
	{
		user: "QC-05",
		verified: 203,
		rejected: 14,
	},
];

const chartConfig = {
	rejected: {
		label: "Rejected",
		color: "var(--destructive)",
	},
	verified: {
		label: "Verified",
		color: "var(--color-green-600)",
	},
} satisfies ChartConfig;

export const QCStaffPerformanceStaff = () => {
	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div className="grid grid-rows-2 gap-1">
						<CardTitle>QC Staff Performance (Today)</CardTitle>
						<CardDescription>
							Verification team productivity comparison
						</CardDescription>
					</div>

					<Item>
						<ItemMedia>
							<Funnel />
						</ItemMedia>
						<ItemContent>
							<NativeSelect>
								<NativeSelectOption>Select Staff</NativeSelectOption>
								<NativeSelectOption value="QC-01">QC-01</NativeSelectOption>
								<NativeSelectOption value="QC-02">QC-02</NativeSelectOption>
								<NativeSelectOption value="QC-03">QC-03</NativeSelectOption>
								<NativeSelectOption value="QC-04">QC-04</NativeSelectOption>
								<NativeSelectOption value="QC-05">QC-05</NativeSelectOption>
							</NativeSelect>
						</ItemContent>
					</Item>
				</div>
			</CardHeader>
			<CardContent className="space-y-5">
				<ChartContainer config={chartConfig}>
					<BarChart data={chartData}>
						<CartesianGrid strokeDasharray={"3 3"} />
						<YAxis tickMargin={10} />
						<XAxis tickMargin={10} dataKey={"user"} />
						<ChartTooltip content={<ChartTooltipContent />} />
						<Bar dataKey={"verified"} radius={4} fill="var(--color-verified)" />
						<Bar dataKey={"rejected"} radius={4} fill="var(--color-rejected)" />
						<ChartLegend content={<ChartLegendContent />} />
					</BarChart>
				</ChartContainer>

				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Staff</TableHead>
							<TableHead>Verified</TableHead>
							<TableHead>Rejected</TableHead>
							<TableHead>Average Time</TableHead>
							<TableHead>Success Rate</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{chartData.map((item, i) => (
							<TableRow key={i}>
								<TableCell>{item.user}</TableCell>
								<TableCell>{item.verified}</TableCell>
								<TableCell>{item.rejected}</TableCell>
								<TableCell>1.8 Day</TableCell>
								<TableCell>
									<Badge className="text-green-600 bg-green-100">
										{Math.round(
											(item.verified / (item.verified + item.rejected)) * 1000,
										) / 10}
										%
									</Badge>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
};
