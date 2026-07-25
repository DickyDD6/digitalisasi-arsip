"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import { userQueries } from "@/features/users/queries/user.queries";
import { archiveQueries } from "@/features/archives/queries/archive.queries";
import { documentListQueries } from "@/features/documents/queries/document-list.queries";
import { uploadHistoryQueries } from "@/features/documents/queries/upload-history.queries";
import { systemSettingsQueries } from "@/features/system-settings/queries/system-settings.queries";
import { SIDEBAR_ITEMS } from "../config/sidebar-items";

const ROLE_LABELS: Record<string, string> = {
  manager: "Manager Arsip",
  qc: "Tim Quality Control",
  uploader: "Tim Uploader",
  sbap: "Staff Biro Akademik",
};

export const DashboardSidebar = () => {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { data: user } = useQuery(authQueries.userMe());

  const role = user?.role;
  const roleLabel = role ? (ROLE_LABELS[role] ?? role) : "Dashboard";

  const accessibleItems = SIDEBAR_ITEMS.filter((item) =>
    canAccessMenu(role, item.allowedRoles)
  );

  const handlePrefetch = (link: string) => {
    if (link === "/manage-user") {
      queryClient.prefetchQuery(userQueries.list());
    } else if (link === "/manage-archive") {
      queryClient.prefetchQuery(archiveQueries.list());
    } else if (link === "/document-list") {
      queryClient.prefetchQuery(documentListQueries.list({ page: 1, per_page: 15 }));
    } else if (link === "/upload-history") {
      queryClient.prefetchQuery(uploadHistoryQueries.list());
    } else if (link === "/system-settings") {
      queryClient.prefetchQuery(systemSettingsQueries.settings());
    }
  };

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
                  <SidebarMenuButton isActive={pathname === item.link}>
                    <Link
                      href={item.link}
                      onMouseEnter={() => handlePrefetch(item.link)}
                    >
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
            <SidebarMenuButton isActive={pathname === "/system-settings"}>
              <Link
                href={"/system-settings"}
                onMouseEnter={() => handlePrefetch("/system-settings")}
              >
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
