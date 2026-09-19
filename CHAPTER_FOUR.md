# CHAPTER FOUR

# SYSTEM IMPLEMENTATION AND TESTING

## 4.1 Introduction

Chapter Three established *what* the proposed **Campus News Web Portal** for the
Petroleum Training Institute (PTI), Effurun must do. Using the Structured System
Analysis and Design Methodology (SSADM), it analysed the existing manual method
of news dissemination, identified its weaknesses, stated the functional and
non-functional requirements of the proposed system, and expressed the design
abstractly through a context diagram and a Level 1 Data Flow Diagram (DFD).

This chapter presents *how* that design was realised in working software. It
documents the tools and technologies selected for the build, the hardware and
software required to develop and operate the system, the concrete software
architecture, the database that was designed and implemented, the individual
functional modules and their user interfaces, and the testing carried out to
confirm that the system behaves as specified. Screenshots of the running
application are used throughout as evidence of implementation, and the chapter
closes by tracing each requirement from Chapter Three to the part of the system
that satisfies it.

The system was implemented as a modern, server-rendered web application named
**PTI News**. The remainder of this chapter is organised as follows: Section 4.2
recaps and consolidates the system analysis into an implementation-ready set of
requirements; Section 4.3 justifies the choice of development tools; Section 4.4
states the hardware and software requirements; Section 4.5 describes the system
architecture in detail; Section 4.6 covers the database design and
implementation; Section 4.7 describes the roles and access-control model as
built; Section 4.8 walks through each functional module with screenshots; Section
4.9 discusses the user-interface implementation; Section 4.10 reports the testing
performed; Section 4.11 discusses the results against the objectives; and Section
4.12 summarises the chapter. Two appendices provide guides for extracting the
code listings and re-creating the diagrams.

> **Note on design vs. build.** Chapter Three described an idealised editorial
> model (roles *Reader*, *Contributor*, *Editor*, *Administrator* with a
> draft → editorial-approval → publication workflow). The delivered system
> implements a pragmatic three-role model (*student*, *lecturer*,
> *administrator*) in which authoring and publishing are performed from a single
> secured administration area and reader comments are published on submission.
> This chapter documents the system **as actually built**, and Section 4.7
> provides a table mapping the delivered roles and modules back onto the
> Chapter Three design so the two chapters can be read together.

---

## 4.2 System Analysis Overview (Consolidated Requirements)

Before implementation, the requirements from Chapter Three were consolidated into
a single reference set and refined into testable statements. This section
restates them in the form used to drive and later verify the build.

### 4.2.1 Functional Requirements

**Table 4.1 — Consolidated functional requirements**

| ID | Requirement | Source (Ch. 3) |
| :-- | :--- | :--- |
| FR-01 | Any visitor can browse and read published campus news without signing in | User Access; Design Obj. i |
| FR-02 | News is organised into named categories and departmental sections | News Categorisation |
| FR-03 | Users can search for news by keyword | News Search |
| FR-04 | Previously published news remains permanently accessible (archive) | News Archive; Design Obj. v |
| FR-05 | Authorised staff can create, edit, publish, unpublish and delete news articles | News Publication / Management |
| FR-06 | The system provides information about campus events (upcoming and past) | Event Information |
| FR-07 | Administrative and authoring functions are restricted to authenticated, authorised users | Authentication; Design Obj. vi |
| FR-08 | Users can register an account and sign in | User Access; Auth module |
| FR-09 | Signed-in users can react (like/dislike) to and comment on articles | Comments & Feedback (Level 1 DFD, process 4.0) |
| FR-10 | Visitors can subscribe to a newsletter/mailing list | Subscription module |
| FR-11 | Administrators can manage user accounts and view system activity | Administration module; Reports |
| FR-12 | Navigation must let users locate information easily | User-Friendly Navigation |

### 4.2.2 Non-Functional Requirements

**Table 4.2 — Consolidated non-functional requirements and how they are addressed**

| ID | Quality attribute | Requirement | Implementation response (see section) |
| :-- | :--- | :--- | :--- |
| NFR-01 | Usability | Simple interface usable without training | Clean, conventional layout; server-rendered pages (§4.9) |
| NFR-02 | Performance | Respond quickly and display content efficiently | React Server Components, connection pooling, fail-fast DB timeouts (§4.5) |
| NFR-03 | Security | Protect admin functions and sensitive data from unauthorised access | Route guards, hashed credentials via Supabase Auth, tamper-proof roles, Row-Level Security (§4.6, §4.7) |
| NFR-04 | Reliability | Available and consistent when needed | Seed-data fallback + circuit breaker so pages always render (§4.5.2) |
| NFR-05 | Maintainability | Easy for developers to maintain and extend | Decoupled content layer, typed schema, versioned migrations (§4.5, §4.6) |
| NFR-06 | Accessibility | Usable on computers, tablets and smartphones | Responsive Tailwind layout; dedicated accessibility page (§4.9) |
| NFR-07 | Scalability | Accommodate more categories, users and content over time | Stateless serverless rendering; pooled Postgres; data-driven categories/departments (§4.5.5) |

### 4.2.3 Input–Process–Output (IPO) Realisation

The IPO analysis of Chapter Three maps directly onto the implemented system, as
summarised in Table 4.3.

**Table 4.3 — Input–Process–Output mapping to the implementation**

| Stage | Chapter 3 description | As implemented |
| :-- | :--- | :--- |
| Input | Articles, announcements, event data, images, categories, login details | Admin authoring forms, sign-in/sign-up forms, newsletter and comment forms |
| Process | Validate, store, categorise, make approved content available | Server Actions validate input, write through the content layer to Postgres (or the in-memory store), and revalidate affected pages |
| Output | Published news, categorised articles, search results, archived news | Rendered home, news, category, department, event, search and article pages |

---

## 4.3 Choice of Development Tools and Technologies

The system is a **three-tier web application** built entirely on a TypeScript
stack. The tools were chosen to satisfy the non-functional requirements
(particularly maintainability, performance and security) while remaining
deployable at zero infrastructure cost for a student project. Table 4.4
summarises each tool and the reason for its selection.

**Table 4.4 — Development tools and justification**

