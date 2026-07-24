"use client";

import React, { useState, useEffect } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationsDropdown } from "./notifications-dropdown";
import { SearchCommandDialog } from "./search-command-dialog";

export const DashboardNavbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <nav className="z-10 flex items-center justify-between w-full px-4 py-2.5 shadow-sm bg-card sticky top-0 border-b border-border/60">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-2">
            <Image
              src={"/img/logo-univ.png"}
              alt="logo-universitas-pasundan"
              width={40}
              height={40}
              className="size-6 md:size-8"
            />
            <Image
              src={"/img/logo-ft.png"}
              alt="logo-fakultas-teknik"
              width={40}
              height={40}
              className="size-6 md:size-8"
            />
            <div className="flex flex-col justify-center">
              <h1 className="text-base font-semibold md:text-lg text-foreground">
                Digital Arsip
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Fakultas Teknik Universitas Pasundan
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setSearchOpen(true)}
            className="h-9 px-3 text-xs gap-2 text-muted-foreground border-border/60 hover:bg-muted/50 rounded-xl"
          >
            <Search className="w-4 h-4 text-muted-foreground" />
            <span className="hidden md:inline">Cari Dokumen...</span>
            <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono text-muted-foreground border border-border/60 ml-1">
              ⌘K
            </kbd>
          </Button>

          <NotificationsDropdown />
        </div>
      </nav>

      <SearchCommandDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
};
