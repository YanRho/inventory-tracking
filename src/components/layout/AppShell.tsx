"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AppHeader } from "./AppHeader";
import { BottomNav } from "./BottomNav";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isImmersive = pathname.startsWith("/scan");

  if (isImmersive) {
    return <div className="app-shell">{children}</div>;
  }

  return (
    <div className="app-shell">
      <AppHeader />
      <main className="app-main">{children}</main>
      <BottomNav />
    </div>
  );
}
