"use client";

import { Alert, AlertDescription, AlertTitle } from "@repo/ui/components/alert";
import { Button } from "@repo/ui/components/button";
import { Field, FieldContent, FieldLabel } from "@repo/ui/components/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@repo/ui/components/input-group";
import { AlertCircle, KeyRound } from "@repo/ui/icons";
import { Field as TanstackField } from "@tanstack/react-form";
import { useState } from "react";
import {
	UserTableEditFieldGeneratePassword,
	useUserTableEditContext,
} from "..";

export const UserTableEditFieldPassword = () => {
	const [resetPass, setResetPass] = useState<boolean>(false);
	const { formApi } = useUserTableEditContext();

	if (!formApi) return null;

	return resetPass ? (
		<TanstackField form={formApi} name="password">
			{(field) => {
				const isInvalid =
					field.state.meta.isTouched && !field.state.meta.isValid;

				return (
					<Field data-invalid={isInvalid}>
						<UserTableEditFieldGeneratePassword field={field} />
						<Alert variant={"destructive"}>
							<AlertCircle />
							<AlertTitle>Peringatan!</AlertTitle>
							<AlertDescription>
								Kata sandi lama akan diganti. Berikan Kata Sandi baru ini kepada
								Pengguna.
							</AlertDescription>
						</Alert>
						<Button
							type="button"
							onClick={() => {
								formApi.resetField("password");
								setResetPass(false);
							}}
						>
							<KeyRound />
							Batalkan Reset Kata Sandi
						</Button>
					</Field>
				);
			}}
		</TanstackField>
	) : (
		<Field>
			<FieldLabel>Kata Sandi Pengguna</FieldLabel>
			<FieldContent>
				<InputGroup>
					<InputGroupAddon>
						<KeyRound />
					</InputGroupAddon>
					<InputGroupInput readOnly disabled placeholder="********" />
				</InputGroup>

				<Button type="button" onClick={() => setResetPass(true)}>
					<KeyRound />
					Reset Kata Sandi
				</Button>
			</FieldContent>
		</Field>
	);
};