| Layer | Tool / Technology | Version | Role in the project | Why it was chosen |
| :-- | :--- | :--- | :--- | :--- |
| Language | TypeScript | 5.x | Single language across UI, server logic and database schema | Static typing catches errors before run time (supports NFR-05) |
| Framework | Next.js (App Router, Turbopack) | 16.3.0 | Routing, server rendering, Server Actions, request proxy | One framework covers presentation and application tiers; React Server Components give fast first paint (NFR-02) |
| UI library | React | 19.2.8 | Component-based user interface | Industry-standard, integrates natively with Next.js |
| Styling | Tailwind CSS (+ Typography plugin) | 4.x | Utility-first, responsive styling | Rapid, consistent, mobile-first UI (NFR-01, NFR-06) |
| Icons | lucide-react | 1.29.0 | Interface icons | Lightweight, tree-shakeable SVG icon set |
| ORM | Drizzle ORM + drizzle-kit | 0.45.2 / 0.31.10 | Typed database schema, queries and migrations | Schema-as-code with generated SQL migrations (NFR-05) |
| Database driver | postgres (postgres.js) | 3.4.9 | PostgreSQL connectivity via the transaction pooler | Works with Supabase's Supavisor pooler on serverless hosts |
| Database | PostgreSQL (via Supabase) | 15+ | Persistent data store and authentication backend | Reliable relational store; Supabase adds hosted Auth and Row-Level Security |
| Auth | @supabase/ssr, @supabase/supabase-js | 0.12.4 / 2.112.1 | Server-side session handling and authentication | Verified sessions, hashed passwords, tamper-proof roles (NFR-03) |
| Validation | Zod, react-hook-form | 4.4.3 / 7.84.0 | Input validation and form handling | Declarative, type-safe validation of user input |
| Data fetching | @tanstack/react-query | 5.101.4 | Client-side cache for interactive widgets | Smooth engagement interactions |
| Testing | Playwright, ESLint, `tsc` | 1.62 / 9 / 5 | End-to-end tests, linting, type-checking | Automated quality gates (§4.10) |
| Runtime | Node.js | 22.x | JavaScript runtime for development and build | LTS runtime supported by Next.js 16 |
| Hosting | Vercel | — | Production deployment platform | First-class Next.js support; free tier suitable for the project |
| Version control | Git / GitHub | — | Source control and collaboration | Standard tooling; enables continuous deployment |

---

## 4.4 System Requirements

### 4.4.1 Hardware Requirements

Because the portal is a web application, most users need only an internet-enabled
device and a browser. Table 4.5 lists representative requirements.

**Table 4.5 — Hardware requirements**

| Role | Component | Minimum | Recommended |
| :-- | :--- | :--- | :--- |
| Developer machine | Processor | Dual-core 2.0 GHz | Quad-core 2.5 GHz+ |
| | Memory (RAM) | 4 GB | 8 GB+ |
| | Storage | 5 GB free | 10 GB+ (SSD) |
| Server / host | Compute | Provided by Vercel serverless functions | — |
| | Database | Supabase-managed PostgreSQL instance | — |
| End-user device | Any | Smartphone, tablet, laptop or desktop with a modern browser | — |

### 4.4.2 Software Requirements

**Table 4.6 — Software requirements**

| Environment | Software | Purpose |
| :-- | :--- | :--- |
| Development | Node.js 22 LTS & npm | Install dependencies, run the dev server and build |
| | Git | Version control |
| | Code editor (e.g. VS Code) | Writing and editing source code |
| | Modern web browser | Previewing the application |
| Runtime (server) | Vercel (Node.js runtime) | Hosting the built Next.js application |
| | Supabase (PostgreSQL + Auth) | Persistent storage and authentication |
| End user | Any modern browser (Chrome, Firefox, Edge, Safari) | Accessing the portal |

> **Zero-configuration mode.** A distinctive property of the implementation is
> that it runs with **no database and no environment file at all**: content is
> served from a built-in seed dataset. This means the minimum software required
> to *demonstrate* the system is simply Node.js and a browser — the two commands
> `npm install` and `npm run dev`. The role of the database and authentication
> services is explained in Section 4.5.

---

## 4.5 System Architecture

This section describes the architecture at a mid-to-high level of detail. It is
the core of the chapter: it explains not only the tiers of the application but
also the specific mechanisms — the content abstraction layer, the seed/database
duality, and the request-time circuit breaker — that make the system reliable.

### 4.5.1 Architectural Overview

The system follows the classic **three-tier architecture** described in Chapter
Three (presentation tier, application/logic tier, data tier), realised inside a
single Next.js application. In Next.js's App Router model the presentation and
application tiers co-exist in the same codebase but execute in different places:
**React Server Components** and **Server Actions** run on the server (the
application tier), while a thin layer of client components provides interactivity
in the browser (the presentation tier). The data tier is a managed PostgreSQL
database reached through an ORM, with a built-in seed dataset acting as a
fallback data source.

**Figure 4.1 — High-level system architecture**

```mermaid
flowchart TD
    subgraph Client["PRESENTATION TIER — Browser / Client"]
        UI["React client components<br/>(nav, forms, engagement widgets)"]
    end

    subgraph Edge["Request Proxy (proxy.ts)"]
        MW["Session refresh + route guards<br/>/admin → admin only · /portal → signed-in"]
    end

    subgraph App["APPLICATION TIER — Next.js 16 App Router (server)"]
        RSC["React Server Components<br/>(pages & layouts)"]
        SA["Server Actions<br/>(sign-in, authoring, comments, newsletter)"]
        CAL["Content Abstraction Layer<br/>src/lib/content/queries.ts · engagement.ts · mutations.ts"]
        AUTH["Auth Layer<br/>src/lib/auth/* · src/utils/supabase/*"]
    end

    subgraph Data["DATA TIER"]
        DB[("PostgreSQL / Supabase<br/>via Drizzle ORM + pooler")]
        SEED["Seed Dataset (in-memory)<br/>src/lib/content/seed.ts"]
        SUPA["Supabase Auth<br/>(sessions, hashed passwords, roles)"]
    end

    UI -->|HTTP / form posts| MW
    MW --> RSC
    MW --> SA
    RSC --> CAL
    SA --> CAL
    SA --> AUTH
    RSC --> AUTH
    CAL -->|DATABASE_URL set| DB
    CAL -. "fallback: no DB or DB unreachable" .-> SEED
    AUTH --> SUPA
    AUTH -. "fallback: demo cookie" .-> SEED
```

*How to read Figure 4.1:* a request enters through the **proxy** (Next.js 16's
renamed middleware), which refreshes the session and enforces the route guards.
It is then handled by a Server Component (for page reads) or a Server Action (for
writes such as sign-in or authoring). Neither the pages nor the actions touch the
database directly; they call the **content abstraction layer**, which decides at
run time whether to read from PostgreSQL or from the seed dataset. Authentication
is handled by a parallel auth layer that prefers Supabase Auth and falls back to
a demo cookie when Supabase is not configured.

