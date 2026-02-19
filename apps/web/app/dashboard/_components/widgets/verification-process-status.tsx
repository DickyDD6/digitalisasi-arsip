// TODO: PINDAHKAN_KE_FEATURES - Komponen ini harus dipindahkan ke features/dashboard/widgets/
// Lokasi saat ini melanggar arsitektur berbasis fitur - komponen tidak boleh berada di direktori app/
import { Alert, AlertDescription } from "@repo/ui/components/alert";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@repo/ui/components/card";
import { AlertCircle, InfoIcon, XCircle } from "@repo/ui/icons";

export const VerificationProcessStatus = () => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Verification Process Status</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<Alert variant={"warning"}>
					<AlertCircle />
					<AlertDescription>
						There are 124 documents awaiting verification for more than 3 days
					</AlertDescription>
				</Alert>
				<Alert variant={"destructive"}>
					<XCircle />
					<AlertDescription>
						There are 47 documents awaiting verification for more than 7 days
					</AlertDescription>
				</Alert>
				<Alert variant={"info"}>
					<InfoIcon />
					<AlertDescription>
						Average document verification time: 2.3 days
					</AlertDescription>
				</Alert>
			</CardContent>
		</Card>
	);
};
