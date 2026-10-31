import { lazy, Suspense, useEffect, useState } from "react";
import { ArrowRight, Check, FlaskConical, Layers3 } from "lucide-react";
import Preview, { Inspection } from "./Preview";
const Editor = lazy(() => import("./Editor"));
import Playground from "./Playground";
import { baseCSS, lessons } from "../course";
import { contrast, download } from "../engine.mjs";
export const labCatalog = [
  ["box", "Box Model", "See the space inside, around, and between.", "07"],
  ["flex", "Flexbox", "Find your axis. Make room for everything.", "11"],
  ["grid", "Grid Builder", "Think in rows, columns, and possibilities.", "12"],
  [
    "responsive",
    "Responsive Preview",
    "One design. A thousand possible widths.",
    "13",
  ],
  [
    "selector",
    "Selector Explorer",
    "Choose exactly the elements you mean.",
    "04",
  ],
  [
    "cascade",
    "Cascade Arena",
    "Follow the evidence to the winning rule.",
    "05",
  ],
  ["color", "Color Studio", "Find a palette that everyone can read.", "08"],
  [
    "tokens",
    "Design System Builder",
    "One decision. A more consistent interface.",
    "16",
  ],
  ["position", "Positioning Lab", "Discover where a box really belongs.", "10"],
] as const;
const labHTML =
  '<main class="layout">' +
  Array.from(
    { length: 6 },
    (_, i) =>
      `<article class="item card ${i % 2 ? "featured" : ""}"><span>0${i + 1}</span><h2>${["Imagine", "Explore", "Make", "Learn", "Refine", "Grow"][i]}</h2><p>A little space for a big idea.</p></article>`,
  ).join("") +
  "</main>";
