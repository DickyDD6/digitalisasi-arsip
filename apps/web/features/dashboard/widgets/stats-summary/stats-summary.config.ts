import {StatsSummaryConfig} from ".";
import {
	ActivitySquare,
	AlertTriangle,
	Clock,
	FileCheck,
	FileClock,
	FileText,
	FileX,
	UserRoundCheck
} from "@repo/ui/icons"

export const STATS_SUMMARY_CONFIG: StatsSummaryConfig = {
	DIGITALIZED: {
		label: "Total Digitalized Documents",
		icon: FileText,
		colorClassName: "text-primary bg-orange-100"
	},
	VERIFIED: {
		label: "Verified",
		icon: FileCheck,
		colorClassName: "text-green-600 bg-green-100"
	},
	REJECTED: {
		label: "Rejected",
		icon: FileX,
		colorClassName: "text-destructive bg-red-100"
	},
	PENDING: {
		label: "Waiting for Verification",
		icon: FileClock,
		colorClassName: "text-yellow-600 bg-yellow-100"
	},
	ACTIVITY: {
		label: "Today Activity",
		icon: ActivitySquare,
		colorClassName: "text-purple-600 bg-purple-100"
	},
	AVERAGE_TIME: {
		label: "Average Verification Time",
		icon: Clock,
		colorClassName: "text-blue-600 bg-blue-100"
	},
	STAFF: {
		label: "Staff Active",
		icon: UserRoundCheck,
		colorClassName: "text-emerald-600 bg-emerald-100"
	},
	URGENT: {
		label: "Urgent Documents",
		icon: AlertTriangle,
		colorClassName: "text-destructive bg-red-100"
	}
}