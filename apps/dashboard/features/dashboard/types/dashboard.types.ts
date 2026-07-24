export type PeriodType = "hari" | "minggu" | "bulan" | "custom";

export interface DocumentStats {
  total_documents: number;
  verified_documents: number;
  pending_documents: number;
  rejected_documents: number;
}

export interface DocumentStatisticsResponse {
  message: string;
  data: DocumentStats;
}

export interface DashboardStatsResponse {
  message: string;
  data: DocumentStats;
  period?: {
    start_date: string;
    end_date: string;
  };
}

export interface DocumentUploader {
  id: number;
  name: string;
  email: string;
  role: string;
}

export type DocumentStatusType =
  | "pending"
  | "verified"
  | "rejected"
  | "menunggu_verifikasi"
  | "terverifikasi"
  | "tidak_terverifikasi";

export interface DocumentItem {
  id: number;
  file_name?: string;
  title?: string;
  document_type?: string;
  category?: string;
  status: DocumentStatusType | string;
  created_at: string;
  verification_note?: string;
  student_number?: string;
  uploader?: DocumentUploader;
  year?: string;
  file_url?: string;
  file_size?: string;
}

export interface DocumentListResponse {
  message: string;
  data: DocumentItem[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface VerifyDocumentPayload {
  status: "verified" | "rejected";
  verification_note?: string;
}

export interface AuditLogActionObj {
  name: string;
  label: string;
  color?: string;
}

export interface AuditLogItem {
  id: number;
  user_id?: number;
  action: string | AuditLogActionObj;
  description: string;
  created_at?: string;
  date?: {
    formatted?: string;
    time?: string;
    timestamp?: string;
  };
  user?: {
    id?: number;
    name: string;
    email?: string;
    role?: string;
  };
}

export interface AuditLogStats {
  total_activities: number;
  today_total: number;
  today_upload: number;
  today_verify: number;
  today_reject: number;
  by_action?: Record<string, number>;
  recent_activities?: AuditLogItem[];
}

export interface AuditLogStatisticsResponse {
  message: string;
  data: AuditLogStats;
}

export interface UserStats {
  total_users: number;
  total_by_role?: Record<string, number>;
  active_users: number;
  new_users: number;
}

export interface UserStatisticsResponse {
  message: string;
  data: UserStats;
}

export interface YearlyStat {
  year: string;
  nilai: number;
  transkrip: number;
  total: number;
}

export interface DocumentTypeStat {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export interface QCStaffStat {
  staff: string;
  terverifikasi: number;
  ditolak: number;
  avgTime: string;
  successRate: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  time: string;
  type: "warning" | "success" | "info" | "destructive";
  iconName: "alert-circle" | "check-circle" | "info" | "alert-triangle";
  bgColor: string;
  textColor: string;
  iconColor: string;
}
