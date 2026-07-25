import {
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/shared/components/page-header";
import { ManagementUserContent } from "@/features/users/components/manage-user-content";

export default function ManagementUserPage() {
  return (
    <>
      <PageHeader>
        <PageTitle>Manajemen User</PageTitle>
        <PageDescription>
          Kelola akun pengguna, peran, dan izin akses di sistem pengarsipan
          digital.
        </PageDescription>
      </PageHeader>

      <ManagementUserContent />
    </>
  );
}
