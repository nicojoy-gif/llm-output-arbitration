import {
  BarChart3,
  BookOpenCheck,
  History,
  LayoutDashboard,
  PlayCircle,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  description: string;
}

export const NAV_ITEMS: readonly NavItem[] = [
  {
    title: "Overview",
    href: "/",
    icon: LayoutDashboard,
    description: "Arbitration activity and model summary",
  },
  {
    title: "Run Evaluation",
    href: "/evaluate",
    icon: PlayCircle,
    description: "Compare model responses on a benchmark question",
  },
  {
    title: "Evaluation History",
    href: "/history",
    icon: History,
    description: "Logged arbitration decisions",
  },
  {
    title: "Model Analytics",
    href: "/analytics",
    icon: BarChart3,
    description: "Historical model performance",
  },
  {
    title: "Evaluation Rubric",
    href: "/rubric",
    icon: BookOpenCheck,
    description: "How the arbitration engine scores and selects",
  },
];

export function getNavItem(pathname: string): NavItem | undefined {
  return NAV_ITEMS.find((item) =>
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href),
  );
}
