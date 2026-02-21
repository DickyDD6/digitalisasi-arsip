import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Funnel } from "lucide-react";

export const LogActivityContent = () => {
  return (
    <>
      <Card>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <Funnel />
              <Button variant="outline">Filter Role</Button>
              <Button variant="outline">Filter Aksi</Button>
              <Button variant="outline">Filter Tanggal</Button>
            </div>
            <Button variant="outline">Reset Filter</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent>
            <CardTitle>Total Aktivitas</CardTitle>
            <span className="text-xl font-bold">1.234</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <CardTitle>Upload Document</CardTitle>
            <span className="text-xl font-bold">1.234</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <CardTitle>Verifikasi Document</CardTitle>
            <span className="text-xl font-bold">1.234</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <CardTitle>Document Ditolak</CardTitle>
            <span className="text-xl font-bold">1.234</span>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monitoring Seluruh Aktivitas</CardTitle>
        </CardHeader>
        <CardContent>
          {/* TODO: Tabel Log Aktivitas */}
          <div className="text-center text-muted py-10">
            Tabel aktivitas akan ditampilkan di sini.
          </div>
        </CardContent>
      </Card>
    </>
  );
};