### 4.5.2 The Content Abstraction Layer and the Seed/Database Duality

The single most important architectural decision in the system is the
**content abstraction layer**. Every page reads content through the functions in
`src/lib/content/queries.ts` and nothing else; no page ever writes a database
query itself. Each function delegates to one of two interchangeable
implementations:

* `queries.db.ts` — reads from PostgreSQL using Drizzle ORM;
* `queries.seed.ts` — reads from the in-memory seed dataset.

The choice is made at run time by a single helper, `readWithFallback`, in
`src/lib/content/source.ts`. Its behaviour is:

1. If `DATABASE_URL` is **not** set, always serve seed data (the zero-config
   demo).
2. If it **is** set, read from the database, but if the call fails, serve seed
   data so the page still renders.
3. If the failure indicates the database as a whole is unavailable (bad
   credentials, unreachable host, migrations not run), a **circuit breaker**
   serves seed data for the next 30 seconds instead of letting every subsequent
   query wait out its own connection timeout.

```typescript
// src/lib/content/source.ts (abridged)
export async function readWithFallback<T>(
  label: string,
  fromDatabase: () => Promise<T>,
  fromSeed: () => T | Promise<T>,
): Promise<T> {
  if (!isDatabaseConfigured() || breakerOpen()) return fromSeed();
  try {
    return await fromDatabase();
  } catch (error) {
    if (isUnavailableError(error)) unavailableUntil = Date.now() + RETRY_AFTER_MS;
    return fromSeed();               // the page still renders
  }
}
```

This design directly satisfies the **reliability** requirement (NFR-04): the
public site never shows a database error to a reader. It also satisfies
**maintainability** (NFR-05): because pages depend only on the `queries.ts`
interface, the database implementation can change without touching a single page.

Writes behave differently and deliberately do **not** fall back: with a database
configured, an admin write goes to the database or fails loudly, because quietly
writing to in-memory state on a serverless host would silently lose the data.

**Figure 4.2 — Read path with fallback and circuit breaker (sequence)**

```mermaid
sequenceDiagram
    participant P as Page (Server Component)
    participant Q as queries.ts
    participant S as readWithFallback (source.ts)
    participant DB as PostgreSQL (Drizzle)
    participant SD as Seed dataset

    P->>Q: getArticles({ page: 1 })
    Q->>S: readWithFallback('getArticles', db, seed)
    alt DATABASE_URL not set OR breaker open
        S->>SD: read from seed
        SD-->>P: articles (seed)
    else database configured
        S->>DB: SELECT ... FROM articles
        alt query succeeds
            DB-->>P: articles (live)
        else database unavailable
            S->>S: open circuit breaker (30s)
            S->>SD: read from seed
            SD-->>P: articles (fallback)
        end
    end
```

### 4.5.3 Rendering and Write Model

* **Reads** are performed by React Server Components. Pages are rendered on the
  server, so the browser receives fully-formed HTML — good for performance
  (NFR-02) and for users on modest devices and connections.
* **Writes** are performed by **Server Actions** — server functions invoked
  directly from forms (sign-in, sign-up, article authoring, commenting,
  newsletter subscription). After a successful write, the affected pages are
  revalidated so readers immediately see the change.
* **Interactivity** (e.g. the like/dislike widget, the mobile navigation drawer,
  the breaking-news ticker) is provided by small client components.

### 4.5.4 Repository Structure

The repository layout mirrors the architecture. Table 4.7 maps the principal
directories to their responsibilities.

**Table 4.7 — Source directory responsibilities**

| Path | Tier / concern | Responsibility |
| :-- | :--- | :--- |
| `src/app/(site)/` | Presentation | Public routes: home, news, categories, departments, events, search, legal pages |
| `src/app/admin/` | Presentation | Administration dashboard, article management, users, settings, admin login |
| `src/app/portal/` | Presentation | Signed-in landing area for students and lecturers |
| `src/app/login`, `signup` | Presentation | Authentication entry pages |
| `src/components/layout/` | Presentation | Navbar, TopBar, Footer, MobileNav, breaking-news ticker |
| `src/components/ui/` | Presentation | ArticleCard, EventCard, Pagination, ShareLinks, engagement, newsletter form |
| `src/lib/content/` | Application | Content abstraction layer: queries, mutations, engagement, seed data, types |
| `src/lib/auth/` | Application | Sessions, roles, sign-in/up/out actions, demo accounts, profile sync |
| `src/utils/supabase/` | Application/Data | Supabase server/browser/admin clients and session proxy |
| `src/db/` | Data | Drizzle schema, database client, seed loader |
| `src/proxy.ts` | Application (edge) | Session refresh and route protection |
| `drizzle/` | Data | Generated SQL migration and snapshot |
| `scripts/` | Ops | Role assignment, user seeding, Supabase connectivity check |
| `tests/` | Quality | Playwright end-to-end test harness |

### 4.5.5 Deployment Topology

In production the application is deployed to **Vercel** and connects to a
**Supabase** PostgreSQL database through the transaction pooler (Supavisor, port
6543). Every table has Row-Level Security enabled with no policies, so even
though Supabase exposes the public schema through a browser-visible Data API,
that API can neither read nor write the application's tables; only the server —
connecting as the table owner through the pooler — can.

**Figure 4.3 — Deployment topology**

```mermaid
flowchart LR
    U["User's browser"] -->|HTTPS| V["Vercel<br/>(Next.js server + serverless functions)"]
    V -->|"pooled SQL, port 6543"| PG[("Supabase PostgreSQL<br/>RLS enabled, no policies")]
    V -->|"HTTPS (verify session, sign in/up)"| A["Supabase Auth"]
    B["Browser (publishable key)"] -. "blocked by RLS" .-x PG
```

---

## 4.6 Database Design and Implementation

### 4.6.1 Approach

The database schema is defined **as code** in `src/db/schema.ts` using Drizzle
ORM, and the corresponding SQL is generated into a versioned migration
(`drizzle/0000_init.sql`). Defining the schema in TypeScript means the same type
definitions flow through the queries and into the pages, eliminating a whole
class of mismatches between the database and the application (supporting NFR-05).

The schema comprises **sixteen tables**, grouped as follows:

