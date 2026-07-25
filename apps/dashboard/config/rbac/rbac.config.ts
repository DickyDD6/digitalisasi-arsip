export type UserRole = "manager" | "qc" | "uploader" | "sbap";

export interface SidebarMenuItemConfig {
  id: string;
  label: string;
  link: string;
  iconName: string;
  allowedRoles: UserRole[];
}

export const ROLE_PERMISSIONS: Record<string, UserRole[]> = {
  "/": ["manager", "qc", "uploader", "sbap"],
  "/manage-archive": ["manager"],
  "/verification": ["qc", "manager"],
  "/verification-history": ["qc", "manager"],
  "/verified-documents": ["qc", "manager"],
  "/rejected-documents": ["qc", "manager"],
  "/document-list": ["uploader", "manager", "qc", "sbap"],
  "/upload-document": ["uploader", "manager"],
  "/upload-history": ["uploader", "manager"],
  "/notifications": ["manager", "qc", "uploader", "sbap"],
  "/log-activity": ["manager"],
  "/manage-user": ["manager"],
  "/report": ["manager"],
  "/profile": ["manager", "qc", "uploader", "sbap"],
  "/system-settings": ["manager", "qc", "uploader", "sbap"],
  "/help": ["manager", "qc", "uploader", "sbap"],
};

export function hasPermission(
  role: UserRole | undefined,
  path: string
): boolean {
  if (!role) return false;
  const allowed = ROLE_PERMISSIONS[path];
  if (!allowed) return true;
  return allowed.includes(role);
}

export function canAccessMenu(
  role: UserRole | undefined,
  allowedRoles: UserRole[]
): boolean {
  if (!role) return false;
  return allowedRoles.includes(role);
}
