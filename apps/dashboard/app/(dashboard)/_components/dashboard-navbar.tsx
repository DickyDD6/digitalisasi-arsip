import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";

export const DashboardNavbar = () => {
  return (
    <nav className="z-10 grid grid-cols-[1fr_auto_1fr] w-full p-2 shadow-sm bg-card sticky top-0">
      <div className="w-full">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-2">
            <Image
              src={"/img/logo-univ.png"}
              alt="logo-universitas-pasundan"
              width={40}
              height={40}
              className="size-6 md:size-8"
            />
            <Image
              src={"/img/logo-ft.png"}
              alt="logo-fakultas-teknik"
              width={40}
              height={40}
              className="size-6 md:size-8"
            />
            <div className="flex flex-col justify-center">
              <h1 className="text-base font-semibold md:text-xl">
                Digital Arsip
              </h1>
              <p className="text-xs text-muted-foreground">
                Fakultas Teknik Universitas Pasundan
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="items-center hidden gap-4 md:flex">
				<SearchInput withCommand />
				<NotificationsDropdown />
			</div> */}
    </nav>
  );
};
