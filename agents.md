# Sora JSON Prompt Crafter Development Guide

A complete internal guide for contributors to the `supermarsx/sora-json-prompt-crafter` project. Built as a web-based interface with a focus on **privacy-first** prompt configuration for Sora’s generative AI models, it follows a component-driven modular structure (in spirit of the AgentsMD style). This guide covers project layout, component patterns, state management, development workflow, and quality standards.

---

## 🔧 Tech Stack

- **Platform:** Browser (Progressive Web App; offline-capable via Service Worker)
- **Language:** TypeScript (strict mode)
- **Framework:** React 18 (functional components + hooks)
- **UI Library:** Shadcn UI (Radix Primitives) + Tailwind CSS
- **Build Tool:** Vite 5 (Module bundler and dev server)
- **Testing:** Jest + React Testing Library (unit and component tests)
- **Linting/Formatting:** ESLint and Prettier (enforced via scripts)

_(No dedicated backend – all logic runs client-side. External calls are limited to optional analytics or fetching repo stats.)_

---

## 📁 Project Structure

```
sora-json-prompt-crafter/
├── public/                 # Static assets (manifest, service worker, icons, disclaimer)
├── src/
│   ├── components/         # UI components (app screens, modals, panels, controls)
│   │   └── ui/             # Reusable base components (buttons, cards, dialogs, etc.)
│   ├── hooks/              # Custom React hooks (responsive layout, dark mode, tracking)
│   ├── lib/                # Core logic modules (JSON generation, default options, storage, analytics)
│   ├── data/               # Preset data and option definitions (e.g. camera angles, style presets)
│   └── index.tsx           # Application entry point (renders the main app component)
├── tests/                  # Unit/Integration tests (if not collocated with src/)
├── index.html              # HTML template for Vite (app mounting point and script includes)
├── package.json            # Project metadata and NPM scripts (dev, build, test, lint, format)
├── tsconfig.json           # TypeScript configuration (paths, strict settings)
├── tailwind.config.js      # Tailwind CSS configuration (theme and plugin settings)
└── vite.config.ts          # Vite configuration (build setup, aliases)
```