* **Identity & auth:** `roles`, `user`, `session`, `account`, `verification`
* **Content taxonomy:** `categories`, `departments`, `tags`, `certificate_courses`
* **Content:** `articles`, `article_tags`, `media`
* **Engagement:** `comments`, `article_reactions`
* **Events & mailing list:** `events`, `newsletter_subscribers`

### 4.6.2 Entity–Relationship Diagram

Figure 4.4 shows the core content and engagement entities and their
relationships. (Auth-plumbing tables — `session`, `account`, `verification` — are
omitted for clarity.)

**Figure 4.4 — Entity–Relationship diagram (core entities)**

```mermaid
erDiagram
    USER ||--o{ ARTICLES : "authors"
    USER ||--o{ COMMENTS : "writes"
    USER ||--o{ ARTICLE_REACTIONS : "reacts"
    USER }o--|| ROLES : "has"
    CATEGORIES ||--o{ ARTICLES : "classifies"
    DEPARTMENTS ||--o{ ARTICLES : "scopes"
    ARTICLES ||--o{ COMMENTS : "receives"
    ARTICLES ||--o{ ARTICLE_REACTIONS : "receives"
    ARTICLES ||--o{ ARTICLE_TAGS : "tagged by"
    TAGS ||--o{ ARTICLE_TAGS : "labels"

    USER {
        text id PK
        text name
        text email UK
        boolean emailVerified
        varchar role "admin/lecturer/student"
        uuid role_id FK
    }
    ARTICLES {
        uuid id PK
        varchar title
        varchar slug UK
        jsonb content
        text author_id FK
        uuid category_id FK
        uuid department_id FK
        boolean is_published
        boolean is_featured
        integer views
        timestamp published_at
    }
    CATEGORIES {
        uuid id PK
        varchar name
        varchar slug UK
    }
    DEPARTMENTS {
        uuid id PK
        varchar name
        varchar slug UK
        varchar abbreviation
    }
    COMMENTS {
        uuid id PK
        uuid article_id FK
        text author_id FK
        text content
        boolean is_approved
    }
    ARTICLE_REACTIONS {
        uuid article_id PK,FK
        text user_id PK,FK
        varchar kind "like/dislike"
    }
    TAGS {
        uuid id PK
        varchar name
        varchar slug UK
    }
    ARTICLE_TAGS {
        uuid article_id PK,FK
        uuid tag_id PK,FK
    }
    EVENTS {
        uuid id PK
        varchar title
        varchar slug UK
        timestamp starts_at
        boolean is_published
    }
    NEWSLETTER_SUBSCRIBERS {
        uuid id PK
        varchar email UK
    }
```

### 4.6.3 Data Dictionary (selected tables)

The following tables document the columns of the most important entities. They
form part of the physical database design.

**Table 4.8 — `articles` table**

| Column | Type | Constraints | Description |
| :-- | :--- | :--- | :--- |
| id | uuid | PK, default `gen_random_uuid()` | Unique article identifier |
| title | varchar(255) | NOT NULL | Headline |
| slug | varchar(255) | NOT NULL, UNIQUE | URL-friendly identifier |
| content | jsonb | NOT NULL | Body stored as structured content blocks |
| excerpt | text | | Short summary for cards/SEO |
| author_id | text | NOT NULL, FK → user(id) | Author of the article |
| category_id | uuid | NOT NULL, FK → categories(id) | Primary category |
| department_id | uuid | FK → departments(id) | Owning department (optional) |
| featured_image | text | | URL of the lead image |
| is_published | boolean | NOT NULL, default false | Draft vs. published |
| is_featured | boolean | NOT NULL, default false | Highlighted on the home page |
| views | integer | NOT NULL, default 0 | View counter |
| reading_minutes | integer | NOT NULL, default 1 | Estimated reading time |
| published_at | timestamp | | First-publish timestamp |
| created_at / updated_at | timestamp | NOT NULL, default now() | Audit timestamps |

**Table 4.9 — `user` table**

| Column | Type | Constraints | Description |
| :-- | :--- | :--- | :--- |
| id | text | PK | Account identifier (mirrors the Supabase Auth id) |
| name | text | NOT NULL | Display name |
| email | text | NOT NULL, UNIQUE | Login/contact email |
| emailVerified | boolean | NOT NULL | Whether the email is confirmed |
| image | text | | Avatar URL |
| role_id | uuid | FK → roles(id) | Relational role reference |
| role | varchar(20) | | Mirror of the verified role (admin/lecturer/student) |
| job_title | varchar(100) | | Byline job title |
| bio | text | | Author biography |
| createdAt / updatedAt | timestamp | NOT NULL, default now() | Audit timestamps |

**Table 4.10 — `comments` table**

| Column | Type | Constraints | Description |
| :-- | :--- | :--- | :--- |
| id | uuid | PK, default `gen_random_uuid()` | Comment identifier |
| article_id | uuid | NOT NULL, FK → articles(id) ON DELETE CASCADE | Article commented on |
| author_id | text | NOT NULL, FK → user(id) ON DELETE CASCADE | Comment author |
| content | text | NOT NULL | Comment body |
| is_approved | boolean | NOT NULL, default true | Moderation flag (auto-approved by default) |
| created_at | timestamp | NOT NULL, default now() | Time posted |

**Table 4.11 — `article_reactions` table**

| Column | Type | Constraints | Description |
| :-- | :--- | :--- | :--- |
| article_id | uuid | PK (composite), FK → articles(id) ON DELETE CASCADE | Article reacted to |
| user_id | text | PK (composite), FK → user(id) ON DELETE CASCADE | Reacting user |
| kind | varchar(10) | NOT NULL, CHECK in ('like','dislike') | Reaction type |
| created_at | timestamp | NOT NULL, default now() | Time of reaction |

The composite primary key `(article_id, user_id)` enforces **one reaction per
user per article**; re-reacting replaces the existing row, and a `CHECK`
constraint guarantees the reaction is either a like or a dislike. This is a good
example of pushing an application rule down into the database, where it cannot be
bypassed.

```sql
-- drizzle/0000_init.sql (extract)
CREATE TABLE "article_reactions" (
    "article_id" uuid NOT NULL,
    "user_id"    text NOT NULL,
    "kind"       varchar(10) NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "article_reactions_article_id_user_id_pk"
        PRIMARY KEY("article_id","user_id"),
    CONSTRAINT "article_reactions_kind_check"
        CHECK ("kind" in ('like', 'dislike'))
);
```

**Table 4.12 — Other tables (summary)**

