"use client";

import { differenceInSeconds, formatDistanceStrict } from "date-fns";
import { id } from "date-fns/locale";
import { useCallback, useEffect, useState } from "react";

export const useTimeAgo = (opts?: { interval: number }) => {
  const [now, setNow] = useState<number>(() => Date.now());
  const [withSeconds, setWithSeconds] = useState<boolean>(false);

  useEffect(() => {
    const intervalMs = withSeconds ? 1000 : (opts?.interval ?? 60_000);

    const interval = setInterval(() => {
      setNow(Date.now());
    }, intervalMs);

    return () => clearInterval(interval);
  }, [opts?.interval, withSeconds]);

  const timeAgo = useCallback(
    (time: Date | undefined, opts?: { withSeconds: boolean }) => {
      if (!time) return;

      if (opts?.withSeconds && !withSeconds) {
        setWithSeconds(true);
      }

      if (opts?.withSeconds) {
        const diffSec = differenceInSeconds(time, now);
        const absSec = Math.abs(diffSec);
        const minutes = Math.floor(absSec / 60);
        const seconds = absSec % 60;

        const label =
          minutes > 0
            ? `${minutes} menit ${seconds} detik`
            : `${seconds} detik`;

        return diffSec > 0 ? `dalam waktu ${label}` : `${label} yang lalu`;
      }

      return formatDistanceStrict(time, now, {
        addSuffix: true,
        locale: id,
      });
    },
    [now, withSeconds],
  );

  return { timeAgo, now };
};
