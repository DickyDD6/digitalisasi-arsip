import { User } from "@/features/user";
import { UserStatus } from "@/shared/constants/user-status";
import { FormApi } from "@tanstack/react-form";

export interface UserTableEditFormData extends Omit<
	User,
	"id" | "createdAt" | "updatedAt"
> {
	password: string;
	user_status: UserStatus;
}

export interface UserTableEditFormApi<
	TFormData = UserTableEditFormData,
> extends FormApi<
	TFormData,
	any,
	any,
	any,
	any,
	any,
	any,
	any,
	any,
	any,
	any,
	any
> {}
