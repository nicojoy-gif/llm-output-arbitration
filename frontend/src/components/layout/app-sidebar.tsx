"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cpu, PanelLeftClose, PanelLeftOpen, Scale } from "lucide-react";

import { APP_NAME, APP_TAGLINE, APP_VERSION } from "@/constants/app";
import { NAV_ITEMS, getNavItem } from "@/constants/navigation";
import { StatusDot, useConnectionState } from "@/components/layout/backend-status";
import { cn } from "@/lib/utils";

interface SidebarContentProps {
  collapsed?: boolean;
  onNavigate?: () => void;
}

export function SidebarBrand({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sidebar">
        <Scale className="size-4" strokeWidth={2.25} />
      </div>
      {!collapsed && (
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-sidebar-accent-foreground">{APP_NAME}</p>
          <p className="truncate text-[11px] text-sidebar-muted">{APP_TAGLINE}</p>
        </div>
      )}
    </div>
  );
}

export function SidebarNav({ collapsed = false, onNavigate }: SidebarContentProps) {
  const pathname = usePathname();
  const active = getNavItem(pathname);

  return (
    <nav aria-label="Main" className="flex flex-col gap-0.5">
      {NAV_ITEMS.map((item) => {
        const isActive = active?.href === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            title={collapsed ? item.title : undefined}
            className={cn(
              "group flex h-9 items-center gap-3 rounded-md px-2.5 text-sm font-medium text-sidebar-muted transition-colors outline-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-primary",
              isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
              collapsed && "justify-center px-0",
            )}
          >
            <Icon
              className={cn("size-4 shrink-0", isActive && "text-sidebar-primary")}
              aria-hidden
            />
            {collapsed ? <span className="sr-only">{item.title}</span> : <span>{item.title}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

export function SidebarFooter({ collapsed = false }: { collapsed?: boolean }) {
  const state = useConnectionState();
  const label =
    state === "online" ? "Connected" : state === "offline" ? "Disconnected" : "Checking…";

  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-3 py-1" title={`Backend: ${label}`}>
        <Cpu className="size-4 text-sidebar-muted" aria-label="Local inference via Ollama" />
        <StatusDot state={state} />
      </div>
    );
  }

  return (
    <div className="space-y-2.5 rounded-md border border-sidebar-border p-3 text-xs">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 text-sidebar-muted">
          <Cpu className="size-3.5" aria-hidden />
          Inference
        </span>
        <span className="font-medium text-sidebar-foreground">Local · Ollama</span>
      </div>
      <div className="flex items-center justify-between gap-2" role="status" aria-live="polite">
        <span className="flex items-center gap-2 text-sidebar-muted">
          <StatusDot state={state} />
          Backend
        </span>
        <span className="font-medium text-sidebar-foreground">{label}</span>
      </div>
      <div className="flex items-center justify-between gap-2 text-sidebar-muted">
        <span>Version</span>
        <span className="font-mono text-sidebar-foreground">v{APP_VERSION}</span>
      </div>
    </div>
  );
}

export function AppSidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-svh shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 md:flex",
        collapsed ? "w-16" : "w-60",
      )}
    >
      <div className={cn("flex h-14 items-center border-b border-sidebar-border", collapsed ? "justify-center px-2" : "px-4")}>
        <SidebarBrand collapsed={collapsed} />
      </div>
      <div className={cn("flex-1 overflow-y-auto py-4", collapsed ? "px-2" : "px-3")}>
        {!collapsed && (
          <p className="mb-2 px-2.5 text-[11px] font-medium uppercase tracking-wider text-sidebar-muted/80">
            Workspace
          </p>
        )}
        <SidebarNav collapsed={collapsed} />
      </div>
      <div className={cn("space-y-2 border-t border-sidebar-border", collapsed ? "p-2" : "p-3")}>
        <SidebarFooter collapsed={collapsed} />
        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "flex h-8 w-full cursor-pointer items-center gap-2 rounded-md px-2.5 text-xs text-sidebar-muted outline-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-primary",
            collapsed && "justify-center px-0",
          )}
        >
          {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
