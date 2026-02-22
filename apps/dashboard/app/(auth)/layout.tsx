import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookie = (await cookies())
    .getAll()
    .find((c) => c.name.endsWith("session") || c.name.endsWith("TOKEN"))?.value;

  if (cookie) {
    redirect("/");
  }

  return (
    <div className="min-h-screen place-items-center place-content-center">
      {children}
    </div>
  );
}
