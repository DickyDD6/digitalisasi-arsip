"use client";

import { Button } from "@repo/ui/components/button";
import { Field, FieldContent, FieldLabel } from "@repo/ui/components/field";
import { InputGroupAddon } from "@repo/ui/components/input-group";
import { InputPassword } from "@repo/ui/components/password";
import { Check, Copy, PencilLine, RefreshCw } from "@repo/ui/icons";
import { AnyFieldApi } from "@tanstack/react-form";
import generator from "generate-password";
import { useEffect, useState } from "react";

export const UserTableEditFieldGeneratePassword = ({
	field,
}: {
	field: AnyFieldApi;
}) => {
	const [manualPassword, setManualPassword] = useState<boolean>(false);
	const generatePassword = generator.generate({
		length: 16,
		numbers: true,
		lowercase: true,
		uppercase: true,
		symbols: true,
		strict: true,
		excludeSimilarCharacters: true,
	});
	const [randowmPass, setRandowmPass] = useState<string>(generatePassword);
	const [copied, setCopied] = useState<boolean>(false);

	const handleCopyPassword = async () => {
		if (!randowmPass) return;

		await navigator.clipboard.writeText(randowmPass);
		setCopied(true);

		setTimeout(() => setCopied(false), 1500);
	};

	useEffect(() => {
		if (!randowmPass) return;
		field.setValue(randowmPass);
	}, [randowmPass, field]);

	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

	return (
		<Field data-invalid={isInvalid}>
			<Field orientation="horizontal">
				<FieldLabel htmlFor={field.name}>Kata Sandi Pengguna</FieldLabel>
				<Button
					type="button"
					variant={"link"}
					onClick={() => setManualPassword(!manualPassword)}
				>
					{!manualPassword ? (
						<>
							<PencilLine /> Masukkan Kata Sandi Manual
						</>
					) : (
						<>
							<RefreshCw /> Auto-Generate Kata Sandi
						</>
					)}
				</Button>
			</Field>
			<FieldContent>
				<InputPassword
					id={field.name}
					name={field.name}
					onBlur={field.handleBlur}
					aria-invalid={isInvalid}
					placeholder="Masukkan Kata Sandi Pengguna"
					value={randowmPass}
					onChange={(e) => {
						if (manualPassword) {
							setRandowmPass(e.target.value);
						}
					}}
					addon={
						<>
							<InputGroupAddon align={"inline-end"}>
								<Button
									type="button"
									variant={"ghost"}
									size={"icon"}
									onClick={handleCopyPassword}
								>
									{copied ? <Check className="text-green-600" /> : <Copy />}
								</Button>
							</InputGroupAddon>
							{!manualPassword && (
								<InputGroupAddon align={"inline-end"}>
									<Button
										type="button"
										variant={"ghost"}
										size={"icon"}
										onClick={() => setRandowmPass(generatePassword)}
									>
										<RefreshCw />
									</Button>
								</InputGroupAddon>
							)}
						</>
					}
				/>
			</FieldContent>
		</Field>
	);
};
