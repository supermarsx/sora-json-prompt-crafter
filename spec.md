# Sora JSON Prompt Crafter — Functional & Technical Specification

**Doc status:** v1.0 (initial pass based on repository snapshot)

**Owners:** _Product_: TBD · _Tech Lead_: TBD · _Design_: TBD · _QA_: TBD

**Last updated:** 2025‑08‑17

---

## 1) Overview

Sora JSON Prompt Crafter is a **browser‑only PWA** for crafting, validating, and sharing structured JSON prompts for OpenAI’s Sora (or similar video/image generation pipelines). It exposes a modular UI to compose prompts by domain (style, camera, lighting, etc.), generates a clean JSON payload, and optionally **injects** that payload into a Sora page via a userscript or a cross‑tab postMessage handshake. A small Node CLI mirrors the same core logic for batch/CI use.

**Key properties**
- 100% **client‑side** (no backend). Optional GitHub stats + Google Analytics can be toggled off.
- **PWA**: offline-capable via Service Worker with pre‑cache of app shell + localized disclaimers.
- **i18n**: dynamic locale loading; many bundled locales.
- **Validation**: strict Zod schema; unknown keys rejected; safe parsing; flag auto‑inference.
- **DX/Quality**: React 18 + TypeScript, Vite 5, Tailwind + shadcn/ui; Jest + RTL + jest‑axe, accessibility script over built HTML.
- **CLI**: Read flags / file / stdin; outputs normalized JSON.

Non‑goals: Model execution, server persistence, user accounts, collaborative editing.

---

## 2) Primary personas & use cases

- **Creator/Prompt Engineer**: Needs a fast, guided way to build consistent Sora JSON prompts with presets and validation.
- **Researcher/Team**: Wants sharable, deterministic JSON payloads and a CLI for batch jobs.
- **Educator/Community**: Localized UI and downloadable examples; safe defaults with guardrails.

---

## 3) User experience (happy‑path flows)

### 3.1 Compose & export
1) Open app → select language → (optional) enable tracking.
2) Fill **Prompt**; toggle **Negative prompt**.
3) Expand sections (Core, Dimensions, Style, Camera/Composition, Video Motion, Material, Lighting, Color, Face, Enhancements, DnD) and set options.
4) Generated JSON appears in the right panel with diff highlighting as options change.
5) Export actions: **Copy**, **Download**, **Share**, **Clear**, **Send to Sora**.

### 3.2 Import JSON
- Paste JSON, select file, or **bulk‑import** a folder of JSON files. Invalid objects are rejected with reasons. For valid objects, enabling flags are auto‑toggled to match provided fields.

### 3.3 Send to Sora
- Click **Send to Sora** → opens Sora in a new tab → app repeatedly posts `{ type: 'INSERT_SORA_JSON', json }` until an ACK is received → Sora textarea is populated.
- Alternative: **userscript** embedded in the target page listens for messages and injects JSON.

### 3.4 Settings & utilities
- **Dark mode**, **action labels**, **Sora tools**, **header buttons**, **logo** toggles.
- **Disclaimer** modal (per locale). **Update available** notice when SW has a waiting update.

---

## 4) Functional requirements

### 4.1 Sections & fields (UI → JSON)
Each section can be globally **enabled/disabled**. When disabled, related keys are **removed** from the output JSON. When enabled, defaults are included unless user edits override.

> Note: exact enum lists are maintained in `src/data/*`. This spec groups fields conceptually; use repo enums for authoritative values.

#### A) Prompt
- `prompt: string` (required)
- `use_negative_prompt: boolean` → when true, include `negative_prompt: string`.

#### B) Core Settings
- `seed: number`, `steps: number (1..100)`, `guidance_scale: number`, `cfg_rescale: number`.
- `use_core_settings: boolean` master switch for exposing/controlling these.