| Table | Purpose | Key columns |
| :-- | :--- | :--- |
| roles | Named role catalogue | id, name (unique) |
| categories | News categories | id, name, slug (unique) |
| departments | PTI academic departments | id, name, slug, abbreviation |
| tags | Free-form article labels | id, name, slug |
| article_tags | Article ↔ tag join (many-to-many) | article_id, tag_id (composite PK) |
| media | Uploaded media references | id, url, type, uploader_id |
| events | Campus events | id, title, slug, starts_at, is_published |
| certificate_courses | Short certificate programmes | id, name, slug |
| newsletter_subscribers | Mailing-list addresses | id, email (unique, lower-cased) |
| session / account / verification | Supabase Auth plumbing | per Supabase SSR |

### 4.6.4 Security at the Data Layer

Every table is created with **Row-Level Security (RLS) enabled and no policies**.
This is a deliberate security posture. The application server reaches Postgres
directly as the table owner through the pooler, so RLS does not impede it; but
Supabase also exposes the `public` schema through a Data API reachable with the
publishable key that ships to the browser. With RLS on and no policies, that API
can read and write nothing — closing off a common data-exposure route and
satisfying the **security** requirement (NFR-03) at the storage layer.

```typescript
// src/db/schema.ts (pattern applied to every table)
export const articles = pgTable('articles', {
  /* ...columns... */
}).enableRLS();   // RLS on, no policies → Data API cannot touch it
```

---

## 4.7 User Roles and Access Control (As Built)

### 4.7.1 The Delivered Role Model

The system recognises four effective actors:

* **Anonymous visitor** — can browse and search all published content and
  subscribe to the newsletter.
* **Student** — a signed-in reader who can additionally react to and comment on
  articles; lands on the `/portal` area.
* **Lecturer** — same capabilities as a student, distinguished by the role label
  shown on their comments; also lands on `/portal`.
* **Administrator** — reaches the `/admin` dashboard to create, edit, publish,
  unpublish and delete articles, and to manage users and system settings.

Roles are stored in the account's Supabase `app_metadata`, which users **cannot**
edit (they can only edit their own `user_metadata`), so nobody can grant
themselves administrative rights. Administrators are never self-registered; an
existing account is promoted with the `auth:set-role` script.

### 4.7.2 Access Control Enforcement

Access control is enforced in three layers, so that no single failure exposes a
protected area:

1. **The request proxy** (`src/proxy.ts`) is the first line: it redirects
   unauthenticated visitors away from `/portal` and non-administrators away from
   `/admin`.
2. **Layouts and pages** re-check on their own, because in the App Router a page
   and its layout can render in parallel — `requireAdmin()` protects privileged
   pages directly.
3. **Server Actions** re-validate the session before performing any write.

```typescript
// src/proxy.ts (extract) — first-line route protection
if (isAdminArea && !isAdminLogin) {
  if (!user) return redirectTo('/admin/login');
  if (user.role !== 'admin') return redirectTo('/portal');
}
if (isPortalArea && !user) return redirectTo('/login');
```

This behaviour was verified at run time (see Section 4.10): requesting `/admin`
or `/portal` without a session returns an HTTP 307 redirect to the appropriate
login page.

### 4.7.3 Dual Authentication Backend

Authentication has two interchangeable backends chosen automatically:

* **Supabase Auth** when the Supabase environment variables are set — verified
  sessions, hashed passwords, email confirmation and tamper-proof roles.
* **A demo cookie** otherwise — a throwaway, explicitly-insecure mechanism that
  lets the app be signed into out of the box for demonstration. It is disabled
  entirely once Supabase is configured.

**Figure 4.5 — Authentication and routing flow**

```mermaid
flowchart TD
    Start["User submits sign-in form"] --> Cfg{"Supabase Auth<br/>configured?"}
    Cfg -->|Yes| SB["supabase.auth.signInWithPassword"]
    Cfg -->|No| Demo["authenticateDemoUser (in-memory)"]
    SB --> Ok{"Valid<br/>credentials?"}
    Demo --> Ok
    Ok -->|No| Err["Redirect back to login with ?error=credentials"]
    Ok -->|Yes| Role{"role == admin?"}
    Role -->|Yes| Admin["Redirect to /admin"]
    Role -->|No| Portal["Redirect to /portal"]
```

### 4.7.4 Mapping to the Chapter Three Design

Table 4.13 maps the delivered roles and modules back onto the abstract design of
Chapter Three, reconciling the two chapters.

**Table 4.13 — Chapter 3 design → delivered implementation**

| Chapter 3 concept | Delivered implementation | Notes |
| :-- | :--- | :--- |
| Reader (student/staff/visitor) | Anonymous visitor + Student + Lecturer | Read, search, subscribe, comment, react |
| Contributor (submit drafts) | *Folded into Administrator* | Authoring is done in the secured admin area |
| Editor (review/approve/publish) | *Folded into Administrator* | Publish/unpublish is a direct action; no separate approval queue |
| Administrator | Administrator (`/admin`) | Manage articles, users and settings |
| Process 1.0 Manage User Accounts | `src/lib/auth/*`, `src/utils/supabase/*`, login/signup pages | §4.8.1 |
| Process 2.0 Manage News | `src/lib/content/{queries,mutations,store}`, `admin/articles/*` | §4.8.2–4.8.3 |
| Process 3.0 Manage Events | `events` table + `/events` routes | §4.8.5 |
| Process 4.0 Manage Comments & Feedback | `src/lib/content/engagement.ts`, `ArticleEngagement` | §4.8.7 |
| Process 5.0 Generate Reports | Admin dashboard statistics & Settings status panel | §4.8.9 |
| Data store D1 Users | `user`, `roles`, `session`, `account`, `verification` | §4.6 |
| Data store D2 News | `articles`, `categories`, `departments`, `tags`, `article_tags`, `media` | §4.6 |
| Data store D3 Events | `events`, `certificate_courses` | §4.6 |
| Data store D4 Comments | `comments`, `article_reactions` | §4.6 |

---

## 4.8 Implementation of System Modules

This section presents each functional module with a screenshot of the running
system as evidence of implementation. All screenshots were captured from the
application running locally in zero-configuration (seed) mode, which is populated
with 11 sample articles across 9 categories, 12 departments, 2 certificate
courses and 4 events.

### 4.8.1 Authentication Module

The authentication module provides sign-in (for readers and administrators),
registration, sign-out and session management. There are two sign-in entry
points — `/login` for students and lecturers, and `/admin/login` for
administrators — plus a `/signup` page where a visitor registers and chooses the
student or lecturer role. In demo mode each login page also lists the relevant
demo credentials.

