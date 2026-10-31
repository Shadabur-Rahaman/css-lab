# CSS LAB V1 verification

Verified on 31 October 2026.

## Automated and browser results

- **5/5 Node test groups pass:** sRGB contrast math; valid progress round-trip and deduplication; invalid/out-of-range progress rejection; all 18 curriculum records and three guided projects; restrictive iframe/CSP/message-source policy.
- **14/14 native-browser checks pass:** HTML sanitization; content-box and border-box measurements; real selector matching; invalid selector feedback; cascade layer priority; importance before specificity; actual Flexbox and Grid rendering; narrow/wide media queries; overflow detection; script-injection isolation; lesson/prediction completeness; guided project completeness.
- **12/12 responsive checks pass:** home at 320, 390, and 768px; course at 390px; Flexbox/Grid at 390px; box lab at 320px; playground, projects, teacher, and settings at 390px; reference at 320px.
- **Production build passes:** TypeScript and Vite. The app, React, Motion, editor core, and language parsers are split into separate chunks. The editor is loaded on demand. No build size warning remains after splitting editor language support.

## Manual interaction checks

- Homepage CSS switch changes from ON to OFF and renders the same HTML with browser default styling.
- Box Model Lab starts with measured 304 × 164px for a 240 × 100px content box with 24px padding and 8px borders. Switching to border-box measures 240 × 100px.
- Selector Explorer matches three `.featured` cards; entering `[` produces a readable invalid-selector message.
- Cascade Arena layer scenario: predicting rebeccapurple reveals the browser’s `rgb(102, 51, 153)` value and explains layer precedence before specificity.
- Correct quiz prediction updates score to 1/18. Reload retains the saved score.
- CodeMirror CSS editing works. With Live Preview disabled, Run applies the edited CSS. Inspector reports the authored `rgb(10, 20, 30)`, 40px padding, and `rgb(216, 245, 230)` background.
- Save and Restore Saved restore the experiment. Export generates the HTML/CSS ZIP and reports success.
- Lesson bookmark changes to Bookmarked. Mark Complete & Continue advances to chapter two.
- Main navigation destinations render: onboarding, course, history, labs, challenges, projects, Bug Hunter, reference, revision, roadmap, teacher, settings. Responsive navigation opens the drawer and closes when a lesson destination is selected. Hidden mobile navigation is inert; Escape and Tab handling are implemented.
- Teacher lesson switching replaces the script, example, quiz prompt, homework, and notes. In the final production build the timer advanced to 00:25, paused, and returned to Start. Presenter fullscreen opened and closed successfully. The split CodeMirror editor loaded correctly in production.

## Fixes found during verification

1. Initial iframe geometry could be reported before its parent layout was ready. Measurement now waits for load, a rendered frame or timer fallback, and a nonzero document width; subsequent resize events remeasure it.
2. Border widths may be rounded at the current display scale. The native-browser test compares the actual computed borders with measured dimensions, rather than assuming exactly 2 physical CSS pixels on every setup.
3. Layout lab output had an automatic minimum width that allowed iframe content to widen the application on mobile. Explicit `min-width: 0` now contains the preview’s horizontal scroll area.

## Limits and remaining verification

- Browser checks used the available Chromium-based in-app browser. Real Safari, Firefox, physical touch devices, assistive technology, and real mobile zoom have not been tested.
- Native-browser tests exercise the rendering/security engine and representative UI flows; they do not prove every possible learner-authored HTML/CSS program is safe or performant.
- Fullscreen APIs and clipboard availability depend on the browser and embedding context. Import validation is covered by unit tests; a complete automated file-picker/reset workflow was not run.
- The user explicitly approved public publication. Source is available at https://github.com/Shadabur-Rahaman/css-lab and the GitHub Pages workflow manages deployment to https://shadabur-rahaman.github.io/css-lab/. GitHub's initial build and test job passed on its Linux runner.
- Course coverage is introductory. Advanced masterclasses, exhaustive reference content, and additional dedicated studios remain future work as listed in the README. Do not describe this release as the completed full advanced curriculum.
