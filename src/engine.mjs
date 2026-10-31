export const MAX_CODE = 100000;
export function contrast(a, b) {
  const lum = (h) => {
    const n = h.replace("#", "");
    if (!/^[0-9a-f]{6}$/i.test(n)) throw Error("Use six-digit HEX colors.");
    const c = [0, 2, 4]
      .map((i) => parseInt(n.slice(i, i + 2), 16) / 255)
      .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const x = lum(a),
    y = lum(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
export function validateProgress(p) {
  if (
    !p ||
    p.version !== 1 ||
    !Array.isArray(p.completed) ||
    p.completed.some((n) => !Number.isInteger(n) || n < 1 || n > 18) ||
    !Array.isArray(p.bookmarks) ||
    p.bookmarks.some((n) => !Number.isInteger(n) || n < 1 || n > 18) ||
    typeof p.answers !== "object" ||
    p.answers === null ||
    Array.isArray(p.answers) ||
    Object.keys(p.answers).length > 300 ||
    Object.entries(p.answers).some(
      ([k, v]) => !/^lesson-([1-9]|1[0-8])$/.test(k) || typeof v !== "boolean",
    ) ||
    !Array.isArray(p.projects) ||
    p.projects.some((x) => !["profile", "gallery", "landing"].includes(x))
  )
    throw Error("This is not a valid CSS LAB V1 progress file.");
  return {
    version: 1,
    completed: [...new Set(p.completed)],
    bookmarks: [...new Set(p.bookmarks)],
    answers: { ...p.answers },
    projects: [...new Set(p.projects)],
  };
}
export function download(name, text, type = "text/plain") {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function sanitizeHTML(html) {
  const doc = new DOMParser().parseFromString(
    html.slice(0, MAX_CODE),
    "text/html",
  );
  doc
    .querySelectorAll(
      "script,iframe,frame,frameset,object,embed,base,meta,link,portal",
    )
    .forEach((e) => e.remove());
  doc.querySelectorAll("*").forEach((e) => {
    for (const a of [...e.attributes]) {
      if (
        /^on/i.test(a.name) ||
        [
          "srcdoc",
          "action",
          "formaction",
          "target",
          "download",
          "srcset",
          "poster",
          "background",
        ].includes(a.name) ||
        (["href", "src", "xlink:href"].includes(a.name) &&
          !a.value.startsWith("#") &&
          !/^data:image\/(png|jpeg|gif|webp);base64,/i.test(a.value))
      )
        e.removeAttribute(a.name);
    }
  });
  return doc.body.innerHTML;
}
export function previewDocument(html, css, channel, selector = "") {
  const nonce = crypto.randomUUID().replaceAll("-", "");
  const markup = sanitizeHTML(html),
    safeCSS = css
      .slice(0, MAX_CODE)
      .replace(/<\/style/gi, "/* blocked end tag */");
  const inspect = `const channel=${JSON.stringify(channel)}; const send=data=>parent.postMessage({channel,...data},'*');
function report(el){const s=getComputedStyle(el),r=el.getBoundingClientRect();send({kind:'inspect',tag:el.tagName.toLowerCase(),classes:el.className.toString().slice(0,200),width:Math.round(r.width*10)/10,height:Math.round(r.height*10)/10,color:s.color,background:s.backgroundColor,display:s.display,position:s.position,padding:s.padding,margin:s.margin,boxSizing:s.boxSizing,borderLeft:s.borderLeftWidth,borderRight:s.borderRightWidth});}
function measure(){if(document.documentElement.getBoundingClientRect().width===0||innerWidth===0)return;const target=document.querySelector('.measure')||document.querySelector('.card')||document.body;report(target);send({kind:'viewport',overflow:document.documentElement.scrollWidth>innerWidth,width:innerWidth});}
document.addEventListener('click',e=>{const el=e.target;if(el instanceof Element){if(el.closest('a,button,form'))e.preventDefault();report(el)}});
const selector=${JSON.stringify(selector).replace(/</g, "\u003c")};
if(selector){try{const matches=[...document.querySelectorAll(selector)];matches.forEach(e=>{e.style.outline='3px solid #d0398b';e.style.outlineOffset='3px'});send({kind:'matches',count:matches.length,names:matches.slice(0,20).map(e=>e.tagName.toLowerCase()+(e.className?'.'+e.className.toString().trim().replace(/\\s+/g,'.'):''))});}catch{send({kind:'matches',error:'Invalid selector. Check brackets, punctuation, and the selector syntax supported by this browser.'});}}
let ready=false;addEventListener('load',()=>{ready=true;requestAnimationFrame(measure);setTimeout(measure,150)});addEventListener('resize',()=>{if(ready)measure()});`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-${nonce}'; style-src 'unsafe-inline'; img-src data:; font-src 'none'; connect-src 'none'; form-action 'none'; base-uri 'none';"><style>html{color-scheme:light}body{margin:0}*{overflow-wrap:break-word}${safeCSS}</style></head><body>${markup}<script nonce="${nonce}">${inspect}</script></body></html>`;
}
