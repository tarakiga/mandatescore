<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# as a professions UX designer what should the home page look like?

The home page should instantly communicate “global promise scoreboard” and get people searching or exploring officials within one scroll.

Below is how to structure it as a professional UX designer.

***

## Overall layout

- **Single primary column with supporting side patterns** (cards, filters) rather than a complex multi-column news portal, to keep cognitive load low and trust high.[^1]
- Clear vertical rhythm: **Hero → Core interaction (search/browse) → Trust/impact → How it works → Footer**.[^2][^1]

***

## Above-the-fold hero

Purpose: Explain Mandate Score in one glance and give a clear starting action.

Elements:

- **Top navigation bar**
    - Left: wordmark/logo “Mandate Score”.
    - Center/right: primary nav items – *Browse Officials*, *Methodology*, *About*, *API* (future).
    - Right-most: *Sign in* / *For Researchers \& NGOs*.
- **Hero content (left side on desktop)**
    - Short, strong headline, e.g.
        - “See who is keeping their promises.”
    - One-sentence supporting copy:
        - “Mandate Score is a worldwide scorecard that tracks how elected officials in any country are keeping their campaign promises, turning complex politics into clear, evidence-based ratings.”
    - **Primary CTA**: a large, prominent **global search bar** with placeholder text like “Search an official, office, or city…”.
        - Include typeahead suggestions (e.g., “Zohran Mamdani – NYC Mayor”, “President of Brazil”), so users understand what the system covers.
    - **Secondary CTA**: ghost button like “Browse all officials” that scrolls to the explore section.
- **Hero visualization (right side on desktop)**
    - A **mocked profile card** of a sample official with: name, office, an overall Mandate Score bar, a few colored mini bars for promises, and term time-left indicator.
    - This is not interactive; it’s a visual hint of what you get when you search, similar to how civic dashboards use “data snapshot” heroes.[^3][^1]

On mobile, stack hero text → search bar → sample card.

***

## Primary interaction zone: Search and explore

Right below the hero, you want the “working surface” of the homepage.

### A. Smart search panel

- Repeat the **global search bar**, but now with more affordances: filters or pills for *Country*, *Level* (National, City, etc.), and *Office type* (President, Mayor, MP).
- Show **search hints**: a small list like “Try: ‘New York City Mayor’, ‘President of Kenya’, ‘Zohran Mamdani’”.


### B. Featured officials grid

- Section title: “Trending officials” or “Most searched this week”.
- Display a responsive **card grid** (3–4 columns desktop, 1–2 mobile) of official profile snippets:
    - Portrait/avatar
    - Name, office, country flag
    - Mandate Score as a compact progress bar
    - Mini breakdown: “18 kept -  10 in progress -  5 broken”
- Each card is clickable to the full profile.


### C. Recently updated promises

- Section title: “Recent promise updates”.
- Horizontally scrolling list or vertical list of **promise activity cards**:
    - Official name + office
    - Promise title
    - New status and a small colored pill (Kept / In Progress / Broken / Stalled)
    - Timestamp “Updated 2 days ago”
- This communicates freshness and that the platform is actively maintained, which is critical for civic-tech trust.[^3][^4]

***

## Trust and impact section

Civic tools live or die on perceived neutrality and rigor, so you need explicit trust-building content.

Include a full-width section with:

- **Impact stats** (as simple stat cards):
    - “112 officials tracked”
    - “1,420 promises monitored”
    - “5,300+ source documents analyzed” (placeholder numbers you’ll eventually power from real data).
- **Logos or mentions of NGOs / media** using or referencing the tool (future), or at least a “Built with reference to global promise-tracking research” line.
- A short link: “See our methodology →” that leads to a dedicated, well-structured page explaining scoring, sources, and editorial rules.

The layout can follow the “stats-first impact rhythm” common to civic transparency landing pages.[^1][^5]

***

## “How Mandate Score works” strip

A simple, three-step horizontal illustration just below trust/impact:

1. **Collect promises**
    - “We extract and curate campaign promises from manifestos, official statements, and fact-checking sources.”
2. **Track progress**
    - “We connect promises to laws, budgets, and real-world actions, updating statuses as new evidence appears.”
3. **Score and explain**
    - “We compute a Mandate Score for each official and show you the sources behind every status.”

Each step is a **card molecule** with icon, title, and short body text—this aligns with atomic design and makes it easy to reuse this pattern elsewhere.[^2][^6]

***

## Secondary pathways and content

Below the “How it works” strip, offer deeper navigation for power users:

- **For citizens** – link to a short guide: “How to read a Mandate Scorecard.”
- **For journalists \& NGOs** – link to instructions on embedding cards, exporting data, or requesting coverage.
- **For developers \& researchers** – early mention of forthcoming API or data access.

Each of these can be a card with a headline, one-sentence description, and CTA button (e.g., “View guide”).

***

## Footer

A compact, low-noise footer with:

- Key links: *About*, *Methodology*, *Data sources*, *Privacy*, *Contact*.
- Language selector for future i18n.
- Brief mission statement: “Mandate Score is an independent project tracking how elected officials deliver on their mandates.”

***

## UX principles to emphasize

- **One primary action above the fold**: search. Everything else is supportive.
- **Data as UI**: use cards and progress bars as first-class visual elements, like an accountability dashboard, not a text-heavy blog.[^3][^7]
- **Atomic composition**: hero, search panel, card grids, stat blocks, and stepper sections are all organisms assembled from shared atoms/molecules—no bespoke layout hacks per page.[^2][^6]

If you want, next step I can translate this into a concrete wireframe description (e.g., section-by-section with component names aligned to your design system) or into a Figma-ready component checklist.
<span style="display:none">[^10][^11][^12][^13][^14][^15][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://www.rocket.new/templates/civic-public-data-transparency-landing-page-template

[^2]: https://b13.com/blog/3-steps-to-scalable-website-design-using-atomic-design-principles

[^3]: https://accountabilityconsole.com

[^4]: https://github.com/Code-for-All/civicpatterns.org

[^5]: https://www.taylorfrancis.com/chapters/edit/10.4324/9781315110332-5/data-driven-design-civic-participation-saba-golchehr-naomi-bueno-de-mesquita

[^6]: https://atomicdesign.bradfrost.com/chapter-2/

[^7]: https://dribbble.com/search/political-dashboard

[^8]: https://piquant.ie/news-insights/atomic-design-smarter-way-build-and-manage-your-website

[^9]: https://www.linkedin.com/pulse/youth-representation-politics-tableau-dashboard-chinedum-nwaogwugwu

[^10]: https://github.com/codeforamerica/civic-tech-patterns

[^11]: https://www.youtube.com/watch?v=uovYUvUew4g

[^12]: https://community-democracies.org/app/uploads/2022/09/Report-Technology-in-Elections.pdf

[^13]: https://www.reddit.com/r/ClaudeAI/comments/1mb3a18/i_built_a_complete_marketing_site_using_claude/

[^14]: https://www.novasarc.com/data-driven-app-design-user-experience

[^15]: https://www.behance.net/gallery/158625669/An-Election-Result-Analysis-Dashboard-(ERAD)/modules/894996847
