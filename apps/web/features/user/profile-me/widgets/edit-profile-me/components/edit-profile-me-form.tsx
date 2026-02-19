"use client";

import { useMe } from "@/features/user";
import {
	Field,
	FieldContent,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet,
} from "@repo/ui/components/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@repo/ui/components/input-group";
import { Mail, Phone, School, UserRound } from "@repo/ui/icons";
import { useForm } from "@tanstack/react-form";
import { EditProfileMeSchema, useEditProfileMeStore } from "../";

export const EditProfileMeForm = () => {
	const { data } = useMe();
	const editProfileMe = useEditProfileMeStore((state) => state.editProfileMe);
	const editProfileMeForm = useForm({
		defaultValues: {
			fullname: data?.data.name ?? "",
			email: data?.data.email ?? "",
			phone: "",
			department: "",
		},
		validators: {
			onSubmit: EditProfileMeSchema,
		},
		onSubmit: ({ value }) => console.log(value),
	});

	return (
		<form
			id="profile-form"
			onSubmit={async (e) => {
				e.preventDefault();
				await editProfileMeForm.handleSubmit();
			}}
		>
			<FieldSet>
				<FieldLegend>Informasi Personal</FieldLegend>
				<FieldGroup>
					<Field orientation={"horizontal"}>
						<editProfileMeForm.Field name="fullname">
							{(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;

								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Nama Lengkap</FieldLabel>
										<FieldContent>
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
													disabled={!editProfileMe}
													placeholder="Masukkan Nama Lengkap"
												/>
												{isInvalid && (
													<FieldError errors={field.state.meta.errors} />
												)}
											</InputGroup>
										</FieldContent>
									</Field>
								);
							}}
						</editProfileMeForm.Field>
						<editProfileMeForm.Field name="email">
							{(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;

								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Email</FieldLabel>
										<FieldContent>
											<InputGroup>
												<InputGroupAddon>
													<Mail />
												</InputGroupAddon>
												<InputGroupInput
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													aria-invalid={isInvalid}
													disabled={!editProfileMe}
													placeholder="Masukkan Email"
												/>
												{isInvalid && (
													<FieldError errors={field.state.meta.errors} />
												)}
											</InputGroup>
										</FieldContent>
									</Field>
								);
							}}
						</editProfileMeForm.Field>
					</Field>
					<Field orientation={"horizontal"}>
						<editProfileMeForm.Field name="phone">
							{(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;

								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>No. Telepon</FieldLabel>
										<FieldContent>
											<InputGroup>
												<InputGroupAddon>
													<Phone />
												</InputGroupAddon>
												<InputGroupInput
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													aria-invalid={isInvalid}
													disabled={!editProfileMe}
													placeholder="Masukkan No. Telepon"
												/>
												{isInvalid && (
													<FieldError errors={field.state.meta.errors} />
												)}
											</InputGroup>
										</FieldContent>
									</Field>
								);
							}}
						</editProfileMeForm.Field>
						<editProfileMeForm.Field name="department">
							{(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;

								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Prodi</FieldLabel>
										<FieldContent>
											<InputGroup>
												<InputGroupAddon>
													<School />
												</InputGroupAddon>
												<InputGroupInput
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													aria-invalid={isInvalid}
													disabled={!editProfileMe}
													placeholder="Masukkan Prodi"
												/>
												{isInvalid && (
													<FieldError errors={field.state.meta.errors} />
												)}
											</InputGroup>
										</FieldContent>
									</Field>
								);
							}}
						</editProfileMeForm.Field>
					</Field>
				</FieldGroup>
			</FieldSet>
		</form>
	);
};
