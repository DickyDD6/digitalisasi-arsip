import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import {
	Item,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from "@repo/ui/components/item";
import { Shield, UploadCloud, UsersRound, Workflow } from "@repo/ui/index";
import { cn } from "@repo/ui/lib/utils";

const mockData = [
	{
		icon: UsersRound,
		title: "Total Users",
		count: 32,
		color: "text-foreground",
	},
	{
		icon: Shield,
		title: "Tim QC",
		count: 8,
		color: "text-green-600",
	},
	{
		icon: UploadCloud,
		title: "Tim Uploader",
		count: 12,
		color: "text-yellow-600",
	},
	{
		icon: Workflow,
		title: "SBAP officer",
		count: 11,
		color: "text-blue-600",
	},
];

export const UsersStatsSummary = () => {
	return (
		<div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
			{mockData.map((data, i) => (
				<Button variant={"ghost"} className="p-0 w-auto h-auto" key={i}>
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
								<ItemMedia>
									<data.icon className={cn("size-4 md:size-6", data.color)} />
								</ItemMedia>
							</Item>
						</CardContent>
					</Card>
				</Button>
			))}
		</div>
	);
};
