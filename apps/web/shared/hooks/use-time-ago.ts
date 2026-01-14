"use client";

import { formatDistanceStrict } from "date-fns";
import { useCallback, useEffect, useState } from "react";

export const useTimeAgo = () => {
	const [now, setNow] = useState(Date.now());

	useEffect(() => {
		const interval = setInterval(() => {
			setNow(Date.now());
		}, 60 * 1000);

		return () => clearInterval(interval);
	}, []);

	const timeAgo = useCallback(
		(time: string) =>
			formatDistanceStrict(time, now, {
				addSuffix: true,
			}),
		[now],
	);

	return { timeAgo };
};
