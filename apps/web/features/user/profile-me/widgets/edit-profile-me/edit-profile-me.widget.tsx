"use client";

import React from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@repo/ui/components/card";
import { useMe } from "@/features/user";
import { Shield } from "@repo/ui/icons";
import { ROLE } from "@/shared/constants";
import { EditProfileMeForm } from ".";

export const EditProfileMeWidget = () => {
	const { data } = useMe();

	return (
		<Card className={"p-0 pb-6 overflow-hidden"}>
			<CardHeader className={"bg-primary text-primary-foreground py-6"}>
				<div className={"flex gap-2 items-center"}>
					<Shield size={64} className={"size-20 fill-current"} />
					<div className={"space-y-1"}>
						<CardTitle>{data?.data.name}</CardTitle>
						<span className={"font-medium text-sm"}>
							{ROLE[data?.data.role.toLocaleUpperCase() as keyof typeof ROLE] ||
								[]}
						</span>
						<CardDescription
							className={"text-xs text-primary-foreground opacity-70"}
						>
							Fakultas Teknik
						</CardDescription>
					</div>
				</div>
			</CardHeader>

			<CardContent>
				<EditProfileMeForm />
			</CardContent>
		</Card>
	);
};
