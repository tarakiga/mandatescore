# PRD: MandateScore Web Application

## 1. Overview

This document defines the product requirements for a minimal, globally scalable web application that creates a scorecard for elected officials based on their campaign promises and visible progress toward fulfilling them.
The application focuses on a clean, card-like profile for each official, listing promises, current fulfillment scores, and time remaining in office.

## 2. Product Vision and Goals

The product vision is to provide a neutral, evidence-based, and visually intuitive way for anyone in the world to see how well an elected official is living up to their campaign promises.
It combines structured data about promises, outcomes, and timelines with transparent sourcing from public documents and knowledge graphs.

Core goals:
- Make accountability legible: Surface how many promises are kept, in progress, broken, or stalled using a simple score and progress bar.
- Be global and extensible: Support officials from any country, with flexible modeling for different political systems and term structures.
- Be explainable and auditable: Every score must be backed by traceable, sourced evidence (articles, official documents, parliamentary data, etc.).
- Minimize manual work: Use ontology/knowledge-graph oriented design and semi-automated data ingestion to reduce curation overhead over time.[^1][^2][^3]

## 3. Primary Use Cases

1. **Citizen checks an official’s performance**
   - As a citizen, I search for "Zohran Mamdani" and see a profile card with his office, jurisdiction, term dates, headline promises, and an overall fulfillment score with a progress bar and time-left indicator.[^4][^5][^6]
   - I can drill into each promise to see status (Kept, In Progress, Broken, Stalled, Not Started) and evidence links.

2. **Researcher/NGO tracks promises over time**
   - As a researcher, I monitor a set of officials and export data about promises and fulfillment; I need transparent criteria and citation trails similar to existing promise trackers like PolitiFact’s Biden Promise Tracker and the Obameter.[^7][^8]

3. **Journalist uses scorecard in reporting**
   - As a journalist, I want to embed or reference the scorecard for an official in a story and quickly verify the underlying evidence for a featured promise.[^8][^7]

4. **Power user explores ontology-backed graph**
   - As an advanced user, I want to explore relationships between promises, legislative actions, and outcomes via an API/graph view, leveraging underlying political ontologies (e.g., PODIO-like or domain-specific political ontologies).[^9][^3][^1]

## 4. Target Users and Initial Scope

Initial primary users:
- Civically engaged citizens in major cities/countries.
- Journalists and civil society organizations interested in accountability.
- Researchers in political science and civic tech.

v1 scope assumptions:
- Support a limited but diverse set of jurisdictions (e.g., New York City mayor, US federal executive branch, and one or two additional countries with good open data).
- Start with handpicked high-salience officials (mayors, presidents, prime ministers) rather than every elected official globally.
- Design ontology and data model to allow expansion to “everyone in the world” over time, but not as part of v1 feature delivery.[^10][^3]

## 5. High-Level Feature List (v1)

### 5.1 Global Search and Browse

- Search bar (by name, office, country, city, party).
- Browse popular officials and recently updated profiles.
- Basic filters: country, level (national, regional, local), office type.

### 5.2 Official Profile Card (Core UI)

For each official:
- Portrait or placeholder avatar.
- Name, office title, jurisdiction, party, term start/end dates.
- An overall "Promise Fulfillment Score" (0–100) with a horizontal progress bar.
- A secondary progress indicator for "Time elapsed in office" vs time remaining.
- Key stats: number of promises tracked, kept, in progress, broken, stalled.
- List of top promises with status chips and mini progress bars.
- A tab or section for "Evidence & Sources" showing key citations.[^11][^7]

### 5.3 Promise Detail View

Each promise has:
- Short, standardized title.
- Full text / paraphrased description.
- Category tags (e.g., Housing, Transport, Taxation, Education).
- Source(s) of the promise (manifesto PDF, speech transcript, debate, campaign site, media coverage).
- Status (Kept, In Progress, Broken, Stalled, Not Started, Not Yet Rated) similar to existing trackers.[^7][^8]
- Evidence events: key milestones (bills introduced, laws passed, budget allocations, implementation outcomes).
- Timeline view (campaign date → promise creation → legislative events → outcomes).

### 5.4 Scoring and Metrics

- Per-promise status contributes to an official’s overall score using a configurable weighting system (e.g., Kept = 1, Compromise = 0.7, In Progress = 0.5, Stalled = 0.2, Broken = 0).
- Optionally weight promises by salience (e.g., flagged as "headline" in ontology or by editorial curation) and by number of independent sources confirming progress.
- Time-normalized metrics: show performance relative to how far into the term the official is (e.g., "On track", "Behind schedule").[^8][^7]

### 5.5 Data Provenance and Transparency

