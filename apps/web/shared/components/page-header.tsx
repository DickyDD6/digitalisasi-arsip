import {
	Card,
	CardContent,
	CardDescription,
	CardTitle,
} from "@repo/ui/components/card";
import { Children, ComponentProps, isValidElement } from "react";
import { cn } from "@repo/ui/lib/utils";

export const PageHeader = ({ className, ...props }: ComponentProps<"div">) => {
	return (
		<Card>
			<CardContent className={cn("flex justify-between", className)} {...props}>
				<div className={"space-y-1"}>
					{Children.toArray(props.children).find(
						(child) => isValidElement(child) && child.type === PageTitle,
					)}
					{Children.toArray(props.children).find((child) => {
						return isValidElement(child) && child.type === PageDescription;
					})}
				</div>
				{Children.toArray(props.children).find(
					(child) => isValidElement(child) && child.type === PageActions,
				)}
			</CardContent>
		</Card>
	);
};

export const PageTitle = ({ className, ...props }: ComponentProps<"div">) => {
	return <CardTitle className={className} {...props} />;
};
PageTitle.displayName = "PageTitle";

export const PageDescription = ({
	className,
	...props
}: ComponentProps<"div">) => {
	return <CardDescription className={className} {...props} />;
};
PageDescription.displayName = "PageDescription";

export const PageActions = ({ className, ...props }: ComponentProps<"div">) => {
	return <div data-slot={"page-actions"} className={className} {...props} />;
};
PageActions.displayName = "PageActions";
