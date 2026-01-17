import {
	Alert,
	AlertDescription,
	AlertTime,
	AlertTitle,
} from "@repo/ui/components/alert";
import { Button } from "@repo/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@repo/ui/components/card";
import {
	AlertCircle,
	AlertTriangle,
	CheckCircle2,
	InfoIcon,
} from "@repo/ui/icons";
import Link from "next/link";

export const NotificationsAndAnnouncements = () => {
	return (
		<Card>
			<CardHeader>
				<div className="flex justify-between">
					<div className="grid grid-rows-2 gap-1">
						<CardTitle className="text-sm md:text-base">Notifications And Announcements</CardTitle>
						<CardDescription className="text-xs md:text-sm">Latest System Update</CardDescription>
					</div>

					<Link href={"/dashboard/notifications"}>
						<Button variant={"link"} className="text-xs md:text-sm">See All Notifications</Button>
					</Link>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				<Alert variant={"warning"}>
					<AlertCircle />
					<AlertTitle>Attention</AlertTitle>
					<AlertDescription>
						There is a spike in pending verification documents (&gt;20% of
						normal)
					</AlertDescription>
					<AlertTime>15 minute ago</AlertTime>
				</Alert>
				<Alert variant={"success"}>
					<CheckCircle2 />
					<AlertTitle>Target Achieved</AlertTitle>
					<AlertDescription>
						The QC-01 team successfully completed 98% of the weekly target
					</AlertDescription>
					<AlertTime>1 hours ago</AlertTime>
				</Alert>
				<Alert variant={"info"}>
					<InfoIcon />
					<AlertTitle>Report Available</AlertTitle>
					<AlertDescription>
						The December 2025 monthly report has been generated and is ready to
						download
					</AlertDescription>
					<AlertTime>2 hours ago</AlertTime>
				</Alert>
				<Alert variant={"destructive"}>
					<AlertTriangle />
					<AlertTitle>System Maintenance</AlertTitle>
					<AlertDescription>
						Scheduled maintenance on 10 Jan 2026, 22:00 -24:00 WIB
					</AlertDescription>
					<AlertTime>2 hours ago</AlertTime>
				</Alert>
			</CardContent>
		</Card>
	);
};