- For each promise and status update, maintain:
  - Source URL(s).
  - Publication date.
  - Publisher type (official gov, media, NGO, research, user-submitted).
  - Confidence score (derived from source reliability and consensus among sources).
- Visible "Why this status?" explanation on each promise with summarized reasoning and links.

### 5.6 Basic Admin / Curation Tools (MVP)

- Admin dashboard for curators (trusted orgs, internal team):
  - Create/edit officials.
  - Add/edit promises and link sources.
  - Update statuses based on new evidence.
- Simple audit log for changes to an official’s record.

## 6. Information Sourcing and Ontology Strategy

### 6.1 Data Sources for Promises

Potential initial sources:
- Campaign websites and online manifestos (PDFs, HTML).
- Major news outlets’ summaries of campaign promises (e.g., CNN, BBC type profiles).[^5][^6][^4]
- Fact-checking and promise-tracking outlets (e.g., PolitiFact’s Promise Trackers, RMIT ABC Promise Tracker, and similar CPET platforms).[^7][^8]
- Existing civic-tech promise trackers cataloged in civic tech directories (e.g., Promise Tracker projects globally).[^10]

For a specific figure like Zohran Mamdani, promises include universal childcare, free city buses, rent freezes, higher taxes on the wealthy, and city-run grocery stores, all documented in national/international media coverage.[^12][^13][^6][^4][^5]

### 6.2 Ontology / Knowledge Graph Layer

Introduce a political ontology (inspired by PODIO and other political knowledge graphs) to model:
- Entities: Person, Office, Election, Term, Promise, Policy Area, Bill, Law, Program, Location, Organization.
- Relationships: madePromise(Person → Promise), holdsOffice(Person → Office), fulfillsVia(Promise → Law/Program), targetsAudience(Promise → PopulationGroup), coveredBy(Promise → Article/FactCheck), hasJurisdiction(Office → Location).[^2][^3][^1][^9]

Benefits:
- Standardizes how promises and actions are represented across jurisdictions.
- Enables integration with external KGs (e.g., Wikidata for person/office IDs; domain-specific politics KGs like those built by Rappler and others).[^3]
- Supports semantic queries like "Show all housing promises made by current mayors in G20 cities".

### 6.3 Integration with Wikidata and Wikipedia

- Use Wikidata to resolve unique identifiers for persons and offices, and to fetch canonical labels, alternative names, and links to Wikipedia pages.
- Wikipedia pages about elections and politicians often list key policy planks; these can be semi-automatically extracted and normalized, then curated by admins for accuracy.
- Ontology alignment: map Wikidata items (Q-IDs) to internal Person, Office, and Location classes.

### 6.4 Semi-Automated Promise Extraction

Phased approach:

- **Phase 1 (MVP):**
  - Manual curation of promises for selected officials by admins, relying on media summaries, manifestos, and existing trackers.[^4][^12][^5][^8][^7]

- **Phase 2:**
  - NLP pipeline to scan election manifestos, speeches, and media for candidate statements of intent.
  - Use a promise-extraction model (similar to research on automatic KG population from social big data) to propose candidate promises and classify them by policy area.[^2][^9]
  - Admins review and approve.

- **Phase 3:**
  - Deeper integration with political discourse ontologies (PODIO) to capture context, stance, and temporal aspects of promises across media, social, and legislative records.[^1][^9]

## 7. Progress Tracking Model

### 7.1 What Counts as Progress?

Define an abstract lifecycle for a promise:

1. **Not Started**: No concrete policy action taken.
2. **In Progress**: Policy is being developed, bills introduced, or pilots announced.
3. **Partially Implemented / Compromise**: Some aspects implemented, scope reduced, or implemented via alternative mechanisms.
4. **Kept**: Promise clearly implemented as stated or within an acceptable interpretation.
5. **Broken**: Official explicitly abandons promise or acts contrary to it.
6. **Stalled**: No meaningful progress for a significant time despite being in progress.

This mirrors the status taxonomies used by existing election promise trackers (PolitiFact, RMIT ABC Promise Tracker, etc.).[^8][^7]

### 7.2 Data Signals for Status Updates

Possible signals:
- Legislative data: bills introduced, passed, or defeated related to the promise.
- Budget data: line items funding or defunding the promised program.
- Executive actions: decrees, regulations, agency directives.
- Outcome indicators: metrics showing implementation (e.g., bus fares reduced to zero on certain routes).
- Public statements: official announcements confirming completion or abandonment.

Sources include official government portals, open data APIs, legislative databases, and credible news outlets that report on implementation.[^14][^3][^10][^7]

### 7.3 Status Assignment Logic (v1)

