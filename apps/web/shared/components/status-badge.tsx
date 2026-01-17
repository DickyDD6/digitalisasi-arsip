import { ComponentProps } from "react";
import { cn, cva, VariantProps } from "@repo/ui/lib";
import { Slot } from "@repo/ui/radix";
import { Badge } from "@repo/ui/components/badge";

const statusBadgeVariants = cva("", {
	variants: {
		variant: {
			TRANSCRIPT: "bg-orange-100 text-orange-600",
			MARK: "bg-blue-100 text-blue-600",
			ACTIVE: "bg-green-100 text-green-600",
			"NON-ACTIVE": "bg-red-100 text-destructive",
			VERIFIED: "bg-green-100 text-green-600",
			REJECTED: "bg-red-100 text-destructive",
			PENDING: "bg-yellow-100 text-yellow-600",
			DELETED: "bg-muted text-muted-foreground",
			DOWNLOADED: "bg-purple-100 text-purple-600",
			UPLOADED: "bg-blue-100 text-blue-600",
		},
	},
	defaultVariants: {
		variant: "ACTIVE",
	},
});

export const StatusBadge = ({
	className,
	variant,
	asChild = false,
	...props
}: ComponentProps<"span"> &
	VariantProps<typeof statusBadgeVariants> & {
		asChild?: boolean;
	}) => {
	const Comp = asChild ? Slot : Badge;

	return (
		<Comp
			className={cn(statusBadgeVariants({ variant }), className)}
			{...props}
		/>
	);
};
