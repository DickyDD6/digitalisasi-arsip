import React from "react";
import Link from "next/link";
import { Search, FileCheck, ArrowRight } from "lucide-react";

export function SBAPActionBanners() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 1. Cari Arsip Digital Card */}
      <Link href="/search-archive" className="group block focus:outline-none">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#9810FA] to-[#8200DB] p-6 text-white shadow-lg transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
          <div className="p-3 rounded-full bg-white/20 backdrop-blur-md shrink-0 w-fit">
            <Search className="w-6 h-6 text-white" />
          </div>

          <div className="mt-4 space-y-2">
            <h3 className="text-lg font-bold tracking-tight text-white flex items-center gap-2 group-hover:translate-x-1 transition-transform">
              Cari Arsip Digital
              <ArrowRight className="w-4 h-4 opacity-80" />
            </h3>
            <p className="text-xs text-white/80 leading-relaxed">
              Pencarian cepat dan akurat berdasarkan kriteria
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-white/20 space-y-1 text-xs text-white/90 font-medium">
            <p>• Nilai: Prodi, Tahun Ajaran, Mata Kuliah, Kelas</p>
            <p>• Transkrip/Ijazah: NPM, Prodi</p>
          </div>
        </div>
      </Link>

      {/* 2. Arsip Terverifikasi Card */}
      <Link
        href="/available-archives"
        className="group block focus:outline-none"
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#155DFC] to-[#1447E6] p-6 text-white shadow-lg transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
          <div className="p-3 rounded-full bg-white/20 backdrop-blur-md shrink-0 w-fit">
            <FileCheck className="w-6 h-6 text-white" />
          </div>

          <div className="mt-4 space-y-2">
            <h3 className="text-lg font-bold tracking-tight text-white flex items-center gap-2 group-hover:translate-x-1 transition-transform">
              Arsip Terverifikasi
              <ArrowRight className="w-4 h-4 opacity-80" />
            </h3>
            <p className="text-xs text-white/80 leading-relaxed">
              Lihat dan download arsip yang sudah diverifikasi
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-white/20 space-y-1 text-xs text-white/90 font-medium">
            <p>• Akses seluruh arsip digital resmi</p>
            <p>• Status: Terverifikasi oleh Tim QC</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
