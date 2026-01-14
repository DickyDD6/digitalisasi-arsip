"use client";

import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@repo/ui/components/command";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@repo/ui/components/input-group";
import { Kbd, KbdGroup } from "@repo/ui/components/kbd";
import { FileText, Search } from "@repo/ui/index";
import { useEffect } from "react";
import { useSearchCommandStore } from "./search-store";

export const SearchCommandShortcut = () => {
	const openSearchCommand = useSearchCommandStore((s) => s.openSearchCommand);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.ctrlKey || e.metaKey) && e.key === "k") {
				e.preventDefault();
				openSearchCommand();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [openSearchCommand]);

	return null;
};

export const SearchInput = ({
	withCommand = false,
}: {
	withCommand?: boolean;
}) => {
	const { open, openSearchCommand, closeSearchCommand } =
		useSearchCommandStore();

	return (
		<>
			<InputGroup className="shadow-none">
				<InputGroupAddon>
					<Search />
				</InputGroupAddon>
				<InputGroupInput
					placeholder="Search Documents..."
					onClick={withCommand ? openSearchCommand : undefined}
					readOnly
				/>
				{withCommand && (
					<InputGroupAddon align={"inline-end"}>
						<KbdGroup>
							<Kbd>CTRL</Kbd>
							<span>+</span>
							<Kbd>K</Kbd>
						</KbdGroup>
					</InputGroupAddon>
				)}
			</InputGroup>
			{withCommand && (
				<CommandDialog open={open} onOpenChange={closeSearchCommand}>
					<CommandInput placeholder="Search Documents..." />
					<CommandList>
						<CommandEmpty>No Result found.</CommandEmpty>
						<CommandGroup heading="suggestions">
							<CommandItem>
								<FileText />
								Nilai_223040166_2022_Pemrograman-Web.pdf
							</CommandItem>
						</CommandGroup>
					</CommandList>
				</CommandDialog>
			)}
		</>
	);
};
