"use client";

import { Button } from "@repo/ui/button";
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
import generator from "generate-password";
import { Check, Copy, Eye, EyeOff, PencilLine, RefreshCw } from "lucide-react";
import React, { ReactNode, useEffect, useState } from "react";
import { useFieldContext } from "../form-context";

export const PasswordGenerate = ({
  label,
  description,
  icon,
  icons,
  placeholder,
  type = "password",
  autoComplete = "off",
  mode = "edit",
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
  mode?: "edit" | "add";
}) => {
  const [showPassword, setShowPassword] = React.useState(true);
  const [resetPass, setResetPass] = useState<boolean>(() => {
    if (mode === "add") {
      return true;
    } else {
      return false;
    }
  });
  const [password, setPassword] = useState<"manual" | "generated">("generated");
  const [copied, setCopied] = useState<boolean>(false);
  const field = useFieldContext<string>();

  const generatePassword = generator.generate({
    length: 16,
    numbers: true,
    lowercase: true,
    uppercase: true,
    symbols: true,
    strict: true,
    excludeSimilarCharacters: true,
  });
  const [randomPass, setRandomPass] = useState<string>(generatePassword);

  const leftAddon =
    icons?.left || (icon?.side === "left" ? icon.element : null);
  const rightAddon =
    icons?.right || (icon?.side === "right" ? icon.element : null);

  const handleCopyPassword = async () => {
    if (!randomPass) return;

    await navigator.clipboard.writeText(randomPass);
    setCopied(true);

    setTimeout(() => setCopied(false), 1500);
  };

  useEffect(() => {
    if (!randomPass) return;

    field.handleChange(randomPass);
  }, [randomPass, field]);

  return (
    <Field data-invalid={!field.state.meta.isValid}>
      <Field orientation="horizontal">
        <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
        {resetPass && (
          <Button
            type="button"
            variant={"link"}
            onClick={() => {
              if (password !== "manual") {
                field.handleChange("");
                setRandomPass("");
              } else {
                setRandomPass(generatePassword);
              }
              setPassword((prev) =>
                prev === "generated" ? "manual" : "generated",
              );
            }}
          >
            {password === "generated" ? (
              <>
                <PencilLine /> Masukkan Kata Sandi Manual
              </>
            ) : (
              <>
                <RefreshCw /> Auto-Generate Kata Sandi
              </>
            )}
          </Button>
        )}
      </Field>

      <Field>
        <InputGroup>
          {leftAddon && <InputGroupAddon>{leftAddon}</InputGroupAddon>}
          <InputGroupInput
            id={field.name}
            disabled={!resetPass}
            value={field.state.value || ""}
            onChange={(e) => field.handleChange(e.target.value)}
            aria-invalid={!field.state.meta.isValid}
            onBlur={field.handleBlur}
            placeholder={
              resetPass ? placeholder : "Kata sandi tidak dapat dilihat"
            }
            readOnly={mode === "edit" ? !resetPass : false}
            type={resetPass && showPassword ? "text" : type}
            autoComplete={autoComplete}
          />
          {rightAddon && (
            <InputGroupAddon align={"inline-end"}>{rightAddon}</InputGroupAddon>
          )}
          {resetPass && (
            <InputGroupAddon align={"inline-end"}>
              <Button
                type="button"
                variant={"ghost"}
                size={"icon"}
                onClick={handleCopyPassword}
              >
                {copied ? <Check className="text-green-600" /> : <Copy />}
              </Button>
            </InputGroupAddon>
          )}
          {resetPass && password === "generated" && (
            <InputGroupAddon align={"inline-end"}>
              <Button
                type="button"
                variant={"ghost"}
                size={"icon"}
                onClick={() => setRandomPass(generatePassword)}
              >
                <RefreshCw />
              </Button>
            </InputGroupAddon>
          )}
          {resetPass && (
            <InputGroupAddon align={"inline-end"}>
              <InputGroupButton
                size={"icon-sm"}
                variant="ghost"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>
        {mode === "edit" && !resetPass && (
          <span className="text-sm text-muted-foreground">
            Kata sandi tidak ditampilkan oleh pengguna lain demi keamanan. Klik
            &apos;Reset Kata Sandi&apos; jika ingin mengubah.
          </span>
        )}
        {mode === "add" ? null : !resetPass ? (
          <Button
            onClick={() => {
              setRandomPass(generatePassword);
              setPassword("generated");
              setResetPass(!resetPass);
            }}
          >
            Reset Kata Sandi
          </Button>
        ) : (
          <Button
            onClick={() => {
              setRandomPass("");
              field.handleChange("");
              setPassword("generated");
              setResetPass(!resetPass);
            }}
          >
            Batal Reset Kata Sandi
          </Button>
        )}
      </Field>

      {description && <FieldDescription>{description}</FieldDescription>}
      {!field.state.meta.isValid && (
        <FieldError errors={field.state.meta.errors} />
      )}
    </Field>
  );
};