#### C) Dimensions & Format
- `use_dimensions_format: boolean` → governs `width`, `height`, `aspect_ratio`, `output_format`, `dynamic_range`.
- `use_dimensions: boolean` → governs inclusion of `width`, `height` specifically.

#### D) Style
- `use_style_preset: boolean`.
- `style_preset: { category: string; style: string }` (options from `stylePresets`).

#### E) Camera & Composition
- `use_camera_composition: boolean`.
- `camera_angle`, `shot_type`, `subject_focus`, `composition_rules[]` (from `cameraPresets`).
- Optional camera controls: `use_camera_angle`, `camera_type`, `use_lens_type`, `lens_type`, `use_aperture`, `aperture`, `use_dof`, `depth_of_field`, `use_blur_style`, `blur_style`.

#### F) Video Motion
- `camera_motion: string`, `motion_direction: 'forward'|'backward'|'left'|'right'|'up'|'down'`.
- `frame_interpolation: 'smooth'|'realistic'|'sharp'`.
- `fps: number` (default max 60; **`extended_fps`** allows up to 240).
- `duration: number` (seconds; behind **`use_duration`** flag).
- `extended_motion_strength: boolean` (unlocks wider ranges for motion strength sliders when applicable).

#### G) Material & Environment
- `use_material`, `made_out_of`.
- `use_secondary_material`, `secondary_material`.
- `use_environment`, `environment`.
- `use_location`, `location`.
- `use_time_of_year`, `time_of_year` / `season`.

#### H) Lighting & Color
- `use_lighting`, `lighting` (from `lightingOptions`).
- `use_color_grading`, `color_grade` (from `colorGradingOptions`).
- Additional image look controls: `use_black_and_white`, `black_and_white_preset`; `special_effects`; `lut_preset`.

#### I) People/Face & Character vibes
- `use_face`: face‑oriented settings.
- Character attributes: `subject_gender`, `makeup_style`, `character_mood`, `subject_mood`.

#### J) Enhancements & Safety
- `use_enhancement_safety: boolean`.
- `prevent_deformities: boolean`.
- `quality_booster: string` (when enabled by UI).
- `safety_filter: 'strict'|'moderate'|'off'`.
- `upscale: number` (gated by `use_upscale_factor`).

#### K) DnD (world‑building helpers)
- Master: `use_dnd_section: boolean`.
- Character: `use_dnd_character_race`, `dnd_character_race`; `use_dnd_character_class`, `dnd_character_class`; `use_dnd_character_background`, `dnd_character_background`; `use_dnd_character_alignment`, `dnd_character_alignment`.
- World: `use_dnd_environment`, `dnd_environment`; `use_dnd_magic_school`, `dnd_magic_school`; `use_dnd_item_type`, `dnd_item_type`.
- Monsters: `use_dnd_monster_type`, `dnd_monster_type`.

#### L) Misc/Extended
- The validation layer whitelists several additional string fields used across sections (e.g., `signature`, `atmosphere_mood`, `sword_type`, `sword_vibe`, etc.). When present and enabled by related toggles, include them and infer enable flags (see 4.3).

### 4.2 Generated JSON panel
- Renders the current JSON with **inline diff** from the previous version (character‑level diff) for visual feedback.
- Actions: **Copy**, **Download**, **Clear**, **Scroll into view** (from control panel), **Share** (generates shareable link with embedded state), **Send to Sora**.
- Performance: keep ~last N revisions for diffing only; avoid unbounded memory growth.

### 4.3 Import & flag auto‑inference
- **Import Modal**: paste JSON or select a single file.
- **Bulk Import**: select multiple `.json` files; valid ones appear in History and can be individually loaded.
- **Validation**: `isValidOptions(obj)` (Zod). Unknown keys or wrong types → reject gracefully with toasts.
- **Sanitization**: remove dangerous keys (`__proto__`, `constructor`, `prototype`) before validation.
- **Flag inference**: when options contain keys (e.g., `lighting`, `color_grade`, `width/height`, any `dnd_` prefix), automatically set enabling flags (e.g., `use_lighting`, `use_color_grading`, `use_dimensions`, `use_dnd_section`, etc.).