![Reader sign-in page](chapter4-assets/login.png)
*Figure 4.6 — Reader sign-in page (`/login`)*

![Registration page with role choice](chapter4-assets/signup.png)
*Figure 4.7 — Registration page (`/signup`) with student/lecturer role selection*

### 4.8.2 News / Article Module

This module lists published articles with pagination and renders each article on
its own page. The home page surfaces a featured story, trending items, the latest
stories and upcoming events; the news index lists all articles; and the article
page renders the structured content blocks with a generated table of contents, an
author panel, related stories and share links.

![Home page](chapter4-assets/home.png)
*Figure 4.8 — Home page with featured story, breaking-news ticker, trending, latest stories and upcoming events*

![News listing page](chapter4-assets/news-list.png)
*Figure 4.9 — News index (`/news`) with article cards and pagination*

![Article detail page](chapter4-assets/article-detail.png)
*Figure 4.10 — Article page with featured image, table of contents, author panel and related stories*

Articles are grouped into categories; each category has its own listing page.

![Category listing page](chapter4-assets/category-research.png)
*Figure 4.11 — Category page (`/category/research`)*

### 4.8.3 Content Management (Authoring) Module

Administrators manage content from the `/admin` area. Articles can be listed,
created, edited, published/unpublished and deleted. The authoring form supports a
title, category, author, featured image and a formatted body; writes are
performed by Server Actions through the content abstraction layer (to the
database when configured, or the in-memory store in demo mode).

![Admin article list](chapter4-assets/admin-articles.png)
*Figure 4.12 — Article management list (`/admin/articles`)*

![New article form](chapter4-assets/admin-new.png)
*Figure 4.13 — Article authoring form (`/admin/articles/new`)*

### 4.8.4 Departments and Certificate Courses Module

The portal presents PTI's academic departments and its short certificate
programmes, each with its own detail page listing related articles.

![Departments directory](chapter4-assets/departments.png)
*Figure 4.14 — Departments directory (`/departments`)*

![Department detail page](chapter4-assets/department-detail.png)
*Figure 4.15 — Department page (`/departments/computer-science-information-technology`)*

### 4.8.5 Events Module

The events module lists upcoming and past campus events and renders each event on
its own page with date, time (or an all-day indication) and location.

![Events listing](chapter4-assets/events.png)
*Figure 4.16 — Events page (`/events`) showing upcoming and past events*

![Event detail](chapter4-assets/event-detail.png)
*Figure 4.17 — Event detail page*

### 4.8.6 Search and Retrieval Module

The search module matches a query against article titles, excerpts, category
names and tags (case-insensitive) over published articles, satisfying FR-03.

![Search results](chapter4-assets/search-results.png)
*Figure 4.18 — Search results for the query "innovation" (`/search?q=innovation`)*

### 4.8.7 Engagement Module (Comments & Feedback)

Signed-in users can like or dislike an article and leave comments; the
like/dislike widget enforces one reaction per user (see §4.6.3), and comments
show the author's role label. These actions are gated: an anonymous visitor is
prompted to sign in. This realises process 4.0 (Manage Comments & Feedback) of
the Chapter Three Level 1 DFD.

![Signed-in article view](chapter4-assets/article-engagement-signedin.png)
*Figure 4.19 — Article viewed by a signed-in user, showing the account in the navigation bar and enabled engagement controls*

### 4.8.8 Newsletter Subscription Module

Visitors can subscribe to the mailing list from the newsletter form embedded on
content pages (visible in Figure 4.10). Addresses are stored lower-cased with a
case-insensitive uniqueness constraint in the `newsletter_subscribers` table
(FR-10). This corresponds to the *subscription* half of process 5.0 in Chapter
Three; automatic email notification of new issues is identified as future work
(Section 4.11).

### 4.8.9 Administration Module (Dashboard, Users, Settings)

The administration module provides an overview dashboard with content statistics,
a user-management page, and a settings page whose **Backend status** panel
reports, at a glance, whether the database and authentication services are
connected — a lightweight realisation of the *reporting* intent of process 5.0.

![Admin dashboard](chapter4-assets/admin-dashboard.png)
*Figure 4.20 — Admin dashboard overview with content statistics and quick actions*

![Admin users page](chapter4-assets/admin-users.png)
*Figure 4.21 — User management page (`/admin/users`)*

![Admin settings page](chapter4-assets/admin-settings.png)
*Figure 4.22 — Settings page (`/admin/settings`) with the backend-status panel*

### 4.8.10 Supporting Features

Several supporting features complete the system:

* **Breaking-news ticker** — a scrolling banner for time-sensitive announcements
  (visible at the top of Figure 4.8).
* **Custom 404 page** — a friendly, branded page for unknown URLs.
* **Legal & accessibility pages** — Privacy, Terms and Accessibility pages.
* **Administrator sign-in** — a separate, clearly-labelled admin login.

![Custom 404 page](chapter4-assets/not-found.png)
*Figure 4.23 — Custom 404 (page-not-found) screen*

![Administrator sign-in](chapter4-assets/admin-login.png)
*Figure 4.24 — Administrator sign-in page (`/admin/login`)*

---

## 4.9 User Interface Implementation

The interface is built with Tailwind CSS following a **mobile-first, responsive**
approach, satisfying the accessibility and usability requirements (NFR-01,
NFR-06). The visual language uses PTI's institutional green as the primary
colour, a clear typographic hierarchy, generous white space and conventional
navigation patterns (a top navigation bar with a search action on desktop, and a
slide-in drawer on small screens). A dedicated `/accessibility` page documents
the site's accessibility commitments.

The same pages reflow gracefully to phone width. Figure 4.25 shows the home page,
news index and an article as rendered on a mobile viewport (iPhone 13), including
the collapsed mobile navigation.

![Mobile home page](chapter4-assets/mobile-home.png)
*Figure 4.25a — Home page on a mobile viewport*

![Mobile news listing](chapter4-assets/mobile-news-list.png)
*Figure 4.25b — News index on a mobile viewport*

![Mobile article page](chapter4-assets/mobile-article-detail.png)
*Figure 4.25c — Article page on a mobile viewport*

---

## 4.10 System Testing

Testing was carried out to confirm that the system meets its requirements and is
free of the classes of error that automated tools can detect. Three levels of
testing were applied: **static analysis**, **automated end-to-end testing** and
**functional (manual/route) testing**.

