"use client";

import React from "react";
import Image from "next/image";
import { Loader2, ShieldCheck } from "lucide-react";

export const Flasher = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background relative overflow-hidden select-none">
      {/* Background Decorative Ambient Light Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Main Glassmorphic Container Card */}
      <div className="relative z-10 flex flex-col items-center gap-5 p-8 sm:p-10 rounded-2xl border border-border/60 bg-card/80 shadow-lg backdrop-blur-md max-w-sm w-full mx-4 text-center">
        {/* Logos Container */}
        <div className="flex items-center justify-center gap-3">
          <Image
            src="/img/logo-univ.png"
            alt="Universitas Pasundan"
            width={44}
            height={44}
            className="size-9 sm:size-10 object-contain drop-shadow-sm"
          />
          <div className="h-6 w-px bg-border/80" />
          <Image
            src="/img/logo-ft.png"
            alt="Fakultas Teknik"
            width={44}
            height={44}
            className="size-9 sm:size-10 object-contain drop-shadow-sm"
          />
        </div>

        {/* Title & System Name */}
        <div className="space-y-1">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
            Digital Arsip
          </h2>
          <p className="text-xs text-muted-foreground font-medium">
            Fakultas Teknik Universitas Pasundan
          </p>
        </div>

        {/* Loader Spinner & Status Indicator */}
        <div className="flex flex-col items-center gap-2 pt-2">
          <div className="relative flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <ShieldCheck className="w-4 h-4 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-75" />
          </div>

          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-xs font-medium text-muted-foreground">
              Memeriksa Autentikasi Sesi
            </span>
            <span className="flex gap-0.5">
              <span className="w-1 h-1 bg-primary rounded-full animate-ping" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