For MVP, use rule-based and curator-driven status assignment:

- A promise is marked **Kept** when multiple independent sources confirm the core policy has been implemented.
- **In Progress** when official legislative or executive actions aligned with the promise are underway but not fully implemented.
- **Broken** when the official explicitly reverses course or votes/signs against the core intent.
- **Stalled** when In Progress but no updates for a defined period (e.g., 12 months) and no clear forward movement.

Admins perform these assignments using an internal UI, supported by suggested status changes from automated scripts.

### 7.4 Toward Automated Progress Tracking

Longer-term automation opportunities:
- Subscribe to legislative APIs (where available) and map bills to promises via ontology relations and NLP (topic modeling, similarity).
- Monitor budget documents and news feeds for signals of implementation or rollback.
- Use a classifier trained on historical promise stories (from existing trackers) to suggest status transitions.

Ontology grounding (explicit relations between promises, bills, laws, and programs) is key to reliable automation.[^9][^3][^1][^2]

## 8. Scoring Algorithm (Initial Proposal)

### 8.1 Promise-Level Scoring

Assign numeric scores per status:
- Kept: 1.0
- Compromise / Partially Implemented: 0.7
- In Progress: 0.5
- Stalled: 0.2
- Broken: 0.0
- Not Started / Not Yet Rated: excluded from average (or treated as 0 depending on chosen semantics).

Each promise may optionally have a weight based on salience or importance, initially set manually.

### 8.2 Official-Level Score

- Compute a weighted average of promise scores.
- Display as a 0–100 Promises Fulfilled score on the profile card.
- Provide a breakdown (e.g., 18 kept, 10 in progress, 5 broken, etc.) so the score is interpretable.

This approach is similar in spirit to how existing promise trackers aggregate status into summary metrics or grades.[^11][^7][^8]

### 8.3 Time-Aware Scoring

- Present a secondary indicator: "on track" vs "behind" based on mapping promises to expected timelines (derived from the term length and original promise wording, when available).
- Example: if a 4-year term is halfway through and only 10% of promises are fully kept but many are in progress, show a neutral or slightly negative trend; near term-end with many not started, highlight risk.

## 9. Data Quality, Accuracy, and Governance

### 9.1 Verification and Editorial Policies

- Every promise and status is tied to at least one source; high-impact promises should have multiple sources.
- Editorial guidelines define:
  - What counts as a campaign promise.
  - How to interpret ambiguous promises.
  - How to handle partial implementation and conflicting sources.
- Borrow best practices from public-interest journalism and fact-checking, as described in research on election promise tracking and CPETs.[^7][^8]

### 9.2 Versioning and Audit Trails

- Maintain a change log for each promise and official, with timestamps, editor identity, and reason for change.
- Allow users to see prior statuses and historical scores.

### 9.3 Community Input (Later Phase)

For v1, limit edits to trusted curators; later, introduce:
- User suggestions for new promises or status updates, with evidence links.
- Reputation and review mechanisms to prevent abuse.

Existing community-driven platforms like VowTrack can provide validation that community voting and input can be combined with curator oversight to generate meaningful scores.[^11]

## 10. Non-Functional Requirements

### 10.1 Performance and Scalability

- Fast search and profile load times (target <300 ms backend response for cached views for popular officials).
- Design backend and ontology store (e.g., graph DB) to scale to tens of thousands of officials and hundreds of thousands of promises.

### 10.2 Reliability and Availability

- Highly available read path (profiles and scores) with CDN caching.
- Regular backups of graph/relational databases and indexes.

### 10.3 Security and Abuse Prevention

- Role-based access control for admins and curators.
- Input validation and moderation for any user-generated suggestions.
- Logging and anomaly detection for suspicious edit patterns.

### 10.4 Internationalization

- Core UI localized for major languages over time.
- Ontology supports multilingual labels via integration with Wikidata and other multilingual knowledge sources.

## 11. Technical Architecture (High-Level)

### 11.1 Core Components

- **Web frontend**: Minimal, responsive single-page app (SPA) for search, profile cards, and promise views.
- **API backend**: REST/GraphQL API serving officials, promises, scores, and search.
- **Knowledge graph / ontology store**: RDF/graph database (e.g., GraphDB, Blazegraph, Neo4j with an ontology layer) storing political entities and relations.[^3][^1]
- **Relational/analytic store**: For aggregate metrics, scores, and historical trends.
- **Ingestion and NLP pipeline**: Scripts/services that pull data from sources, propose promises, and map events to existing promises.

### 11.2 Ontology Integration