### 4.10.1 Static Analysis

Two static quality gates are run against the whole codebase:

* **Type checking** (`npm run typecheck`, i.e. `tsc --noEmit`) verifies that
  every value is used consistently with its type across the UI, server logic and
  database schema.
* **Linting** (`npm run lint`, ESLint with the Next.js configuration) enforces
  code-quality and framework-correctness rules.

Both gates pass with **no errors and no warnings**, as reproduced below.

```text
$ npm run typecheck
> tsc --noEmit
(no output — exit code 0)

$ npm run lint
> eslint .
(no output — exit code 0)
```

### 4.10.2 End-to-End Test Harness

An end-to-end testing harness is configured with **Playwright**
(`playwright.config.ts`, tests in `tests/`), targeting Chromium. Playwright
drives a real browser against the running application, which is the appropriate
technique for verifying user journeys such as sign-in, navigation and content
rendering. During development the same tooling was used to script the browser
that captured the screenshots in Section 4.8, confirming that every documented
route renders without a client-side error.

### 4.10.3 Functional / Route Testing

The core user-facing routes and the access-control rules were exercised against
the running server and their HTTP responses recorded. Table 4.14 presents the
results.

**Table 4.14 — Functional test cases and results**

| # | Test case | Route / action | Expected | Actual | Result |
| :-- | :--- | :--- | :--- | :--- | :--- |
| T1 | Home page loads | `GET /` | 200 OK | 200 | Pass |
| T2 | News index loads | `GET /news` | 200 OK | 200 | Pass |
| T3 | Article detail loads | `GET /news/pti-unveils-new-innovation-hub` | 200 OK | 200 | Pass |
| T4 | Category page loads | `GET /category/research` | 200 OK | 200 | Pass |
| T5 | Departments directory loads | `GET /departments` | 200 OK | 200 | Pass |
| T6 | Department detail loads | `GET /departments/computer-science-information-technology` | 200 OK | 200 | Pass |
| T7 | Events page loads | `GET /events` | 200 OK | 200 | Pass |
| T8 | Event detail loads | `GET /events/ogtan-conference-expo-2026` | 200 OK | 200 | Pass |
| T9 | Search returns results | `GET /search?q=innovation` | 200 OK | 200 | Pass |
| T10 | Reader login page loads | `GET /login` | 200 OK | 200 | Pass |
| T11 | Admin login page loads | `GET /admin/login` | 200 OK | 200 | Pass |
| T12 | Registration page loads | `GET /signup` | 200 OK | 200 | Pass |
| T13 | Legal pages load | `GET /privacy`, `/terms`, `/accessibility` | 200 OK | 200 | Pass |
| T14 | **Admin area is protected** | `GET /admin` (no session) | Redirect to login | 307 → `/admin/login` | Pass |
| T15 | **Portal is protected** | `GET /portal` (no session) | Redirect to login | 307 → `/login` | Pass |
| T16 | Unknown URL handled | `GET /nonexistent-xyz` | 404 Not Found | 404 | Pass |
| T17 | Admin can sign in | Submit admin credentials | Land on `/admin` | Landed on `/admin` | Pass |
| T18 | Student can sign in | Submit student credentials | Land on `/portal` | Landed on `/portal` | Pass |

Test cases T14 and T15 confirm the access-control requirement (FR-07, NFR-03):
protected areas correctly redirect unauthenticated requests. T17 and T18 confirm
role-based routing after authentication.

---

## 4.11 Discussion of Results

The implemented Campus News Web Portal satisfies the objectives set out in
Chapter Three. Table 4.15 traces each functional requirement to the evidence of
its implementation.

**Table 4.15 — Requirements traceability matrix**

| Req. | Satisfied by | Evidence |
| :-- | :--- | :--- |
| FR-01 Browse published news | Public routes, content layer | Figs. 4.8–4.10; T1–T3 |
| FR-02 Categorised / departmental news | Categories & departments | Figs. 4.11, 4.14–4.15; T4–T6 |
| FR-03 Search | Search module | Fig. 4.18; T9 |
| FR-04 Archive | Persistent articles, permalinks | Figs. 4.9–4.10 |
| FR-05 Create/edit/publish/delete news | Admin authoring + mutations | Figs. 4.12–4.13 |
| FR-06 Event information | Events module | Figs. 4.16–4.17; T7–T8 |
| FR-07 Restricted admin functions | Proxy + `requireAdmin` + action checks | Fig. 4.5; T14–T15 |
| FR-08 Register / sign in | Auth module | Figs. 4.6–4.7, 4.24; T10–T12, T17–T18 |
| FR-09 React / comment | Engagement module | Fig. 4.19 |
| FR-10 Newsletter subscription | Newsletter module | Fig. 4.10; §4.8.8 |
| FR-11 Manage users / activity | Admin users & dashboard | Figs. 4.20–4.22 |
| FR-12 Easy navigation | Navbar, mobile drawer, breadcrumbs | Figs. 4.8, 4.25 |

The non-functional requirements are addressed as summarised in Table 4.2 and
demonstrated through the architecture (Section 4.5) and testing (Section 4.10):
the seed/database duality with a circuit breaker delivers **reliability**;
server rendering and connection pooling deliver **performance**; the layered
access control, hashed credentials, tamper-proof roles and RLS deliver
**security**; the decoupled content layer and typed, migration-driven schema
deliver **maintainability**; and the responsive interface delivers
**accessibility**.

**Limitations and future work.** In keeping with an honest account of the build,
the following are noted as areas for future work: (i) a distinct
*contributor → editor* approval workflow (as originally envisaged in Chapter
Three) is not implemented — authoring and publishing are combined in the admin
area; (ii) comments are auto-approved rather than passing through a moderation
queue, although the `is_approved` column exists to support moderation later;
(iii) automatic email notification of subscribers when a new issue is published
is not yet implemented (only subscription capture is); and (iv) media uploads are
referenced by URL rather than uploaded through the interface. None of these
affects the core objective — a centralised, searchable, permanently-archived
campus news platform — which has been met.

---

## 4.12 Summary

This chapter described the implementation and testing of the PTI Campus News Web
Portal. It justified the choice of a TypeScript/Next.js/PostgreSQL stack, stated
the hardware and software requirements, and set out the three-tier architecture
in detail — in particular the content abstraction layer whose seed/database
duality and circuit breaker allow the site to render reliably with or without a
database. It documented the sixteen-table database schema, its entity
relationships and its Row-Level-Security posture; described the delivered role
and access-control model and mapped it back to the Chapter Three design; and
presented each functional module with screenshots of the running system.
Finally, it reported the testing performed — static type-checking and linting
(both clean), an end-to-end Playwright harness, and a suite of functional route
tests (all passing) — and traced every requirement to the evidence of its
implementation. Chapter Five draws conclusions from this work and offers
recommendations.

