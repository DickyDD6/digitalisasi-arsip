import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function Unauthorized() {
  return (
    <div className="min-h-screen place-content-center place-items-center">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-destructive font-bold text-4xl">
            401
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <CardDescription className="text-center">
            Tidak Terautentikasai - Anda harus login untuk mengakses halaman
            ini.
          </CardDescription>
          <Link href="/login">
            <Button className="w-full">Login</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
