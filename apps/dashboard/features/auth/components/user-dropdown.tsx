"use client";

import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@repo/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import {
  ChevronDown,
  HelpCircle,
  KeyRound,
  LogOut,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { LogoutButton } from "./logout-button";
import { useQuery } from "@tanstack/react-query";
import { authQueries } from "@/features/auth/queries/auth.queries";
import { cn } from "@repo/ui/lib/utils";

const ROLE_LABELS: Record<string, string> = {
  manager: "Manager Arsip",
  qc: "Tim Quality Control",
  uploader: "Tim Uploader",
  sbap: "Staff Biro Akademik",
};

export const UserDropdown = () => {
  const [open, setOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const { data: user } = useQuery(authQueries.userMe());

  const userName = user?.name ?? "User";
  const userEmail = user?.email ?? "";
  const roleLabel = user?.role ? (ROLE_LABELS[user.role] ?? user.role) : "User";

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger
          render={
            <Button
              variant="outline"
              className="flex justify-between items-center h-full w-full"
            />
          }
        >
          <div className="flex gap-2 items-center">
            <UserRound />
            <div className="grid text-left">
              <p className="font-medium text-sm truncate max-w-[120px]">
                {userName}
              </p>
              <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                {roleLabel}
              </p>
            </div>
          </div>
          <ChevronDown
            className={cn(
              "transition-all duration-300",
              open ? "rotate-180" : "rotate-0",
            )}
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent side="right">
          <div className="px-4 py-2 flex items-center gap-2 justify-between">
            <div className="grid">
              <p className="font-medium">{userName}</p>
              <p className="text-xs text-muted-foreground">{userEmail}</p>
            </div>
            <Badge variant="outline">{roleLabel}</Badge>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href="/profile" className="flex items-center gap-2 w-full">
              <UserRound className="size-4" />
              Profile Saya
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              href="/profile/change-password"
              className="flex items-center gap-2 w-full"
            >
              <KeyRound className="size-4" />
              Ubah Password
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/help" className="flex items-center gap-2 w-full">
              <HelpCircle className="size-4" />
              Bantuan
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              setOpen(false);
              setLogoutDialogOpen(true);
            }}
            className="cursor-pointer"
          >
            <LogOut className="size-4" />
            <span>Keluar</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Logout Confirmation Dialog (outside DropdownMenu to prevent unmounting/escape bug) */}
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="flex gap-2">
              <div className="bg-red-100 dark:bg-rose-950 p-2 rounded-xl flex items-center justify-center shrink-0">
                <LogOut className="size-5 text-red-600 dark:text-rose-400" />
              </div>
              <div className="grid">
                <p className="font-semibold text-base text-foreground">
                  Konfirmasi Keluar
                </p>
                <p className="text-xs text-muted-foreground">
                  Apakah Anda yakin ingin keluar?
                </p>
              </div>
            </div>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            Anda akan keluar dari sistem dan harus login kembali untuk mengakses
            dashboard.
          </p>

          <DialogFooter className="flex justify-end gap-2 pt-2">
            <DialogClose render={<Button variant="outline" />}>
              Batal
            </DialogClose>
            <LogoutButton>Ya, Keluar</LogoutButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