---

## Appendix A — Guide to Extracting Code Listings

The listings below are the recommended code excerpts for the project appendix.
For each, the file and (approximate) line range are given, together with a
command to print exactly those lines so they can be pasted into the appendix.
Run the commands from the repository root. (`sed -n 'START,ENDp' FILE` prints a
line range; adjust the range if the file has changed.)

**Table A.1 — Recommended appendix code listings**

| # | Listing | File | Lines (approx.) | Extraction command |
| :-- | :--- | :--- | :--- | :--- |
| A-1 | Database schema (all tables) | `src/db/schema.ts` | 1–170 | `sed -n '1,170p' src/db/schema.ts` |
| A-2 | Generated SQL migration | `drizzle/0000_init.sql` | 1–188 | `cat drizzle/0000_init.sql` |
| A-3 | Content abstraction — read API | `src/lib/content/queries.ts` | 1–100 | `sed -n '1,100p' src/lib/content/queries.ts` |
| A-4 | Fallback + circuit breaker | `src/lib/content/source.ts` | 42–101 | `sed -n '42,101p' src/lib/content/source.ts` |
| A-5 | Article write path (mutations) | `src/lib/content/mutations.ts` | 25–86 | `sed -n '25,86p' src/lib/content/mutations.ts` |
| A-6 | Engagement (likes/comments) | `src/lib/content/engagement.ts` | 40–77 | `sed -n '40,77p' src/lib/content/engagement.ts` |
| A-7 | Sign-in / sign-up Server Actions | `src/lib/auth/actions.ts` | 31–118 | `sed -n '31,118p' src/lib/auth/actions.ts` |
| A-8 | Route protection (proxy) | `src/proxy.ts` | 18–69 | `sed -n '18,69p' src/proxy.ts` |
| A-9 | Server-side session / requireAdmin | `src/lib/auth/server.ts` | 28–56 | `sed -n '28,56p' src/lib/auth/server.ts` |
| A-10 | Database client (pooled) | `src/db/index.ts` | 20–66 | `sed -n '20,66p' src/db/index.ts` |
| A-11 | Content view-model types | `src/lib/content/types.ts` | 46–113 | `sed -n '46,113p' src/lib/content/types.ts` |
| A-12 | Roles definition | `src/lib/auth/roles.ts` | 1–18 | `cat src/lib/auth/roles.ts` |

To export every listing to a single file for the appendix:

```bash
for f in src/db/schema.ts drizzle/0000_init.sql src/lib/content/queries.ts \
         src/lib/content/source.ts src/lib/content/mutations.ts \
         src/lib/content/engagement.ts src/lib/auth/actions.ts src/proxy.ts \
         src/lib/auth/server.ts src/db/index.ts src/lib/content/types.ts \
         src/lib/auth/roles.ts; do
  echo -e "\n\n===== $f =====\n" ; cat "$f" ;
done > appendix-code.txt
```

---

## Appendix B — Guide to the Figures and Diagrams

* **Rendered diagrams (Figures 4.1–4.5).** These are written in
  [Mermaid](https://mermaid.js.org/) directly in this Markdown file. They render
  automatically on GitHub and in most Markdown viewers. **Pre-rendered PNG copies
  are also provided** in `chapter4-assets/` for pasting straight into a Word
  document: `diagram-4.1-architecture.png`, `diagram-4.2-read-fallback-sequence.png`,
  `diagram-4.3-deployment.png`, `diagram-4.4-erd.png` and
  `diagram-4.5-auth-flow.png`. To re-export or edit them, paste the fenced
  ` ```mermaid ``` ` block into the [Mermaid Live Editor](https://mermaid.live)
  and use **Actions → PNG/SVG**, or install the Mermaid CLI
  (`npm i -g @mermaid-js/mermaid-cli`) and run `mmdc -i figure.mmd -o figure.png`.
* **Screenshots (Figures 4.6–4.25).** These are stored in `chapter4-assets/` and
  were captured from the running application. To re-capture them, start the app
  with `npm run dev`, open the listed route in a browser, and take a full-page
  screenshot. (The whole set can be regenerated with a Playwright script that
  visits each route and calls `page.screenshot({ fullPage: true })`.)
* **Consistency with Chapter 3.** The context diagram and Level 1 DFD in Chapter
  Three remain the authoritative logical view; the diagrams here (architecture,
  ERD, sequence and flow) are the physical/implementation counterparts. Section
  4.7.4 (Table 4.13) links the two.

---

### List of Figures

| Figure | Title |
| :-- | :--- |
| 4.1 | High-level system architecture |
| 4.2 | Read path with fallback and circuit breaker (sequence) |
| 4.3 | Deployment topology |
| 4.4 | Entity–Relationship diagram (core entities) |
| 4.5 | Authentication and routing flow |
| 4.6 | Reader sign-in page |
| 4.7 | Registration page |
| 4.8 | Home page |
| 4.9 | News index |
| 4.10 | Article page |
| 4.11 | Category page |
| 4.12 | Article management list |
| 4.13 | Article authoring form |
| 4.14 | Departments directory |
| 4.15 | Department page |
| 4.16 | Events page |
| 4.17 | Event detail page |
| 4.18 | Search results |
| 4.19 | Signed-in article view (engagement) |
| 4.20 | Admin dashboard |
| 4.21 | User management page |
| 4.22 | Settings page (backend status) |
| 4.23 | Custom 404 page |
| 4.24 | Administrator sign-in |
| 4.25 | Responsive (mobile) views |

### List of Tables

| Table | Title |
| :-- | :--- |
| 4.1 | Consolidated functional requirements |
| 4.2 | Consolidated non-functional requirements |
| 4.3 | Input–Process–Output mapping |
| 4.4 | Development tools and justification |
| 4.5 | Hardware requirements |
| 4.6 | Software requirements |
| 4.7 | Source directory responsibilities |
| 4.8–4.12 | Data dictionary (articles, user, comments, reactions, others) |
| 4.13 | Chapter 3 design → delivered implementation |
| 4.14 | Functional test cases and results |
| 4.15 | Requirements traceability matrix |
| A.1 | Recommended appendix code listings |
