import { previewDocument, sanitizeHTML } from "../src/engine.mjs";
import { lessons, projects } from "../src/course";
let passed = 0,
  failed = 0;
function result(name: string, ok: boolean, detail = "") {
  const li = document.createElement("li");
  li.textContent =
    (ok ? "PASS" : "FAIL") + " · " + name + (detail ? " · " + detail : "");
  li.style.color = ok ? "#8ce1b5" : "#ffa99c";
  document.querySelector("#results")!.append(li);
  ok ? passed++ : failed++;
}
async function frame(html: string, css: string, width = 600, selector = "") {
  const channel = crypto.randomUUID(),
    el = document.createElement("iframe");
  el.sandbox.add("allow-scripts");
  el.title = "Verification experiment";
  el.style.cssText = `width:${width}px;height:180px;border:1px solid #888;display:block;margin:12px 0;background:white`;
  let inspect: any, matches: any, viewport: any;
  let resolve: () => void;
  const done = new Promise<void>((r) => (resolve = r));
  const receive = (e: MessageEvent) => {
    if (e.source !== el.contentWindow || e.data?.channel !== channel) return;
    if (e.data.kind === "inspect") inspect = e.data;
    if (e.data.kind === "matches") matches = e.data;
    if (e.data.kind === "viewport") {
      viewport = e.data;
      resolve();
    }
  };
  addEventListener("message", receive);
  el.srcdoc = previewDocument(html, css, channel, selector);
  document.querySelector("#frames")!.append(el);
  await Promise.race([done, new Promise((r) => setTimeout(r, 4000))]);
  removeEventListener("message", receive);
  return { inspect, matches, viewport, el };
}
const malicious =
  '<h1 onclick="parent.bad=true">Hello</h1><script>parent.bad=true</script><iframe src="https://example.com"></iframe><img src="https://example.com/track"><a href="javascript:alert(1)">bad</a><form action="https://example.com"><input formaction="https://example.com"></form>';
const clean = sanitizeHTML(malicious);
result(
  "HTML removes executable and external-resource markup",
  !clean.includes("<script") &&
    !clean.includes("<iframe") &&
    !clean.includes("onclick") &&
    !clean.includes("javascript:") &&
    !clean.includes("https://"),
);
const content = await frame(
  '<div class="measure">Box</div>',
  ".measure{width:200px;height:50px;padding:20px;border:2px solid black;box-sizing:content-box}",
);
const calculated =
  240 +
  parseFloat(content.inspect?.borderLeft || "0") +
  parseFloat(content.inspect?.borderRight || "0");
result(
  "content-box measured by browser",
  Math.abs(content.inspect?.width - calculated) < 0.15,
  JSON.stringify({ measured: content.inspect?.width, calculated }),
);
const border = await frame(
  '<div class="measure">Box</div>',
  ".measure{width:200px;height:80px;padding:20px;border:2px solid black;box-sizing:border-box}",
);
result("border-box measured by browser", border.inspect?.width === 200);
const sel = await frame(
  '<div class="card"><h2>A</h2><p>B</p></div><div class="card"><h2>C</h2></div>',
  "",
  600,
  ".card > h2",
);
result("real selector matching", sel.matches?.count === 2);
const invalid = await frame("<p>A</p>", "", 600, "[");
result(
  "invalid selector produces useful error",
  typeof invalid.matches?.error === "string",
);
const layer = await frame(
  '<p class="measure card" id="profile">Cascade</p>',
  "@layer base, theme;@layer base{#profile{color:crimson}}@layer theme{.card{color:rebeccapurple}}",
);
result(
  "normal layer order beats specificity",
  layer.inspect?.color === "rgb(102, 51, 153)",
);
const imp = await frame(
  '<p class="measure card" id="profile">Cascade</p>',
  ".card{color:royalblue!important}#profile{color:crimson}",
);
result(
  "importance beats normal ID rule",
  imp.inspect?.color === "rgb(65, 105, 225)",
);
const flex = await frame(
  '<main class="measure"><i>A</i><i>B</i></main>',
  ".measure{display:flex;gap:20px}i{width:50px}",
);
result("Flexbox renders as real flex", flex.inspect?.display === "flex");
const grid = await frame(
  '<main class="measure"><i>A</i><i>B</i></main>',
  ".measure{display:grid;grid-template-columns:repeat(2,1fr)}",
);
result("Grid renders as real grid", grid.inspect?.display === "grid");
const mobile = await frame(
  '<main class="measure">Responsive</main>',
  ".measure{width:100px}@media(min-width:640px){.measure{width:300px}}",
  390,
);
const wide = await frame(
  '<main class="measure">Responsive</main>',
  ".measure{width:100px}@media(min-width:640px){.measure{width:300px}}",
  900,
);
result(
  "media queries respond to actual iframe viewport",
  mobile.inspect?.width === 100 && wide.inspect?.width === 300,
  JSON.stringify({
    mobile: mobile.inspect?.width,
    wide: wide.inspect?.width,
    viewports: [mobile.viewport, wide.viewport],
  }),
);
const overflow = await frame(
  '<main class="measure">Overflow</main>',
  ".measure{width:800px}",
  320,
);
result("horizontal overflow is detected", overflow.viewport?.overflow === true);
const escape = await frame(
  '<div class="measure">Safe</div><script>document.querySelector(".measure").textContent="BAD"</script>',
  '.measure{color:green} </style><script>document.querySelector(".measure").style.color="red"</script>',
);
result(
  "injected scripts cannot change computed output",
  escape.inspect?.color === "rgb(0, 128, 0)",
);
result(
  "18 unique lessons with valid prediction answers",
  lessons.length === 18 &&
    new Set(lessons.map((l) => l.id)).size === 18 &&
    lessons.every(
      (l) => l.predict.options[l.predict.answer] && l.solution && l.html,
    ),
);
result(
  "three guided projects have complete steps and CSS solutions",
  projects.length === 3 &&
    projects.every((p) => p.steps.length >= 5 && p.solution.length > 250),
);
document.querySelector("#status")!.textContent =
  `Completed: ${passed} passed, ${failed} failed.`;
document.title = `${failed ? "FAIL" : "PASS"} · CSS LAB browser verification`;
