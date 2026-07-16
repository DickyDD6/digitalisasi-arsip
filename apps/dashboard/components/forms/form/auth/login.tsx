import { AUTH_SCHEMA } from "@/schemas/auth.schema";
import { KeyRound, UserRound } from "lucide-react";
import { formOptions } from "@tanstack/react-form-nextjs";
import { withForm } from "../../form-context";

export const loginFormOptions = formOptions({
  defaultValues: {
    email: "",
    password: "",
  },
  validators: {
    onDynamic: AUTH_SCHEMA.login,
  },
});

export const LoginForm = withForm({
  ...loginFormOptions,
  render: ({ form }) => (
    <>
      <form.AppField name="email">
        {(field) => (
          <field.TextField
            label="Email"
            placeholder="Masukkan Email"
            icon={{ side: "left", element: <UserRound /> }}
          />
        )}
      </form.AppField>
      <form.AppField name="password">
        {(field) => (
          <field.Password
            label="Kata Sandi"
            placeholder="Masukkan Kata Sandi"
            icon={{ side: "left", element: <KeyRound /> }}
          />
        )}
      </form.AppField>
    </>
  ),
});