function Range({
  label,
  value,
  set,
  min = 0,
  max = 100,
  unit = "px",
}: {
  label: string;
  value: number;
  set: (n: number) => void;
  min?: number;
  max?: number;
  unit?: string;
}) {
  return (
    <label className="control">
      <span>
        {label}
        <output>
          {value}
          {unit}
        </output>
      </span>
      <input
        aria-label={label}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => set(+e.target.value)}
      />
    </label>
  );
}
function Select({
  label,
  value,
  set,
  options,
}: {
  label: string;
  value: string;
  set: (s: string) => void;
  options: string[];
}) {
  return (
    <label className="control">
      <span>{label}</span>
      <select value={value} onChange={(e) => set(e.target.value)}>
        {options.map((x) => (
          <option key={x}>{x}</option>
        ))}
      </select>
    </label>
  );
}
export function LabIndex({ go }: { go: (s: string) => void }) {
  return (
    <>
      <div className="page-intro">
        <span className="eyebrow">THE EXPERIMENT BENCH</span>
        <h1>
          Less memorizing.
          <br />
          <em>More discovering.</em>
        </h1>
        <p>Move a slider. Change a rule. Let the browser show you why.</p>
      </div>
      <div className="lab-grid">
        {labCatalog.map(([id, name, desc, ch], i) => (
          <button
            className="lab-card"
            key={id}
            onClick={() => go("labs/" + id)}
          >
            <div className={"lab-art art-" + i}>
              {i === 0 ? (
                <div className="mini-box">
                  <div>
                    <div>content</div>
                  </div>
                </div>
              ) : i === 1 ? (
                <div className="mini-flex">
                  <i />
                  <i />
                  <i />
                </div>
              ) : i === 2 ? (
                <div className="mini-grid">
                  {Array.from({ length: 6 }, (_, n) => (
                    <i key={n} />
                  ))}
                </div>
              ) : (
                <span>
                  {
                    [
                      "",
                      "",
                      "",
                      "↔",
                      ".card",
                      "@layer",
                      "#6655dd",
                      "--primary",
                      "↗",
                    ][i]
                  }
                </span>
              )}
            </div>
            <div className="lab-card-copy">
              <span className="eyebrow">CHAPTER {ch} · INTERACTIVE LAB</span>
              <h3>
                {name} <ArrowRight size={17} />
              </h3>
              <p>{desc}</p>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}
export default function Lab({ kind }: { kind: string }) {
  const [padding, setPadding] = useState(24),
    [border, setBorder] = useState(8),
    [margin, setMargin] = useState(20),
    [boxWidth, setBoxWidth] = useState(240),
    [sizing, setSizing] = useState("content-box");
  const [direction, setDirection] = useState("row"),
    [justify, setJustify] = useState("flex-start"),
    [align, setAlign] = useState("stretch"),
    [wrap, setWrap] = useState("wrap"),
    [gap, setGap] = useState(16),
    [count, setCount] = useState(4),
    [itemWidth, setItemWidth] = useState(130);
  const [columns, setColumns] = useState(3),
    [track, setTrack] = useState("minmax(0, 1fr)"),
    [span, setSpan] = useState(1),
    [rows, setRows] = useState(120);
  const [width, setWidth] = useState(680),
    [height, setHeight] = useState(380),
    [position, setPosition] = useState("relative"),
    [offset, setOffset] = useState(20);
  const [selector, setSelector] = useState(".featured"),
    [matches, setMatches] = useState<{
      count?: number;
      names?: string[];
      error?: string;
    }>({}),
    [inspect, setInspect] = useState<Inspection>(),
    [overflow, setOverflow] = useState(false);
  const [fg, setFg] = useState("#242044"),
    [bg, setBg] = useState("#eeebff"),
    [primary, setPrimary] = useState("#6554d9"),
    [radius, setRadius] = useState(16),
    [font, setFont] = useState("system-ui");
  const [scenario, setScenario] = useState("specificity"),
    [guess, setGuess] = useState(""),
    [revealed, setRevealed] = useState(false);
  let generated = baseCSS,
    html = labHTML;
  if (kind === "box") {
    html =
      '<div class="measure">Your content box<br/>Change a layer. Measure the result.</div>';
    generated =
      baseCSS +
      `\n.measure { width: ${boxWidth}px; height: 100px; padding: ${padding}px; border: ${border}px solid #a498ec; margin: ${margin}px; box-sizing: ${sizing}; background: #d3f4e9; color: #194e45; }`;
  }
  if (kind === "flex") {
    html =
      '<main class="layout">' +
      Array.from(
        { length: count },
        (_, i) => `<div class="item">${String(i + 1).padStart(2, "0")}</div>`,
      ).join("") +
      "</main>";
    generated =
      baseCSS +
      `\n.layout { display: flex; flex-direction: ${direction}; justify-content: ${justify}; align-items: ${align}; flex-wrap: ${wrap}; gap: ${gap}px; min-height: 260px; background: #e1e0f2; padding: 16px; }\n.item { flex: 0 1 ${itemWidth}px; min-width: 0; min-height: 70px; background: #6554d9; color: white; border-radius: 8px; padding: 16px; box-sizing: border-box; }`;
  }
  if (kind === "grid")
    generated =
      baseCSS +
      `\n.layout { display: grid; grid-template-columns: repeat(${columns}, ${track}); grid-auto-rows: minmax(${rows}px, auto); gap: ${gap}px; }\n.card { min-width: 0; padding: 16px; }\n.card:first-child { grid-column: span ${Math.min(span, columns)}; background: #e7e1ff; }`;
  if (kind === "responsive")
    generated =
      baseCSS +
      "\n.layout { display: grid; gap: 16px; }\n@media (min-width: 640px) { .layout { grid-template-columns: repeat(3, minmax(0, 1fr)); } }\n.card { min-width: 0; }";
  if (kind === "selector")
    generated =
      baseCSS +
      "\n.layout { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }\n.featured { background: #eeebff; }";
  if (kind === "color") {
    html = lessons[0].html;
    generated =
      baseCSS +
      `\n.card { color: ${fg}; background: ${bg}; border-radius: ${radius}px; box-shadow: 0 16px 32px #24204420; }\nbutton { background: ${fg}; color: ${bg}; padding: 12px; border: 0; border-radius: 8px; }`;
  }
  if (kind === "tokens") {
    html = lessons[0].html;
    generated =
      baseCSS +
      `\n:root { --primary: ${primary}; --background: ${bg}; --text: ${fg}; --space: ${padding}px; --radius: ${radius}px; --font: ${font}; }\nbody { background: var(--background); color: var(--text); font-family: var(--font); }\n.card { padding: var(--space); border-radius: var(--radius); border-top: 5px solid var(--primary); }\nbutton, .badge { background: var(--primary); color: white; border: 0; border-radius: calc(var(--radius) / 2); padding: 10px 16px; }`;
  }
  if (kind === "position") {
    html =
      '<div class="stage"><div class="measure">Move me</div><p>I follow normal flow. Watch my position when the other box leaves the flow.</p><div style="height:500px">Scroll inside this preview to test sticky or fixed.</div></div>';
    generated =
      baseCSS +
      `\n.stage { position: relative; min-height: 800px; border: 2px dashed #a498ec; }\n.measure { position: ${position}; top: ${offset}px; left: ${offset}px; width: 150px; padding: 20px; background: #6554d9; color: white; z-index: 1; }`;
  }
  const cascadeCSS: Record<string, string> = {
    specificity:
      ".card { color: royalblue; }\n#profile { color: crimson; }\n.card { color: rebeccapurple; }",
    layers:
      "@layer base, theme;\n@layer base { #profile { color: crimson; } }\n@layer theme { .card { color: rebeccapurple; } }",
    important:
      ".card { color: royalblue !important; }\n#profile { color: crimson; }",
    order: ".card { color: crimson; }\n.card { color: rebeccapurple; }",
    zero: ":where(#profile) { color: crimson; }\n.card { color: royalblue; }",
  };
  if (kind === "cascade") {
    html =
      '<article id="profile" class="card measure"><h1>I inherit the winning color.</h1><p>Predict. Reveal. Explain.</p></article>';
    generated = baseCSS + "\n" + cascadeCSS[scenario];
  }
  const [code, setCode] = useState(generated);
  useEffect(() => {
    setCode(generated);
  }, [generated]);
  const title = labCatalog.find((x) => x[0] === kind)?.[1] || "Layout Lab";
  const ratio = contrast(fg, bg);
  return (
    <>
      <div className="page-intro compact">
        <span className="eyebrow">
          <FlaskConical size={14} /> REAL CSS. REAL BROWSER.
        </span>
        <h1>
          {title}
          <em>.</em>
        </h1>
        <p>
          {labCatalog.find((x) => x[0] === kind)?.[2]} Controls generate CSS;
          the editor below remains yours to change.
        </p>
      </div>
      <div className="lab-workbench">
        <aside className="lab-controls panel">
          <span className="eyebrow">YOUR VARIABLES</span>
          {kind === "box" && (
            <>
              <div className="box-legend">
                <span>margin</span>
                <div>
                  <span>border</span>
                  <div>
                    <span>padding</span>
                    <b>content</b>
                  </div>
                </div>
              </div>
              <Range
                label="Content / declared width"
                value={boxWidth}
                set={setBoxWidth}
                min={120}
                max={400}
              />
              <Range
                label="Padding"
                value={padding}
                set={setPadding}
                max={60}
              />
              <Range label="Border" value={border} set={setBorder} max={25} />
              <Range label="Margin" value={margin} set={setMargin} max={50} />
              <Select
                label="Box sizing"
                value={sizing}
                set={setSizing}
                options={["content-box", "border-box"]}
              />
              <p className="muted">
                Margin is transparent space outside the painted box. The diagram
                is schematic; measurements come from the browser.
              </p>
            </>
          )}
          {kind === "flex" && (
            <>
              <Select
                label="Direction"
                value={direction}
                set={setDirection}
                options={["row", "column", "row-reverse", "column-reverse"]}
              />
              <Select
                label="Justify content"
                value={justify}
                set={setJustify}
                options={[
                  "flex-start",
                  "center",
                  "flex-end",
                  "space-between",
                  "space-around",
                  "space-evenly",
                ]}
              />
              <Select
                label="Align items"
                value={align}
                set={setAlign}
                options={[
                  "stretch",
                  "flex-start",
                  "center",
                  "flex-end",
                  "baseline",
                ]}
              />
              <Select
                label="Wrap"
                value={wrap}
                set={setWrap}
                options={["wrap", "nowrap", "wrap-reverse"]}
              />
              <Range
                label="Item count"
                value={count}
                set={setCount}
                min={1}
                max={10}
                unit=""
              />
              <Range
                label="Item basis"
                value={itemWidth}
                set={setItemWidth}
                min={50}
                max={250}
              />
              <p className="callout">
                Main axis:{" "}
                {direction.startsWith("row")
                  ? "inline (horizontal here)"
                  : "block (vertical here)"}
                . Cross axis is perpendicular.
              </p>
            </>
          )}
          {kind === "grid" && (
            <>
              <Range
                label="Columns"
                value={columns}
                set={setColumns}
                min={1}
                max={6}
                unit=""
              />
              <Select
                label="Track sizing"
                value={track}
                set={setTrack}
                options={["minmax(0, 1fr)", "150px", "minmax(100px, 1fr)"]}
              />
              <Range
                label="Minimum row height"
                value={rows}
                set={setRows}
                min={60}
                max={220}
              />
              <Range
                label="Featured item span"
                value={span}
                set={setSpan}
                min={1}
                max={columns}
                unit=""
              />
              <p className="callout">
                Grid lines surround each track. Change the span to cross more
                than one column.
              </p>
            </>
          )}
          {["flex", "grid"].includes(kind) && (
            <Range label="Gap" value={gap} set={setGap} max={48} />
          )}
          {kind === "responsive" && (
            <>
              <div className="preset-buttons">
                {[320, 390, 768, 1024].map((w) => (
                  <button key={w} onClick={() => setWidth(w)}>
                    {w}px
                  </button>
                ))}
              </div>
              <button
                className="button secondary"
                onClick={() => {
                  setWidth(height);
                  setHeight(width);
                }}
              >
                Rotate viewport
              </button>
              <Range
                label="Viewport height"
                value={height}
                set={setHeight}
                min={240}
                max={800}
              />
              <p className="callout">
                Active layout:{" "}
                {width >= 640
                  ? "three columns (≥ 640px)"
                  : "one column (< 640px)"}
                . This describes the starter CSS; editor changes can alter its
                breakpoints.
              </p>
              <p className="muted">
                Presets approximate CSS viewports. They do not emulate device
                rendering, zoom, preferences, or other browser engines.
              </p>
            </>
          )}
          {kind === "selector" && (
            <>
              <label className="control">
                <span>CSS selector</span>
                <input
                  value={selector}
                  onChange={(e) => setSelector(e.target.value)}
                  placeholder=".card > h2"
                  spellCheck={false}
                />
              </label>
              <div className="chips">
                {[
                  ".featured",
                  ".card > h2",
                  ".card:nth-child(odd)",
                  ":is(h2, p)",
                  ":has(> h2)",
                ].map((s) => (
                  <button key={s} onClick={() => setSelector(s)}>
                    {s}
                  </button>
                ))}
              </div>
              <div role="status" className="callout">
                {matches.error || `${matches.count ?? 0} elements match`}
                <p>{matches.names?.join(", ")}</p>
              </div>
              <p className="muted">
                Uses the browser’s querySelectorAll(). Pseudo-elements and
                states such as :hover may not produce static matches. Focus and
                hover inside the preview to explore states.
              </p>
            </>
          )}
          {kind === "cascade" && (
            <>
              <Select
                label="Conflict type"
                value={scenario}
                set={(s) => {
                  setScenario(s);
                  setRevealed(false);
                  setGuess("");
                }}
                options={[
                  "specificity",
                  "layers",
                  "important",
                  "order",
                  "zero",
                ]}
              />
              <label className="control">
                <span>Predict the winning color</span>
                <select
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                >
                  <option value="">Choose a prediction</option>
                  {["crimson", "rebeccapurple", "royalblue"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              <button
                className="button primary"
                disabled={!guess}
                onClick={() => setRevealed(true)}
              >
                Reveal browser result
              </button>
              {revealed && (
                <div className="callout">
                  <strong>
                    {guess ===
                    {
                      specificity: "crimson",
                      layers: "rebeccapurple",
                      important: "royalblue",
                      order: "rebeccapurple",
                      zero: "royalblue",
                    }[scenario]
                      ? "Prediction matches the starter."
                      : "Revisit the priority order."}
                  </strong>
                  <p>
                    {
                      {
                        specificity:
                          "Same origin, importance, and layer: the ID wins on specificity.",
                        layers:
                          "Normal author rules: the later theme layer wins before specificity.",
                        important:
                          "The important author declaration beats normal author declarations.",
                        order:
                          "Equal specificity and other cascade criteria: later source order wins.",
                        zero: ":where() contributes zero specificity, so .card wins.",
                      }[scenario]
                    }
                  </p>
                  <p>
                    Actual computed color:{" "}
                    <code>{inspect?.color || "Measuring…"}</code>
                  </p>
                </div>
              )}
              <p className="muted">
                Explanations apply to the supplied scenarios. Editing CSS
                changes the real result; it does not rewrite the explanation.
                Full cascade also includes origin ordering, animations,
                transitions, inline declarations, reversed important layer
                order, and @scope proximity.
              </p>
            </>
          )}
          {["color", "tokens"].includes(kind) && (
            <>
              <label className="control">
                <span>Text color</span>
                <input
                  type="color"
                  value={fg}
                  onChange={(e) => setFg(e.target.value)}
                />
                <code>{fg}</code>
              </label>
              <label className="control">
                <span>Background</span>
                <input
                  type="color"
                  value={bg}
                  onChange={(e) => setBg(e.target.value)}
                />
                <code>{bg}</code>
              </label>
              {kind === "tokens" && (
                <>
                  <label className="control">
                    <span>Primary token</span>
                    <input
                      type="color"
                      value={primary}
                      onChange={(e) => setPrimary(e.target.value)}
                    />
                  </label>
                  <Range
                    label="Spacing token"
                    value={padding}
                    set={setPadding}
                    max={60}
                  />
                  <Select
                    label="Font family"
                    value={font}
                    set={setFont}
                    options={["system-ui", "Georgia", "monospace"]}
                  />
                </>
              )}
              <Range
                label="Corner radius"
                value={radius}
                set={setRadius}
                max={40}
              />
              <div className="contrast">
                <strong>
                  {ratio.toFixed(2)}
                  <small>:1</small>
                </strong>
                <span>
                  {ratio >= 4.5
                    ? "Passes AA normal text contrast"
                    : ratio >= 3
                      ? "Passes AA large text only"
                      : "Below AA text contrast"}
                </span>
              </div>
              {kind === "tokens" && (
                <p className="muted">
                  Primary on white: {contrast(primary, "#ffffff").toFixed(2)}:1.{" "}
                  {contrast(primary, "#ffffff") >= 4.5
                    ? "Passes AA normal text."
                    : "Choose a darker primary for small white text."}
                </p>
              )}
              <p className="muted">
                Contrast uses opaque sRGB pairs. It does not evaluate gradients,
                alpha compositing, images, or certify accessibility. Large text
                means at least 24 CSS pixels, or about 18.67 CSS pixels when
                bold.
              </p>
              <button onClick={() => download("tokens.css", code)}>
                Download CSS
              </button>
            </>
          )}
          {kind === "position" && (
            <>
              <Select
                label="Position"
                value={position}
                set={setPosition}
                options={["static", "relative", "absolute", "fixed", "sticky"]}
              />
              <Range
                label="Top / left offset"
                value={offset}
                set={setOffset}
                max={120}
              />
              <p className="callout">
                {position === "absolute"
                  ? "The positioned stage establishes the containing block."
                  : position === "fixed"
                    ? "Fixed uses this iframe viewport in this example."
                    : position === "sticky"
                      ? "Scroll the preview. Sticky needs an inset and available scroll range."
                      : position === "relative"
                        ? "The box moves visually but its flow space remains."
                        : "Offsets do not move a static-positioned box."}
              </p>
            </>
          )}
        </aside>
        <div className="lab-output">
          <div className="panel lab-preview">
            <div className="viewport-toolbar">
              <span>
                <i className="status-dot" /> BROWSER RENDERING
              </span>
              <span>
                {width} × {height}px
              </span>
            </div>
            {kind === "cascade" && !revealed ? (
              <div className="prediction-cover">
                <Layers3 size={40} />
                <h3>Make a prediction first.</h3>
                <p>Inspect the CSS below, then choose a winning color.</p>
              </div>
            ) : (
              <Preview
                html={html}
                css={code}
                width={width}
                height={height}
                selector={kind === "selector" ? selector : ""}
                onMatches={setMatches}
                onInspect={setInspect}
                onViewport={(v) => setOverflow(v.overflow)}
              />
            )}
            <Range
              label="Preview width"
              value={width}
              set={setWidth}
              min={280}
              max={1200}
            />
            {kind !== "cascade" && (
              <div className="measurement">
                <Check size={14} />
                {inspect
                  ? `Selected ${inspect.tag}${inspect.classes ? "." + inspect.classes.split(" ")[0] : ""} · ${inspect.width} × ${inspect.height}px · ${inspect.boxSizing}`
                  : "Rendering…"}
                {overflow && <b className="warning"> · Horizontal overflow</b>}
              </div>
            )}
          </div>
          <div className="panel">
            <div className="file-tabs">
              <span># style.css · editable generated CSS</span>
            </div>
            <Suspense
              fallback={
                <div className="editor-loading">Loading your code editor…</div>
              }
            >
              <Editor value={code} onChange={setCode} />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
const bugs = [
  {
    title: "The rule that never lands",
    prompt:
      "The heading should be purple, but nothing changes. Inspect the selector before changing specificity.",
    html: lessons[0].html,
    css: baseCSS + "\n.card h3 { color: rebeccapurple; }",
    solution: baseCSS + "\n.card h1 { color: rebeccapurple; }",
    hints: [
      "Does the selected heading exist in the HTML?",
      "The HTML uses h1; the rule targets h3.",
    ],
  },
  {
    title: "The overflowing card",
    prompt:
      "The card should fit inside the viewport. Repair the box-sizing calculation.",
    html: lessons[0].html,
    css:
      baseCSS +
      "\n.card { width: 100%; padding: 48px; box-sizing: content-box; }",
    solution:
      baseCSS +
      "\n.card { width: 100%; padding: 48px; box-sizing: border-box; }",
    hints: [
      "What does width include under content-box?",
      "Padding is being added outside 100%. Try border-box.",
    ],
  },
  {
    title: "The stubborn three-column grid",
    prompt:
      "This grid overflows on mobile. Make its tracks adapt to available room.",
    html: labHTML,
    css:
      baseCSS +
      "\n.layout { display: grid; grid-template-columns: 300px 300px 300px; gap: 16px; }",
    solution:
      baseCSS +
      "\n.layout { display: grid; grid-template-columns: repeat(auto-fit,minmax(min(100%,180px),1fr)); gap:16px; }",
    hints: [
      "Three fixed 300px columns already need 900px, before gaps.",
      "Try auto-fit with a minmax() minimum that cannot exceed the container.",
    ],
  },
];
export function Bugs() {
  const [selected, setSelected] = useState(0),
    [hint, setHint] = useState(0);
  const b = bugs[selected];
  return (
    <>
      <div className="page-intro">
        <span className="eyebrow">
          OBSERVE → INSPECT → HYPOTHESIZE → CHANGE → VERIFY
        </span>
        <h1>
          Every bug leaves <em>a clue.</em>
        </h1>
        <p>Investigate before changing code. The browser is your evidence.</p>
      </div>
      <div className="tabs">
        {bugs.map((b, i) => (
          <button
            className={i === selected ? "active" : ""}
            onClick={() => {
              setSelected(i);
              setHint(0);
            }}
            key={b.title}
          >
            {i + 1}. {b.title}
          </button>
        ))}
      </div>
      <p>{b.prompt}</p>
      <button
        className="button secondary"
        disabled={hint >= b.hints.length}
        onClick={() => setHint(hint + 1)}
      >
        Reveal hint {Math.min(hint + 1, b.hints.length)} of {b.hints.length}
      </button>
      {b.hints.slice(0, hint).map((h) => (
        <p className="callout" key={h}>
          {h}
        </p>
      ))}
      <Playground
        key={selected}
        initialHTML={b.html}
        initialCSS={b.css}
        solution={b.solution}
        storageKey={"bug-" + selected}
        title="Bug Hunter workspace"
      />
      <p className="muted">
        Use the browser-computed inspector and overflow indicator to verify your
        repair. This exercise does not automatically certify every possible
        solution.
      </p>
    </>
  );
}
