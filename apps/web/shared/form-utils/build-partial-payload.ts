export const buildPartialPayload = <T extends Record<string, any>>(
	value: T,
	fieldMeta: Partial<Record<keyof T, { isDirty: boolean }>>,
): Partial<T> => {
	const payload: Partial<T> = {};

	for (const key in fieldMeta) {
		if (fieldMeta[key as keyof T]?.isDirty) {
			payload[key as keyof T] = value[key as keyof T];
		}
	}

	return payload;
};
