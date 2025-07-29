// components/layout/DashboardLayout.tsx
import React from "react";
import { clsx } from "clsx";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={"flex min-h-screen"}>
      <main className="flex flex-col flex-1 justify-center items-center ">
        <div className="flex">{children}</div>
      </main>
    </div>
  );
}