- **public/**: Contains static files served directly. Notably includes `sw.js` (the service worker enabling offline functionality), `site.webmanifest` (PWA manifest for installable app), icons, and the `disclaimer.txt` displayed in-app. A build step (`npm run generate-sw-assets`) scans `public/` for localized disclaimers and translations and outputs `public/sw-assets.js` consumed by `sw.js`.
- **src/**: All source code.
  - `components/`: React components for the UI. This includes higher-level components (e.g. **Dashboard** page, **HistoryPanel**, **ControlPanel**, **ShareModal**, etc.) as well as a `components/ui/` subfolder with low-level UI elements (buttons, cards, sliders, dialogs) following the design system.
  - `hooks/`: Custom hooks encapsulating cross-cutting logic (e.g. `useDarkMode` toggles the theme, `useTracking` manages analytics opt-in, `useIsSingleColumn` handles responsive layout changes, etc.).
  - `lib/`: Core logic and utilities. For example, **generateJson** (builds the JSON output from the options state), **defaultOptions** (default values for all Sora options), **validateOptions** (ensures loaded JSON is valid), **storage** (wrapper around localStorage for persistence), and **analytics** (for event tracking). These modules keep non-UI logic self-contained.
  - `data/`: Definition of option values and presets. This includes structured lists for various selectable parameters (camera types, lens options, quality levels, fantasy presets, etc.). By organizing them here, the app can easily extend or modify preset categories without cluttering core logic.
  - `index.tsx`: The app’s entry file. It initializes the React app, rendering the main component (often the Dashboard or App) into the `index.html` container. Also applies global providers (if any) and imports global styles.

- **tests/**: Contains test files (if separated; e.g. `*.test.ts` or `*.spec.tsx`). The project uses **Jest** and React Testing Library to verify component rendering and **generateJson** logic. (In smaller projects, tests may reside alongside their implementation in `src/`.)
- **index.html**: The root HTML page used by Vite. It loads the React bundle and includes references to the manifest, fonts, and sets up the basic HTML skeleton.
- **package.json**: Defines dependencies and NPM scripts. Key scripts include `npm run dev` (launches Vite dev server), `build` (produces a production build in the `dist/` directory), `test` (runs the Jest test suite), `lint` (ESLint), `format` (Prettier), and `typecheck` (TypeScript compiler for type checking).
- **Configuration files**: _tsconfig.json_ for TypeScript settings, _tailwind.config.js_ for customizing Tailwind (colors, dark mode, etc.), and _vite.config.ts_ for build configuration (including path aliases like `@/` for `src/`). These ensure consistency and smooth development experience.

---

## 🧠 Agent Architecture

While Sora is a client-side app (not a multi-process system like Electron), it still embraces a modular “agent-like” design. Each major feature area is handled by a dedicated module or component acting as its own **agent** of functionality. Key responsibilities divided among these logical agents include:

- **JSON Generation** – Producing the prompt configuration JSON from the current user-selected options. This is primarily handled by the `generateJson` function (in the **lib**) using the structured data in state. It ensures that only enabled sections are included and formats values correctly.
- **State & Persistence** – Managing the application state for all prompt options and ensuring it persists. The main Dashboard component holds a single source of truth (`SoraOptions` state object) for all form inputs. On every change, state updates trigger JSON regeneration and a diff highlight. The app uses a local cache (via `localStorage`, wrapped by **storage** lib) to persist the latest JSON (`currentJson`) and an array of past entries (`jsonHistory`). This means user data remains local and reloads/restores automatically.
- **History Management** – Storing up to 100 previously crafted JSON prompts and allowing users to review or restore them. The HistoryPanel component and related hooks act as an agent for this, handling addition of new entries on copy, and providing import/export functionality for saved prompts.
- **UI/UX Controls** – Handling interactive UI elements such as theme toggling (dark/light mode), layout responsiveness (single vs multi-column view), and modals (share, import, disclaimer). For example, the **useDarkMode** hook (with context) acts as the agent controlling theme state across the app, and the **DisclaimerModal** component ensures the license/disclaimer is accessible.
- **Offline & Caching** – The Service Worker (in `public/sw.js`) functions as a background agent to cache assets and allow the app to load fully offline. On build, static files are prepared so that the first visit installs the worker and subsequent visits can operate without internet. This agent requires careful updating on new releases (to refresh caches) but otherwise works behind the scenes.
- **Analytics & Tracking** – (Optional) If analytics is enabled via config, the app will track certain usage events (e.g., time spent, clicks on copy, regenerating JSON). The **useTracking** hook and **analytics** lib coordinate this. They ensure no data leaves the app if the user opts out (or if the environment variable disables tracking), aligning with the privacy-first goal.

**Design principles for these agents (modules):**

- Keep modules as **stateless** as feasible. Most functions (like JSON generation or validation) operate purely on input data without hidden side-effects. State is lifted to React components or context, not stored in global singletons.
- **Explicit inputs**: Functions and components receive all needed parameters (for example, passing in the options object or flags) rather than reaching into shared mutable scopes.
- Leverage React’s **hooks and context** for structured communication. Instead of a complex event bus, the app relies on hook return values and context providers to share state (e.g., the tracking and theme states) between components.
- **Graceful error handling**: All external interactions (parsing JSON, localStorage access, copying to clipboard, fetching GitHub stats) are wrapped in try/catch. Errors or invalid inputs do not crash the app – instead they log to console and trigger user-friendly toasts (for example, if clipboard access fails or JSON parsing encounters invalid data).
- **No external calls** by default. Aside from optional telemetry or explicit user actions (like fetching GitHub star counts for display), the app does not call external APIs. This ensures user prompts and data stay local. Any new feature that might require network access should be gated behind user action or setting, preserving the privacy-first design.

---

## 💬 State & Interaction Patterns

In a single-page React application like Sora, clear patterns govern how components interact and how state flows:

- **Unidirectional Data Flow:** The central `options` state (of type `SoraOptions`) is maintained in the top-level Dashboard component. All form controls (sliders, toggles, text inputs for prompts) directly update this state via setters. The updated state then propagates down to child components as props or through context, ensuring a single source of truth for the current configuration.
- **Reactive Updates:** Sora uses React’s `useEffect` hooks to perform side effects when certain state changes occur. For example, when `options` change, an effect runs to regenerate the JSON output (`generateJson(options)`) and update the displayed `jsonString`. Another effect monitors `jsonString` changes to compute a character-level diff (using the `diff` library) and highlight changes for the user. These patterns ensure the UI stays in sync with state without manual intervention.
- **Local Persistence:** The app treats browser storage as an event source as well. Using the wrapper (`safeGet`/`safeSet`), it writes the current JSON and history to `localStorage` whenever they change (via effects). On startup, it hydratess state from any stored data. This means a page refresh or browser restart will automatically load the last editing session, creating a seamless experience.
- **Decoupled Components via Hooks:** Instead of direct parent-child coupling for global concerns, Sora employs context and custom hooks. For example, a **ThemeContext** (through `useDarkMode`) provides a boolean and toggle for dark mode to any component that needs to adjust styling, without passing props down manually. Similarly, the tracking opt-in state is accessible application-wide via a hook. This pattern encourages loose coupling and reusability of components.
- **Service Worker Lifecycle:** The service worker operates independently once registered. There isn’t direct continuous messaging between the app and the worker beyond the initial registration. However, developers should be aware of its lifecycle (it may serve cached content on subsequent loads). During development, when testing changes to `sw.js` or static assets, one may need to refresh with cache invalidation or update the service worker registration to ensure the new content is picked up.
- **Graceful Degradation:** All interactions are designed to fail safely. If, for example, the attempt to fetch live GitHub stats fails (due to network issues or API limits), the app catches the error and triggers a toast notification but continues functioning normally. If the service worker isn’t supported or fails to register, the app still runs as a normal web app (just without offline caching).

_By following these patterns, contributors can introduce new features or UI components without breaking the central data flow or the app’s resilience. Always prefer React’s built-in state management and lifecycle tools over ad-hoc solutions for consistency._

---

## ✅ PR Requirements

To merge a Pull Request, the following must be true:

- ✅ **TypeScript passes**: No type errors. Run `npm run typecheck` and ensure all interfaces, types, and generics line up correctly.
- ✅ **Linting passes**: Code meets style guidelines via ESLint (`npm run lint`) and formatting via Prettier (`npm run format`). This repository uses a consistent style (including Tailwind-specific linting); PRs should not introduce new linter warnings.
- ✅ **Prettier enforced**: The `pr` command automatically runs `npm run format`, so all files, including `agents.md`, must already be prettified.
- ✅ **Tests pass**: All unit tests and any integration tests must pass (`npm test`). If new features are added, corresponding tests should be included. Aim for meaningful coverage, especially for critical logic in `lib/`.
- ✅ **Coverage badge updated**: After modifying tests, run `npm run coverage` to refresh `coverage.svg`.
- ✅ **No debug leftovers**: Remove any `console.log`, `debugger`, or commented-out code used during development. The codebase should be clean of dev-only artifacts when submitted for review.
- ✅ **Conventional commits**: Follow semantic commit message conventions (e.g., prefix with `feat:`, `fix:`, `docs:`, etc. as appropriate). This not only helps maintain clear project history but also may feed into release notes if using automation.
- ✅ **Documentation updated**: If the change is user-facing or alters the workflow, update relevant docs. This could mean adjusting the README (for a new feature or option) or this guide (for architectural changes or new “agent” modules).

_A PR that fails any check will require fixes before merging. Our CI pipeline will run linting, type-checking, tests, and build to help catch these. Keep iteration quick by running these locally before pushing._

---

## 🎨 Code Style

Consistency is enforced through automated tools, but contributors should also keep these style guidelines in mind:

- **Formatting**: This project uses Prettier and an ESLint config (including React and Tailwind plugins). Always format your code with `npm run format` before commit – consistent spacing, quotes, and ordering are taken care of. ESLint will flag issues like unused vars or improper React hook usage; fix all lint issues.
- **Type Usage**: Use `interface` or `type` aliases for structured data shapes (for example, the `SoraOptions` interface defines the full shape of prompt configuration). Avoid using `any` unless absolutely necessary – prefer proper typing or generics to maintain type safety throughout the code.
- **React Components**: Use functional components with hooks. Component files and component names should be **PascalCase** (e.g., `HistoryPanel.tsx` exports a `HistoryPanel` component). One component per file is recommended, with the file name matching the component.
- **Naming Conventions**: Use **camelCase** for variables and functions. Use **PascalCase** for component and type names (as noted) and for classes (though this project avoids class components). Use **kebab-case** (dash-separated lowercase) for file names that are not React components (utility files, assets, etc.), and for any CSS files if present.
- **File Organization**: Keep files focused. A file should ideally export one main thing (one component or one logical module). Avoid monolithic files. If a component grows too large or complex, consider breaking out sub-components or utilities.
- **Comments**: Add inline comments for any complex logic or non-obvious code blocks. For example, if a calculation or algorithm is being done to transform options to JSON, a short comment explaining the approach is valuable. Use JSDoc style comments for functions in `lib/` if they are complex or widely used.
- **Self-documenting code**: Prefer clear naming over excessive comments. For instance, a function named `parseCameraOptions()` is better than a vague `processData()` with a comment. However, when a feature’s intent or use might be unclear to a new contributor, **include a brief comment or update the relevant section in documentation.**
- **Styling**: Since styling is handled via Tailwind CSS utility classes, avoid inline styles or external CSS unless absolutely needed. Use semantic class names when extending Tailwind (e.g., for animations or keyframes, use the Tailwind convention or `@apply`). Keep the design language consistent (spacing, colors) by relying on the established Tailwind config and shadcn UI defaults.

Following these conventions ensures that the codebase remains readable and maintainable. Code reviews will flag stylistic or structural inconsistencies, so it’s best to check existing patterns in similar files when in doubt.

---

## 🧪 Testing Strategy

All critical functionality in Sora JSON Prompt Crafter should be covered by tests, to catch regressions and ensure new changes don’t break existing features:

- **Unit Tests for Logic**: Functions in `src/lib/` (such as JSON generation, validation, or any data manipulation) should have corresponding unit tests. This is vital for things like ensuring the output JSON matches the options selected, or that enabling/disabling a section behaves correctly. For example, tests might feed a partial `SoraOptions` object into `generateJson` and assert that the resulting JSON string contains or omits certain fields. Edge cases (like no prompt provided, or extreme values) should be tested too.
- **Component Tests**: Use React Testing Library to verify that key components render and respond to user interactions as expected. For instance, a test for the `HistoryPanel` could simulate clicking the “copy to clipboard” and then check that a new history entry appears. Or a test for the theme toggle could verify that a CSS class or data attribute changes. While we don’t test every trivial detail, focus on components with complex state or side-effects.
- **Integration Testing**: Currently, no dedicated end-to-end test framework is set up (the project does not include Playwright or Cypress by default). However, as the app grows, consider adding some integration tests. These could run the application in a headless browser context and simulate a typical user flow: e.g., fill in some fields, toggle a preset, click “Copy JSON”, then verify the JSON output and that history count increased. Integration tests help ensure that multiple pieces work together correctly (especially before major releases).
- **Mocking External Interactions**: Tests should run offline and deterministically. That means any external calls (like the fetch to GitHub for stats, or accessing `window.localStorage`) should be mocked or stubbed. The test environment (Jest + jsdom) provides a fake DOM and storage, but you may need to simulate or spy on certain global methods. Ensure that enabling or disabling tracking doesn’t actually hit a network in tests – instead, verify that the function to send analytics (if any) was called with expected arguments.
- **Continuous Testing**: Run the test suite frequently during development (`npm test` or even `npm run test -- --watch`). The CI pipeline will run tests on each PR. It’s encouraged to also run `npm run typecheck` in watch mode if making heavy type changes. Keeping tests passing as you develop prevents a big crunch at the end. If you add a new feature without tests, expect the reviewers to ask for tests before merging.

**Example:** A simple test for JSON generation might look like:

```ts
import { generateJson } from '@/lib/generateJson';
import { DEFAULT_OPTIONS } from '@/lib/defaultOptions';

test('generates valid JSON from default options', () => {
  const jsonStr = generateJson(DEFAULT_OPTIONS);
  const obj = JSON.parse(jsonStr);
  expect(obj).toHaveProperty('prompt');
  expect(obj.prompt).toEqual(DEFAULT_OPTIONS.prompt);
  // If no optional sections are enabled by default, those fields should be absent:
  expect(obj).not.toHaveProperty('lens_type');
});
```

This ensures the default output includes at least the base fields and respects the toggles. As new features are added (e.g., new option sections or fields), corresponding tests should be introduced or updated to cover their behavior.

---

## 🚀 Build & Release

Building and releasing Sora JSON Prompt Crafter is straightforward, since it’s a static web application:

```bash
npm run build       # Compile the app and bundle into /dist
```

This will produce an optimized production build in the `dist/` directory. The output includes all HTML, JS, CSS, and asset files needed to serve the app. Key build outputs to note:

- The **service worker** (`sw.js`) and related files in `dist` ensure offline support. Verify that these are generated and references in `index.html` are correct (Vite should handle this automatically if configured).
- The **PWA manifest** and any icons will be copied into `dist`. Make sure the manifest (`site.webmanifest`) is present and lists the correct icons and app name, and that icons are included.
- The **disclaimer.txt** should be copied over to `dist` (so it can be accessed via `/disclaimer.txt` in the deployed app). This is handled by the build process (as the file resides in public/), but double-check especially if the file is updated.
- All React component code and Tailwind styles are minified and bundled. Check that dynamic features (like dark mode classes or any lazy-loaded chunks) are working by running a local server on the `dist` folder.

**Serving**: The app can be hosted on any static file server or CDN. During development, use `npm run dev` to serve locally with live reload. For a production-like test, you can run `npm run preview` after building, which uses Vite’s preview server on port 4173 by default.

**Docker**: A Dockerfile is provided to containerize the app for convenience. To build and run a Docker image:

```bash
docker build -t sora-json-prompt-crafter .
docker run -p 8080:8080 sora-json-prompt-crafter
```

This will build the app inside a Node container and serve it (the Docker image uses a simple Node server or Vite preview to host the static files). The application will then be accessible at `http://localhost:8080`. Using Docker ensures the same environment across deployments.

**Environment Variables**: Before building for production, ensure any needed environment variables are set (or `.env` is configured). Notably:

- `VITE_MEASUREMENT_ID` can be set to a Google Analytics ID if tracking is desired (or left blank to use the default dummy ID).
- `VITE_DISABLE_ANALYTICS` can be set to `"true"` to completely disable analytics code.
- `VITE_DISCLAIMER_URL` can point to a custom URL for the disclaimer text if needed.

By default, the app is configured to be fully functional out of the box with no env changes (it will use a default GA ID that collects nothing meaningful and a local disclaimer file). But for an official release, you might insert the project’s actual analytics ID or a custom disclaimer link here.

---

## 📦 Deployment Checklist

Before considering a new release or deploying the app, go through this checklist:

- [ ] **Clean build succeeds** – Run a fresh `npm ci` (to install exact dependencies), then `npm run build`. No errors or warnings should occur during build. The output should be verified with `npm run preview` or another static server to ensure it loads.
- [ ] **All interactive features work** – Test the live app (either in dev or from the preview build) to ensure that adjusting every option control updates the JSON output accordingly. Sliders, toggles, text inputs, dropdowns – each should reflect in the generated JSON.
- [ ] **State persistence and history** – Reload the page (or reopen after closing) to confirm that the last crafted JSON is restored. Create a few different prompts and use the “Copy JSON” function to populate the history; check that the History panel shows them and that importing/exporting that history works if those features are available.
- [ ] **Offline functionality** – Open the app in a browser, then turn off internet and refresh. The app should still load (due to the service worker cache) and previously saved data should still be accessible. Verify that no resources fail to load while offline.
- [ ] **Optional settings** – If analytics tracking is enabled, confirm that opt-out toggle works (e.g., when turned off, no network requests are made for events). If any environment-specific features (like a custom disclaimer URL or integration with a hosting platform such as Lovable) are used, ensure they are correctly configured and working in the deployment environment.

Performing these checks helps catch any issues in the final packaged app that might not surface during development (for example, missing assets in the build, or features that break in a production setting). Only once all boxes are ticked should a release be considered ready.

---

## 🔮 Roadmap & Ideas

Looking ahead, there are several enhancements and new features that could further improve Sora JSON Prompt Crafter. These are not yet implemented but are under consideration or open for contribution:

- [ ] **AI-Assisted Prompt Suggestions** – Integrate an AI helper to suggest improvements or variations for user-written prompts. For example, using a large language model to refine the prompt text or to generate negative prompt recommendations based on the positive prompt. This could be an optional side panel that analyzes the current prompt and offers suggestions.
- [ ] **Real-time Preview Integration** – Connect to Sora’s generative engine (if an API or local endpoint is available) to show a live preview of the image or video that the JSON would produce. This would turn the crafter into a more dynamic WYSIWYG tool. Challenges include performance and maintaining the privacy-first approach (perhaps by doing this only on user request or locally).
- [ ] **Expanded Preset Library** – Continuously add and refine the preset options. This might include more style categories, genre-specific presets, or community-contributed presets. A possible idea is to allow the app to fetch updated presets from a repository or to import/export presets definitions as JSON, so users can share their own.
- [ ] **Internationalization (i18n)** – Provide translations for the UI and preset descriptions. As Sora’s user base grows globally, having the interface in multiple languages would be valuable. This entails externalizing all strings and possibly allowing dynamic switching of language.
- [ ] **Enhanced Mobile UX** – Although the app is responsive (single-column mode on narrow screens), there are ideas to make mobile usage more convenient. This could include touch-friendly controls for sliders (perhaps integrating mobile-native pickers), a collapsible menu for sections, or even a dedicated mobile layout mode.
- [ ] **Collaboration and Sharing** – Build on the Share Modal to perhaps allow generating a shareable link or QR code that encodes the JSON or links to an online instance with the JSON pre-loaded. This could make it easier for users to share prompt settings with each other. It might involve a tiny backend service or leveraging query parameters/local storage on a common host.
- [ ] **CLI or Editor Plugin** – For advanced users, a command-line tool or an IDE extension that uses the same underlying prompt crafting logic could be introduced. This would allow offline or power-user access to generate prompt JSONs without using the GUI, useful for scripting or automation scenarios.

Items on this roadmap should align with the project’s core mission: making prompt configuration easy, transparent, and user-controlled. Contributors are welcome to pick up any of these ideas or propose their own. If you start working on a roadmap item, it’s a good idea to create an issue to discuss the approach first.

---

## 🤝 Contribution Workflow

We welcome contributions that align with the project’s goals. To ensure a smooth workflow, please follow these guidelines:

- **Branching**: Create a new branch for each feature or fix. Use a descriptive branch naming convention like `feat/add-history-export` or `fix/typo-in-footer`. This helps maintain a clean project history and makes it easier to manage multiple contributions.
- **Draft Pull Requests**: Feel free to open a Draft PR early if you want feedback or to signal what you’re working on. Mark the PR as “Ready for review” when it’s complete. Drafts are a great way to discuss implementation details before everything is finalized.
- **Pull Request Description**: In your PR, provide a clear description of the problem and solution. If it’s a UI change, include before/after screenshots or GIFs. If it’s a new feature, explain how it works and any new dependencies it introduces. The PR template (if configured) will guide you on key points to cover (like testing performed, related issue numbers, etc.).
- **Keep PRs Focused**: Try to make each PR about one topic. It’s better to have two smaller PRs than one large PR that does unrelated things. Reviewers will appreciate a concise, focused change. For example, don’t mix a refactor of the theme toggle with an unrelated bug fix in the history panel – separate them.
- **Update Documentation**: If your contribution adds or changes functionality, update the README or this guide as part of the same PR. For instance, if you add a new option section, ensure it’s documented under Features or noted in the relevant section of this guide (Project Structure or Roadmap, etc.). Documentation changes make it easier for the next contributor (or even your future self) to understand the context of the code.
- **Testing Your Changes**: Before requesting a review, run the full test suite and linting. It’s also recommended to build the project (`npm run build`) and try running a local preview of the production build, especially if your changes affect the build process or any runtime behavior. Catching issues early will speed up the review process. When adding new disclaimer or locale files, run `npm run generate-sw-assets` to update the service worker asset list (this step is included in the default `dev` and `build` scripts).

Following this workflow helps maintain code quality and project coherence. The maintainers will review your PR for alignment with the project direction, code standards, and completeness of implementation (including tests). We aim to be prompt and constructive in reviews – our common goal is to improve Sora Prompt Crafter together.

---

## 💡 Suggestion Guidelines

Ideas, feature requests, and feedback are highly appreciated. If you have a suggestion or discover an area for improvement, here’s how to go about sharing it:

- **Use GitHub Issues**: Open an issue with the details of your suggestion. If possible, apply a label such as `enhancement` or `suggestion` to categorize it. This helps maintainers triage and track it.
- **Clear Scope**: In the issue, clearly explain _what_ you are proposing and _why_. What problem does it solve, or what benefit does it bring? If the idea came from personal use of the app, describe that context. Keep the scope focused – if it’s too broad (“overhaul the entire UI”), consider breaking it into smaller ideas or be prepared to discuss and refine it.
- **Expected Outcome**: Describe the expected behavior or outcome of the feature. If it’s a UI feature, consider adding a mockup, sketch, or screenshot of a similar implementation. If it’s a behavior change, give an example scenario. Concrete examples help everyone understand the proposal better.
- **Check Roadmap & Existing Issues**: Before submitting, glance at the Roadmap (above) and open issues to see if your idea is already mentioned. It’s perfectly fine if it is – you can add details or support to an existing issue rather than creating a duplicate. Suggestions that align with planned direction or tackle known gaps are more likely to get traction quickly.
- **Be Open to Discussion**: Once you post a suggestion, there may be further questions or alternate proposals in the comments. Engage constructively – our aim is to refine ideas into something actionable. Sometimes a suggestion might be great but beyond the current scope; maintainers might label it as “future” or ask for community help to implement it.
- **Consider Contributing**: If your suggestion is something you feel strongly about and you have the skills to implement it, we encourage you to contribute the code as well. Perhaps note in the issue “_I’m willing to work on this_” – a maintainer can then assign it or guide you. Small, self-contained suggestions are excellent candidates for first contributions.

When crafting suggestions, also keep in mind the guiding principles of the project: **privacy-first, user-friendly, and focused on prompt configuration**. Ideas that enhance user control, improve usability, or maintain code quality will resonate best. Conversely, suggestions that add heavy external dependencies or stray from the app’s core purpose may need extra consideration.

For bug reports, please include steps to reproduce, the expected vs actual behavior, and any relevant console errors or screenshots. Use the issue template if provided.

Finally, always aim for the **most robust, long-term solution** in your suggestions. Quick hacks or workarounds might solve the immediate problem but could introduce technical debt. If you’re suggesting a fix, outline why it addresses the root cause. For new features, propose an implementation that won’t paint us into a corner later, even if it means a bit more upfront effort.

Every suggestion, no matter how small, helps improve Sora JSON Prompt Crafter. We appreciate your input and will consider each idea carefully. Remember: thoughtful, well-scoped suggestions with clear value are the ones most likely to be accepted and implemented.

---

## 📘 Glossary

| Term                | Description                                                                                                                                                                                                                                                              |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Prompt**          | The main input text describing the desired output for the generative model. In Sora, this is the user-provided description of the scene or image they want.                                                                                                              |
| **Negative Prompt** | Text that specifies what should be _avoided_ in the generated output. Helps steer the model away from unwanted features (e.g. “blurry, low-res”).                                                                                                                        |
| **Preset**          | A predefined configuration for certain options or style. Presets (e.g. quality levels, pop culture styles) auto-fill multiple related settings to save time and ensure consistency in outputs.                                                                           |
| **Option Section**  | A grouping of related prompt options that can be toggled on or off. For example, “Camera Settings” or “D\&D Character Details” might be sections. Each section typically has a `use_sectionname` boolean in `SoraOptions` to include/exclude its fields.                 |
| **Service Worker**  | A background script that runs in the browser to intercept network requests and cache resources. In this app, it enables offline access by caching static files and serves them from cache when offline.                                                                  |
| **PWA**             | Stands for Progressive Web App. A web application that can be installed on devices and can function offline or with poor network connectivity (thanks to the service worker). Sora Prompt Crafter is a PWA, meaning users can “install” it and use it like a native app. |
| **Local Storage**   | A web browser storage mechanism for storing key-value data. Sora uses local storage to save the current JSON and history of prompts so that data persists between sessions without a server.                                                                             |
| **Lovable**         | An optional deployment platform mention in the README (lovable.app) where the app can be hosted and shared. Not directly affecting the code, but an avenue for sharing the running app.                                                                                  |
| **Sora**            | The namesake generative AI model or system for which these JSON prompts are crafted. While this app doesn’t run the model, Sora refers to the broader AI system that consumes the JSON configuration to generate images or videos.                                       |

---

Let the code serve the mission. Ship clean, ship tested. 🚀
