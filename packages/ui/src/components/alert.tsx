import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@repo/ui/lib/utils";

const alertVariants = cva(
	"relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current has-data-[slot=alert-time]:grid-cols-[calc(var(--spacing)*4)_1fr_auto]",
	{
		variants: {
			variant: {
				default: "bg-card text-card-foreground",
				destructive:
					"text-destructive bg-red-100 [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90 border-destructive",
				warning:
					"text-yellow-600 bg-yellow-100 [&>svg]:text-current *:data-[slot=alert-description]:text-yellow-600/90 border-yellow-600",
				info: "text-blue-600 bg-blue-100 [&>svg]:text-current *:data-[slot=alert-description]:text-blue-600/90 border-blue-600",
				success:
					"text-green-600 bg-green-100 [&>svg]:text-current *:data-[slot=alert-description]:text-green-600/90 border-green-600",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

function Alert({
	className,
	variant,
	...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
	return (
		<div
			data-slot="alert"
			role="alert"
			className={cn(alertVariants({ variant }), className)}
			{...props}
		/>
	);
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="alert-title"
			className={cn(
				"col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
				className,
			)}
			{...props}
		/>
	);
}

function AlertDescription({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="alert-description"
			className={cn(
				"text-muted-foreground col-start-2 grid justify-items-start gap-1 text-xs md:text-sm [&_p]:leading-relaxed",
				className,
			)}
			{...props}
		/>
	);
}

function AlertTime({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="alert-time"
			className={cn(
				"text-muted-foreground col-start-3 grid justify-items-start gap-1 row-start-1 text-xs [&_p]:leading-relaxed",
				className,
			)}
			{...props}
		/>
	);
}

export { Alert, AlertTitle, AlertDescription, AlertTime };
