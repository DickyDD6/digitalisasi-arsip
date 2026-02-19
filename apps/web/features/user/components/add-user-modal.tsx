"use client";

import { Alert, AlertDescription, AlertTitle } from "@repo/ui/components/alert";
import { Button } from "@repo/ui/components/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
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
	Mail,
	Plus,
	UserRound,
	UserRoundCog,
	UserRoundPlus,
} from "@repo/ui/icons";
import { useState } from "react";

export const AddUserModal = () => {
	const [openModalDialog, setOpenModalDialog] = useState<boolean>(false);

	return (
		<Dialog open={openModalDialog} onOpenChange={setOpenModalDialog}>
			<DialogTrigger asChild>
				<Button>
					<UserRoundPlus /> Add User
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<Item className="p-0">
						<ItemMedia className="p-2 text-yellow-600 bg-yellow-100 rounded-md">
							<UserRoundPlus className="size-4 md:size-6" />
						</ItemMedia>
						<ItemContent>
							<DialogTitle asChild>
								<ItemTitle>Add New User</ItemTitle>
							</DialogTitle>
							<DialogDescription asChild>
								<ItemDescription>
									Register New Users to the System
								</ItemDescription>
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

						<Field>
							{/* <UserTableEditFieldGeneratePassword /> */}
							<Alert variant={"warning"}>
								<AlertCircle />
								<AlertTitle>Important!</AlertTitle>
								<AlertDescription>
									Save this password! Give to User for First Time Login
								</AlertDescription>
							</Alert>
						</Field>

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
					</FieldGroup>

					<Field orientation={"horizontal"} className="justify-end">
						<Button
							variant={"outline"}
							onClick={() => setOpenModalDialog(false)}
						>
							Cancel
						</Button>
						<Button>
							<Plus />
							Add Users
						</Button>
					</Field>
				</FieldSet>
			</DialogContent>
		</Dialog>
	);
};
