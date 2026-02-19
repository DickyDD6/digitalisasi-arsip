import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Image from "next/image";
import { LoginForm } from "./login-form";

export const LoginCard = () => {
  return (
    <Card className="w-full lg:w-300 py-0 overflow-hidden lg:grid lg:grid-cols-2">
      <div className="bg-[url('/img/login-bg-card.png')] hidden lg:block bg-cover bg-center h-150">
        <div className="bg-black/30 h-full py-6 px-4">
          <div className="flex items-center gap-2">
            <Image
              src={"/img/logo-univ.png"}
              alt="logo-universitas-pasundan"
              width={40}
              height={40}
            />
            <Image
              src={"/img/logo-ft.png"}
              alt="logo-fakultas-teknik"
              width={40}
              height={40}
            />
            <div className="flex flex-col justify-center text-primary-foreground">
              <h1 className="font-semibold text-3xl">Digital Archive</h1>
              <p className="text-primary-foreground text-xs font-light">
                Fakultas Teknik Universitas Pasundan
              </p>
            </div>
          </div>
        </div>
      </div>
      <CardContent className="space-y-5 py-6 place-content-center">
        <CardHeader className="px-0">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Masukkan Credentials Anda untuk Melanjutkan.
          </CardDescription>
        </CardHeader>
        <LoginForm />
      </CardContent>
    </Card>
  );
};