### 4.4 History
- Maintain up to **100** entries of imported/generated JSON states with timestamp and action label when tracking is enabled.

### 4.5 Sora integration
- **Userscript** (public): listens for `INSERT_SORA_JSON` messages, writes prettified JSON into the target page’s textarea, then posts back `INSERT_SORA_JSON_ACK`. On load, posts `SORA_USERSCRIPT_READY`; host acknowledges with `SORA_USERSCRIPT_ACK`.
- **In‑app send**: opens `https://sora.chatgpt.com` in new tab and posts `{ type: 'INSERT_SORA_JSON', json }` every 250ms until ACK or 10s timeout. Stops posting on ACK.

### 4.6 Settings
- Toggles persisted in `localStorage` (keys in `src/lib/storage-keys.ts`): dark mode, Sora tools, header buttons, logo, action labels, tracking.
- **Tracking** (opt‑in/out): events stored locally as well for a user‑visible **Action History** when enabled.
- **Disclaimer**: fetch text from `/disclaimers/disclaimer.{locale}.txt` (configurable via env); cache in SW and `localStorage`.

### 4.7 Internationalization
- Default `en-US`. On language change, lazily fetch `/locales/{lng}.json` and add to i18n resource bundle at runtime.
- **Test** ensures all locale files contain keys present in `en-US.json`.

### 4.8 Accessibility
- UI components have labels/ARIA where needed. A script runs `jest-axe` against `dist/index.html` to report violations. CI should fail on violations.

---

## 5) Non‑functional requirements

**Performance**
- First contentful render < 2s on mid‑range mobile (3G Fast throttling in DevTools).
- Bundle ≤ ~250KB JS gzip for initial route (excludes locales loaded on demand); code‑split heavy panels.
- Diff rendering should not freeze on large JSON (≥10k chars). Consider windowing if needed.

**Offline/PWA**
- Precache **app shell**, icons, `index.html`, flags, and every disclaimer file; cache‑first strategy for shell, network‑first for dynamic locale JSON with cache fallback.
- Show **Update available** toast when a waiting SW is detected; clicking reloads the app.

**Reliability**
- Import must not corrupt state on partial failures; always keep a revert path (undo/redo stack limit 50 states).

**Observability**
- Console warnings for non‑fatal issues (e.g., clipboard unsupported, analytics disabled, SW registration failure) and toasts for UX‑visible errors.

---

## 6) Data model

### 6.1 Option object (`SoraOptions`)
A strongly‑typed interface comprising:
- **Core**: `prompt`, `negative_prompt?`, `use_negative_prompt`, `seed`, `steps`, `guidance_scale`, `cfg_rescale`.
- **Dimensions/Format**: `use_dimensions_format`, `use_dimensions`, `width`, `height`, `aspect_ratio`, `output_format`, `dynamic_range`.
- **Style**: `use_style_preset`, `style_preset: { category, style }`.
- **Camera/Composition**: `use_camera_composition`, plus `camera_angle`, `shot_type`, `subject_focus`, `composition_rules[]`, and optional camera/lens/aperture/dof/blur fields behind respective `use_*` flags.
- **Video Motion**: `camera_motion`, `motion_direction`, `frame_interpolation`, `fps` (+`extended_fps`), `duration?` (+`use_duration`), `extended_motion_strength`.
- **Lighting/Color**: `use_lighting`/`lighting`, `use_color_grading`/`color_grade`, `use_black_and_white`/`black_and_white_preset`, `special_effects`, `lut_preset`.
- **Materials/Environment**: `use_material`/`made_out_of`, `use_secondary_material`/`secondary_material`, `use_environment`/`environment`, `use_location`/`location`, `use_time_of_year`/`time_of_year`.
- **Character/Face**: `use_face`, `subject_gender`, `makeup_style`, `character_mood`, `subject_mood`.
- **Enhancements/Safety**: `use_enhancement_safety`, `prevent_deformities`, `quality_booster`, `upscale` (+`use_upscale_factor`), `safety_filter`.
- **DnD**: `use_dnd_section` plus specific `use_dnd_*` gates and their `dnd_*` values.

