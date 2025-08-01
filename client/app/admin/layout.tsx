// components/layout/DashboardLayout.tsx
import React from "react";
import HeaderAdmin from "./_components/header-admin/header-admin";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={"min-h-screen bg-neutral-100"}>
      <HeaderAdmin isArticle={false} />
      <main className="flex flex-col flex-1 justify-center items-center p-6 pt-[80px]">
        {children}
      </main>
    </div>
  );
}
