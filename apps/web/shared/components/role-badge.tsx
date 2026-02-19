import { ComponentProps } from "react";
import { cn, cva, VariantProps } from "@repo/ui/lib";
import { Slot } from "@repo/ui/radix";
import { Badge } from "@repo/ui/components/badge";

const roleBadgeVariants = cva("uppercase", {
	variants: {
		variant: {
			MANAGER: "bg-manager text-manager-foreground",
			QC: "bg-qc text-qc-foreground",
			UPLOADER: "bg-uploader text-uploader-foreground",
			SBAP: "bg-sbap text-sbap-foreground",
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
