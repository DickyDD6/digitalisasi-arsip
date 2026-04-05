import {
  PageHeader,
  PageTitle,
  PageDescription,
} from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Clock, KeyRound, Shield } from "lucide-react";

export default function ChangePasswordPage() {
  return (
    <>
      <PageHeader>
        <PageTitle>Ubah Password</PageTitle>
        <PageDescription>
          Perbarui password Anda secara berkala untuk menjaga keamanan akun
          Anda.
        </PageDescription>
      </PageHeader>

      <div className="grid grid-cols-[1fr_auto] gap-4">
        <Card>
          <CardContent>
            {/* TODO: pindah ke logic form untuk menggunakan field context dan component Password */}
            <Field>
              <FieldLabel>
                Password Lama <span className="text-red-500">*</span>
              </FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <KeyRound className="size-4" />
                </InputGroupAddon>
                <InputGroupInput placeholder="Masukkan password lama" />
              </InputGroup>
            </Field>
            <Field>
              <FieldLabel>
                Password Baru <span className="text-red-500">*</span>
              </FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <KeyRound className="size-4" />
                </InputGroupAddon>
                <InputGroupInput placeholder="Masukkan password baru" />
              </InputGroup>
            </Field>
            <Field>
              <FieldLabel>
                Konfirmasi Password Baru <span className="text-red-500">*</span>
              </FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <KeyRound className="size-4" />
                </InputGroupAddon>
                <InputGroupInput placeholder="Konfirmasi password baru" />
              </InputGroup>
            </Field>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button variant="outline">Reset</Button>
            <Button>Ubah Password</Button>
          </CardFooter>
        </Card>

        <div className="grid grid-rows-2 gap-4">
          <Card>
            <CardHeader>
              <div className="flex gap-2 items-center">
                <Shield className="size-4" />
                <CardTitle>Syarat Password</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1">
                <li>Password minimal 8 karakter</li>
                <li>Mengandung huruf besar dan kecil</li>
                <li>Mengandung angka dan simbol</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex gap-2 items-center">
                <Clock className="size-4" />
                <CardTitle>Riwayat Password</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Terakhir Diubah:</p>
              <p className="font-medium">15 Desember 2023</p>
              <p className="text-xs text-muted-foreground">
                (23 hari yang lalu)
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
