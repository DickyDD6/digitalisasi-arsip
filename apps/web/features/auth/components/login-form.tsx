"use client";

import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
import {
	Field,
	FieldError,
	FieldLabel,
	FieldSet,
} from "@repo/ui/components/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@repo/ui/components/input-group";
import { InputPassword } from "@repo/ui/components/password";
import { Loader2, UserRound } from "@repo/ui/icons";
import { useForm } from "@tanstack/react-form";
import { LoginSchema } from "../auth.schema";
import { useLogin } from "../hooks/use-auth";

export const LoginForm = () => {
	const { mutate, isPending } = useLogin();

	const loginForm = useForm({
		defaultValues: {
			username: "",
			password: "",
		},
		validators: {
			onSubmit: LoginSchema,
		},
		onSubmit: async ({ value }) => mutate(value),
	});

	return (
		<form
			id="login-form"
			onSubmit={async(e) => {
				e.preventDefault();
				await loginForm.handleSubmit();
			}}
		>
			<FieldSet>
				<loginForm.Field name="username">
					{(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;

						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel htmlFor={field.name}>Username</FieldLabel>
								<InputGroup>
									<InputGroupAddon>
										<UserRound />
									</InputGroupAddon>
									<InputGroupInput
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										aria-invalid={isInvalid}
										placeholder="Masukkan Username Anda"
									/>
								</InputGroup>
								{isInvalid && <FieldError errors={field.state.meta.errors} />}
							</Field>
						);
					}}
				</loginForm.Field>

				<loginForm.Field name="password">
					{(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;

						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel htmlFor="password">Password</FieldLabel>
								<InputPassword
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									aria-invalid={isInvalid}
									placeholder="Masukkan Password Anda"
								/>
								{isInvalid && <FieldError errors={field.state.meta.errors} />}
							</Field>
						);
					}}
				</loginForm.Field>

				<Field orientation={"horizontal"}>
					<Field orientation={"horizontal"}>
						<Checkbox id="remember-me" />
						<FieldLabel htmlFor="remember-me">Remember Me</FieldLabel>
					</Field>
					<Button type={"button"} variant={"link"}>
						Forget Password?
					</Button>
				</Field>

				<Button form="login-form" type="submit">
					{isPending ? (
						<Loader2 className="animate-spin duration-300" />
					) : (
						"LogIn"
					)}
				</Button>
				<p className="text-center text-xs text-muted-foreground">
					&copy; 2026 Digital Archive. All rights reserved.
				</p>
			</FieldSet>
		</form>
	);
};
