"use client";

// TODO: PINDAHKAN_KE_FEATURES - Komponen ini harus dipindahkan ke features/dashboard/widgets/
// Lokasi saat ini melanggar arsitektur berbasis fitur - komponen tidak boleh berada di direktori app/
import { Badge } from "@repo/ui/components/badge";
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
import { Item, ItemContent, ItemMedia } from "@repo/ui/components/item";
import {
	NativeSelect,
	NativeSelectOption,
} from "@repo/ui/components/native-select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@repo/ui/components/table";
import { Funnel } from "@repo/ui/icons";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
				<div className="flex items-start justify-between md:items-center">
					<div className="grid w-full grid-rows-2 gap-1">
						<CardTitle className="text-sm md:text-base">
							QC Staff Performance (Today)
						</CardTitle>
						<CardDescription className="text-xs md:text-sm">
							Verification team productivity comparison
						</CardDescription>
					</div>

					<Item className="p-0">
						<ItemMedia className="size-4 md:size-8">
							<Funnel />
						</ItemMedia>
						<ItemContent className="w-40">
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
			<CardContent className="flex flex-col items-center w-full gap-5 px-0">
				<ChartContainer config={chartConfig} className="w-full h-full px-6">
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

				<div className="w-80 md:w-full">
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
										<Badge variant={"success"}>
											{Math.round(
												(item.verified / (item.verified + item.rejected)) *
													1000,
											) / 10}
											%
										</Badge>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	);
};
