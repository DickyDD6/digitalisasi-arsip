export const USER_STATUS = {
	ACTIVE: "AKTIF",
	NON_ACTIVE: "NON-AKTIF",
} as const;

export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];
