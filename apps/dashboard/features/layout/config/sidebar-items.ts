import {
  FileText,
  FolderArchive,
  LayoutDashboard,
  Logs,
  LucideProps,
  UsersRound,
  Upload,
  History,
  FileCheck,
  Printer,
  Search,
} from "lucide-react";
import React from "react";
import { UserRole } from "@/config/rbac/rbac.config";

export interface SidebarItem {
  label: string;
  link: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  allowedRoles: UserRole[];
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    label: "Dashboard",
    link: "/",
    icon: LayoutDashboard,
    allowedRoles: ["manager", "qc", "uploader", "sbap"],
  },

  {
    label: "Pengelolaan Arsip",
    link: "/manage-archive",
    icon: FolderArchive,
    allowedRoles: ["manager"],
  },
  {
    label: "Aktivitas Log",
    link: "/log-activity",
    icon: Logs,
    allowedRoles: ["manager"],
  },
  {
    label: "Pengelolaan Pengguna",
    link: "/manage-user",
    icon: UsersRound,
    allowedRoles: ["manager"],
  },
  {
    label: "Laporan",
    link: "/report",
    icon: FileText,
    allowedRoles: ["manager"],
  },

  {
    label: "Upload Dokumen",
    link: "/upload-document",
    icon: Upload,
    allowedRoles: ["uploader"],
  },
  {
    label: "Daftar Dokumen",
    link: "/document-list",
    icon: FileText,
    allowedRoles: ["uploader"],
  },
  {
    label: "Riwayat Upload",
    link: "/upload-history",
    icon: History,
    allowedRoles: ["uploader"],
  },

  {
    label: "Verifikasi Dokumen",
    link: "/document-list?status=menunggu_verifikasi",
    icon: FileCheck,
    allowedRoles: ["qc"],
  },
  {
    label: "Riwayat Verifikasi",
    link: "/document-list?status=terverifikasi",
    icon: History,
    allowedRoles: ["qc"],
  },

  {
    label: "Pencarian Arsip",
    link: "/document-list?status=terverifikasi",
    icon: Search,
    allowedRoles: ["sbap"],
  },
  {
    label: "Cetak Transkrip",
    link: "/document-list?tab=print",
    icon: Printer,
    allowedRoles: ["sbap"],
  },
];
