import { Outlet, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { RightRail } from "@/components/RightRail";
import { api, getSession } from "@/lib/auth";
import { asRecord, str } from "@/lib/utils";

async function domainGet(path: string) {
  const token = getSession().accessToken;
  const res = await fetch(path, {
    credentials: "include",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) return { items: [] as unknown[] };
  return (await res.json()) as { items?: unknown[] };
}

export function AppShell() {
  const [search, setSearch] = useState("");
  const path = useRouterState({ select: (s) => s.location.pathname });

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
  const checkins = useQuery({
    queryKey: ["checkins-today"],
    queryFn: () => domainGet("/v1/checkins"),
  });
  const overdue = useQuery({
    queryKey: ["overdue"],
    queryFn: () => domainGet("/v1/billing/overdue"),
  });

  const showRight = path === "/" || path === "";

  return (
    <div className="flex min-h-screen bg-transparent">
      <aside className="sticky top-0 hidden h-dvh shrink-0 lg:block z-20">
        <Sidebar />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="border-b border-line/60 bg-white/70 backdrop-blur-md p-3 lg:hidden">
          <Sidebar variant="drawer" />
        </div>

        <div className="flex min-w-0 flex-1 gap-6 p-4 md:p-8">
          <div className="min-w-0 flex-1">
            <TopBar search={search} onSearch={setSearch} />
            <main>
              <Outlet />
            </main>
          </div>
          {showRight ? (
            <div className="sticky top-8 hidden h-[calc(100vh-4rem)] shrink-0 overflow-auto xl:block">
              <RightRail
                gymName={str(asRecord(gym.data).name, "") || undefined}
                overdueCount={(overdue.data?.items ?? []).length}
                checkinCount={(checkins.data?.items ?? []).length}
                branchCount={(branches.data ?? []).length}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
