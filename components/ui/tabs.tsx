"use client";

import { useRef } from "react";

type TabItem = {
  readonly id: string;
  readonly label: string;
};

type TabsProps = {
  readonly tabs: readonly TabItem[];
  readonly activeTabId: string;
  readonly idBase?: string;
  readonly ariaLabel?: string;
  readonly onTabChange: (tabId: string) => void;
};

export function Tabs({
  tabs,
  activeTabId,
  idBase = "tabs",
  ariaLabel = "Sections",
  onTabChange
}: TabsProps) {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function focusAndActivateByIndex(index: number) {
    const safeIndex = (index + tabs.length) % tabs.length;
    const targetTab = tabs[safeIndex];
    if (!targetTab) return;
    tabRefs.current[safeIndex]?.focus();
    onTabChange(targetTab.id);
  }

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      aria-orientation="horizontal"
      style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}
    >
      {tabs.map((tab, index) => {
        const selected = tab.id === activeTabId;
        const tabButtonId = `${idBase}-tab-${tab.id}`;
        const panelId = `${idBase}-panel-${tab.id}`;
        return (
          <button
            key={tab.id}
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            id={tabButtonId}
            type="button"
            role="tab"
            tabIndex={selected ? 0 : -1}
            aria-selected={selected}
            aria-controls={panelId}
            onClick={() => onTabChange(tab.id)}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight") {
                event.preventDefault();
                focusAndActivateByIndex(index + 1);
              } else if (event.key === "ArrowLeft") {
                event.preventDefault();
                focusAndActivateByIndex(index - 1);
              } else if (event.key === "Home") {
                event.preventDefault();
                focusAndActivateByIndex(0);
              } else if (event.key === "End") {
                event.preventDefault();
                focusAndActivateByIndex(tabs.length - 1);
              }
            }}
            style={{
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-subtle)",
              padding: "var(--space-2) var(--space-3)",
              background: selected ? "color-mix(in srgb, var(--accent-brand) 16%, transparent)" : "transparent",
              color: selected ? "var(--text-primary)" : "var(--text-muted)",
              fontSize: "var(--text-sm)",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
