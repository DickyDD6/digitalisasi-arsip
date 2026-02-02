// TODO: PINDAHKAN_KE_FEATURES - Komponen ini harus dipindahkan ke features/user/widgets/
// Lokasi saat ini melanggar arsitektur berbasis fitur - komponen tidak boleh berada di direktori app/
import {
	MetricCard,
	MetricCardContent,
	MetricCardIcon,
	MetricCardTitle,
	MetricCardValue,
	MetricGrid,
} from "@/shared/components/metric";
import {Shield, UploadCloud, UsersRound, Workflow} from "@repo/ui/icons";
import {cn} from "@repo/ui/lib";

const mockData = [
	{
		icon: UsersRound,
		title: "Total Users",
		count: 32,
		color: "text-foreground",
	},
	{
		icon: Shield,
		title: "Tim QC",
		count: 8,
		color: "text-green-600",
	},
	{
		icon: UploadCloud,
		title: "Tim Uploader",
		count: 12,
		color: "text-yellow-600",
	},
	{
		icon: Workflow,
		title: "SBAP officer",
		count: 11,
		color: "text-blue-600",
	},
];

export const UsersStatsSummary = () => {
	return (
		<MetricGrid>
			{mockData.map((data, i) => (
				<MetricCard key={i}>
					<MetricCardContent>
						<MetricCardTitle>{data.title}</MetricCardTitle>
						<MetricCardValue className={cn(data.color)}>
							{data.count}
						</MetricCardValue>
					</MetricCardContent>
					<MetricCardIcon className={cn(data.color)}>
						<data.icon/>
					</MetricCardIcon>
				</MetricCard>
			))}
		</MetricGrid>
	);
};
