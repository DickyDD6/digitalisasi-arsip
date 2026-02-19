"use client";

import {
	Field,
	FieldContent,
	FieldError,
	FieldLabel,
} from "@repo/ui/components/field";
import { Field as TanstackField } from "@tanstack/react-form";
import { useUserTableEditContext } from "..";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@repo/ui/components/input-group";
import { UserRound } from "@repo/ui/icons";

export const UserTableEditFieldNIP = () => {
	const { formApi } = useUserTableEditContext();

	if (!formApi) return null;

	return (
		<TanstackField form={formApi} name="nip">
			{(field) => {
				const isInvalid =
					field.state.meta.isTouched && !field.state.meta.isValid;
				return (
					<Field data-invalid={isInvalid}>
						<FieldLabel htmlFor={field.name}>NIP Pengguna</FieldLabel>
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
									placeholder="Masukkan NIP Pengguna"
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
