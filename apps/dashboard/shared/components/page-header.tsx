import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@repo/ui/card";
import { findChild } from "@/shared/utils/find-children";
import { cn } from "@repo/ui/lib/utils";
import React from "react";

export const PageHeader = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const { children, ...contentProps } = props;

  return (
    <Card className="border border-border/60 bg-card/90 shadow-sm backdrop-blur">
      <CardContent
        className={cn("flex justify-between items-center p-5 sm:p-6", className)}
        {...contentProps}
      >
        <div className="space-y-1">
          {findChild(children, PageTitle)}
          {findChild(children, PageDescription)}
        </div>
        {findChild(children, PageActions)}
      </CardContent>
    </Card>
  );
};
PageHeader.displayName = "PageHeader";

export const PageTitle = ({
  className,
  ...props
}: React.ComponentProps<"div">) => (
  <CardTitle className={cn("text-xl sm:text-2xl font-bold tracking-tight text-foreground", className)} {...props} />
);
PageTitle.displayName = "PageTitle";

export const PageDescription = ({
  className,
  ...props
}: React.ComponentProps<"div">) => (
  <CardDescription className={cn("text-xs sm:text-sm text-muted-foreground pt-0.5", className)} {...props} />
);
PageDescription.displayName = "PageDescription";

export const PageActions = ({
  className,
  ...props
}: React.ComponentProps<"div">) => (
  <div data-slot="page-actions" className={cn("flex items-center gap-2", className)} {...props} />
);
PageActions.displayName = "PageActions";
