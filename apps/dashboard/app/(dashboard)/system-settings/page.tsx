import {
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/components/page-header";

export default function SystemSettingPage() {
  return (
    <>
      <PageHeader>
        <PageTitle> Pengaturan Sistem</PageTitle>
        <PageDescription>
          Konfigurasi notifikasi, threshold verifikasi, dan backup data.
        </PageDescription>
      </PageHeader>
    </>
  );
}
