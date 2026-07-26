"use client";

import { Button } from "@repo/ui/button";
import { useFormContext } from "../form-context";
import { Loader2 } from "lucide-react";

export const SubmitButton = ({ label }: { label?: string }) => {
  const form = useFormContext();

  return (
    <form.Subscribe
      selector={(state) => ({
        canSubmit: state.canSubmit,
        isSubmitting: state.isSubmitting,
      })}
    >
      {({ canSubmit, isSubmitting }) => (
        <Button
          disabled={!canSubmit || isSubmitting}
          onClick={async () => await form.handleSubmit()}
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin duration-300" />
          ) : (
            label || "Submit"
          )}
        </Button>
      )}
    </form.Subscribe>
  );
};
