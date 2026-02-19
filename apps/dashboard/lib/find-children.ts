import React from "react";

export const findChild = (
  children: React.ReactNode,
  type: React.FC | string,
) => {
  return React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type === type,
  );
};