**Validation**: Zod **strict partial** schema. Unknown keys fail validation. Specific nested object shapes (e.g., `style_preset`) must match. Arrays and nulls are accepted where intended. Dangerous keys are stripped prior to validation.

### 6.2 Flag inference map
A mapping from option keys to their enabling flags (e.g., `lighting` → `use_lighting`, `width/height` → `use_dimensions`, any `dnd_*` → `use_dnd_section`, etc.). On import/CLI parse, set corresponding `use_*` to `true` automatically.

### 6.3 Storage keys
`DARK_MODE`, `SORA_TOOLS_ENABLED`, `HEADER_BUTTONS_ENABLED`, `LOGO_ENABLED`, `ACTION_LABELS_ENABLED`, `TRACKING_ENABLED`, `TRACKING_HISTORY`, `LOCALE`.

---

## 7) Architecture & implementation

**Frontend**
- React 18 (hooks, Suspense+lazy for large components) + TypeScript strict.
- Styling with Tailwind + shadcn/ui (Radix primitives). Utility hooks for responsive layout and feature toggles.
- State slices: local component state + persisted preferences via `localStorage` helpers with try/catch.
- JSON generation: `generateJson()` clones and prunes fields based on `use_*` flags.
- i18n: i18next with runtime resource loading; default `en-US`; changeLanguage helper ensures bundle availability.

**PWA**
- Custom `sw.js` with explicit precache list + runtime handlers. Cache name is versioned (e.g., `sora-prompt-cache-v2`). Update flow via `useUpdateCheck()`.

**Userscript & Messaging**
- Public userscript with version token replaced at build; posts **READY** on load; host sends **ACK**; handles **INSERT_SORA_JSON** and replies with **ACK** once the textarea is updated.
- In‑app sender verifies `event.source === openedWindow` and message type before stopping the interval.

**CLI**
- `runCli(argv, stdinInput?)`: supports `--help`, `--version`, `--file <path>`, direct flags (`--prompt`, `--width`, etc.), or reading JSON from **stdin** when no flags provided.
- Uses the same `loadOptionsFromJson` + `generateJson` logic as the app.

**Build & Tooling**
- Vite config injects commit hash/date into build (`VITE_COMMIT_*`) and **defines** `__BASE_URL__` for runtime fetches.
- PWA via `vite-plugin-pwa` (optional), component tagging plugin for telemetry labels.
- Node **>=22** required in `package.json` (note: Dockerfile currently uses Node 20 – see follow‑ups).
- Scripts: dev/build/preview, lint/format/typecheck, test/coverage, accessibility check, copy locales.

---

## 8) Security & privacy

**Threat model (client‑only app)**
- **XSS/Injection**: JSON text rendered only via a syntax highlighter & controlled `<pre>`. Never `dangerouslySetInnerHTML` with untrusted data. Continue avoiding it.
- **Prototype pollution**: On import/parse, strip `__proto__`, `constructor`, `prototype` before validation.
- **postMessage misuse**: Current flow filters by `event.source === openedWindow` and message `type`; **must** also check `event.origin` against an allowlist (e.g., `https://sora.chatgpt.com`) when possible. Consider including a random **nonce** in the handshake payload for CSRF‑style protection.
- **Clipboard**: Detect and fail gracefully; do not log copied content.
- **Analytics**: Default off when `VITE_DISABLE_ANALYTICS=true`. Even when on, events contain **no prompt data**; only action metadata is stored. Local action history should be user‑clearable.
- **Local storage**: Wrap all accesses in try/catch (already implemented); prefer `setJson/getJson` for structured values.
- **SW caching**: Precache only static assets and disclaimer text; avoid caching third‑party responses by default.

