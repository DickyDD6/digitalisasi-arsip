import {
	Card,
	CardContent,
	CardDescription,
	CardTitle,
} from "@repo/ui/components/card";

export const PageHeader = ({
	title,
	description,
}: {
	title: string;
	description: string;
}) => {
	return (
		<Card>
			<CardContent className="space-y-1">
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardContent>
		</Card>
	);
};
