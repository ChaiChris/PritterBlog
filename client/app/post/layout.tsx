// components/layout/DashboardLayout.tsx
import React from "react";
import Header from "@/components/layout/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={"min-h-screen bg-neutral-100"}>
      <Header isArticle={true} />
      <main className="flex flex-col flex-1 justify-center items-center p-6 pt-[80px]">
        {children}
      </main>
    </div>
  );
}
