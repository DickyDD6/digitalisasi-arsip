"use client";

import { Field, FieldContent, FieldLabel } from "@repo/ui/components/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@repo/ui/components/input-group";
import { Mail } from "@repo/ui/icons";
import { Field as TanstackField } from "@tanstack/react-form";
import { useUserTableEditContext } from "..";

export const UserTableEditFieldEmail = () => {
	const { formApi } = useUserTableEditContext();

	if (!formApi) return null;

	return (
		<TanstackField form={formApi} name="email">
			{(field) => {
				const isInvalid =
					field.state.meta.isTouched && !field.state.meta.isValid;
				return (
					<Field data-invalid={isInvalid}>
						<FieldLabel htmlFor={field.name}>Email Pengguna</FieldLabel>
						<FieldContent>
							<InputGroup>
								<InputGroupAddon>
									<Mail />
								</InputGroupAddon>
								<InputGroupInput
									id={field.name}
									type="email"
									name={field.name}
									onBlur={field.handleBlur}
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									aria-invalid={isInvalid}
									placeholder="Masukkan Email Pengguna"
								/>
							</InputGroup>
						</FieldContent>
					</Field>
				);
			}}
		</TanstackField>
	);
};
