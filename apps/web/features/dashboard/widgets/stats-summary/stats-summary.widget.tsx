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
import { cn } from "@repo/ui/lib/utils";
import { adaptStatsSummary, STATS_SUMMARY_MOCK } from ".";

export const StatsSummaryWidget = () => {
	return (
		<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
			{adaptStatsSummary(STATS_SUMMARY_MOCK).map((data, i) => (
				<Button variant={"ghost"} key={i} className="h-auto w-auto p-0">
					<Card className="w-full h-full hover:scale-105 transition-all hover:shadow-lg hover:border-primary">
						<CardContent>
							<Item className="p-0">
								<ItemContent className="items-start text-start">
									<ItemDescription className="line-clamp-2">
										{data.label}
									</ItemDescription>
									<ItemTitle className="text-xl">{data.value}</ItemTitle>
								</ItemContent>
								<ItemMedia>
									<Badge
										key={i}
										className={cn(
											"rounded-md bg-primary/10 text-primary size-10",
											data.colorClassName,
										)}
									>
										<data.icon className="size-full!" />
									</Badge>
								</ItemMedia>
							</Item>
						</CardContent>
					</Card>
				</Button>
			))}
		</div>
	);
};
