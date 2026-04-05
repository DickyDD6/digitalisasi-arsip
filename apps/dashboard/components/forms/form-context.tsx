import {
  createFormHook,
  createFormHookContexts,
} from "@tanstack/react-form-nextjs";
import { Password } from "./fields/password";
import { PasswordGenerate } from "./fields/pasword-generate";
import { Select } from "./fields/select";
import { TextField } from "./fields/text-field";
import { SubmitButton } from "./fields/submit-button";
import { NumberField } from "./fields/number-field";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    Password,
    PasswordGenerate,
    Select,
    NumberField,
  },
  formComponents: {
    SubmitButton,
  },
});
