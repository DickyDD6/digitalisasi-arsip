import z from "zod";

export const zodValidator = <T extends z.ZodTypeAny>(
	value: unknown,
	schema: T,
) => {
	const result = schema.safeParse(value);

	if (result.success) {
		return;
	}

	return result.error?.flatten().fieldErrors;
};
