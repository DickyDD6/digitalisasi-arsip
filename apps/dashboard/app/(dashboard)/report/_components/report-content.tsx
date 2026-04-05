import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

export const ReportContent = () => {
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <Card>
          <CardContent>
            <CardTitle>Laporan Statistik</CardTitle>
            <p>
              Statistik penggunaan sistem, jumlah dokumen, dan aktivitas
              pengguna.
            </p>
            <Button variant="outline" size="sm" className="mt-4">
              Cetak Laporan
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <CardTitle>Laporan Pengguna</CardTitle>
            <p>Daftar pengguna aktif, peran, dan aktivitas terakhir.</p>
            <Button variant="outline" size="sm" className="mt-4">
              Cetak Laporan
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <CardTitle>Laporan Dokumen</CardTitle>
            <p>
              Daftar dokumen yang telah diunggah, status, dan informasi terkait.
            </p>
            <Button variant="outline" size="sm" className="mt-4">
              Cetak Laporan
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <CardTitle>Laporan Audit</CardTitle>
            <p>
              Daftar aktivitas audit sistem, termasuk akses dokumen dan
              perubahan data.
            </p>
            <Button variant="outline" size="sm" className="mt-4">
              Cetak Laporan
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent>
          <CardTitle>Pratinjau Laporan</CardTitle>
          {/* TODO: Implementasi statistik dengan line chart */}
          <div className="text-center text-muted py-10">
            Pratinjau laporan akan ditampilkan di sini.
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <CardTitle>Laporan yang Pernah Dibuat</CardTitle>
          {/* TODO: Implementasi daftar laporan yang pernah dibuat */}
          <div className="text-center text-muted py-10">
            Daftar laporan yang pernah dibuat akan ditampilkan di sini.
          </div>
        </CardContent>
      </Card>
    </>
  );
};
