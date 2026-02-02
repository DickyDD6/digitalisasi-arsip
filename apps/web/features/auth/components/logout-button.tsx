"use client";

import React, { ComponentProps } from "react";
import { useLogout } from "@/features/auth";
import { LogOut } from "@repo/ui/icons";
import { Button, buttonVariants } from "@repo/ui/components/button";
import { cn, VariantProps } from "@repo/ui/lib";

export const LogoutButton = ({
	className,
	variant = "destructive",
	size = "default",
	asChild,
	...props
}: ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	}) => {
	const { mutate } = useLogout();

	return (
		<Button
			variant={"destructive"}
			className={cn(buttonVariants({ variant, size, className }))}
			onClick={() => mutate()}
			{...props}
		>
			<LogOut className="text-white" />
			Logout
		</Button>
	);
};
