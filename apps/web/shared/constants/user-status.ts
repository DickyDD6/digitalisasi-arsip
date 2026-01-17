export const UserStatus = {
	ACTIVE: "ACTIVE",
	NONACTIVE: "NON-ACTIVE",
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];
