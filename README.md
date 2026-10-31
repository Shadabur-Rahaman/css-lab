# CSS LAB — Learn CSS by Designing

“Don’t just write CSS. Understand why your design works.”

A separate React + TypeScript + Vite application. It does not modify HTML LAB or JS LAB. Native CSS is the subject of every experiment. Tailwind is available for platform styling; the visual interface is predominantly authored CSS. Lucide provides icons, Motion provides a restrained entrance, and CodeMirror supplies real HTML/CSS editing and undo/redo.

## Run

Requires Node.js 22.18+ (Node 24 recommended).

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

The development server uses port 5175; production preview uses 4175. The output is `dist/`. Relative asset paths and hash navigation support GitHub Pages project subpaths without server rewrites.

## Implemented V1 scope

- 18 chapter introductions, grouped into foundations, layout/components, and beyond the basics. Each has why/what/analogy explanations, a syntax walkthrough, editable experiment, prediction question with feedback, debugging starter and solution, guided practice, independent brief, recap, and teacher notes.
- Nine functional labs: box model with browser measurements, Flexbox, Grid, responsive viewport, selector matching, cascade scenarios, color contrast, design tokens, and positioning.
- Shared CodeMirror HTML/CSS workspace: live/manual run, reset, file tabs, copy, save/restore, hint, solution, comparison, fullscreen, viewport dimensions, real computed-style inspector, overflow detection, and ZIP export containing `index.html` and `style.css`.
- Three guided projects with worked solutions and self-review checklists. Ten open-ended Flexbox challenges. Three staged-hint Bug Hunter cases.
- Eighteen prediction questions, bookmarks, revision cards, local progress import/export/reset, and self-reported lesson milestones.
- Teacher notes for each chapter, class timer, fullscreen demonstrations, homework, a scoring rubric, and a suggested 18-session sequence.

## Honest coverage limits

This is a functional V1 foundation, not the full advanced masterclass described by the long-term brief. Chapters 15–18 offer introductory coverage. Dedicated unit converter, full typography/gradient studios, exhaustive selector DOM-tree visualization, stacking-context graph, general cascade explanation engine, detailed container/subgrid labs, project automatic assessment, complete reference corpus, and expanded advanced exercises remain future work. The reference contains 29 focused entries.

Quiz results store the latest answer per question, not a full attempt history. Completion and project review are explicit learner self-assessments. Project step checkboxes last for the current visit; completed project reviews persist. Browser-local records are small and capped, so IndexedDB is not needed in V1. Saved experiments are per workspace; export them separately from progress backups.

## Architecture

`src/course.ts` is the typed curriculum and project source. `App.tsx` provides hash navigation and course views. `components/Playground.tsx` combines the editor and reusable preview. `Labs.tsx` generates real CSS from controls and allows subsequent manual editing. `progress.ts` owns browser persistence. `engine.mjs` owns preview isolation, sanitization, contrast math, and progress validation.

Each course unit is a `Lesson` object. Expand deep topics by adding sections and assessments to that schema rather than copying the editor/rendering infrastructure. Each specialized lab uses native browser layout. Lab controls regenerate the CSS; editing it manually may make the original instructional explanation no longer describe the modified result. This limit is stated in the UI.

## Preview security

Learner markup is parsed and stripped of scripts, nested browsing contexts, dangerous navigation/resource attributes, event handlers, and external resources. Preview frames use `sandbox="allow-scripts"` without `allow-same-origin`; they retain opaque origins and cannot access the application’s origin or localStorage. A restrictive CSP blocks external connections, forms, fonts, and arbitrary scripts. The only script allowed has an unpredictable nonce and is authored by the platform. It reports computed values, selected elements, matches, and overflow through messages checked against the frame window and a per-frame channel.

Learner JavaScript is never run. External fonts, images, and stylesheets are intentionally unavailable; embedded raster data images are permitted. Input is capped at 100 KB per file. Arbitrary CSS can still be computationally expensive or visually misleading inside its frame; this is a local learning tool, not a hardened multi-tenant remote execution service. The inspector reports actual computed values and dimensions; it does not claim to reconstruct every matched/overridden rule. Use browser DevTools for a full cascade trace.

Export sanitizes HTML and preserves the learner’s CSS. Preview resource restrictions are not embedded into exported projects: review authored CSS (including any resource URLs) before hosting it.

## Verification

`npm test` checks contrast calculations, safe progress validation, curriculum structure, and preview policy invariants. With the dev server running, open `/tests/browser.html` for native-browser checks: sanitization, box measurements, selectors, invalid-selector errors, cascade layers, importance, flex/grid display, media queries, overflow, and script injection isolation. This test page is not part of `dist/`.

Open `/tests/responsive.html` for 12 page/width checks using actual iframe viewports between 320px and 768px. It checks application overflow and the narrow-screen navigation trigger; this is one browser engine, not device or multi-browser certification. See `VERIFICATION.md` for observed results and manual checks.

## GitHub Pages deployment

Push this standalone repository to GitHub, then choose **Settings → Pages → Build and deployment → GitHub Actions**. `.github/workflows/pages.yml` installs locked dependencies, runs tests, builds, uploads `dist/`, and deploys using GitHub’s official Pages actions. It triggers on `main` pushes or manual dispatch. The workflow only has read access to contents and the Pages/OIDC permissions required for deployment.

Provider instructions: https://docs.github.com/en/pages/quickstart and https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages.

## Sources and content policy

- MDN CSS: https://developer.mozilla.org/en-US/docs/Web/CSS
- MDN cascade: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascade/Introduction
- W3C CSS: https://www.w3.org/Style/CSS/
- W3C history: https://www.w3.org/Style/CSS20/history.html
- CSSWG drafts: https://drafts.csswg.org/
- Web Platform Tests: https://web-platform-tests.org/

History distinguishes specification dates from browser adoption. CSS3 is described as modular; no universal CSS4 is invented. Compatibility links lead to current reference material. Device presets approximate viewport sizes and do not claim multi-browser/device emulation. Contrast checks only analyze opaque sRGB pairs and do not certify accessibility.
