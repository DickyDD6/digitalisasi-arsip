"use client";

import {
	PageActions,
	PageDescription,
	PageHeader,
	PageTitle,
} from "@/shared/components/page-header";
import { Button } from "@repo/ui/components/button";
import React from "react";
import { useEditProfileMeStore } from "../widgets/edit-profile-me";

export const ProfileMeHeader = () => {
	const editProfileMe = useEditProfileMeStore((state) => state.editProfileMe);
	const toggleEditProfileMe = useEditProfileMeStore(
		(state) => state.toggleEditProfileMe,
	);

	return (
		<PageHeader>
			<PageTitle>Profile</PageTitle>
			<PageDescription>Kelola Informasi Profile Anda</PageDescription>
			<PageActions className="space-x-2">
				<Button
					type="button"
					variant={editProfileMe ? "outline" : "default"}
					onClick={() => toggleEditProfileMe()}
				>
					{editProfileMe ? "Cancel" : "Edit Profile"}
				</Button>
				{editProfileMe && (
					<Button form="profile-form" type="submit">
						Simpan Perubahan
					</Button>
				)}
			</PageActions>
		</PageHeader>
	);
};
