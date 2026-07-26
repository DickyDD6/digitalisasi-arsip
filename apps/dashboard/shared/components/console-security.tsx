"use client";

import { useEffect } from "react";
import {
  displayConsoleWarning,
  monitorConsoleActivity,
} from "@/shared/utils/console-warning";

export function ConsoleSecurity() {
  useEffect(() => {
    displayConsoleWarning();
    monitorConsoleActivity();

    const darkModeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)",
    );

    const handleThemeChange = () => {
      displayConsoleWarning();
    };

    if (darkModeMediaQuery.addEventListener) {
      darkModeMediaQuery.addEventListener("change", handleThemeChange);
    } else {
      darkModeMediaQuery.addListener(handleThemeChange);
    }

    if (process.env.NEXT_PUBLIC_DISABLE_DEVTOOLS === "true") {
      const isDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      const warningColor = isDarkMode ? "#ffb74d" : "#ff9800";

      const detectDevTools = () => {
        const threshold = 160;
        if (
          window.outerWidth - window.innerWidth > threshold ||
          window.outerHeight - window.innerHeight > threshold
        ) {
          console.log(
            "%c⚠️ Developer Tools terdeteksi",
            `font-size: 14px; color: ${warningColor};`,
          );
        }
      };

      window.addEventListener("resize", detectDevTools);

      return () => {
        window.removeEventListener("resize", detectDevTools);
        if (darkModeMediaQuery.removeEventListener) {
          darkModeMediaQuery.removeEventListener("change", handleThemeChange);
        } else {
          darkModeMediaQuery.removeListener(handleThemeChange);
        }
      };
    }

    return () => {
      if (darkModeMediaQuery.removeEventListener) {
        darkModeMediaQuery.removeEventListener("change", handleThemeChange);
      } else {
        darkModeMediaQuery.removeListener(handleThemeChange);
      }
    };
  }, []);

  return null;
}
