import { withForm } from "@/components/forms/form-context";
import { ROLE } from "@/constants/role";
import { USER_SCHEMA } from "@/schemas/user.schema";
import { formOptions, revalidateLogic } from "@tanstack/react-form-nextjs";
import {
  KeyRound,
  Mail,
  UserRound,
  UserRoundCog,
  UserRoundKey,
} from "lucide-react";

export const AddUserFormOpts = formOptions({
  defaultValues: {
    name: "",
    email: "",
    password: "",
    nip: "",
    role: ROLE.SBAP,
  },
  validationLogic: revalidateLogic(),
  validators: {
    onDynamic: USER_SCHEMA.user,
  },
});

export const AddUserForm = withForm({
  ...AddUserFormOpts,
  render: ({ form }) => (
    <>
      <form.AppField name="name">
        {(field) => (
          <field.TextField
            label="Nama Pengguna"
            placeholder="Masukkan Nama Pengguna"
            icon={{ side: "left", element: <UserRound /> }}
          />
        )}
      </form.AppField>
      <form.AppField name="email">
        {(field) => (
          <>
            <field.TextField
              label="Email Pengguna"
              placeholder="Masukkan Email Pengguna"
              icon={{ side: "left", element: <Mail /> }}
            />
          </>
        )}
      </form.AppField>
      <form.AppField name="password">
        {(field) => (
          <field.PasswordGenerate
            label="Kata Sandi Pengguna"
            placeholder="Masukkan Kata Sandi Pengguna"
            icon={{ side: "left", element: <KeyRound /> }}
            mode={"add"}
          />
        )}
      </form.AppField>
      <form.AppField name="nip">
        {(field) => (
          <field.NumberField
            label="NIP"
            placeholder="Masukkan NIP"
            icon={{ side: "left", element: <UserRoundKey /> }}
          />
        )}
      </form.AppField>
      <form.AppField name="role">
        {(field) => (
          <field.Select
            label="Role"
            placeholder="Masukkan Role"
            icon={{ side: "left", element: <UserRoundCog /> }}
            options={Object.entries(ROLE)
              .filter(([, value]) => value !== ROLE.MANAGER)
              .map(([label, value]) => ({
                value,
                label,
              }))}
          />
        )}
      </form.AppField>
    </>
  ),
});
