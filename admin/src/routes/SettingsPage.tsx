import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Moon, Sun } from "lucide-react";
import { api, getSession } from "@/lib/auth";
import { asRecord, str } from "@/lib/utils";
import { Field, PageCard, PrimaryButton, SoftTable, TextInput } from "@/components/ui";
import { useTheme } from "@/lib/theme";

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function SettingsPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const { theme, toggleTheme } = useTheme();
  const [form, setForm] = useState({
    name: "",
    timezone: "",
    currency: "",
    phone: "",
    email: "",
    address: "",
  });

  const gym = useQuery({
    queryKey: ["gym"],
    queryFn: async () => {
      const { data } = await api.GET("/v1/gym");
      return data as Record<string, unknown>;
    },
  });
  const branches = useQuery({
    queryKey: ["branches"],
    queryFn: async () => {
      const { data } = await api.GET("/v1/branches");
      return (Array.isArray(data) ? data : (data as { items?: unknown[] })?.items ?? []) as unknown[];
    },
  });
  const hours = useQuery({
    queryKey: ["hours", branches.data],
    enabled: (branches.data ?? []).length > 0,
    queryFn: async () => {
      const first = asRecord((branches.data ?? [])[0]);
      const id = str(first.id, "");
      if (!id) return { items: [] as unknown[] };
      const token = getSession().accessToken;
      const res = await fetch(`/v1/branches/${id}/hours`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) return { items: [] as unknown[] };
      return (await res.json()) as { items?: unknown[] };
    },
  });
  const holidays = useQuery({
    queryKey: ["holidays"],
    queryFn: async () => {
      const token = getSession().accessToken;
      const res = await fetch("/v1/gym/holidays", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) return { items: [] as unknown[] };
      return (await res.json()) as { items?: unknown[] };
    },
  });

  useEffect(() => {
    if (!gym.data) return;
    setForm({
      name: str(gym.data.name, ""),
      timezone: str(gym.data.timezone, ""),
      currency: str(gym.data.currency, ""),
      phone: str(gym.data.phone, ""),
      email: str(gym.data.email, ""),
      address: str(gym.data.address, ""),
    });
  }, [gym.data]);

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await api.PATCH("/v1/gym", {
        body: {
          name: form.name || undefined,
          timezone: form.timezone || undefined,
          currency: form.currency || undefined,
          phone: form.phone || undefined,
          email: form.email || undefined,
          address: form.address || undefined,
        },
      });
      if (error) throw new Error("save failed");
    },
    onSuccess: async () => qc.invalidateQueries({ queryKey: ["gym"] }),
  });

  const hourItems = hours.data?.items ?? [];
  const holidayItems = holidays.data?.items ?? [];

  return (
    <div className="space-y-6">
      {/* Appearance / Theme Settings Card */}
      <PageCard title="Appearance">
        <div className="flex items-center justify-between py-2">
          <div>
            <div className="text-sm font-bold text-ink">Dark Mode</div>
            <div className="text-xs text-muted mt-0.5">
              Switch between light glass and dark glass themes.
            </div>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center gap-2.5 rounded-full border border-line bg-surface/70 px-4 py-2 text-sm font-bold text-ink transition-all hover:bg-white dark:hover:bg-card hover:shadow-xs active:scale-95"
          >
            {theme === "dark" ? (
              <>
                <Sun className="size-4 text-amber-400" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="size-4 text-purple-600" />
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </div>
      </PageCard>

      <PageCard title={t("settings.gym")}>
        <form
          className="grid gap-4 md:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            save.mutate();
          }}
        >
          <Field label={t("settings.name")}>
            <TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label={t("settings.timezone")}>
            <TextInput value={form.timezone} onChange={(e) => setForm({ ...form, timezone: e.target.value })} />
          </Field>
          <Field label={t("settings.currency")}>
            <TextInput value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} />
          </Field>
          <Field label={t("settings.phone")}>
            <TextInput value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </Field>
          <Field label={t("settings.email")}>
            <TextInput value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Field>
          <Field label={t("settings.address")}>
            <TextInput value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </Field>
          <div className="md:col-span-2 pt-2">
            <PrimaryButton type="submit" disabled={save.isPending}>
              {t("settings.save")}
            </PrimaryButton>
          </div>
        </form>
      </PageCard>

      <PageCard title={t("settings.branches")}>
        <SoftTable
          headers={[t("settings.name"), t("settings.address"), t("settings.phone")]}
          rows={(branches.data ?? []).map((b) => {
            const row = asRecord(b);
            return [str(row.name), str(row.address), str(row.phone)];
          })}
        />
      </PageCard>

      <PageCard title="Branch hours">
        {hourItems.length === 0 ? (
          <p className="text-sm font-medium text-muted py-2">{t("common.none")}</p>
        ) : (
          <SoftTable
            headers={["Day", "Opens", "Closes"]}
            rows={hourItems.map((h) => {
              const row = asRecord(h);
              const day = Number(row.weekday ?? 1);
              return [weekdays[day - 1] ?? String(day), str(row.opens_at), str(row.closes_at)];
            })}
          />
        )}
      </PageCard>

      <PageCard title="Holidays">
        {holidayItems.length === 0 ? (
          <p className="text-sm font-medium text-muted py-2">{t("common.none")}</p>
        ) : (
          <SoftTable
            headers={["Date", "Name"]}
            rows={holidayItems.map((h) => {
              const row = asRecord(h);
              return [str(row.date), str(row.name)];
            })}
          />
        )}
      </PageCard>
    </div>
  );
}
