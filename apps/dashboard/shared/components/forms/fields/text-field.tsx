import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import React, { ReactNode } from "react";
import { useFieldContext } from "../form-context";

export const TextField = ({
  label,
  description,
  icon,
  icons,
  placeholder,
  type = "text",
  autoComplete = "off",
}: {
  label: string;
  description?: string;
  icon?: {
    side: "left" | "right";
    element: ReactNode;
  };
  icons?: {
    left?: ReactNode;
    right?: ReactNode;
  };
  placeholder?: string;
  type?: string;
  autoComplete?: string;
}) => {
  const field = useFieldContext<string>();
  const leftAddon =
    icons?.left || (icon?.side === "left" ? icon.element : null);
  const rightAddon =
    icons?.right || (icon?.side === "right" ? icon.element : null);

  return (
    <Field data-invalid={!field.state.meta.isValid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <InputGroup>
        {leftAddon && <InputGroupAddon>{leftAddon}</InputGroupAddon>}
        <InputGroupInput
          id={field.name}
          value={field.state.value || ""}
          onChange={(e) => field.handleChange(e.target.value)}
          aria-invalid={!field.state.meta.isValid}
          onBlur={field.handleBlur}
          placeholder={placeholder}
          type={type}
          autoComplete={autoComplete}
        />
        {rightAddon && <InputGroupAddon>{rightAddon}</InputGroupAddon>}
      </InputGroup>
      {description && <FieldDescription>{description}</FieldDescription>}
      {!field.state.meta.isValid && (
        <FieldError errors={field.state.meta.errors} />
      )}
    </Field>
  );
};
