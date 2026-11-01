import { Search, Settings2, Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { firstName, getSession } from "@/lib/auth";
import { useTheme } from "@/lib/theme";

export function TopBar({
  search,
  onSearch,
}: {
  search: string;
  onSearch: (value: string) => void;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = getSession();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="mb-8 flex flex-wrap items-center gap-4">
      <div className="min-w-[180px]">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink">
          {t("header.hi", { name: firstName(user) })}
        </h1>
        <p className="text-sm font-medium text-muted mt-0.5">{t("app.tagline")}</p>
      </div>

      <form
        className="relative mx-auto flex min-w-[240px] max-w-xl flex-1 items-center"
        onSubmit={(e) => {
          e.preventDefault();
          const q = search.trim();
          void navigate({
            to: "/members",
            search: q ? ({ q } as Record<string, string>) : {},
          });
        }}
      >
        <Search className="pointer-events-none absolute left-4 size-4 text-muted" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={t("header.search")}
          className="w-full rounded-full border border-white/80 dark:border-white/10 bg-white/90 dark:bg-[#151622]/90 backdrop-blur-md py-3 pr-4 pl-11 text-sm text-ink shadow-[0_8px_24px_rgba(26,27,47,0.06)] dark:shadow-none outline-none ring-teal/30 placeholder:text-muted transition-all focus:bg-white dark:focus:bg-[#181926] focus:ring-2 focus:shadow-[0_12px_28px_rgba(26,27,47,0.09)]"
        />
      </form>

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          aria-label="Toggle theme"
          onClick={toggleTheme}
          className="grid size-11 place-items-center rounded-full border border-white/80 dark:border-white/10 bg-white/90 dark:bg-[#151622]/90 backdrop-blur-md text-ink shadow-[0_8px_24px_rgba(26,27,47,0.06)] dark:shadow-none transition-all hover:bg-white dark:hover:bg-[#1f2030] hover:scale-105 active:scale-95"
        >
          {theme === "dark" ? (
            <Sun className="size-4.5 text-amber-400" />
          ) : (
            <Moon className="size-4.5 text-purple-600" />
          )}
        </button>

        <button
          type="button"
          aria-label={t("nav.settings")}
          onClick={() => void navigate({ to: "/settings" })}
          className="grid size-11 place-items-center rounded-full border border-white/80 dark:border-white/10 bg-white/90 dark:bg-[#151622]/90 backdrop-blur-md text-ink shadow-[0_8px_24px_rgba(26,27,47,0.06)] dark:shadow-none transition-all hover:bg-white dark:hover:bg-[#1f2030] hover:scale-105 active:scale-95"
        >
          <Settings2 className="size-4.5 text-ink-soft" />
        </button>
      </div>
    </header>
  );
}
