import {
  PageActions,
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/components/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  Mail,
  Phone,
  School,
  Shield,
  UserCircle,
  UserRound,
} from "lucide-react";

export default function ProfilePage() {
  return (
    <>
      <PageHeader>
        <PageTitle>Profil Saya</PageTitle>
        <PageDescription>Kelola informasi profil Anda</PageDescription>
        <PageActions>
          <Button>Edit Profil</Button>
        </PageActions>
      </PageHeader>

      <Card className="pt-0 overflow-hidden">
        <CardHeader className="bg-primary text-primary-foreground border-b-0">
          <div className="flex items-center gap-4">
            <UserCircle />
            <div className="grid">
              <p className="font-medium">John Doe</p>
              <p className="text-sm">Manajer</p>
              <p className="text-xs font-light">Fakultas Teknik</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="font-medium">Informasi Personal</p>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Nama Lengkap</FieldLabel>
              <FieldContent>
                <InputGroup>
                  <InputGroupAddon>
                    <UserRound className="size-4" />
                  </InputGroupAddon>
                  <InputGroupInput value={"Jhon Doe"} readOnly />
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
                  <InputGroupInput value={"john.doe@example.com"} readOnly />
                </InputGroup>
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>No. Telepon</FieldLabel>
              <FieldContent>
                <InputGroup>
                  <InputGroupAddon>
                    <Phone className="size-4" />
                  </InputGroupAddon>
                  <InputGroupInput value={"08123456789"} readOnly />
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

          <div className="grid gap-2 bg-neutral-200 p-2 rounded-md">
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground">Role:</p>
              <Badge>Manajer</Badge>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground">Hak Akses:</p>
              <p className="font-medium">Akses Penuh - Supervisor</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground">Status Akun:</p>
              <p className="font-medium">Aktif</p>
            </div>
          </div>

          <Separator />

          <p className="font-medium">Aktivitas Akun</p>
          <div className="grid grid-cols-2 gap-4 bg-neutral-200 p-2 rounded-md">
            <div className="grid">
              <div className="flex items-center gap-2">
                <Calendar className="size-4" />
                <p className="text-sm text-muted-foreground">
                  Bergabung sejak:
                </p>
              </div>
              <p className="font-medium">1 Januari 2026</p>
            </div>

            <div className="grid">
              <div className="flex items-center gap-2">
                <Clock className="size-4" />
                <p className="text-sm text-muted-foreground">Terakhir Login:</p>
              </div>
              <p className="font-medium">10 Juni 2026, 14:30</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert className="bg-blue-100 text-blue-600">
        <Shield />
        <AlertTitle>Informasi Keamaman</AlertTitle>
        <AlertDescription className="text-inherit font-light">
          Email dan fakultas tidak dapat diubah sendiri. Hubungi administrator
          sistem untuk perubahan data tersebut.
        </AlertDescription>
      </Alert>
    </>
  );
}
