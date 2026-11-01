import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useSyncExternalStore } from "react";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  Users,
  BadgePercent,
  ScanLine,
  Receipt,
  UserPlus,
  CalendarDays,
  Dumbbell,
  BarChart3,
  Settings,
  LogOut,
  UserCog,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getSession, isOwner, logout, subscribeSession } from "@/lib/auth";

const items = [
  { to: "/", icon: LayoutDashboard, key: "dashboard" },
  { to: "/users", icon: UserCog, key: "users", ownerOnly: true },
  { to: "/members", icon: Users, key: "members" },
  { to: "/plans", icon: BadgePercent, key: "plans" },
  { to: "/checkin", icon: ScanLine, key: "checkin" },
  { to: "/billing", icon: Receipt, key: "billing" },
  { to: "/leads", icon: UserPlus, key: "leads" },
  { to: "/classes", icon: CalendarDays, key: "classes" },
  { to: "/trainers", icon: Dumbbell, key: "trainers" },
  { to: "/reports", icon: BarChart3, key: "reports" },
  { to: "/settings", icon: Settings, key: "settings" },
] as const;

export function Sidebar({ variant = "rail" }: { variant?: "rail" | "drawer" }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const session = useSyncExternalStore(subscribeSession, getSession, getSession);
  const owner = isOwner(session.user);

  function onLogout() {
    void logout();
    void navigate({ to: "/login", replace: true });
  }

  return (
    <aside
      className={cn(
        "flex flex-col bg-white/75 dark:bg-[#151622]/80 backdrop-blur-xl transition-all duration-300",
        variant === "rail"
          ? "h-full w-[240px] border-r border-white/60 dark:border-white/10 p-5 shadow-[4px_0_24px_rgba(30,40,60,0.03)] dark:shadow-none"
          : "w-full rounded-3xl border border-white/80 dark:border-white/10 p-4 shadow-sm",
      )}
    >
      <div className={cn("mb-6 flex items-center gap-3", variant === "rail" ? "px-2" : "px-1")}>
        <div className="flex size-11 items-center justify-center rounded-2xl bg-white dark:bg-white/10 shadow-sm ring-1 ring-black/5 dark:ring-white/10">
          <img src="/logo.png" alt="" className="h-8 w-auto object-contain" />
        </div>
        <div>
          <div className="text-lg font-extrabold tracking-tight text-ink">{t("app.name")}</div>
          <div className="text-xs font-semibold text-muted">Admin Console</div>
        </div>
      </div>

      <nav
        className={cn(
          "flex gap-1.5",
          variant === "rail" ? "flex-1 flex-col overflow-y-auto pr-1" : "flex-wrap",
        )}
      >
        {items
          .filter((item) => !("ownerOnly" in item && item.ownerOnly) || owner)
          .map((item) => {
            const isActive = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "relative flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-200",
                  isActive
                    ? "bg-white dark:bg-white/10 text-ink shadow-[0_4px_16px_rgba(26,27,47,0.08)] ring-1 ring-black/[0.04] dark:ring-white/10 font-bold"
                    : "text-ink-soft/80 hover:bg-white/60 dark:hover:bg-white/5 hover:text-ink",
                )}
              >
                <item.icon
                  className={cn(
                    "size-4.5 transition-colors",
                    isActive ? "text-teal font-bold" : "text-muted"
                  )}
                />
                <span>{t(`nav.${item.key}`)}</span>
                {isActive && (
                  <span className="ml-auto size-1.5 rounded-full bg-teal" />
                )}
              </Link>
            );
          })}
      </nav>

      <div className="pt-3 border-t border-line/60">
        <button
          type="button"
          onClick={() => void onLogout()}
          className="flex w-full items-center gap-3 rounded-full px-4 py-2.5 text-sm font-semibold text-muted transition hover:bg-white/80 dark:hover:bg-white/10 hover:text-ink hover:shadow-xs"
        >
          <LogOut className="size-4.5" />
          {t("nav.logout")}
        </button>
      </div>
    </aside>
  );
}
