"use client";

import {
  PageHeader,
  PageTitle,
  PageDescription,
} from "@/shared/components/page-header";
import { Alert, AlertDescription, AlertTitle } from "@repo/ui/alert";
import { Badge } from "@repo/ui/badge";
import { Card, CardContent, CardHeader } from "@repo/ui/card";
import { Field, FieldContent, FieldLabel } from "@repo/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@repo/ui/input-group";
import { Separator } from "@repo/ui/separator";
import { authQueries } from "@/features/auth/queries/auth.queries";
import { useQuery } from "@tanstack/react-query";
import {
  Mail,
  School,
  Shield,
  UserCircle,
  UserRound,
} from "lucide-react";

const ROLE_LABELS: Record<string, string> = {
  manager: "Manager Arsip",
  qc: "Tim Quality Control",
  uploader: "Tim Uploader",
  sbap: "Staff Biro Akademik",
};

export default function ProfilePage() {
  const { data: user } = useQuery(authQueries.userMe());

  const userName = user?.name ?? "User";
  const userEmail = user?.email ?? "";
  const roleLabel = user?.role ? ROLE_LABELS[user.role] ?? user.role : "User";

  return (
    <>
      <PageHeader>
        <PageTitle>Profil Saya</PageTitle>
        <PageDescription>Kelola informasi profil Anda</PageDescription>
      </PageHeader>

      <Card className="pt-0 overflow-hidden">
        <CardHeader className="bg-primary text-primary-foreground border-b-0">
          <div className="flex items-center gap-4">
            <UserCircle className="size-12" />
            <div className="grid">
              <p className="font-semibold text-lg">{userName}</p>
              <p className="text-sm opacity-90">{roleLabel}</p>
              <p className="text-xs font-light opacity-75">Fakultas Teknik</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <p className="font-medium">Informasi Personal</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Nama Lengkap</FieldLabel>
              <FieldContent>
                <InputGroup>
                  <InputGroupAddon>
                    <UserRound className="size-4" />
                  </InputGroupAddon>
                  <InputGroupInput value={userName} readOnly />
                </InputGroup>
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <FieldContent>
                <InputGroup>
                  <InputGroupAddon>
                    <Mail className="size-4" />
                  </InputGroupAddon>
                  <InputGroupInput value={userEmail} readOnly />
                </InputGroup>
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Fakultas</FieldLabel>
              <FieldContent>
                <InputGroup>
                  <InputGroupAddon>
                    <School className="size-4" />
                  </InputGroupAddon>
                  <InputGroupInput value={"Fakultas Teknik"} readOnly />
                </InputGroup>
              </FieldContent>
            </Field>
          </div>

          <Separator />

          <div className="grid gap-2 bg-muted p-4 rounded-md">
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground text-sm">Role:</p>
              <Badge variant="outline">{roleLabel}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground text-sm">Status Akun:</p>
              <p className="font-medium text-sm text-green-600">Aktif</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert className="bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-900 dark:text-blue-200">
        <Shield className="size-4 text-blue-600 dark:text-blue-400" />
        <AlertTitle>Informasi Keamanan</AlertTitle>
        <AlertDescription className="text-inherit font-light">
          Email dan fakultas tidak dapat diubah sendiri. Hubungi administrator sistem untuk perubahan data tersebut.
        </AlertDescription>
      </Alert>
    </>
  );
}
