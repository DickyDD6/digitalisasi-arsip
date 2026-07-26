import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@repo/ui/button";
import { ShieldAlert, LogIn, ArrowLeft } from "lucide-react";

export default function Unauthorized() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background relative overflow-hidden select-none p-4">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-destructive/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

      <div className="relative z-10 flex flex-col items-center gap-6 p-8 sm:p-10 rounded-3xl border border-border/60 bg-card/80 shadow-2xl backdrop-blur-md max-w-md w-full text-center">
        {/* Logo FT Unpas Header */}
        <div className="flex items-center justify-center gap-3">
          <Image
            src="/img/logo-univ.png"
            alt="Universitas Pasundan"
            width={40}
            height={40}
            className="size-9 sm:size-10 object-contain"
          />
          <div className="h-6 w-px bg-border/80" />
          <Image
            src="/img/logo-ft.png"
            alt="Fakultas Teknik"
            width={40}
            height={40}
            className="size-9 sm:size-10 object-contain"
          />
        </div>

        {/* 401 Badge Icon */}
        <div className="p-4 rounded-2xl bg-destructive/10 text-destructive border border-destructive/20">
          <ShieldAlert className="w-10 h-10 stroke-[1.75]" />
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold tracking-widest text-destructive uppercase">
            Error 401 • Akses Ditolak
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Sesi Tidak Terautentikasi
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Anda harus login terlebih dahulu atau tidak memiliki izin akses
            untuk membuka halaman ini.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full pt-2">
          <Button
            render={<Link href="/login" />}
            className="w-full h-10 text-xs font-semibold bg-[#F54A00] hover:bg-[#d64100] text-white"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Login Kembali
          </Button>
          <Button
            render={<Link href="/" />}
            variant="outline"
            className="w-full h-10 text-xs font-semibold border-border/60"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Beranda
          </Button>
        </div>
      </div>
    </div>
  );
}
