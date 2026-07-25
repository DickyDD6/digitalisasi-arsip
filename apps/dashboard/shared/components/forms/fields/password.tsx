"use client";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@repo/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@repo/ui/input-group";
import { Eye, EyeOff } from "lucide-react";
import React, { ReactNode } from "react";
import { useFieldContext } from "../form-context";

export const Password = ({
  label,
  description,
  icon,
  icons,
  placeholder,
  type = "password",
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
  const [showPassword, setShowPassword] = React.useState(false);
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
          type={showPassword ? "text" : type}
          autoComplete={autoComplete}
        />
        {rightAddon && (
          <InputGroupAddon align={"inline-end"}>{rightAddon}</InputGroupAddon>
        )}
        <InputGroupAddon align={"inline-end"}>
          <InputGroupButton
            size={"icon-sm"}
            variant="ghost"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      {description && <FieldDescription>{description}</FieldDescription>}
      {!field.state.meta.isValid && (
        <FieldError errors={field.state.meta.errors} />
      )}
    </Field>
  );
};
