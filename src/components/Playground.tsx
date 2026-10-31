import { lazy, Suspense, useEffect, useRef, useState } from "react";
import {
  Check,
  Copy,
  Download,
  Maximize2,
  Play,
  RotateCcw,
  Save,
} from "lucide-react";
import { strToU8, zipSync } from "fflate";
const Editor = lazy(() => import("./Editor"));
import Preview, { Inspection } from "./Preview";
import { download, MAX_CODE, sanitizeHTML } from "../engine.mjs";
export default function Playground({
  initialHTML,
  initialCSS,
  solution,
  hint = "Change one declaration. Predict its effect, then compare with the preview.",
  storageKey = "scratch",
  title = "Your design workspace",
}: {
  initialHTML: string;
  initialCSS: string;
  solution?: string;
  hint?: string;
  storageKey?: string;
  title?: string;
}) {
  const [html, setHTML] = useState(initialHTML),
    [css, setCSS] = useState(initialCSS),
    [tab, setTab] = useState<"html" | "css">("css"),
    [live, setLive] = useState(true),
    [run, setRun] = useState({ html: initialHTML, css: initialCSS }),
    [width, setWidth] = useState(620),
    [height, setHeight] = useState(360),
    [inspect, setInspect] = useState<Inspection>(),
    [notice, setNotice] = useState(""),
    [showHint, setShowHint] = useState(false),
    [compare, setCompare] = useState(false),
    [overflow, setOverflow] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (live) {
      const id = setTimeout(() => setRun({ html, css }), 250);
      return () => clearTimeout(id);
    }
  }, [html, css, live]);
  const edit = (text: string, fn: (s: string) => void) => {
    if (text.length > MAX_CODE) {
      setNotice("Code is limited to 100 KB per file.");
      return;
    }
    fn(text);
  };
  function save() {
    try {
      localStorage.setItem(
        "csslab-experiment-" + storageKey,
        JSON.stringify({ html, css }),
      );
      setNotice("Experiment saved in this browser.");
    } catch {
      setNotice(
        "Browser storage is full or unavailable. Export your files instead.",
      );
    }
  }
  function load() {
    try {
      const p = JSON.parse(
        localStorage.getItem("csslab-experiment-" + storageKey) || "null",
      );
      if (!p) {
        setNotice("No saved experiment for this workspace yet.");
        return;
      }
      if (
        typeof p.html !== "string" ||
        typeof p.css !== "string" ||
        p.html.length > MAX_CODE ||
        p.css.length > MAX_CODE
      )
        throw Error();
      setHTML(p.html);
      setCSS(p.css);
      setNotice("Saved experiment restored.");
    } catch {
      setNotice("Could not restore this experiment.");
    }
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(tab === "css" ? css : html);
      setNotice("Copied " + tab.toUpperCase() + ".");
    } catch {
      setNotice(
        "Clipboard is unavailable. Select code in the editor and copy it.",
      );
    }
  }
  function exportFiles() {
    const page =
      '<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>My CSS LAB project</title><link rel="stylesheet" href="style.css"></head><body>' +
      sanitizeHTML(html) +
      "</body></html>";
    const zip = zipSync({
      "index.html": strToU8(page),
      "style.css": strToU8(css),
    });
    const url = URL.createObjectURL(
      new Blob([zip as BlobPart], { type: "application/zip" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "css-lab-project.zip";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice(
      "Exported index.html and style.css. HTML is sanitized; your CSS is exported unchanged.",
    );
  }
  return (
    <div className="workspace" ref={panel}>
      <div className="workspace-toolbar">
        <strong>{title}</strong>
        <div className="actions">
          <label className="toggle">
            <input
              type="checkbox"
              checked={live}
              onChange={(e) => setLive(e.target.checked)}
            />{" "}
            Live preview
          </label>
          <button onClick={() => setRun({ html, css })}>
            <Play size={14} />
            Run
          </button>
          <button
            title="Reset editor to starter"
            onClick={() => {
              setHTML(initialHTML);
              setCSS(initialCSS);
              setRun({ html: initialHTML, css: initialCSS });
              setCompare(false);
              setNotice("Starter restored. Saved experiment is unchanged.");
            }}
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
          <button
            title="Fullscreen workspace"
            onClick={async () => {
              try {
                if (document.fullscreenElement) await document.exitFullscreen();
                else await panel.current?.requestFullscreen();
              } catch {
                setNotice("Fullscreen is unavailable in this browser.");
              }
            }}
          >
            <Maximize2 size={15} />
          </button>
        </div>
      </div>
      <div className="workspace-grid">
        <section className="code-pane">
          <div className="file-tabs">
            <button
              className={tab === "html" ? "active" : ""}
              onClick={() => setTab("html")}
            >
              ◇ index.html
            </button>
            <button
              className={tab === "css" ? "active" : ""}
              onClick={() => setTab("css")}
            >
              # style.css
            </button>
            <button
              className="copy"
              aria-label="Copy current file"
              onClick={copy}
            >
              <Copy size={14} />
            </button>
          </div>
          <Suspense
            fallback={
              <div className="editor-loading">Loading your code editor…</div>
            }
          >
            <Editor
              language={tab}
              value={tab === "html" ? html : css}
              onChange={(s) =>
                tab === "html" ? edit(s, setHTML) : edit(s, setCSS)
              }
            />
          </Suspense>
          <div className="editor-foot">
            <span>{tab === "css" ? "CSS" : "HTML"} · UTF-8</span>
            <span>Undo / redo supported</span>
          </div>
        </section>
        <section className="render-pane">
          <div className="viewport-toolbar">
            <span>
              <i className="status-dot" /> LIVE RESULT
            </span>
            <select
              aria-label="Preview device preset"
              value={width}
              onChange={(e) => setWidth(+e.target.value)}
            >
              {![320, 390, 620, 768, 1024].includes(width) && (
                <option value={width}>Custom {width}px</option>
              )}
              <option value={320}>Narrow · 320px</option>
              <option value={390}>Mobile · 390px</option>
              <option value={620}>Fluid · 620px</option>
              <option value={768}>Tablet · 768px</option>
              <option value={1024}>Desktop · 1024px</option>
            </select>
          </div>
          <Preview
            html={run.html}
            css={run.css}
            width={width}
            height={height}
            onInspect={setInspect}
            onViewport={(v) => setOverflow(v.overflow)}
          />
          <div className="size-controls">
            <label>
              Width{" "}
              <input
                aria-label="Preview width"
                type="range"
                min={280}
                max={1200}
                value={width}
                onChange={(e) => setWidth(+e.target.value)}
              />
              <output>{width}px</output>
            </label>
            <label>
              Height{" "}
              <input
                aria-label="Preview height"
                type="range"
                min={200}
                max={650}
                value={height}
                onChange={(e) => setHeight(+e.target.value)}
              />
            </label>
          </div>
        </section>
      </div>
      <div className="workspace-footer">
        <div className="actions">
          <button onClick={save}>
            <Save size={14} />
            Save
          </button>
          <button onClick={load}>Restore saved</button>
          <button onClick={exportFiles}>
            <Download size={14} />
            Export files
          </button>
          <button onClick={() => setShowHint(!showHint)}>Hint</button>
          {solution && (
            <>
              <button
                onClick={() => {
                  setCSS(solution);
                  setNotice(
                    "Worked solution loaded. Try explaining each declaration.",
                  );
                }}
              >
                Reveal solution
              </button>
              <button onClick={() => setCompare(!compare)}>
                {compare ? "Hide comparison" : "Compare result"}
              </button>
            </>
          )}
        </div>
        <span className={overflow ? "warning" : "muted"}>
          {overflow
            ? "Horizontal overflow detected"
            : "Isolated browser preview"}
        </span>
      </div>
      {notice && (
        <p role="status" className="notice">
          <Check size={14} />
          {notice}
        </p>
      )}
      {showHint && <p className="callout">{hint}</p>}
      {compare && solution && (
        <div className="comparison">
          <h3>Worked solution · compare with your result above</h3>
          <Preview html={initialHTML} css={solution} width={width} />
        </div>
      )}
      {inspect && (
        <details className="inspector">
          <summary>Visual inspector · click any element in the preview</summary>
          <div className="inspect-grid">
            {Object.entries(inspect)
              .filter(([k]) => !["channel", "kind"].includes(k))
              .map(([k, v]) => (
                <div key={k}>
                  <span>{k}</span>
                  <code>{String(v)}</code>
                </div>
              ))}
          </div>
          <p className="muted">
            Actual browser measurements and computed values. This inspector does
            not enumerate all matched or overridden rules; use browser Developer
            Tools for a full cascade trace.
          </p>
        </details>
      )}
    </div>
  );
}
