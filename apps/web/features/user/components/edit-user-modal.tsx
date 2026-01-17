"use client";

import { Button } from "@repo/ui/components/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@repo/ui/components/dialog";
import {
	Field,
	FieldContent,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from "@repo/ui/components/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@repo/ui/components/input-group";
import {
	Item,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from "@repo/ui/components/item";
import {
	NativeSelect,
	NativeSelectOption,
} from "@repo/ui/components/native-select";
import {
	AlertCircle,
	AlertTriangle,
	CircleCheckBig,
	KeyRound,
	Mail,
	Pencil,
	Plus,
	UserRound,
	UserRoundCog,
	X,
} from "@repo/ui/icons";
import { useState } from "react";
import { FieldGeneratePassword } from "../../archive/components/field-generate-password";
import { Alert, AlertDescription, AlertTitle } from "@repo/ui/components/alert";
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/radio-group";
import { Label } from "@repo/ui/components/label";

export const EditUserModal = ({ id }: { id: string }) => {
	const [openEditModal, setOpenEditModal] = useState<boolean>(false);
	const [resetPass, setResetPass] = useState<boolean>(false);
	const [accountStatus, setAccountStatus] = useState<"active" | "non-active">(
		"active",
	);

	return (
		<Dialog open={openEditModal} onOpenChange={setOpenEditModal}>
			<DialogTrigger asChild>
				<Button
					variant={"ghost"}
					size={"icon"}
					className="text-blue-600 hover:bg-blue-100"
				>
					<Pencil />
				</Button>
			</DialogTrigger>
			<DialogContent className="max-h-150 md:max-h-max overflow-y-auto">
				<DialogHeader>
					<Item className="p-0">
						<ItemMedia className="p-2 bg-blue-100 text-blue-600 rounded-md">
							<Pencil className="size-4 md:size-6" />
						</ItemMedia>
						<ItemContent>
							<DialogTitle asChild>
								<ItemTitle>Edit User Data</ItemTitle>
							</DialogTitle>
							<DialogDescription asChild>
								<ItemDescription>Update User Information</ItemDescription>
							</DialogDescription>
						</ItemContent>
					</Item>
				</DialogHeader>

				<FieldSet>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor="user-fullname">
								User&apos;s Full Name{" "}
								<span className="text-destructive">*</span>
							</FieldLabel>
							<FieldContent>
								<InputGroup>
									<InputGroupAddon>
										<UserRound />
									</InputGroupAddon>
									<InputGroupInput
										id="user-fullname"
										value={id}
										onChange={() => {}}
										placeholder="Enter the User's Full Name"
									/>
								</InputGroup>
							</FieldContent>
						</Field>
						<Field>
							<FieldLabel htmlFor="user-email">
								User&apos;s Email <span className="text-destructive">*</span>
							</FieldLabel>
							<FieldContent>
								<InputGroup>
									<InputGroupAddon>
										<Mail />
									</InputGroupAddon>
									<InputGroupInput
										id="user-email"
										type="email"
										placeholder="Enter the User's Email"
									/>
								</InputGroup>
							</FieldContent>
						</Field>

						{resetPass ? (
							<Field>
								<FieldGeneratePassword />
								<Alert variant={"destructive"}>
									<AlertCircle />
									<AlertTitle>Warning!</AlertTitle>
									<AlertDescription>
										The old password will be replaced. Give this new Password to
										the User.
									</AlertDescription>
								</Alert>
								<Button onClick={() => setResetPass(false)}>
									<KeyRound />
									Cancel Reset Password
								</Button>
							</Field>
						) : (
							<Field>
								<FieldLabel htmlFor="user-password">
									User&apos;s Password{" "}
									<span className="text-destructive">*</span>
								</FieldLabel>
								<FieldContent>
									<InputGroup>
										<InputGroupAddon>
											<KeyRound />
										</InputGroupAddon>
										<InputGroupInput
											id="user-password"
											readOnly
											value={id}
											onChange={() => {}}
										/>
									</InputGroup>

									<Button onClick={() => setResetPass(true)}>
										<KeyRound />
										Reset Password
									</Button>
								</FieldContent>
							</Field>
						)}

						<Field>
							<FieldLabel htmlFor="user-role">
								User&apos;s Role <span className="text-destructive">*</span>
							</FieldLabel>
							<FieldContent>
								<InputGroup>
									<InputGroupAddon>
										<UserRoundCog />
									</InputGroupAddon>
									<NativeSelect
										classNameContainer="w-full"
										className="border-none focus-visible:ring-0 group-focus-visible/input:ring-ring"
									>
										<NativeSelectOption>Select Role</NativeSelectOption>
										<NativeSelectOption value={"MANAGER"}>
											MANAGER
										</NativeSelectOption>
										<NativeSelectOption value={"QC"}>QC</NativeSelectOption>
										<NativeSelectOption value={"UPLOADER"}>
											UPLOADER
										</NativeSelectOption>
										<NativeSelectOption value={"SBAP"}>SBAP</NativeSelectOption>
									</NativeSelect>
								</InputGroup>
							</FieldContent>
						</Field>

						<Field>
							<FieldLabel>Account Status</FieldLabel>
							<FieldContent>
								<RadioGroup
									value={accountStatus}
									onValueChange={(val) =>
										setAccountStatus(val as typeof accountStatus)
									}
								>
									<Field orientation={"horizontal"}>
										<RadioGroupItem value="active" id="active" />
										<Label htmlFor="active">
											<CircleCheckBig className="size-4 md:size-6 text-green-600" />{" "}
											Active
										</Label>
									</Field>
									<Field orientation={"horizontal"}>
										<RadioGroupItem value="non-active" id="non-active" />
										<Label htmlFor="non-active">
											<X className="size-4 md:size-6 text-destructive" />{" "}
											Non-Active
										</Label>
									</Field>
								</RadioGroup>
								<Item className="p-0 gap-1">
									{accountStatus === "active" ? (
										<>
											<ItemMedia>
												<CircleCheckBig className="size-4 md:size-6 text-green-600" />{" "}
											</ItemMedia>
											<ItemContent>
												<ItemDescription className="mt-1">
													Users can Login and access the system.
												</ItemDescription>
											</ItemContent>
										</>
									) : (
										<>
											<ItemMedia>
												<AlertTriangle className="size-4 md:size-6 text-yellow-600" />{" "}
											</ItemMedia>
											<ItemContent>
												<ItemDescription className="mt-1">
													Users cannot Login to the system.
												</ItemDescription>
											</ItemContent>
										</>
									)}
								</Item>
							</FieldContent>
						</Field>
					</FieldGroup>
				</FieldSet>

				<DialogFooter>
					<Button variant={"outline"} onClick={() => setOpenEditModal(false)}>
						Cancel
					</Button>
					<Button>
						<Plus />
						Add Users
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
