import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@repo/ui/field";
import {
  SelectContent,
  SelectItem,
  Select as SelectPrimitive,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { ReactNode } from "react";
import { useFieldContext } from "../form-context";
import { InputGroup, InputGroupAddon } from "@repo/ui/input-group";

export const Select = ({
  label,
  description,
  icon,
  icons,
  placeholder,
  options,
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
  options: { value: string; label: string }[];
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

        <SelectPrimitive
          value={field.state.value}
          onValueChange={(val) => field.handleChange(val as string)}
        >
          <SelectTrigger className="w-full border-0 shadow-none">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </SelectPrimitive>

        {rightAddon && (
          <InputGroupAddon align={"inline-end"}>{rightAddon}</InputGroupAddon>
        )}
      </InputGroup>
      {description && <FieldDescription>{description}</FieldDescription>}
      {!field.state.meta.isValid && (
        <FieldError errors={field.state.meta.errors} />
      )}
    </Field>
  );
};
