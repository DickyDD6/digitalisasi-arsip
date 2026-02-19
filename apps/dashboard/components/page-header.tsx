import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { findChild } from "@/lib/find-children";
import { cn } from "@/lib/utils";
import React from "react";

export const PageHeader = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const { children, ...contentProps } = props;

  return (
    <Card>
      <CardContent
        className={cn("flex justify-between", className)}
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
  <CardTitle className={className} {...props} />
);
PageTitle.displayName = "PageTitle";

export const PageDescription = ({
  className,
  ...props
}: React.ComponentProps<"div">) => (
  <CardDescription className={className} {...props} />
);
PageDescription.displayName = "PageDescription";

export const PageActions = ({
  className,
  ...props
}: React.ComponentProps<"div">) => (
  <div data-slot="page-actions" className={className} {...props} />
);
PageActions.displayName = "PageActions";
