import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
} from "@repo/ui/components/item";
import {
	NativeSelect,
	NativeSelectOption,
} from "@repo/ui/components/native-select";
import { Calendar, Funnel } from "@repo/ui/icons";

export const PeriodFilterCard = () => {
	return (
		<Card>
			<CardContent>
				<Item className="p-0">
					<ItemMedia className="my-auto translate-y-0! size-4 md:size-8">
						<Calendar />
					</ItemMedia>
					<ItemContent>
						<ItemDescription className="text-xs md:text-base">
							Periode Data:
						</ItemDescription>
					</ItemContent>
					<ItemActions className="hidden md:flex">
						<Button>Hari Ini</Button>
						<Button variant={"outline"}>Minggu Ini</Button>
						<Button variant={"outline"}>Bulan Ini</Button>
					</ItemActions>
					<ItemActions className="block md:hidden">
						<Item className="p-0">
							<ItemMedia className="size-4 md:size-8 my-auto translate-y-0!">
								<Funnel />
							</ItemMedia>
							<ItemContent>
								<NativeSelect>
									<NativeSelectOption value="today">Today</NativeSelectOption>
									<NativeSelectOption value="weeks">
										This Week
									</NativeSelectOption>
									<NativeSelectOption value="months">
										This Month
									</NativeSelectOption>
								</NativeSelect>
							</ItemContent>
						</Item>
					</ItemActions>
				</Item>
			</CardContent>
		</Card>
	);
};
