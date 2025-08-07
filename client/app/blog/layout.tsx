// components/layout/DashboardLayout.tsx
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className={"min-h-screen bg-neutral-50"}>{children}</div>;
}
