import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import {
	Item,
	ItemContent,
	ItemDescription,
	ItemTitle,
} from "@repo/ui/components/item";
import { cn } from "@repo/ui/lib";

const mockData = [
	{
		title: "Total Activity Today",
		count: 47,
		color: "text-foreground",
	},
	{
		title: "Document Upload",
		count: 18,
		color: "text-blue-600",
	},
	{
		title: "Verified",
		count: 23,
		color: "text-green-600",
	},
	{
		title: "Rejected",
		count: 6,
		color: "text-destructive",
	},
];

export const MonitoringStatsSummaryCard = () => {
	return (
		<div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
			{mockData.map((data, i) => (
				<Button key={i} className="p-0 h-auto w-auto" variant={"ghost"}>
					<Card className="w-full h-full hover:scale-105 transition-all hover:shadow-lg hover:border-primary">
						<CardContent>
							<Item className="p-0">
								<ItemContent className="items-start">
									<ItemDescription className="line-clamp-2">
										{data.title}
									</ItemDescription>
									<ItemTitle className={cn("text-xl", data.color)}>
										{data.count}
									</ItemTitle>
								</ItemContent>
							</Item>
						</CardContent>
					</Card>
				</Button>
			))}
		</div>
	);
};
