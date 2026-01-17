"use client";

import { Button } from "@repo/ui/components/button";
import { Field, FieldContent, FieldLabel } from "@repo/ui/components/field";
import { InputGroupAddon } from "@repo/ui/components/input-group";
import { InputPassword } from "@repo/ui/components/password";
import {
	Check,
	Copy,
	PencilLine,
	RefreshCw
} from "@repo/ui/icons";
import generator from "generate-password";
import { useState } from "react";

export const FieldGeneratePassword = () => {
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

	const handleCopyPassword = () => {
		if (!randowmPass) return;

		navigator.clipboard.writeText(randowmPass);
		setCopied(true);

		setTimeout(() => setCopied(false), 1500);
	};

	return (
		<Field>
			<Field orientation="horizontal">
				<FieldLabel htmlFor="user-password">
					User&apos;s Password <span className="text-destructive">*</span>
				</FieldLabel>
				<Button
					variant={"link"}
					onClick={() => setManualPassword(!manualPassword)}
				>
					{!manualPassword ? (
						<>
							<PencilLine /> Enter Manual Password
						</>
					) : (
						<>
							<RefreshCw /> Auto-Generate Password
						</>
					)}
				</Button>
			</Field>
			<FieldContent>
				<InputPassword
					id="user-password"
					placeholder="Enter the User's Password"
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
