import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import {
	Item,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from "@repo/ui/components/item";
import {
	ActivitySquare,
	AlertTriangle,
	Clock,
	FileCheck,
	FileClock,
	FileText,
	FileX,
	UserRoundCheck,
} from "@repo/ui/icons";
import { cn } from "@repo/ui/lib/utils";

const mockData = [
	{
		title: "Total Digitalized Documents",
		data: 32_847,
		category: "DIGITALIZED",
	},
	{
		title: "Verified",
		data: 28_234,
		category: "VERIFIED",
	},
	{
		title: "Waiting for Verification",
		data: 3_240,
		category: "PENDING",
	},
	{
		title: "Rejected",
		data: 1_373,
		category: "REJECTED",
	},
	{
		title: "Today Activity",
		data: 47,
		category: "ACTIVITY",
	},
	{
		title: "Average Verification Time",
		data: 2.3,
		category: "AVERAGE_TIME",
	},
	{
		title: "Staff Active",
		data: 8,
		category: "STAFF",
	},
	{
		title: "Urgent Documents",
		data: 15,
		category: "URGENT",
	},
];

const iconDocument = [
	{
		icon: FileText,
		category: "DIGITALIZED",
		color: "text-primary bg-orange-100",
	},
	{
		icon: FileCheck,
		category: "VERIFIED",
		color: "text-green-600 bg-green-100",
	},
	{
		icon: FileClock,
		category: "PENDING",
		color: "text-yellow-600 bg-yellow-100",
	},
	{
		icon: FileX,
		category: "REJECTED",
		color: "text-destructive bg-red-100",
	},
	{
		icon: ActivitySquare,
		category: "ACTIVITY",
		color: "text-purple-600 bg-purple-100",
	},
	{
		icon: Clock,
		category: "AVERAGE_TIME",
		color: "text-blue-600 bg-blue-100",
	},
	{
		icon: UserRoundCheck,
		category: "STAFF",
		color: "text-emerald-600 bg-emerald-100",
	},
	{
		icon: AlertTriangle,
		category: "URGENT",
		color: "text-destructive bg-red-100",
	},
];

export const DashboardStatsSummary = () => {
	return (
		<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
			{mockData.map((data, i) => (
				<Button variant={"ghost"} key={i} className="h-auto w-auto p-0">
					<Card className="w-full h-full hover:scale-105 transition-all hover:shadow-lg hover:border-primary">
						<CardContent>
							<Item className="p-0">
								<ItemContent className="items-start">
									<ItemDescription className="line-clamp-2">
										{data.title}
									</ItemDescription>
									<ItemTitle className="text-xl">{data.data}</ItemTitle>
								</ItemContent>
								<ItemMedia>
									{iconDocument
										.filter((item) => item.category === data.category)
										.map(({ icon: Icon, color }, i) => (
											<Badge
												key={i}
												className={cn(
													"rounded-md bg-primary/10 text-primary size-10",
													color,
												)}
											>
												<Icon className="size-full!" />
											</Badge>
										))}
								</ItemMedia>
							</Item>
						</CardContent>
					</Card>
				</Button>
			))}
		</div>
	);
};