- Define a custom political promise ontology extending or mapping to:
  - Political discourse ontologies (e.g., PODIO).
  - Election/politics knowledge graphs (e.g., national KGs like Rappler’s Philippine politics KG).[^1][^3]
- Use URIs/Q-IDs from Wikidata for interoperability.

## 12. UX and Visual Design Principles

- Clean, card-centric design with high contrast and minimal clutter.
- Emphasize two numbers: overall promise score and time elapsed vs remaining in office.
- Color coding:
  - Green for Kept, blue for In Progress, yellow for Stalled/Compromise, red for Broken.
- Provide tooltips and explanatory microcopy ("How is this score calculated?").

## 13. Risks and Open Questions

- **Data availability**: Many jurisdictions lack structured open data; rely on media and manual curation initially.[^10][^3]
- **Subjectivity**: Interpreting promise fulfillment can be contested; mitigation via transparent criteria and multiple independent sources.[^8][^7]
- **Scalability to "every official in the world"**: Requires automated extraction and mapping, plus partnerships with local NGOs and media.
- **Legal and safety considerations**: Possible pushback in less democratic jurisdictions.

## 14. MVP Definition

For an initial release:
- Support a small curated set of high-profile officials (e.g., Zohran Mamdani and a handful of others) with manually curated promises.
- Provide search, profile card, promise list, and status/evidence views.
- Implement a simple scoring model and ontology-backed data model, even if ingestion is manual.
- Build admin tools for internal curation only.

This MVP validates user value, scoring model, and ontology design, while setting up for future automation and global expansion.

---

## References

1. [[PDF] PODIO: A Political Discourse Ontology - CEUR-WS.org](https://ceur-ws.org/Vol-3967/PD_paper_159.pdf) - We constructed a Knowledge Graph (KG) based on the PODIO ontology using various data sources categor...

2. [Automatic Knowledge Graph Population from Social Big ...](https://pdfs.semanticscholar.org/9fed/28d935a1fcbf31319106a220dc324abd0718.pdf)

3. [Rappler Created the First Philippine Politics Knowledge Graph by ...](https://www.ontotext.com/knowledgehub/case-studies/rappler-created-first-philippine-politics-knowledge-graph/) - Thanks to the Politics Ontology and GraphDB's inferencing capabilities, they are now able to identif...

4. [Here's a look at Zohran Mamdani's policy ideas | CNN Politics](https://www.cnn.com/2025/11/04/politics/policy-ideas-zohran-mamdani-nyc-election) - Democratic nominee Zohran Mamdani, the frontrunner in the city's mayoral race, has multiple proposal...

5. [Four challenges facing New York City Mayor Zohran Mamdani - BBC](https://www.bbc.com/news/articles/ce8edj7y5z9o) - Can the Democratic socialist deliver on the big cost-of-living promises that propelled him to victor...

6. [Future NYC Mayor Zohran Mamdani has made bold promises ... - PBS](https://www.pbs.org/newshour/politics/future-nyc-mayor-zohran-mamdani-has-made-bold-promises-can-he-keep-them) - Can he do it? Mamdani, a 34-year-old democratic socialist, already faces intense scrutiny, even befo...

7. [Biden Promise Tracker | PolitiFact](https://www.politifact.com/truth-o-meter/promises/biden-promise-tracker/?ruling=true) - PolitiFact is a fact-checking website that rates the accuracy of claims by elected officials and oth...

8. [Election Promise Tracking: Extending the Shelf Life of Democracy in ...](https://www.tandfonline.com/doi/full/10.1080/1461670X.2025.2477001) - While global fact-checking practice pivots away from its political origins towards debunking project...

9. [Knowledge Graph Representation for Political Information Sources](https://aclanthology.org/2024.politicalnlp-1.6/) - Our research findings are presented through knowledge graphs, utilizing a dataset spanning 11.5 year...

10. [Projects](https://directory.civictech.guide/listing-category/promise-trackers)

11. [VowTrack - Political Promise Tracking](https://www.vowtrack.app) - Track political promises and accountability

12. [6 Zohran Mamdani Campaign Promises That New York City Can't ...](https://www.yahoo.com/news/articles/6-zohran-mamdani-campaign-promises-023756159.html) - Democratic socialist Zohran Mamdani has been elected mayor by promising New Yorkers “free” programs ...

13. [Appraising Mamdani's Five Key Policies](https://www.democracycollaborative.org/blogs/mamdani-five-key-policies) - Mayoral candidate Zohran Mamdani's policies are not only feasible, but could work to improve the liv...

14. [Presidential promises, promises, promises.... - The Fulcrum](https://thefulcrum.us/presidential-promises-promises-promises) - When Donald Trump made his first successful run for president in 2016, he made 663 promises to Ameri...

