import React from "react";
import Link from "next/link";
import { Upload, Clock, FileX } from "lucide-react";
import { Card } from "@/components/ui/card";

export function UploaderQuickActions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Action Card 1: Upload Dokumen Baru */}
      <Link href="/upload-document">
        <Card className="border-none bg-[#155DFC] hover:bg-[#1251db] text-white shadow-md transition-transform hover:-translate-y-0.5 cursor-pointer p-5">
          <div className="space-y-3">
            <div className="p-2.5 rounded-xl bg-white/20 w-fit backdrop-blur">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Upload Dokumen Baru</h3>
              <p className="text-xs text-white/80 mt-0.5">Unggah Nilai, Transkrip, atau Ijazah</p>
            </div>
          </div>
        </Card>
      </Link>

      {/* Action Card 2: Dokumen Pending */}
      <Link href="/manage-archive?status=menunggu_verifikasi">
        <Card className="border-none bg-[#D08700] hover:bg-[#b87800] text-white shadow-md transition-transform hover:-translate-y-0.5 cursor-pointer p-5">
          <div className="space-y-3">
            <div className="p-2.5 rounded-xl bg-white/20 w-fit backdrop-blur">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Dokumen Pending</h3>
              <p className="text-xs text-white/80 mt-0.5">Lihat Status Dokumentasi</p>
            </div>
          </div>
        </Card>
      </Link>

      {/* Action Card 3: Dokumen Ditolak */}
      <Link href="/manage-archive?status=tidak_terverifikasi">
        <Card className="border-none bg-[#E7000B] hover:bg-[#c9000a] text-white shadow-md transition-transform hover:-translate-y-0.5 cursor-pointer p-5">
          <div className="space-y-3">
            <div className="p-2.5 rounded-xl bg-white/20 w-fit backdrop-blur">
              <FileX className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Dokumen Ditolak</h3>
              <p className="text-xs text-white/80 mt-0.5">Perbaiki Dokumen Invalid</p>
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
}
