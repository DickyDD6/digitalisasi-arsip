import {
  PageActions,
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/shared/components/page-header";
import { Button } from "@repo/ui/button";
import { LogActivityContent } from "@/features/log-activity/components/log-activity-content";

export default function LogActivityPage() {
  return (
    <>
      <PageHeader>
        <PageTitle>Log Aktivitas</PageTitle>
        <PageDescription>
          Monitoring dan audit trail seluruh aktivitas pengguna
        </PageDescription>
        <PageActions>
          <Button>Export Log</Button>
        </PageActions>
      </PageHeader>

      <LogActivityContent />
    </>
  );
}
