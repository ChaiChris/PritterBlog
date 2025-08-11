import React from "react";
import HeaderAdmin from "./_components/header-admin/header-admin";
import NavigationBarAdmin from "./_components/navigation-bar/navigation-bar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={"min-h-screen"}>
      {/* <HeaderAdmin /> */}
      <main className="flex flex-col flex-1 justify-center items-center p-6 pt-[80px]">
        <div className="flex flex-col gap-6 ">
          <NavigationBarAdmin />
        </div>
        {children}
      </main>
    </div>
  );
}
