import type { ReactNode } from "react";
import { DataTable } from "./data-table";
import { OfficialProfileCard } from "./official-profile-card";
import { PublicShell } from "./public-shell";
import { Split } from "./split";
import { Stack } from "./stack";
import { Tabs } from "./tabs";

type DataTableColumn = {
  readonly key: string;
  readonly label: string;
};

type DataTableRow = {
  readonly id: string;
  readonly cells: Record<string, string>;
};

type TabItem = {
  readonly id: string;
  readonly label: string;
};

type OfficialProfileTemplateProps = {
  readonly profile: {
    readonly name: string;
    readonly office: string;
    readonly countryCode?: string;
    readonly jurisdiction: string;
    readonly score: number;
    readonly keptCount: number;
    readonly inProgressCount: number;
    readonly brokenCount: number;
    readonly avatarUrl?: string;
  };
  readonly tabs: readonly TabItem[];
  readonly activeTabId: string;
  readonly onTabChange: (tabId: string) => void;
  readonly tableTitle: string;
  readonly tableColumns: readonly DataTableColumn[];
  readonly tableRows: readonly DataTableRow[];
  readonly aside?: ReactNode;
};

export function OfficialProfileTemplate({
  profile,
  tabs,
  activeTabId,
  onTabChange,
  tableTitle,
  tableColumns,
  tableRows,
  aside
}: OfficialProfileTemplateProps) {
  const activePanelId = `official-profile-panel-${activeTabId}`;
  const activeTabButtonId = `official-profile-tab-${activeTabId}`;

  return (
    <PublicShell title="Official Profile" subtitle="Evidence-backed performance overview">
      <Stack gap="6">
        <OfficialProfileCard {...profile} />
        <Tabs
          tabs={tabs}
          activeTabId={activeTabId}
          idBase="official-profile"
          ariaLabel="Official profile sections"
          onTabChange={onTabChange}
        />
        {aside ? (
          <div role="tabpanel" id={activePanelId} aria-labelledby={activeTabButtonId}>
            <Split preset="sidebar-right" gap="6">
              <DataTable title={tableTitle} columns={tableColumns} rows={tableRows} />
              <aside>{aside}</aside>
            </Split>
          </div>
        ) : (
          <div role="tabpanel" id={activePanelId} aria-labelledby={activeTabButtonId}>
            <DataTable title={tableTitle} columns={tableColumns} rows={tableRows} />
          </div>
        )}
      </Stack>
    </PublicShell>
  );
}
