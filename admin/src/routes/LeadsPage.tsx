import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "@/lib/auth";
import { asRecord, str } from "@/lib/utils";
import { Field, GhostButton, PageCard, PrimaryButton, SoftTable, TextSelect } from "@/components/ui";

export function LeadsPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [convertId, setConvertId] = useState<string | null>(null);
  const [branchId, setBranchId] = useState("");

  const leads = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data } = await api.GET("/v1/leads", { params: { query: { limit: 100 } } });
      return (data?.items ?? []) as unknown[];
    },
  });
  const branches = useQuery({
    queryKey: ["branches"],
    queryFn: async () => {
      const { data } = await api.GET("/v1/branches");
      return (Array.isArray(data) ? data : (data as { items?: unknown[] })?.items ?? []) as unknown[];
    },
  });

  const convert = useMutation({
    mutationFn: async () => {
      if (!convertId) return;
      const { error } = await api.POST("/v1/leads/{leadId}/convert", {
        params: { path: { leadId: convertId } },
        body: { home_branch_id: branchId },
      });
      if (error) throw new Error("convert failed");
    },
    onSuccess: async () => {
      setConvertId(null);
      await qc.invalidateQueries({ queryKey: ["leads"] });
      await qc.invalidateQueries({ queryKey: ["members"] });
    },
  });

  const branchOpts = (branches.data ?? []).map((b) => {
    const row = asRecord(b);
    return { id: str(row.id, ""), name: str(row.name) };
  });

  return (
    <PageCard title={t("leads.title")}>
      {(leads.data ?? []).length === 0 ? (
        <p className="text-sm font-medium text-muted py-4">{t("leads.empty")}</p>
      ) : (
        <SoftTable
          headers={[t("members.name"), t("leads.contact"), t("leads.status"), t("common.actions")]}
          rows={(leads.data ?? []).map((lead) => {
            const row = asRecord(lead);
            const id = str(row.id, "");
            return [
              <span key="n" className="font-semibold text-ink">{str(row.name)}</span>,
              <span key="c" className="text-muted">{str(row.contact)}</span>,
              <span key="s" className="inline-block rounded-full bg-teal-100/90 text-teal-800 px-3 py-1 text-xs font-bold">
                {str(row.status, "open")}
              </span>,
              <GhostButton key="act" type="button" onClick={() => setConvertId(id)} className="text-xs py-1.5 px-3">
                {t("leads.convert")}
              </GhostButton>,
            ];
          })}
        />
      )}

      {convertId ? (
        <form
          className="mt-6 flex flex-wrap items-end gap-3 rounded-[24px] bg-purple-50/70 border border-purple-100/60 p-5"
          onSubmit={(e) => {
            e.preventDefault();
            convert.mutate();
          }}
        >
          <Field label={t("members.branch")}>
            <TextSelect required value={branchId} onChange={(e) => setBranchId(e.target.value)}>
              <option value="">Select</option>
              {branchOpts.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </TextSelect>
          </Field>
          <PrimaryButton type="submit">{t("leads.convert")}</PrimaryButton>
          <GhostButton type="button" onClick={() => setConvertId(null)}>
            {t("common.cancel")}
          </GhostButton>
        </form>
      ) : null}
    </PageCard>
  );
}
