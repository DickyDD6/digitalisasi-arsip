"use client";

import { Button } from "@repo/ui/components/button";
import { Calendar as CalendarComponent } from "@repo/ui/components/calendar";
import { Card, CardContent } from "@repo/ui/components/card";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@repo/ui/components/input-group";
import { Item, ItemContent, ItemMedia } from "@repo/ui/components/item";
import {
	NativeSelect,
	NativeSelectOption,
} from "@repo/ui/components/native-select";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@repo/ui/components/popover";
import { Calendar, Funnel } from "@repo/ui/index";
import { useState } from "react";

export const MonitoringFilterCard = () => {
	const [openPopoverDate, setOpenPopoverDate] = useState<boolean>(false);
	const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);

	return (
		<Card>
			<CardContent className="flex flex-col md:flex-row gap-2 justify-between">
				<Item className="p-0 items-start md:items-center">
					<ItemMedia className="mt-2 md:mt-0">
						<Funnel className="size-4 md:size-6" />
					</ItemMedia>
					<ItemContent className="flex-col md:flex-row">
						<NativeSelect classNameContainer="w-full">
							<NativeSelectOption value={"all-role"}>
								All Role
							</NativeSelectOption>
							<NativeSelectOption value={"manager"}>Manager</NativeSelectOption>
							<NativeSelectOption value={"qc"}>QC</NativeSelectOption>
							<NativeSelectOption value={"uploader"}>
								UPLOADER
							</NativeSelectOption>
							<NativeSelectOption value={"sbap"}>SBAP</NativeSelectOption>
						</NativeSelect>

						<NativeSelect classNameContainer="w-full">
							<NativeSelectOption value={"all-action"}>
								All Action
							</NativeSelectOption>
							<NativeSelectOption value={"verified"}>
								Verified
							</NativeSelectOption>
							<NativeSelectOption value={"rejected"}>
								Rejected
							</NativeSelectOption>
							<NativeSelectOption value={"deleted"}>Deleted</NativeSelectOption>
							<NativeSelectOption value={"downloaded"}>
								Downloaded
							</NativeSelectOption>
							<NativeSelectOption value={"uploaded"}>
								Uploaded
							</NativeSelectOption>
						</NativeSelect>

						<Popover open={openPopoverDate} onOpenChange={setOpenPopoverDate}>
							<PopoverTrigger>
								<InputGroup>
									<InputGroupAddon>
										<Calendar />
									</InputGroupAddon>
									<InputGroupInput
										type="text"
										placeholder="DD/MM/YYYY"
										value={
											dateFilter
												? String(
														new Date(dateFilter).toLocaleDateString("id-ID", {
															day: "2-digit",
															month: "2-digit",
															year: "2-digit",
														}),
													)
												: ""
										}
										onChange={() => {}}
									/>
								</InputGroup>
							</PopoverTrigger>
							<PopoverContent
								className="p-0 overflow-hidden w-auto"
								align="start"
							>
								<CalendarComponent
									mode="single"
									selected={dateFilter}
									onSelect={(date) => {
										setDateFilter(date);
										setOpenPopoverDate(false);
									}}
								/>
							</PopoverContent>
						</Popover>
					</ItemContent>
				</Item>

				<Button variant={"secondary"}>Reset</Button>
			</CardContent>
		</Card>
	);
};
