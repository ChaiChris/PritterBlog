// components/layout/DashboardLayout.tsx
import React from "react";
import styles from "./_styles/login.module.scss";
import { clsx } from "clsx";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={clsx(styles.login_bg, "flex flex-col min-h-screen")}>
      <header className="w-full flex justify-center items-center">
        <div className="max-w-180 w-full text-center p-6">
          <h1 className="text-2xl font-bold text-zinc-700/70">Pritter Blog</h1>
        </div>
      </header>
      <main className="flex flex-col flex-1 justify-center items-center px-4">
        <div className="w-full max-w-md">{children}</div>
      </main>
      <div className="w-full flex justify-center items-center">
        <footer className="max-w-180 w-full text-sm text-gray-700 p-6 pt-10 border-t flex justify-between items-top">
          <div className="left-side flex flex-col gap-2">
            <div className="font-bold text-lg text-zinc-700">Pritter Blog</div>
            <div className="text-zinc-700">@2025</div>
          </div>
          <div className="right-side flex flex-col gap-2">
            <div className="text-zinc-700 text-shadow-md">+886 00000000000</div>
            <div className="text-zinc-700">service@pritter.com</div>
          </div>
        </footer>
      </div>
    </div>
  );
}
