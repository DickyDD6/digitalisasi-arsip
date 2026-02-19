"use client";

import { ROLE, Role } from "@/shared/constants";
import { Field, FieldContent, FieldLabel } from "@repo/ui/components/field";
import { InputGroup, InputGroupAddon } from "@repo/ui/components/input-group";
import {
	NativeSelect,
	NativeSelectOption,
} from "@repo/ui/components/native-select";
import { UserRoundCog } from "@repo/ui/icons";
import { Field as TanstackField } from "@tanstack/react-form";
import { useUserTableEditContext } from "..";

export const UserTableEditFieldRole = () => {
	const { formApi } = useUserTableEditContext();

	if (!formApi) return null;

	return (
		<TanstackField form={formApi} name="role">
			{(field) => {
				const isInvalid =
					field.state.meta.isTouched && !field.state.meta.isValid;
				return (
					<Field data-invalid={isInvalid}>
						<FieldLabel htmlFor={field.name}>Role Pengguna</FieldLabel>
						<FieldContent>
							<InputGroup>
								<InputGroupAddon>
									<UserRoundCog />
								</InputGroupAddon>
								<NativeSelect
									classNameContainer="w-full"
									className="border-none focus-visible:ring-0 group-focus-visible/input:ring-ring"
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value as Role)}
									aria-invalid={isInvalid}
									id={field.name}
									name={field.name}
									onBlur={field.handleBlur}
								>
									<NativeSelectOption>Pilih Role</NativeSelectOption>
									{Object.values(ROLE).map((role) => (
										<NativeSelectOption key={role} value={role}>
											{role}
										</NativeSelectOption>
									))}
								</NativeSelect>
							</InputGroup>
						</FieldContent>
					</Field>
				);
			}}
		</TanstackField>
	);
};
