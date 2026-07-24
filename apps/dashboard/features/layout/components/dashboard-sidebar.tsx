"use client";

import { useQuery } from "@tanstack/react-query";
import { FolderArchive, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserDropdown } from "@/features/auth/components/user-dropdown";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { canAccessMenu } from "@/config/rbac";
import { authQueries } from "@/features/auth/queries/auth.queries";
import { SIDEBAR_ITEMS } from "../config/sidebar-items";

const ROLE_LABELS: Record<string, string> = {
  manager: "Manager Arsip",
  qc: "Tim Quality Control",
  uploader: "Tim Uploader",
  sbap: "Staff Biro Akademik",
};

export const DashboardSidebar = () => {
  const pathname = usePathname();
  const { data: user } = useQuery(authQueries.userMe());

  const role = user?.role;
  const roleLabel = role ? (ROLE_LABELS[role] ?? role) : "Dashboard";

  const accessibleItems = SIDEBAR_ITEMS.filter((item) =>
    canAccessMenu(role, item.allowedRoles)
  );

  return (
    <Sidebar collapsible="icon" className="border-none shadow-sm">
      <SidebarHeader className="shadow-sm py-3.5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="hover:bg-transparent focus:bg-transparent active:bg-transparent cursor-default overflow-visible group-data-[collapsible=icon]:overflow-hidden p-0 group-data-[collapsible=icon]:p-0!">
              <div className="h-full px-1 rounded-md bg-primary place-content-center">
                <FolderArchive className="text-primary-foreground size-5" />
              </div>
              <div className="leading-2">
                <h2 className="-mt-1 text-xl font-semibold">Dashboard</h2>
                <p className="text-muted-foreground text-xs font-medium">
                  {roleLabel}
                </p>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {accessibleItems.map((item, i) => (
                <SidebarMenuItem key={i}>
                  <SidebarMenuButton isActive={pathname === item.link} asChild>
                    <Link href={item.link}>
                      <item.icon />
                      {item.label}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton isActive={pathname === "/system-settings"} asChild>
              <Link href={"/system-settings"}>
                <Settings />
                Pengaturan Sistem
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <UserDropdown />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
