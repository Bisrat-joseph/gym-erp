import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageCard({
  title,
  action,
  children,
  className,
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-[24px] bg-white/95 dark:bg-[#151622]/95 backdrop-blur-md p-6 shadow-[0_12px_36px_-4px_rgba(26,27,47,0.06),0_4px_12px_-2px_rgba(26,27,47,0.03)] dark:shadow-[0_12px_36px_-4px_rgba(0,0,0,0.4)] ring-1 ring-black/[0.03] dark:ring-white/[0.06] transition-all hover:shadow-[0_16px_40px_-4px_rgba(26,27,47,0.08)] dark:hover:shadow-[0_16px_40px_-4px_rgba(0,0,0,0.5)]",
        className,
      )}
    >
      {(title || action) && (
        <div className="mb-5 flex items-center justify-between gap-3">
          {title ? (
            <h2 className="text-base font-bold tracking-tight text-ink">{title}</h2>
          ) : (
            <div />
          )}
          {action && (
            <div className="text-xs font-semibold text-teal hover:underline cursor-pointer">
              {action}
            </div>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

export function StatTile({
  title,
  value,
  tone,
  icon,
  meta,
}: {
  title: string;
  value: string | number;
  tone: "lavender" | "peach" | "mint";
  icon: ReactNode;
  meta?: Array<{ icon: ReactNode; label: string }>;
}) {
  const pillBg =
    tone === "lavender"
      ? "bg-purple-100/90 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300"
      : tone === "peach"
        ? "bg-orange-100/90 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300"
        : "bg-teal-100/90 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300";

  return (
    <div
      className={cn(
        "rounded-[24px] bg-white/95 dark:bg-[#151622]/95 backdrop-blur-md p-6 shadow-[0_12px_36px_-4px_rgba(26,27,47,0.06),0_4px_12px_-2px_rgba(26,27,47,0.03)] dark:shadow-[0_12px_36px_-4px_rgba(0,0,0,0.4)] ring-1 ring-black/[0.03] dark:ring-white/[0.06] transition-all duration-300 hover:shadow-[0_18px_44px_-4px_rgba(26,27,47,0.09)] dark:hover:shadow-[0_18px_44px_-4px_rgba(0,0,0,0.5)] hover:-translate-y-0.5",
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className={cn("grid size-12 place-items-center rounded-2xl shadow-xs transition-transform duration-200 group-hover:scale-105", pillBg)}>
          {icon}
        </div>
        <div className="text-right">
          <div className="text-3xl font-extrabold tracking-tight text-ink">{value}</div>
          <div className="mt-1 text-xs font-medium text-muted">{title}</div>
        </div>
      </div>
      {meta && meta.length > 0 ? (
        <div className="flex items-center gap-4 border-t border-line/60 pt-3 mt-2">
          {meta.map((m, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs font-medium text-ink-soft">
              <span className="grid size-6 place-items-center rounded-full bg-surface text-ink-soft">{m.icon}</span>
              {m.label}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function PrimaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "rounded-full bg-teal px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-teal/25 transition-all hover:bg-teal-dark hover:shadow-lg hover:shadow-teal/30 active:scale-95 disabled:opacity-50",
        props.className,
      )}
    />
  );
}

export function GhostButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "rounded-full border border-line bg-white/80 dark:bg-white/5 px-4 py-2 text-sm font-semibold text-ink transition-all hover:bg-white dark:hover:bg-white/10 hover:shadow-xs disabled:opacity-50",
        props.className,
      )}
    />
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-semibold text-ink-soft text-xs tracking-wide">{label}</span>
      {children}
    </label>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-2xl border border-line bg-white/70 dark:bg-white/5 px-4 py-3 text-sm text-ink outline-none transition-all placeholder:text-muted ring-teal/30 focus:border-teal/40 focus:bg-white dark:focus:bg-white/10 focus:ring-2 focus:shadow-xs",
        props.className,
      )}
    />
  );
}

export function TextSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "w-full rounded-2xl border border-line bg-white/70 dark:bg-[#181926] px-4 py-3 text-sm text-ink outline-none transition-all ring-teal/30 focus:border-teal/40 focus:bg-white dark:focus:bg-[#1f2030] focus:ring-2 focus:shadow-xs",
        props.className,
      )}
    />
  );
}

export function SoftTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-separate border-spacing-y-2 text-left text-sm">
        <thead>
          <tr className="text-xs font-semibold tracking-wider text-muted uppercase">
            {headers.map((h) => (
              <th key={h} className="px-4 py-2 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="bg-surface/60 dark:bg-white/[0.03] transition-colors hover:bg-surface/90 dark:hover:bg-white/[0.06]">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3.5 first:rounded-l-2xl last:rounded-r-2xl">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
