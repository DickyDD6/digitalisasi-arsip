"use client";

import React from "react";
import Link from "next/link";
import { Clock, FileCheck, FileX } from "lucide-react";
import { Card } from "@repo/ui/card";

interface QCQuickAccessBannerProps {
  pendingCount?: number;
}

export function QCQuickAccessBanner({
  pendingCount = 0,
}: QCQuickAccessBannerProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 1. Dokumen Pending Card */}
      <Link href="/verification?status=menunggu_verifikasi">
        <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden group relative bg-gradient-to-br from-amber-600 to-amber-800 text-white min-h-[160px] flex flex-col justify-between p-6">
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 group-hover:scale-105 transition-transform">
              <Clock className="w-7 h-7 text-amber-200" />
            </div>
          </div>

          <div className="mt-4 space-y-1">
            <h3 className="text-xl font-bold tracking-tight text-white group-hover:translate-x-0.5 transition-transform">
              Dokumen Pending
            </h3>
            <p className="text-sm text-amber-100/90 font-normal">
              {pendingCount} dokumen menunggu verifikasi
            </p>
          </div>
        </Card>
      </Link>

      {/* 2. Terverifikasi Card */}
      <Link href="/verification?status=terverifikasi">
        <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden group relative bg-gradient-to-br from-emerald-600 to-emerald-800 text-white min-h-[160px] flex flex-col justify-between p-6">
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 group-hover:scale-105 transition-transform">
              <FileCheck className="w-7 h-7 text-emerald-200" />
            </div>
          </div>

          <div className="mt-4 space-y-1">
            <h3 className="text-xl font-bold tracking-tight text-white group-hover:translate-x-0.5 transition-transform">
              Terverifikasi
            </h3>
            <p className="text-sm text-emerald-100/90 font-normal">
              Lihat dokumen yang sudah disetujui
            </p>
          </div>
        </Card>
      </Link>

      {/* 3. Ditolak Card */}
      <Link href="/verification?status=ditolak">
        <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden group relative bg-gradient-to-br from-rose-600 to-rose-800 text-white min-h-[160px] flex flex-col justify-between p-6">
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 group-hover:scale-105 transition-transform">
              <FileX className="w-7 h-7 text-rose-200" />
            </div>
          </div>

          <div className="mt-4 space-y-1">
            <h3 className="text-xl font-bold tracking-tight text-white group-hover:translate-x-0.5 transition-transform">
              Ditolak
            </h3>
            <p className="text-sm text-rose-100/90 font-normal">
              Dokumen dengan catatan penolakan
            </p>
          </div>
        </Card>
      </Link>
    </div>
  );
}
