"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Menu } from "lucide-react";

import { APP_NAME } from "@/constants/app";
import { getNavItem } from "@/constants/navigation";
import { BackendStatus } from "@/components/layout/backend-status";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";

export function AppHeader({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  const pathname = usePathname();
  const current = getNavItem(pathname);
  const title = current?.title ?? "Not found";

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b bg-background/85 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/70 md:px-6">
      <Button
        variant="ghost"
        size="icon-sm"
        className="md:hidden"
        onClick={onOpenMobileNav}
        aria-label="Open navigation"
      >
        <Menu />
      </Button>

      <div className="min-w-0 flex-1">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-foreground">
                {APP_NAME}
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="size-3" />
            </li>
            <li aria-current="page" className="truncate text-foreground">
              {title}
            </li>
          </ol>
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden sm:block">
          <BackendStatus />
        </div>
        <div className="sm:hidden">
          <BackendStatus variant="plain" showLabel={false} />
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
