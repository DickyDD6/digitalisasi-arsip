import { ComponentProps } from "react";
import { cn, cva, VariantProps } from "@repo/ui/lib";
import { Slot } from "@repo/ui/radix";
import { Badge } from "@repo/ui/components/badge";

const roleBadgeVariants = cva("uppercase", {
	variants: {
		variant: {
			MANAGER: "",
			QC: "bg-green-600",
			UPLOADER: "bg-blue-600",
			SBAP: "bg-purple-600",
		},
	},
	defaultVariants: {
		variant: "MANAGER",
	},
});

export const RoleBadge = ({
	className,
	variant,
	asChild = false,
	asTeam = false,
	...props
}: ComponentProps<"span"> &
	VariantProps<typeof roleBadgeVariants> & {
		asChild?: boolean;
		asTeam?: boolean;
	}) => {
	const Comp = asChild ? Slot : Badge;

	return asTeam ? (
		<Comp className={cn(roleBadgeVariants({ variant }), className)} {...props}>
			Team {props.children}
		</Comp>
	) : (
		<Comp
			className={cn(roleBadgeVariants({ variant }), className)}
			{...props}
		/>
	);
};
