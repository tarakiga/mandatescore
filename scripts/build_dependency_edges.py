#!/usr/bin/env python3
"""
Build dependency edge CSV from jira/mandatescore-master-import.csv.

Input CSV expected columns:
- IssueKey
- DependsOn (pipe-delimited, e.g. "MS-202|MS-203")

Output CSV columns:
- issue_key
- depends_on_key
- link_type

Default link_type is "is blocked by" (Jira-friendly wording).
"""

from __future__ import annotations

import argparse
import csv
from pathlib import Path
from typing import Iterable, List, Set, Tuple


def parse_depends_on(raw: str, delimiter: str) -> List[str]:
    if not raw:
        return []
    return [item.strip() for item in raw.split(delimiter) if item.strip()]


def build_edges(rows: Iterable[dict], delimiter: str, link_type: str) -> List[Tuple[str, str, str]]:
    edges: Set[Tuple[str, str, str]] = set()

    for row in rows:
        issue_key = (row.get("IssueKey") or "").strip()
        if not issue_key:
            continue

        depends_raw = (row.get("DependsOn") or "").strip()
        for dep_key in parse_depends_on(depends_raw, delimiter):
            edges.add((issue_key, dep_key, link_type))

    return sorted(edges, key=lambda x: (x[0], x[1], x[2]))


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate dependency edge CSV from master import CSV.")
    parser.add_argument(
        "--input",
        default="jira/mandatescore-master-import.csv",
        help="Path to source CSV (default: jira/mandatescore-master-import.csv)",
    )
    parser.add_argument(
        "--output",
        default="jira/mandatescore-dependency-edges.csv",
        help="Path to output CSV (default: jira/mandatescore-dependency-edges.csv)",
    )
    parser.add_argument(
        "--delimiter",
        default="|",
        help="Dependency delimiter used in DependsOn column (default: |)",
    )
    parser.add_argument(
        "--link-type",
        default="is blocked by",
        help='Value for link_type column (default: "is blocked by")',
    )
    args = parser.parse_args()

    input_path = Path(args.input)
    output_path = Path(args.output)

    if not input_path.exists():
        raise FileNotFoundError(f"Input file not found: {input_path}")

    with input_path.open("r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        required_columns = {"IssueKey", "DependsOn"}
        missing = required_columns.difference(reader.fieldnames or [])
        if missing:
            raise ValueError(f"Missing required columns: {', '.join(sorted(missing))}")
        rows = list(reader)

    edges = build_edges(rows, args.delimiter, args.link_type)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["issue_key", "depends_on_key", "link_type"])
        writer.writerows(edges)

    print(f"Generated {len(edges)} dependency edges at: {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
