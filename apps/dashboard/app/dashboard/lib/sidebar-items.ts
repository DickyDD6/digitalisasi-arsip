import {
  FileText,
  FolderArchive,
  LayoutDashboard,
  Logs,
  LucideProps,
  UsersRound,
} from "lucide-react";
import React from "react";

interface SidebarItem {
  label: string;
  link: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    label: "Dashboard",
    link: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Pengelolaan Arsip",
    link: "/dashboard/manage-archive",
    icon: FolderArchive,
  },
  {
    label: "Aktivitas Log",
    link: "/dashboard/log-activity",
    icon: Logs,
  },
  {
    label: "Pengelolaan Pengguna",
    link: "/dashboard/manage-user",
    icon: UsersRound,
  },
  {
    label: "Laporan",
    link: "/dashboard/report",
    icon: FileText,
  },
];
