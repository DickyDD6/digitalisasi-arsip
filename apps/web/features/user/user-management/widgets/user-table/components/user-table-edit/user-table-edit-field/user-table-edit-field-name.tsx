"use client";

import {
	Field,
	FieldContent,
	FieldError,
	FieldLabel,
} from "@repo/ui/components/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@repo/ui/components/input-group";
import { UserRound } from "@repo/ui/icons";
import { Field as TanstackField } from "@tanstack/react-form";
import { useUserTableEditContext } from "..";

export const UserTableEditFieldName = () => {
	const { formApi } = useUserTableEditContext();

	if (!formApi) return null;

	return (
		<TanstackField form={formApi} name="name">
			{(field) => {
				const isInvalid =
					field.state.meta.isTouched && !field.state.meta.isValid;
				return (
					<Field data-invalid={isInvalid}>
						<FieldLabel htmlFor={field.name}>Nama Lengkap Pengguna</FieldLabel>
						<FieldContent>
							<InputGroup>
								<InputGroupAddon>
									<UserRound />
								</InputGroupAddon>
								<InputGroupInput
									id={field.name}
									name={field.name}
									type="text"
									onBlur={field.handleBlur}
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									aria-invalid={isInvalid}
									placeholder="Masukkan Nama Lengkap Pengguna"
								/>
								{isInvalid && <FieldError errors={field.state.meta.errors} />}
							</InputGroup>
						</FieldContent>
					</Field>
				);
			}}
		</TanstackField>
	);
};
