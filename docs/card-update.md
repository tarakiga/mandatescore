## How past officials should appear

- **Search results**
    - Include past officials, but:
        - Tag them with a clear label like **“Former”** or **“Term ended”** next to the office title.
        - Optionally sort current officials higher by default, with a filter toggle like *[Current]* / *[Past]* / *[All]*.[^1][^2]
- **Profile card treatment (list view)**
    - Show them in the same grid/list as current officials, but with subtle visual differences:
        - Term dates visible: “Mayor of X · 2018–2022”.
        - A small **“Archived term”** badge.
        - Score bar still shown (this is their final Mandate Score), but no “live” cues like “Last updated 2 days ago”.
    - This follows archive patterns where items remain discoverable but clearly not active records.[^3][^1]
- **Profile detail page**
    - At the top, under the name/office:
        - “**Status: Former official** – term completed on 15 Jan 2024”
    - Lock the context:
        - Make it clear the score is **frozen for that term**, not updating.
        - If they had multiple terms, show a **term switcher** (e.g., “Term 1: 2014–2018 · Term 2: 2018–2022”) and a separate scorecard per term.


## UX rationale

- Users expect to be able to look up **historical performance** as part of accountability—an archive pattern, not a deletion pattern.[^2][^1]
- Mixing past and current without clear status is confusing; a simple **“Former / Archived” state and term dates** solves this while preserving comparability (past Mandate Scores can still be benchmarked against current ones).
