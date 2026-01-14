"use client";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
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
import { ChevronRight, Funnel, Search, X } from "@repo/ui/index";
import { useEffect } from "react";
import { useSearchCommandStore } from "./search-store";
import {
	Item,
	ItemContent,
	ItemMedia,
	ItemTitle,
} from "@repo/ui/components/item";

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
					<InputGroupAddon align={"inline-end"} className="hidden md:block">
						<KbdGroup>
							<Kbd>CTRL</Kbd>
							<span>+</span>
							<Kbd>K</Kbd>
						</KbdGroup>
					</InputGroupAddon>
				)}
			</InputGroup>
			{withCommand && (
				<CommandDialog
					showCloseButton={false}
					open={open}
					onOpenChange={closeSearchCommand}
					className="min-w-4/5 min-h-4/5"
				>
					<div className="flex items-center justify-between p-2 bg-primary">
						<div className="flex items-center gap-2">
							<Badge className="p-2 bg-muted/30 text-primary-foreground rounded-md!">
								<Search className="size-4 md:size-6!" />
							</Badge>
							<div className="grid gap-px text-primary-foreground">
								<span className="text-sm font-semibold md:text-xl">Advanced Search</span>
								<span className="text-xs md:text-sm">
									Search Documents with detail filter.
								</span>
							</div>
						</div>

						<Button
							variant={"ghost"}
							size={"icon"}
							onClick={closeSearchCommand}
							className="text-primary-foreground bg-accent/30 hover:bg-accent/40 hover:text-primary-foreground"
						>
							<X className="size-4 md:size-6" />
						</Button>
					</div>
					<div className="relative p-4">
						<CommandInput
							placeholder="Search by NIM, Name, Courses, or other keywords..."
							className="pr-24 md:pr-28"
						/>
						<Button
							variant={"ghost"}
							className="absolute -translate-y-1/2 top-1/2 right-6"
						>
							<Funnel />
							Filter
						</Button>
					</div>
					<div className="flex gap-4 px-4 mb-4 overflow-x-auto">
						<Button variant={"outline"}>Waiting for Verification</Button>
						<Button variant={"outline"}>Rejected</Button>
						<Button variant={"outline"}>Year 2025</Button>
						<Button variant={"outline"}>Even semester</Button>
						<Button variant={"outline"}>Final score</Button>
					</div>
					<CommandList>
						<CommandEmpty>No Result found.</CommandEmpty>
						<CommandGroup heading="Last Search">
							<div className="grid gap-2">
								<CommandItem asChild>
									<Item variant={"outline"}>
										<ItemMedia>
											<Search />
										</ItemMedia>
										<ItemContent>
											<ItemTitle>NIM 123456789</ItemTitle>
										</ItemContent>
										<ItemMedia>
											<ChevronRight />
										</ItemMedia>
									</Item>
								</CommandItem>
								<CommandItem asChild>
									<Item variant={"outline"}>
										<ItemMedia>
											<Search />
										</ItemMedia>
										<ItemContent>
											<ItemTitle>Kalkulus 1</ItemTitle>
										</ItemContent>
										<ItemMedia>
											<ChevronRight />
										</ItemMedia>
									</Item>
								</CommandItem>
								<CommandItem asChild>
									<Item variant={"outline"}>
										<ItemMedia>
											<Search />
										</ItemMedia>
										<ItemContent>
											<ItemTitle>Class of 2005 student</ItemTitle>
										</ItemContent>
										<ItemMedia>
											<ChevronRight />
										</ItemMedia>
									</Item>
								</CommandItem>
								<CommandItem asChild>
									<Item variant={"outline"}>
										<ItemMedia>
											<Search />
										</ItemMedia>
										<ItemContent>
											<ItemTitle>Document Rejected</ItemTitle>
										</ItemContent>
										<ItemMedia>
											<ChevronRight />
										</ItemMedia>
									</Item>
								</CommandItem>
								<CommandItem asChild>
									<Item variant={"outline"}>
										<ItemMedia>
											<Search />
										</ItemMedia>
										<ItemContent>
											<ItemTitle>Even Semester 2008</ItemTitle>
										</ItemContent>
										<ItemMedia>
											<ChevronRight />
										</ItemMedia>
									</Item>
								</CommandItem>
							</div>
						</CommandGroup>
					</CommandList>

					<div className="hidden gap-4 p-4 md:flex">
						<KbdGroup>
							<Kbd>CTRL</Kbd>
							<span>+</span>
							<Kbd>K</Kbd>
							Open Advance Search
						</KbdGroup>
						<KbdGroup>
							<Kbd>ESC</Kbd>
							Close Advance Search
						</KbdGroup>
					</div>
				</CommandDialog>
			)}
		</>
	);
};
