"use client";

import { Eye, EyeClosed, KeyRound } from "lucide-react";
import * as React from "react";
import { Button } from "./button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";

export const InputPassword = (
  props: React.ComponentProps<"input"> & {
    addon?: React.ReactNode;
  },
) => {
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  return (
    <InputGroup>
      <InputGroupAddon>
        <KeyRound />
      </InputGroupAddon>
      <InputGroupInput type={showPassword ? "text" : "password"} {...props} />
      <InputGroupAddon align={"inline-end"}>
        <Button
          type="button"
          variant={"ghost"}
          size={"icon"}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <Eye /> : <EyeClosed />}
        </Button>
      </InputGroupAddon>
      {props.addon}
    </InputGroup>
  );
};
