"use client";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Calendar as CalendarComponent } from "@repo/ui/components/calendar";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@repo/ui/components/command";
import {
	Field,
	FieldContent,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from "@repo/ui/components/field";
import { Input } from "@repo/ui/components/input";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@repo/ui/components/input-group";
import {
	Item,
	ItemContent,
	ItemMedia,
	ItemTitle,
} from "@repo/ui/components/item";
import { Kbd, KbdGroup } from "@repo/ui/components/kbd";
import {
	NativeSelect,
	NativeSelectOption,
} from "@repo/ui/components/native-select";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@repo/ui/components/popover";
import {
	BookOpen,
	Calendar,
	CalendarArrowDown,
	CalendarArrowUp,
	CalendarDays,
	ChevronRight,
	FileText,
	Funnel,
	Search,
	TrendingUp,
	UserRound,
	UserSquare2,
	X,
} from "@repo/ui/icons";
import { useEffect, useState } from "react";
import { useSearchCommandStore } from "./search-store";
import { cn } from "@repo/ui/lib/utils";

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
	className,
}: {
	withCommand?: boolean;
	className?: string;
}) => {
	const { open, openSearchCommand, closeSearchCommand } =
		useSearchCommandStore();
	const [openFilter, setOpenFilter] = useState<boolean>(false);
	const [calendarFromOpen, setCalendarFromOpen] = useState<boolean>(false);
	const [calendarToOpen, setCalendarToOpen] = useState<boolean>(false);
	const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
	const [dateTo, setDateTo] = useState<Date | undefined>(undefined);

	return (
		<>
			<InputGroup className={cn("shadow-none w-max", className)}>
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
								<span className="text-sm font-semibold md:text-xl">
									Advanced Search
								</span>
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
							placeholder="Search by NPM, Name, Courses, or other keywords..."
							className="pr-24 md:pr-28"
						/>
						<Button
							variant={"ghost"}
							className="absolute -translate-y-1/2 top-1/2 right-6"
							onClick={() => setOpenFilter(!openFilter)}
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
					{openFilter ? (
						<FieldSet className="px-4">
							<div className="grid max-h-80 md:max-h-full overflow-y-auto md:grid-cols-3 gap-4">
								<FieldGroup>
									<Field>
										<FieldLabel htmlFor="npm">
											<UserSquare2 className="size-6 text-primary" /> NPM
										</FieldLabel>
										<FieldContent>
											<Input id="npm" placeholder="Example: 123456789" />
										</FieldContent>
									</Field>

									<Field>
										<FieldLabel htmlFor="academic_year">
											<Calendar className="size-6 text-primary" /> Academic Year
										</FieldLabel>
										<FieldContent>
											<NativeSelect
												id="academic_year"
												classNameContainer="w-full"
											>
												<NativeSelectOption>Select Year</NativeSelectOption>
												<NativeSelectOption value={"2000"}>
													2000
												</NativeSelectOption>
												<NativeSelectOption value={"2001"}>
													2001
												</NativeSelectOption>
												<NativeSelectOption value={"2002"}>
													2002
												</NativeSelectOption>
												<NativeSelectOption value={"2003"}>
													2003
												</NativeSelectOption>
												<NativeSelectOption value={"2004"}>
													2004
												</NativeSelectOption>
												<NativeSelectOption value={"2005"}>
													2005
												</NativeSelectOption>
												<NativeSelectOption value={"2006"}>
													2006
												</NativeSelectOption>
												<NativeSelectOption value={"2007"}>
													2007
												</NativeSelectOption>
												<NativeSelectOption value={"2008"}>
													2008
												</NativeSelectOption>
												<NativeSelectOption value={"2009"}>
													2009
												</NativeSelectOption>
												<NativeSelectOption value={"2010"}>
													2010
												</NativeSelectOption>
											</NativeSelect>
										</FieldContent>
									</Field>

									<Field>
										<FieldLabel htmlFor="verification_status">
											<TrendingUp className="size-6 text-primary" />{" "}
											Verification Status
										</FieldLabel>
										<FieldContent>
											<NativeSelect
												id="verification_status"
												classNameContainer="w-full"
											>
												<NativeSelectOption>Select Status</NativeSelectOption>
												<NativeSelectOption value={"verified"}>
													Verified
												</NativeSelectOption>
												<NativeSelectOption value={"rejected"}>
													Rejected
												</NativeSelectOption>
												<NativeSelectOption value={"pending"}>
													Pending
												</NativeSelectOption>
											</NativeSelect>
										</FieldContent>
									</Field>
								</FieldGroup>

								<FieldGroup>
									<Field>
										<FieldLabel htmlFor="student_name">
											<UserRound className="size-6 text-primary" />
											Student Name
										</FieldLabel>
										<FieldContent>
											<Input
												id="student_name"
												placeholder="Example: John Doe"
											/>
										</FieldContent>
									</Field>

									<Field>
										<FieldLabel htmlFor="semester">
											<CalendarDays className="size-6 text-primary" />
											Semester
										</FieldLabel>
										<FieldContent>
											<NativeSelect id="semester" classNameContainer="w-full">
												<NativeSelectOption>Select Semester</NativeSelectOption>
												<NativeSelectOption value={"even"}>
													Even
												</NativeSelectOption>
												<NativeSelectOption value={"odd"}>
													Odd
												</NativeSelectOption>
											</NativeSelect>
										</FieldContent>
									</Field>

									<Field>
										<FieldLabel htmlFor="upload_date_from">
											<CalendarArrowDown className="size-6 text-primary" />
											Upload Date (From)
										</FieldLabel>
										<FieldContent>
											<Popover
												open={calendarFromOpen}
												onOpenChange={setCalendarFromOpen}
											>
												<PopoverTrigger asChild>
													<Input
														type="text"
														placeholder="DD/MM/YY"
														id="upload_date_from"
														value={
															dateFrom
																? new Date(dateFrom).toLocaleDateString(
																		"id-ID",
																		{
																			day: "2-digit",
																			month: "2-digit",
																			year: "2-digit",
																		},
																	)
																: ""
														}
														onChange={() => {}}
													/>
												</PopoverTrigger>
												<PopoverContent
													className="p-0 overflow-hidden w-auto"
													align="start"
												>
													<CalendarComponent
														mode="single"
														selected={dateFrom}
														onSelect={(date) => {
															setDateFrom(date);
															setCalendarFromOpen(false);
														}}
													/>
												</PopoverContent>
											</Popover>
										</FieldContent>
									</Field>
								</FieldGroup>

								<FieldGroup>
									<Field>
										<FieldLabel htmlFor="subject">
											<BookOpen className="size-6 text-primary" />
											Subject
										</FieldLabel>
										<FieldContent>
											<Input
												id="subject"
												placeholder="Example: Pemrograman Web"
											/>
										</FieldContent>
									</Field>

									<Field>
										<FieldLabel htmlFor="document_type">
											<FileText className="size-6 text-primary" />
											Document Type
										</FieldLabel>
										<FieldContent>
											<NativeSelect
												id="document_type"
												classNameContainer="w-full"
											>
												<NativeSelectOption>Select Type</NativeSelectOption>
												<NativeSelectOption value={"pdf"}>
													PDF
												</NativeSelectOption>
												<NativeSelectOption value={"docs"}>
													Docs
												</NativeSelectOption>
												<NativeSelectOption value={"pptx"}>
													PPTX
												</NativeSelectOption>
												<NativeSelectOption value={"excel"}>
													XLSX
												</NativeSelectOption>
											</NativeSelect>
										</FieldContent>
									</Field>

									<Field>
										<FieldLabel htmlFor="upload_date_to">
											<CalendarArrowUp className="size-6 text-primary" />
											Upload Date (To)
										</FieldLabel>
										<FieldContent>
											<Popover
												open={calendarToOpen}
												onOpenChange={setCalendarToOpen}
											>
												<PopoverTrigger asChild>
													<Input
														type="text"
														placeholder="DD/MM/YY"
														id="upload_date_to"
														value={
															dateTo
																? new Date(dateTo).toLocaleDateString("id-ID", {
																		day: "2-digit",
																		month: "2-digit",
																		year: "2-digit",
																	})
																: ""
														}
														onChange={() => {}}
													/>
												</PopoverTrigger>
												<PopoverContent
													className="p-0 overflow-hidden w-auto"
													align="start"
												>
													<CalendarComponent
														mode="single"
														selected={dateTo}
														onSelect={(date) => {
															setDateTo(date);
															setCalendarToOpen(false);
														}}
													/>
												</PopoverContent>
											</Popover>
										</FieldContent>
									</Field>
								</FieldGroup>
							</div>

							<Field orientation="horizontal" className="pb-4">
								<Button>Apply Filters</Button>
								<Button variant={"destructive"}>Reset Filter</Button>
							</Field>
						</FieldSet>
					) : (
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
					)}

					<div className="hidden gap-4 p-4 md:flex mt-auto">
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
