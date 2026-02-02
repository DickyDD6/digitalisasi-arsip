"use client";

import { USER_STATUS, UserStatus } from "@/shared/constants";
import { Field, FieldContent, FieldLabel } from "@repo/ui/components/field";
import {
	Item,
	ItemContent,
	ItemDescription,
	ItemMedia,
} from "@repo/ui/components/item";
import { Label } from "@repo/ui/components/label";
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/radio-group";
import { AlertTriangle, CircleCheckBig, X } from "@repo/ui/icons";
import { Field as TanstackField } from "@tanstack/react-form";
import { useUserTableEditContext } from "..";

export const UserTableEditFieldUserStatus = () => {
	const { formApi } = useUserTableEditContext();

	if (!formApi) return null;

	return (
		<TanstackField form={formApi} name="user_status">
			{(field) => {
				const isInvalid =
					field.state.meta.isTouched && !field.state.meta.isValid;
				return (
					<Field data-invalid={isInvalid}>
						<FieldLabel htmlFor={field.name}>Status Akun</FieldLabel>
						<FieldContent>
							<RadioGroup
								aria-invalid={isInvalid}
								onBlur={field.handleBlur}
								value={field.state.value}
								onValueChange={(val) => field.handleChange(val as UserStatus)}
								id={field.name}
								name={field.name}
							>
								<Field orientation={"horizontal"} className="w-max gap-10">
									{Object.values(USER_STATUS).map((status) => (
										<Field
											orientation={"horizontal"}
											key={status}
											className="w-max"
										>
											<RadioGroupItem value={status} id={status} />
											<Label htmlFor={status} className="cursor-pointer">
												{status === USER_STATUS.ACTIVE ? (
													<CircleCheckBig
														className={
															"size-4 md:size-6 text-active-foreground"
														}
													/>
												) : (
													<X
														className={
															"size-4 md:size-6 text-non-active-foreground"
														}
													/>
												)}{" "}
												{status}
											</Label>
										</Field>
									))}
								</Field>
							</RadioGroup>
							<Item className="p-0 gap-1">
								<ItemMedia>
									{formApi.getFieldValue("user_status") ===
									USER_STATUS.ACTIVE ? (
										<CircleCheckBig
											size={24}
											className="size-2 md:size-4 text-active-foreground"
										/>
									) : (
										<AlertTriangle
											size={24}
											className="size-2 md:size-4 text-pending-foreground"
										/>
									)}
								</ItemMedia>
								<ItemContent>
									<ItemDescription className="mt-1 text-xs">
										{formApi.getFieldValue("user_status") === USER_STATUS.ACTIVE
											? "Pengguna Aktif dapat Login ke Sistem."
											: "Pengguna Nonaktif tidak dapat Login ke Sistem."}
									</ItemDescription>
								</ItemContent>
							</Item>
						</FieldContent>
					</Field>
				);
			}}
		</TanstackField>
	);
};
