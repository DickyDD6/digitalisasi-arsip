export const displayConsoleWarning = () => {
  if (typeof window === "undefined") return;

  const shouldDisplay =
    process.env.NODE_ENV === "production" ||
    process.env.NEXT_PUBLIC_ENABLE_CONSOLE_WARNING === "true";

  if (!shouldDisplay) return;

  const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const colors = {
    text: isDarkMode ? "#e0e0e0" : "#1a1a1a",
    textMuted: isDarkMode ? "#aaa" : "#666",
    link: isDarkMode ? "#66b3ff" : "#0066cc",
    warning: "#ff3b30",
    warningBg: isDarkMode ? "rgba(255, 59, 48, 0.15)" : "#fff3e0",
    warningBorder: "#ff6b00",
    info: isDarkMode ? "#64b5f6" : "#2196f3",
    border: isDarkMode ? "#555" : "#999",
  };

  console.clear();

  console.log(
    "%cBERHENTI!",
    `color: #ff3b30; font-size: 60px; font-weight: bold; text-shadow: 3px 3px 0 rgb(217, 31, 38), 6px 6px 0 rgb(226, 91, 14), 9px 9px 0 rgb(245, 221, 8), 12px 12px 0 rgb(5, 148, 68), 15px 15px 0 rgb(2, 135, 206), 18px 18px 0 rgb(4, 77, 145), 21px 21px 0 rgb(42, 21, 113);`,
  );

  console.log(
    "%cIni adalah fitur browser yang ditujukan untuk developer.",
    `font-size: 20px; font-weight: bold; color: ${colors.text};`,
  );

  console.log(
    "%cJika seseorang meminta Anda untuk menyalin-menempel sesuatu di sini untuk mengaktifkan fitur Digital Arsip atau 'meretas' akun seseorang, itu adalah penipuan dan akan memberikan mereka akses ke akun Anda.",
    `font-size: 16px; color: ${colors.text}; line-height: 1.5; margin-top: 10px;`,
  );

  console.log(
    "%cLihat %chttps://digitalisasi-arsip.com/security %cuntuk informasi selengkapnya.",
    `font-size: 16px; color: ${colors.text}; margin-top: 10px;`,
    `font-size: 16px; color: ${colors.link}; font-weight: bold;`,
    `font-size: 16px; color: ${colors.text};`,
  );

  console.log(
    "%c⚠️ PERINGATAN KEAMANAN",
    `font-size: 18px; font-weight: bold; color: ${colors.warningBorder}; background: ${colors.warningBg}; padding: 8px 12px; margin-top: 20px; border-left: 4px solid ${colors.warningBorder};`,
  );

  console.log(
    "%cJANGAN menjalankan kode yang tidak Anda pahami di console ini.\nJANGAN masukkan kredensial login Anda di console ini.\nJANGAN percaya siapapun yang meminta Anda menjalankan kode di sini.",
    `font-size: 14px; color: ${colors.warning}; line-height: 1.8; font-weight: 500;`,
  );

  if (process.env.NODE_ENV === "production") {
    console.log(
      "%c🛡️ Aktivitas console Anda sedang dipantau untuk keamanan sistem.",
      `font-size: 13px; color: ${colors.textMuted}; font-style: italic; margin-top: 15px;`,
    );
  }

  console.log(
    "%c💻 Developer?",
    `font-size: 14px; font-weight: bold; color: ${colors.info}; margin-top: 20px;`,
  );

  console.log(
    "%cJika Anda adalah developer yang sedang melakukan debugging, pastikan:\n• Anda memahami setiap kode yang Anda jalankan\n• Tidak membagikan token atau kredensial Anda\n• Menggunakan environment development untuk testing",
    `font-size: 12px; color: ${colors.text}; line-height: 1.8;`,
  );

  console.log(
    "%c\n───────────────────────────────────────────────\nDigital Arsip UNPAS © 2026\nSistem Pengarsipan Digital Fakultas Teknik\n───────────────────────────────────────────────",
    `font-size: 11px; color: ${colors.border}; font-family: monospace;`,
  );

  if (process.env.NODE_ENV === "development") {
    console.log(
      `%c🎨 Console Theme: ${isDarkMode ? "Dark" : "Light"}`,
      `font-size: 11px; color: ${colors.textMuted}; font-style: italic;`,
    );
  }
};

export const monitorConsoleActivity = () => {
  if (typeof window === "undefined") return;
  if (process.env.NODE_ENV !== "production") return;

  const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const originalLog = console.log;

  const suspiciousPatterns = [
    /document\.cookie/i,
    /localStorage\.getItem/i,
    /sessionStorage\.getItem/i,
    /fetch.*token/i,
    /fetch.*password/i,
    /eval\(/i,
  ];

  const warningBg = isDarkMode ? "#d32f2f" : "#d32f2f";
  const warningText = "#fff";
  const warningSecondary = isDarkMode ? "#ff5252" : "#d32f2f";

  console.log = function (...args: unknown[]) {
    const message = args.join(" ");
    const isSuspicious = suspiciousPatterns.some((pattern) =>
      pattern.test(message),
    );

    if (isSuspicious) {
      console.warn(
        "%c🚨 AKTIVITAS MENCURIGAKAN TERDETEKSI",
        `font-size: 16px; font-weight: bold; color: ${warningText}; background: ${warningBg}; padding: 8px 16px; border-radius: 4px;`,
      );
      console.warn(
        "%cKode yang Anda coba jalankan terdeteksi sebagai potensi ancaman keamanan. JANGAN LANJUTKAN jika Anda tidak yakin!",
        `font-size: 14px; color: ${warningSecondary}; font-weight: bold;`,
      );
    }

    originalLog.apply(console, args);
  };

  Object.defineProperty(window, "__NEXT_DATA__", {
    get() {
      console.warn(
        "%c⛔ STOP! Accessing sensitive data",
        `font-size: 16px; color: ${warningSecondary}; font-weight: bold;`,
      );
      return undefined;
    },
  });
};
