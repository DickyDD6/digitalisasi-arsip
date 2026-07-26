import { http } from "@/shared/lib/http";

export interface SystemSettingsConfig {
  verificationWarningThresholdDays: number;
  archiveRetentionPermanent: boolean;
  ocrAutoScan: boolean;
  rejectReasonRequired: boolean;
  autoPdfCompression: boolean;
  allowedExtensions: string[];
  watermarkEnabled: boolean;
  bulkDownloadFormat: "ZIP" | "SINGLE";
  navbarNotificationBadge: boolean;
  statusNotificationEnabled: boolean;
}

const SETTINGS_KEY = "digital_archive_system_settings";

const defaultSettings: SystemSettingsConfig = {
  verificationWarningThresholdDays: 3,
  archiveRetentionPermanent: true,
  ocrAutoScan: true,
  rejectReasonRequired: true,
  autoPdfCompression: true,
  allowedExtensions: ["PDF", "PNG"],
  watermarkEnabled: true,
  bulkDownloadFormat: "ZIP",
  navbarNotificationBadge: true,
  statusNotificationEnabled: true,
};

export const systemSettingsService = {
  /**
   * Graceful Fallback Pattern:
   * Tries to fetch settings from Backend API (/api/system-settings).
   * Fallbacks gracefully to localStorage if endpoint is not deployed yet.
   * // TODO: REVISI_BACKEND.md - Add /api/system-settings GET & POST endpoints
   */
  async getSettings(): Promise<SystemSettingsConfig> {
    try {
      const res = await http.get<ApiResponse<SystemSettingsConfig>>(
        "/api/system-settings",
      );
      if (res.data?.data) {
        return res.data.data;
      }
    } catch {
      // Graceful fallback to localStorage
    }

    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        return { ...defaultSettings, ...JSON.parse(saved) };
      }
    } catch {
      // ignore
    }

    return defaultSettings;
  },

  async updateSettings(
    settings: Partial<SystemSettingsConfig>,
  ): Promise<SystemSettingsConfig> {
    try {
      const res = await http.post<ApiResponse<SystemSettingsConfig>>(
        "/api/system-settings",
        settings,
      );
      if (res.data?.data) {
        return res.data.data;
      }
    } catch {
      // Graceful fallback to localStorage
    }

    const current = await this.getSettings();
    const updated = { ...current, ...settings };
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    return updated;
  },
};
