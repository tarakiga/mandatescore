"use client";

import { Button } from "./button";
import { Cluster } from "./cluster";
import { Input } from "./input";

type SearchBarProps = {
  readonly value: string;
  readonly placeholder?: string;
  readonly onChange: (nextValue: string) => void;
  readonly onSearch: () => void;
  readonly onClear?: () => void;
};

export function SearchBar({
  value,
  placeholder = "Search...",
  onChange,
  onSearch,
  onClear
}: SearchBarProps) {
  return (
    <Cluster gap="2" align="stretch" wrap="nowrap">
      <div style={{ flex: 1, minWidth: 0 }}>
        <Input
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") onSearch();
          }}
        />
      </div>
      <Button onClick={onSearch}>Search</Button>
      <Button variant="secondary" onClick={onClear} disabled={!value}>
        Clear
      </Button>
    </Cluster>
  );
}
