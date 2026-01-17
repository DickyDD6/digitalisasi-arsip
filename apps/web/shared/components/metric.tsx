import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardTitle,
} from "@repo/ui/components/card";
import {
	Item,
	ItemContent,
	ItemDescription,
	ItemTitle,
} from "@repo/ui/components/item";
import { cn } from "@repo/ui/lib/utils";
import { ComponentProps, PropsWithChildren } from "react";

const MetricGrid = ({ className, ...props }: ComponentProps<"div">) => (
	<div
		className={cn("grid grid-cols-2 gap-4 lg:grid-cols-4", className)}
		{...props}
	/>
);

const MetricCard = ({ children }: PropsWithChildren) => (
	<Button variant={"ghost"} className="h-auto w-auto p-0">
		<Card className="w-full h-full hover:scale-105 transition-all hover:shadow-lg hover:border-primary">
			<CardContent>
				<Item className="p-0">{children}</Item>
			</CardContent>
		</Card>
	</Button>
);

const MetricCardContent = ({ className, ...props }: ComponentProps<"div">) => (
	<ItemContent className={cn("items-start", className)} {...props} />
);

const MetricCardTitle = ({ className, ...props }: ComponentProps<"p">) => (
	<CardTitle>
		<ItemDescription className={cn("line-clamp-2", className)} {...props} />
	</CardTitle>
);

const MetricCardValue = ({ className, ...props }: ComponentProps<"div">) => (
	<CardDescription>
		<ItemTitle className={cn("text-xl", className)} {...props} />
	</CardDescription>
);

const MetricCardIcon = ({ className, ...props }: ComponentProps<"span">) => (
	<Badge className={cn("rounded-md size-10", className)} {...props} />
);

export {
	MetricCard,
	MetricCardContent,
	MetricCardIcon,
	MetricCardTitle,
	MetricCardValue,
	MetricGrid,
};
