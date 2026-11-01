import { useTranslation } from "react-i18next";
import { getSession, firstName } from "@/lib/auth";

export function RightRail({
  gymName,
  overdueCount = 0,
  checkinCount = 0,
  branchCount = 0,
}: {
  gymName?: string;
  overdueCount?: number;
  checkinCount?: number;
  branchCount?: number;
}) {
  const { t } = useTranslation();
  const { user } = getSession();

  return (
    <aside className="flex w-[300px] shrink-0 flex-col gap-5">
      <section className="rounded-[24px] bg-white/95 dark:bg-[#151622]/95 backdrop-blur-md p-6 shadow-[0_12px_36px_-4px_rgba(26,27,47,0.06),0_4px_12px_-2px_rgba(26,27,47,0.03)] dark:shadow-[0_12px_36px_-4px_rgba(0,0,0,0.4)] ring-1 ring-black/[0.03] dark:ring-white/[0.06]">
        <div className="mb-4 text-xs font-bold uppercase tracking-wider text-muted">{t("dashboard.profile")}</div>
        <div className="flex flex-col items-center text-center">
          <div className="mb-3 grid size-20 place-items-center overflow-hidden rounded-full bg-linear-to-br from-purple-100 to-orange-100 dark:from-purple-900/60 dark:to-orange-900/60 text-2xl font-extrabold text-ink ring-4 ring-white dark:ring-white/10 shadow-md">
            {firstName(user).slice(0, 1).toUpperCase()}
          </div>
          <div className="text-base font-bold text-ink">{user?.name || user?.email}</div>
          <div className="mt-1 text-xs font-medium text-muted">
            {(user?.staff_roles ?? []).join(" · ") || "staff"}
          </div>
          <div className="mt-4 grid w-full grid-cols-2 gap-2 text-left text-xs">
            <div className="rounded-2xl bg-surface/70 dark:bg-white/[0.04] px-3 py-2.5">
              <div className="text-muted text-[10px] font-semibold uppercase tracking-wider">Email</div>
              <div className="truncate font-semibold text-ink mt-0.5">{user?.email}</div>
            </div>
            <div className="rounded-2xl bg-surface/70 dark:bg-white/[0.04] px-3 py-2.5">
              <div className="text-muted text-[10px] font-semibold uppercase tracking-wider">Roles</div>
              <div className="font-semibold text-ink mt-0.5">{(user?.staff_roles ?? []).join(", ") || "—"}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[24px] bg-white/95 dark:bg-[#151622]/95 backdrop-blur-md p-6 shadow-[0_12px_36px_-4px_rgba(26,27,47,0.06),0_4px_12px_-2px_rgba(26,27,47,0.03)] dark:shadow-[0_12px_36px_-4px_rgba(0,0,0,0.4)] ring-1 ring-black/[0.03] dark:ring-white/[0.06]">
        <div className="mb-3 text-xs font-bold uppercase tracking-wider text-muted">{t("dashboard.todayGoal")}</div>
        <ul className="space-y-2.5 text-sm">
          <li className="flex items-center justify-between rounded-2xl bg-surface/70 dark:bg-white/[0.04] px-4 py-3">
            <span className="font-semibold text-ink">{t("checkin.title")}</span>
            <span className="font-extrabold text-ink">{checkinCount}</span>
          </li>
          <li className="flex items-center justify-between rounded-2xl bg-orange-50/70 dark:bg-orange-950/40 border border-orange-100/50 dark:border-orange-900/30 px-4 py-3">
            <span className="font-semibold text-orange-900 dark:text-orange-200">{t("dashboard.overdue")}</span>
            <span className="font-extrabold text-orange-950 dark:text-orange-100">{overdueCount}</span>
          </li>
        </ul>
      </section>

      <section className="rounded-[24px] bg-white/95 dark:bg-[#151622]/95 backdrop-blur-md p-6 shadow-[0_12px_36px_-4px_rgba(26,27,47,0.06),0_4px_12px_-2px_rgba(26,27,47,0.03)] dark:shadow-[0_12px_36px_-4px_rgba(0,0,0,0.4)] ring-1 ring-black/[0.03] dark:ring-white/[0.06]">
        <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">{t("dashboard.gymNear")}</div>
        <p className="text-base font-bold text-ink">{gymName || t("app.name")}</p>
        <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs">
          <div className="rounded-2xl bg-surface/70 dark:bg-white/[0.04] px-3 py-3">
            <div className="text-base font-extrabold text-ink">{branchCount || "—"}</div>
            <div className="text-muted mt-0.5 font-medium">{t("settings.branches")}</div>
          </div>
          <div className="rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100/50 dark:border-emerald-900/30 px-3 py-3">
            <div className="text-base font-extrabold text-emerald-900 dark:text-emerald-200">{checkinCount}</div>
            <div className="text-emerald-700/80 dark:text-emerald-300 mt-0.5 font-medium">{t("dashboard.checkinsToday")}</div>
          </div>
        </div>
      </section>
    </aside>
  );
}
