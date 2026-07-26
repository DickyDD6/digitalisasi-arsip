import { http } from "@/shared/lib/http";

export interface NotificationItemData {
  id: number;
  title: string;
  message: string;
  time: string;
  type: "info" | "success" | "warning" | "destructive";
  read?: boolean;
}

const READ_NOTIFS_KEY = "digital_archive_read_notifications";

export const notificationsService = {
  /**
   * Graceful Fallback Pattern:
   * Tries to fetch notifications from Backend API (/api/notifications).
   * Fallbacks gracefully to localStorage if endpoint is not deployed yet.
   * // TODO: REVISI_BACKEND.md - Add /api/notifications GET endpoint
   */
  async getNotifications(): Promise<NotificationItemData[]> {
    try {
      const res =
        await http.get<ApiResponse<NotificationItemData[]>>(
          "/api/notifications",
        );
      if (res.data?.data) {
        return res.data.data;
      }
    } catch {
      // Graceful fallback to localStorage / mock storage
    }

    try {
      const savedRead = localStorage.getItem(READ_NOTIFS_KEY);
      const readIds: number[] = savedRead ? JSON.parse(savedRead) : [];

      const defaultItems: NotificationItemData[] = [
        {
          id: 101,
          title: "Status Dokumen Terbaru",
          message: "Dokumen transkrip nilai telah diverifikasi oleh tim QC.",
          time: "5 Menit lalu",
          type: "success",
        },
        {
          id: 102,
          title: "Pengingat Format PDF",
          message: "Gunakan template transkrip nilai standar versi 2026.",
          time: "1 Jam lalu",
          type: "info",
        },
      ];

      return defaultItems.map((item) => ({
        ...item,
        read: readIds.includes(item.id),
      }));
    } catch {
      return [];
    }
  },

  async markAsRead(id: number): Promise<void> {
    try {
      await http.post(`/api/notifications/${id}/read`);
    } catch {
      // Graceful fallback to localStorage
      try {
        const saved = localStorage.getItem(READ_NOTIFS_KEY);
        const readIds: number[] = saved ? JSON.parse(saved) : [];
        if (!readIds.includes(id)) {
          localStorage.setItem(
            READ_NOTIFS_KEY,
            JSON.stringify([...readIds, id]),
          );
        }
      } catch {
        // ignore storage error
      }
    }
  },
};
