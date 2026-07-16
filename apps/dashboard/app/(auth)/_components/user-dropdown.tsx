"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  HelpCircle,
  KeyRound,
  LogOut,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { LogoutButton } from "./logout-button";

export const UserDropdown = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex justify-between items-center h-full w-full"
          >
            <div className="flex gap-2 items-center">
              <UserRound />
              <div className="grid">
                <p className="font-medium">Jhon Doe</p>
                <p className="text-xs text-muted-foreground">Manajer</p>
              </div>
            </div>
            {open ? (
              <ChevronDown className="rotate-180 transition-all duration-300" />
            ) : (
              <ChevronDown className="rotate-0 transition-all duration-300" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right">
          <div className="px-4 py-2 flex items-center gap-2 justify-between">
            <div className="grid">
              <p className="font-medium">John Doe</p>
              <p className="text-xs text-muted-foreground">
                johndoe@example.com
              </p>
            </div>
            <Badge>Manajer</Badge>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/profile/manager">
              <UserRound className="size-4" />
              Profile Saya
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/profile/change-password">
              <KeyRound className="size-4" />
              Ubah Password
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/help">
              <HelpCircle className="size-4" />
              Bantuan
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <LogOut className="size-4" />
                  Keluar
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <div className="flex gap-2">
                    <div className="bg-red-100 p-2">
                      <LogOut className="size-4 text-red-600" />
                    </div>
                    <div className="grid">
                      <p className="font-medium">Konfirmasi Keluar</p>
                      <p className="text-xs text-muted-foreground">
                        Apakah Anda yakin ingin keluar?
                      </p>
                    </div>
                  </div>
                </DialogHeader>

                <p className="text-sm text-muted-foreground">
                  Anda akan keluar dari sistem dan harus login kembali untuk
                  mengakses dashboard.
                </p>

                <DialogFooter className="flex justify-end gap-2">
                  <DialogClose asChild>
                    <Button variant="outline">Batal</Button>
                  </DialogClose>
                  <LogoutButton>Ya, Keluar</LogoutButton>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