**Compliance**
- Provide privacy note in Disclaimer; document exactly what events are tracked and how to disable.

---

## 9) Quality, testing, and acceptance

**Unit/Component tests** (Jest + RTL)
- Hooks: undo/redo, local‑storage state, update‑check, tracking.
- Lib: validation, option flag mapping, default options, generateJson, date/utils.
- i18n: locale completeness (all keys present).
- Userscript: message handling & textarea injection; acknowledgment messaging.
- CLI: flags/file/stdin parsing; unknown flags error; `--version` matches `package.json`.

**Accessibility**
- Run `npm run accessibility` after build; zero **jest‑axe** violations required.

**Manual acceptance**
- PWA installable; offline reload works for UI (locale switching may use cached resources).
- Import invalid JSON shows friendly errors; valid JSON toggles relevant `use_*` flags.
- Diff view highlights only changed segments; large JSON does not stall.
- Send‑to‑Sora posts and stops on ACK; userscript path works on compatible pages.

**Metrics (optional)**
- Count of exports, imports, toggles used; no prompt strings recorded.

---

## 10) Build, packaging & deployment

**Local dev**
- Node ≥22, `npm ci`, `npm run dev` (ensure `scripts/copyTranslations.js` runs). Environment variables via `.env`.

**Production build**
- `npm run build` → `dist/` with PWA assets. `npm run coverage` to refresh badge.

**Docker**
- Multi‑stage build (Node 20 Alpine) that serves `dist/` with `serve` at port **8080**. _Action_: align Node version with engines.

**Environment variables** (`.env`)
- `VITE_MEASUREMENT_ID` (GA); `VITE_DISABLE_ANALYTICS` (true/false); `VITE_DISABLE_STATS`; `VITE_DISCLAIMER_URL` (may include `{locale}`); `VITE_GTAG_DEBUG`.

---

## 11) Open issues & follow‑ups

1) **Origin allowlist & nonce** in cross‑tab messaging to harden the Sora injection flow.
2) **Synchronize Node versions** (engines ≥22 vs Docker Node 20).
3) Consider **virtualized diff** (e.g., react‑window) for very large JSON.
4) Expand **e2e testing** (Cypress/Playwright) to cover PWA install/update, import flows, and send‑to‑Sora handshake end‑to‑end.
5) Add **CSP meta** (e.g., `default-src 'self'`) in `index.html` with necessary allowances for GA (if enabled).
6) Optionally add **backup/export** of local preferences/history (JSON download).

---

## 12) Appendix (event names & examples)

**Analytics events (examples)**
- `toggle_dark_mode`, `toggle_tracking`, `open_disclaimer`, `copy_json`, `download_json`, `clear_json`, `share_button`, `copy_link`, `history_import: { type: 'single'|'bulk' }`, `send_to_sora`.

**Message types**
- From host → userscript: `INSERT_SORA_JSON`.
- From userscript → host: `INSERT_SORA_JSON_ACK`, `SORA_USERSCRIPT_READY`.
- From host → userscript: `SORA_USERSCRIPT_ACK`.

**Service Worker cache name**
- `sora-prompt-cache-v2` (bump on breaking cache changes).

---

## 13) Definition of Done (for the next release)

- [ ] New import/flag‑inference paths covered by tests.
- [ ] Cross‑tab messaging includes origin check & nonce; docs updated.
- [ ] Node version alignment completed; CI green on Node ≥22 and Docker image updated.
- [ ] Accessibility script returns **0** violations.
- [ ] PWA offline works; update prompt shown on SW `waiting`.
- [ ] i18n completeness test passes for all shipped locales.
- [ ] README updated with privacy/tracking note and CLI usage examples.

