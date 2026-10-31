export type Question = {
  prompt: string;
  options: string[];
  answer: number;
  explain: string;
};
export type Lesson = {
  id: number;
  title: string;
  level: string;
  minutes: number;
  why: string;
  what: string;
  analogy: string;
  steps: string[];
  html: string;
  css: string;
  explain: string[];
  predict: Question;
  mistake: string;
  debug: string;
  solution: string;
  practice: string;
  challenge: string;
  recap: string;
  lab: string;
  topics: string[];
};
const card =
  '<article class="card" id="profile"><span class="badge">CSS EXPLORER</span><h1>Hello, designer.</h1><p>A little curiosity can change everything.</p><button>Keep exploring</button></article>';
const cards =
  '<section class="layout">' +
  ["Discover", "Experiment", "Create", "Refine", "Share", "Grow"]
    .map(
      (x, i) =>
        `<article class="card"><span>0${i + 1}</span><h2>${x}</h2><p>Make space for your next idea.</p></article>`,
    )
    .join("") +
  "</section>";
export const baseCSS =
  "body { font-family: system-ui, sans-serif; color: #172039; background: #eef0f7; padding: 24px; }\nbutton { font: inherit; cursor: pointer; }\n.card { background: white; padding: 24px; border: 1px solid #d9ddec; border-radius: 16px; }\nh1, h2 { line-height: 1.15; }\np { line-height: 1.6; }";
const q = (
  prompt: string,
  options: string[],
  answer: number,
  explain: string,
): Question => ({ prompt, options, answer, explain });
const definitions = [
  {
    title: "Meet CSS",
    why: "A document needs both meaning and presentation. Repeating fonts and colors in every HTML element makes a site difficult to update.",
    what: "CSS means Cascading Style Sheets. A stylesheet is a set of rules that tells the browser how to present HTML. The browser already has default styles; your rules add to or override them. CSS styles web documents; native apps may use different styling systems.",
    analogy:
      "HTML is the building structure; CSS is the arrangement, paint, and interior design. Unlike a real building, the browser can rearrange the same structure whenever available space changes.",
    steps: [
      "Read the HTML: the heading has meaning before it has a color.",
      "Change the color value and watch the same heading change.",
      "Remove your rule. The browser still displays its default heading style.",
    ],
    css: "h1 {\n  color: #6554d9;\n  font-size: 36px;\n}\n.card { padding: 28px; background: #f0edff; }",
    explain: [
      "h1 selects every level-one heading.",
      "color changes the foreground; #6554d9 is a color value.",
      "font-size changes text size; px is a CSS reference pixel.",
    ],
    predict: q(
      "If you remove all author CSS, what happens?",
      [
        "The HTML disappears",
        "The browser shows HTML with default styles",
        "JavaScript replaces the page",
      ],
      1,
      "HTML still provides content and structure. User-agent styles supply basic presentation.",
    ),
    mistake:
      "CSS cannot create meaningful document structure or supply general application logic. Use semantic HTML and JavaScript for those tasks.",
    debug: "h1 { colour: purple; }",
    solution: "h1 { color: purple; }",
    practice: "Change the heading to blue and its font size to 40px.",
    challenge:
      "Give the same document a calm academic style, then a bright portfolio style. Keep its HTML unchanged.",
    recap:
      "HTML gives meaning. CSS controls presentation. One document can wear many designs.",
    lab: "playground",
    topics: [
      "Stylesheets",
      "Browser defaults",
      "Separation of concerns",
      "Accessibility",
    ],
  },
  {
    title: "A brief history of CSS",
    why: "Early sites repeated presentation in HTML. Shared style rules made it possible to change a whole site without rewriting its content.",
    what: "Håkon Wium Lie proposed CSS in 1994; Bert Bos contributed to its early development. CSS1 became a W3C Recommendation in 1996, CSS2 in 1998, and CSS 2.1 in 2011. Later CSS develops as independently versioned modules, rather than one finished CSS3 or a universal CSS4.",
    analogy:
      "Think of a toolkit: individual tools improve on their own schedules. A new Grid module does not require every color or font feature to restart at the same version.",
    steps: [
      "Compare the dated milestones in the History page.",
      "Try this simple colors-and-spacing stylesheet.",
      "Switch to Grid in the layout lab. These are modern browser recreations, not old-browser emulation.",
    ],
    css: "h1 { color: navy; }\n.card { margin: 20px; padding: 16px; border: 2px solid navy; }",
    explain: [
      "Basic fonts, colors, margins, padding, and borders belong to CSS1.",
      "Positioning and media types expanded in CSS2.",
      "Modern modules include Grid, Flexbox, selectors, and container queries.",
    ],
    predict: q(
      "What does CSS3 describe?",
      [
        "One finished specification containing every modern feature",
        "A family of independently developed modules",
        "A browser version",
      ],
      1,
      "CSS became modular. Modules have their own levels, maturity, and browser support.",
    ),
    mistake:
      "A specification date is not a promise that every browser supported it on that date.",
    debug: "h1 { color navy; }",
    solution: "h1 { color: navy; }",
    practice:
      "Recreate a simple document with a serif heading and a solid border.",
    challenge:
      "Restyle the same content with a modern card layout. Describe which presentation problem it solves.",
    recap:
      "CSS evolves through modules. Verify feature support separately from specification history.",
    lab: "history",
    topics: ["1994 proposal", "CSS1", "CSS2", "CSS 2.1", "Modular CSS"],
  },
  {
    title: "Your first stylesheet",
    why: "The browser needs precise syntax to connect the element you choose with the appearance you want.",
    what: "A rule contains a selector and a declaration block. Each declaration pairs a property with a value using a colon. Semicolons separate declarations. Braces enclose the block. Comments use /* ... */. Whitespace usually improves readability without changing meaning.",
    analogy:
      "A decorating instruction needs an object, a characteristic, and a setting: bedroom → wall color → blue. This simplifies the syntax; CSS selectors can target many elements at once.",
    steps: [
      "Create a virtual style.css by selecting the CSS editor tab.",
      "Write a rule and run the preview. No installation is needed.",
      'For a real project, save style.css beside index.html and add <link rel="stylesheet" href="style.css"> inside the HTML head.',
    ],
    css: "/* A heading rule */\nh1 {\n  color: blue;\n  font-size: 32px;\n}",
    explain: [
      "h1 is the selector; { starts the declaration block.",
      "color is a property, : separates it from blue, and ; ends the declaration.",
      "} closes the block. Invalid declarations are usually ignored; a missing brace can affect later rules.",
    ],
    predict: q(
      "Which declaration is valid?",
      ["font-size = 32px", "font-size: 32px;", "font size: 32;"],
      1,
      "A declaration uses a recognized property, a colon, a valid value, and usually a semicolon.",
    ),
    mistake:
      'Inline style="color: blue" affects one element; an internal <style> holds rules in HTML; an external linked file can serve many pages. Prefer external files for shared maintainable styling.',
    debug: "h1 { color = blue; font-size: 32; }",
    solution: "h1 { color: blue; font-size: 32px; }",
    practice: "Write a comment, a heading color, and a paragraph font size.",
    challenge:
      "Create index.html and style.css locally, link them, and inspect the result in a browser.",
    recap: "selector { property: value; } is the basic shape of a CSS rule.",
    lab: "playground",
    topics: [
      "Rules",
      "Declarations",
      "Comments",
      "Inline / internal / external",
      "File paths",
    ],
  },
  {
    title: "Selectors & targeting",
    why: "A page may contain hundreds of elements. Selectors let you change the right ones without adding separate instructions everywhere.",
    what: "An element selector targets a tag; .card targets a class; #profile targets an ID. A space selects descendants, > selects direct children, + the next sibling, and ~ later siblings. Commas form selector lists. Attributes and pseudo-classes narrow matches. Pseudo-elements style parts or generated decorative content.",
    analogy:
      "A selector is an address: all rooms, rooms with a label, or one numbered room. This is only a metaphor; real matching follows the DOM tree, not visual position.",
    steps: [
      "Try .card, .card > h1, and button in the Selector Explorer.",
      "Try an invalid selector and read the error.",
      "Try :is(h1, h2), :not(button), and :has(h1). Pseudo-elements do not appear as DOM query matches.",
    ],
    css: ".card { background: #edf8ff; }\n.card > h1 { color: #176384; }\nbutton:hover { background: #d9f7f5; }\nbutton:focus-visible { outline: 3px solid #176384; }",
    explain: [
      ".card matches elements whose class list contains card.",
      "> restricts matching to direct children.",
      "Use :focus-visible for visible keyboard focus; :hover alone is insufficient for touch or keyboard users.",
    ],
    predict: q(
      "What does .card > h1 match?",
      [
        "Every h1 on the page",
        "h1 elements directly inside .card",
        "The .card itself",
      ],
      1,
      "The child combinator only matches h1 elements whose parent matches .card.",
    ),
    mistake:
      "A space and > mean different relationships. ::before and ::after create decorative pseudo-elements; do not place essential meaning only in generated content.",
    debug: ".card h3 { color: purple; }",
    solution: ".card h1 { color: purple; }",
    practice:
      "Select only headings inside cards and give buttons a focus outline.",
    challenge:
      "Style odd list items using :nth-child(odd), then add [disabled] and :checked examples.",
    recap:
      "Selectors match document structure and states. Test your target before changing the style.",
    lab: "selector",
    topics: [
      "Universal / element / class / ID",
      "Combinators",
      "Attributes",
      ":is() / :where() / :has()",
      "Pseudo-elements",
    ],
  },
  {
    title: "Cascade & specificity",
    why: "Several rules can style the same element. You need a predictable way to explain which declaration wins.",
    what: "For applicable declarations, the cascade considers origin and importance (including layers), then specificity, scoping proximity when applicable, then order of appearance. Inheritance supplies values when the cascade does not provide one. The most specific selector does not always win.",
    analogy:
      "Think of competing instructions with authority levels before detail. This analogy omits animation, transition, and special layer rules; use the browser result for real conflicts.",
    steps: [
      "Predict the winning color in the Cascade Arena before revealing it.",
      "Change from specificity to layer order. A less specific rule can now win.",
      "Inspect the actual computed color and read the constrained explanation.",
    ],
    css: "@layer base, theme;\n@layer base { #profile { color: crimson; } }\n@layer theme { .card { color: rebeccapurple; } }",
    explain: [
      "The layer statement establishes normal layer order.",
      "For normal author declarations in layers, later layers take priority before specificity.",
      "Important declarations reverse layer precedence. Inline styles, user/UA important rules, animations, and transitions require their own cascade ordering.",
    ],
    predict: q(
      "Can a less specific selector beat an ID?",
      [
        "Never",
        "Yes, when an earlier cascade criterion gives it priority",
        "Only if the ID is misspelled",
      ],
      1,
      "Origin, importance, and layer order are resolved before specificity.",
    ),
    mistake:
      "Avoid turning every conflict into !important. :where() adds zero specificity; :is(), :not(), and :has() use the most specific selector in their argument list. @scope proximity is considered after specificity.",
    debug: ".card { color: purple; }\n#profile { color: crimson; }",
    solution: ".card { color: purple; }\n#profile { color: purple; }",
    practice: "Make the later theme layer win without using !important.",
    challenge:
      "Compare inherit, initial, unset, revert, and revert-layer in the editor. Explain which stage each affects.",
    recap:
      "Resolve authority and layers before counting specificity. Computed values reflect the browser’s final calculation, not always the used layout value.",
    lab: "cascade",
    topics: [
      "Origins / importance",
      "Layers",
      "Specificity",
      "Inheritance",
      "Computed / used values",
      "@scope",
    ],
  },
  {
    title: "Values, units & fluid sizing",
    why: "A fixed size rarely suits every screen and text preference. Relative units connect sizes to meaningful contexts.",
    what: "px is a CSS reference pixel, not necessarily a physical device pixel. rem relates to the root font size; em depends on the property and local font size. Percentages depend on the property. vw and vh track viewport dimensions. fr shares available grid space. calc(), min(), max(), and clamp() combine constraints.",
    analogy:
      "A fixed plank has a measured length; a flexible shelf takes a share of the available room. CSS has several different reference rooms, so always identify the relevant one.",
    steps: [
      "Change the viewport width in the preview.",
      "Watch clamp() bound text between 24px and 48px.",
      "Compare width: 80% with font-size: 120%; their reference quantities differ.",
    ],
    css: ".card { width: min(80%, 600px); margin-inline: auto; }\nh1 { font-size: clamp(24px, 5vw, 48px); }\np { max-width: 55ch; }",
    explain: [
      "min() chooses the smallest calculated argument.",
      "clamp(minimum, preferred, maximum) keeps a fluid size bounded.",
      "ch approximates the advance measure of the 0 glyph; it is useful for line length. dvh follows dynamic viewport height; svh/lvh use small/large viewport sizes.",
    ],
    predict: q(
      "With a 16px root font size, how large is 2rem?",
      ["16px", "32px", "2% of the viewport"],
      1,
      "rem uses the root element’s computed font size: 2 × 16px = 32px.",
    ),
    mistake:
      "Percentages do not all use the parent width. For example font-size percentages use the parent font size; height percentages have different containing-block constraints.",
    debug: ".card { width: calc(100%-32px); }",
    solution: ".card { width: calc(100% - 32px); }",
    practice: "Use rem for padding and clamp() for a fluid heading.",
    challenge:
      "Compare 100vh with 100dvh on a mobile browser. Test actual browser UI changes. Explore cqw only inside a query container.",
    recap:
      "Choose a unit by its reference. Use constraints so fluid layouts remain usable.",
    lab: "responsive",
    topics: [
      "px / % / em / rem",
      "Viewport units",
      "ch / fr / cqw",
      "calc() / min() / max() / clamp()",
    ],
  },
  {
    title: "The box model & spacing",
    why: "A card that appears 200px wide may occupy more space once padding and borders are added.",
    what: "Every CSS box has content, padding, border, and margin. With content-box, width sets the content width. With border-box, width includes padding and border. Margins remain outside both. Min/max sizes constrain the result. Overflow controls how excess content is handled.",
    analogy:
      "A packed object has the object, cushioning, carton, and space around the carton. Margins are spacing outside the package, not another painted layer.",
    steps: [
      "Adjust padding and border in the Box Model Lab.",
      "Compare the browser-measured width in content-box and border-box.",
      "Add margins and observe that the measured border box does not include them.",
    ],
    css: ".card {\n  width: 260px;\n  padding: 24px;\n  border: 8px solid #a59bfa;\n  margin: 20px auto;\n  box-sizing: border-box;\n}",
    explain: [
      "border-box includes padding and borders in the declared width.",
      "margin: 20px auto adds vertical space and centers a fixed-width block when free inline space exists.",
      "Adjacent block vertical margins may collapse in normal flow; flex/grid margins do not collapse. Outline and shadow do not add layout size.",
    ],
    predict: q(
      "A content-box has width 200px, 20px padding, and 2px border on each side. Its border-box width is…",
      ["200px", "224px", "244px"],
      2,
      "200 + 20 + 20 + 2 + 2 = 244px. Margins are outside that width.",
    ),
    mistake:
      "width: 100% plus padding can overflow under content-box. Setting border-box often fixes this, but long unbreakable content can still overflow.",
    debug: ".card { width: 100%; padding: 32px; box-sizing: content-box; }",
    solution:
      ".card { width: 100%; padding: 32px; box-sizing: border-box; overflow-wrap: anywhere; }",
    practice: "Create a 280px border-box card with 20px padding.",
    challenge:
      "Test overflow-x, min-width, max-width, and margin collapsing in a small article layout.",
    recap:
      "Distinguish the content size, the painted border box, and the space outside it.",
    lab: "box",
    topics: [
      "Content / padding / border / margin",
      "Box sizing",
      "Overflow",
      "Margin collapsing",
      "Inline / block",
    ],
  },
  {
    title: "Color & visual effects",
    why: "Color establishes hierarchy and mood, but it must preserve legibility and meaning.",
    what: "CSS supports named colors, hex, rgb(), hsl(), and newer spaces such as oklch(). Alpha controls a color’s transparency; opacity affects the whole element and descendants. Backgrounds can layer images and gradients. Shadows do not affect layout dimensions.",
    analogy:
      "A palette is a set of paints, but screens emit light. Mixing and contrast calculations differ from physical paint.",
    steps: [
      "Use the Color Studio to compare foreground and background.",
      "Change a gradient stop in the live editor.",
      "Read the calculated WCAG sRGB contrast ratio; transparent or image backgrounds need additional analysis.",
    ],
    css: ".card {\n  color: #242044;\n  background: linear-gradient(135deg, #eeebff, #d8f5f0);\n  border: 1px solid #b9b1e8;\n  box-shadow: 0 12px 30px #24204418;\n}",
    explain: [
      "linear-gradient() creates an image, not a background-color.",
      "Hex can include an alpha channel; modern rgb() uses space-separated channels and / alpha.",
      "currentColor follows the element’s color. Filters and backdrop-filter affect rendering differently; provide usable fallbacks.",
    ],
    predict: q(
      "What does opacity: .5 affect?",
      [
        "Only the background",
        "The element and its descendants as a group",
        "Only its text",
      ],
      1,
      "Use an alpha background color when you want translucent background without fading text.",
    ),
    mistake:
      "Never rely on color alone to indicate an error. Text needs sufficient contrast in its actual composited background.",
    debug: ".card { color: #eeeeee; background: #ffffff; }",
    solution: ".card { color: #242044; background: #ffffff; }",
    practice: "Build a gradient button with readable text and visible focus.",
    challenge:
      "Create primary, background, text, and border tokens. Test text contrast before applying them.",
    recap:
      "Use color deliberately, verify contrast, and keep information available beyond color.",
    lab: "color",
    topics: [
      "HEX / RGB / HSL",
      "Alpha",
      "Gradients",
      "Backgrounds",
      "Contrast",
      "OKLCH introduction",
    ],
  },
  {
    title: "Typography that reads well",
    why: "Good typography helps readers understand content, especially on small screens or at enlarged text sizes.",
    what: "Font family, size, weight, line height, measure, and spacing work together. A unitless line-height scales with each element’s font size. Fallback stacks handle missing fonts. @font-face loads font files; font-display controls loading behavior. Test fonts and avoid layout shifts.",
    analogy:
      "Typography is the speaking voice of a page. Size establishes emphasis; line height gives the voice breathing room. Readability must still be tested with people and real content.",
    steps: [
      "Change font size and line height in the editor.",
      "Reduce the text width to 55ch.",
      "Resize the preview and compare wrapping with fixed-width text.",
    ],
    css: "body { font-family: Georgia, serif; }\n.card { max-width: 60ch; margin-inline: auto; }\nh1 { font-family: system-ui, sans-serif; font-size: clamp(28px, 5vw, 44px); line-height: 1.15; }\np { font-size: 18px; line-height: 1.7; overflow-wrap: anywhere; }",
    explain: [
      "Font stacks use the first available font.",
      "A unitless 1.7 line-height multiplies the current font size.",
      "overflow-wrap can prevent long strings from breaking narrow layouts. Ellipsis needs constrained width, hidden overflow, and appropriate white-space.",
    ],
    predict: q(
      "What does line-height: 1.5 mean?",
      ["1.5 pixels", "1.5 times the current font size", "150% of the viewport"],
      1,
      "A unitless line-height scales with the element’s own font size.",
    ),
    mistake:
      "Tiny fixed text and wide lines make reading difficult. Do not prevent zoom or depend on a remote font to make content legible.",
    debug: "p { font-size: 18px; line-height: 10px; }",
    solution: "p { font-size: 18px; line-height: 1.6; }",
    practice:
      "Style a heading, paragraph, and small caption with a clear hierarchy.",
    challenge:
      "Build a readable article with a fallback stack, 60ch measure, and responsive headings.",
    recap: "Design text as a system of size, rhythm, width, and hierarchy.",
    lab: "playground",
    topics: [
      "Font stacks",
      "Line height",
      "Wrapping",
      "@font-face",
      "Variable fonts",
      "Responsive type",
    ],
  },
  {
    title: "Flow, display & positioning",
    why: "Most layouts should follow document flow. Positioning solves specific placement problems without turning every page into coordinates.",
    what: "Block boxes normally stack in the block direction; inline content participates in lines. display changes box behavior. relative offsets a box while preserving its flow space. absolute removes it from normal flow and uses its containing block. fixed often uses the viewport; transforms can establish a different containing block. sticky is constrained by its scroll container and containing block.",
    analogy:
      "Normal flow is a queue. Relative positioning moves someone visually while keeping their place; absolute positioning removes them from the queue. Actual layout has writing modes and containing-block rules beyond this analogy.",
    steps: [
      "Change position: relative to absolute.",
      "Add position: relative to the parent and compare offsets.",
      "Test sticky in a scrollable container with top: 0.",
    ],
    css: ".card { position: relative; min-height: 220px; }\n.badge { position: absolute; top: 16px; right: 16px; background: #e5e0ff; padding: 6px; }\nh1 { margin-top: 48px; }",
    explain: [
      "A positioned ancestor establishes the absolute child’s containing block in this example.",
      "z-index is constrained by stacking contexts, rather than a single global leaderboard.",
      "display:none removes layout participation; visibility:hidden preserves its space. Floats remain useful for text wrapping.",
    ],
    predict: q(
      "Which positioning removes a box from normal flow?",
      ["relative", "absolute", "static"],
      1,
      "Absolute positioning removes the box from normal flow; surrounding content lays out without its original space.",
    ),
    mistake:
      "A huge z-index cannot escape an ancestor’s stacking context. Sticky needs an inset and enough scroll range; overflow ancestors affect its behavior.",
    debug:
      ".card { position: static; }\n.badge { position: absolute; top: 0; right: 0; }",
    solution:
      ".card { position: relative; }\n.badge { position: absolute; top: 0; right: 0; }",
    practice: "Anchor a badge in the top-right corner of a card.",
    challenge:
      "Build a sticky article heading and inspect its scroll container.",
    recap:
      "Use flow first. Identify the containing block and stacking context when positioning behaves unexpectedly.",
    lab: "position",
    topics: [
      "Normal flow",
      "Display",
      "Containing blocks",
      "Sticky",
      "Stacking contexts",
      "Floats",
    ],
  },
  {
    title: "Flexbox: one axis at a time",
    why: "Rows of buttons or cards need to distribute free space, align different sizes, and adapt when they no longer fit.",
    what: "display:flex makes children flex items. flex-direction establishes the main axis. justify-content aligns on that axis; align-items works on the cross axis. Wrapping creates additional flex lines. flex-grow, flex-shrink, and flex-basis control flexible sizing.",
    analogy:
      "Arrange objects on a shelf, choosing a direction and distributing the free room. Real flex items can shrink or grow; shelf objects usually cannot.",
    steps: [
      "Switch between row and column in the Flexbox Lab.",
      "Change justify-content, then align-items.",
      "Enable wrapping and reduce the width. Each flex line distributes its own space.",
    ],
    css: ".layout {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 16px;\n  justify-content: center;\n  align-items: stretch;\n}\n.card { flex: 1 1 160px; min-width: 0; }",
    explain: [
      "flex: 1 1 160px means grow 1, shrink 1, basis 160px.",
      "min-width: 0 can allow an item to shrink below its automatic minimum.",
      "order changes visual placement without changing DOM reading or keyboard order; do not use it to fix meaning.",
    ],
    predict: q(
      "With flex-direction: column, justify-content controls…",
      [
        "The vertical main axis in horizontal writing mode",
        "Always horizontal alignment",
        "Font alignment",
      ],
      0,
      "The main axis follows flex-direction. It is not always horizontal.",
    ),
    mistake:
      "align-content affects the distribution of flex lines when there are multiple lines and free cross-axis space; it is different from align-items.",
    debug: ".layout { display: block; justify-content: center; gap: 16px; }",
    solution:
      ".layout { display: flex; flex-wrap: wrap; justify-content: center; gap: 16px; }\n.card { min-width: 0; }",
    practice:
      "Center a card on both axes, then create a wrapping button group.",
    challenge:
      "Build a navbar, pricing row, equal-height cards, and a toolbar. Use the design challenge bank for ten progressive Flexbox briefs.",
    recap:
      "Identify the main axis before choosing alignment. Let content wrap and shrink deliberately.",
    lab: "flex",
    topics: [
      "Axes",
      "Alignment",
      "Wrap / gap",
      "Grow / shrink / basis",
      "Min-size",
      "Order",
    ],
  },
  {
    title: "Grid: design in two dimensions",
    why: "Some interfaces need aligned rows and columns. Grid expresses that structure directly.",
    what: "A grid has tracks between numbered lines. Items occupy cells or span several tracks. grid-template-columns defines explicit columns; auto-placement creates implicit tracks as needed. fr shares available space after other sizing constraints. Named areas describe larger page regions.",
    analogy:
      "Grid resembles a floor plan with rows and columns. Unlike rigid rooms, tracks can resize around content and available space.",
    steps: [
      "Change columns, track sizing, and gap in the Grid Lab.",
      "Span the first card across two columns.",
      "Try repeat(auto-fit, minmax(min(100%, 180px), 1fr)) and resize the preview.",
    ],
    css: ".layout {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 180px), 1fr));\n  gap: 16px;\n}\n.card { min-width: 0; }",
    explain: [
      "repeat() avoids repeating track definitions manually.",
      "minmax() bounds a track’s size; min(100%, 180px) prevents its minimum from exceeding a narrow container.",
      "auto-fit collapses empty repeated tracks; auto-fill retains them. subgrid can align nested items to parent tracks where supported.",
    ],
    predict: q(
      "What is Grid particularly useful for?",
      [
        "Coordinating rows and columns",
        "Replacing all semantic HTML",
        "Running application logic",
      ],
      0,
      "Grid coordinates two dimensions. Flexbox is often simpler when the main problem is one-dimensional distribution.",
    ),
    mistake:
      "1fr tracks can still overflow because of content minimums. minmax(0, 1fr) and min-width: 0 address different parts of that problem.",
    debug:
      ".layout { display: grid; grid-template-columns: 400px 400px 400px; }",
    solution:
      ".layout { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 180px), 1fr)); gap: 16px; }",
    practice: "Make a three-column gallery with a two-column featured item.",
    challenge:
      "Create a dashboard using named areas. Test its reading order and narrow layout.",
    recap:
      "Use tracks, lines, and spans to coordinate a two-dimensional layout.",
    lab: "grid",
    topics: [
      "Tracks / lines / areas",
      "repeat() / minmax()",
      "Auto placement",
      "auto-fit / auto-fill",
      "Subgrid introduction",
    ],
  },
  {
    title: "Responsive by design",
    why: "A usable interface must adapt to available space, content, input methods, and user preferences.",
    what: "Start with a useful narrow layout. Add enhancements when content has room. Media queries respond to the viewport or environment; container queries respond to a qualifying ancestor container. Choose breakpoints when your layout needs them, rather than copying device names.",
    analogy:
      "Furniture arrangements change with room size. A reusable component may need to adapt to its own room, even when the entire building stays the same size.",
    steps: [
      "Drag the width control across intermediate sizes.",
      "Watch the active 640px breakpoint change.",
      "Switch orientation and test for overflow. Presets approximate CSS viewports and do not emulate real devices.",
    ],
    css: ".layout { display: grid; gap: 16px; }\n@media (min-width: 640px) {\n  .layout { grid-template-columns: repeat(3, minmax(0, 1fr)); }\n}\n.card { min-width: 0; overflow-wrap: anywhere; }",
    explain: [
      "Base rules create the narrow layout.",
      "The media query adds columns when the iframe viewport is at least 640 CSS pixels.",
      "Use flexible images with max-width:100% and height:auto. Container queries need container-type on an ancestor, not the element querying itself.",
    ],
    predict: q(
      "When should a breakpoint be added?",
      [
        "Only at the width of a popular phone",
        "When the content or layout needs a change",
        "Every 100 pixels",
      ],
      1,
      "Content-driven breakpoints keep layouts usable between device presets.",
    ),
    mistake:
      "A desktop-sized preview shrunk with transform is not a narrow viewport. The lab actually changes iframe width so media queries re-evaluate.",
    debug:
      ".layout { display: grid; grid-template-columns: repeat(3, 300px); }",
    solution:
      ".layout { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 180px), 1fr)); gap: 16px; }",
    practice:
      "Make a card grid work at 320px, 640px, 900px, and widths between them.",
    challenge:
      "Build a container-aware card. Add pointer/hover considerations and verify keyboard usability.",
    recap:
      "Responsive design is usable content across available space, not a fixed list of device models.",
    lab: "responsive",
    topics: [
      "Mobile first",
      "Media queries",
      "Container queries",
      "Overflow",
      "Input preferences",
      "Flexible images",
    ],
  },
  {
    title: "Real interface components",
    why: "Consistent buttons, cards, and form states make a site easier to understand and maintain.",
    what: "Build components on semantic HTML. CSS supplies presentation for hover, focus, disabled, checked, and invalid states. Native buttons, inputs, and dialog supply useful behavior; tabs and modal workflows still need appropriate HTML or JavaScript logic.",
    analogy:
      "Reusable components are matching fittings in a building: they share conventions so people know how to use them.",
    steps: [
      "Style the button in the card without replacing its native element.",
      "Use Tab to inspect focus.",
      "Add a labeled input and test invalid and disabled states.",
    ],
    css: "button { padding: 12px 20px; border: 0; border-radius: 8px; background: #5544c8; color: white; }\nbutton:hover { background: #403096; }\nbutton:focus-visible { outline: 3px solid #162436; outline-offset: 4px; }\nbutton:disabled { opacity: .6; cursor: not-allowed; }",
    explain: [
      "Native button semantics support keyboard activation.",
      "Hover enhances an already usable component.",
      "Focus must remain visible; disabled styling should still communicate the control’s purpose.",
    ],
    predict: q(
      "Does styling a div like a button give it button behavior?",
      ["Yes", "No; use a native button", "Only with a gradient"],
      1,
      "Appearance alone does not provide semantics, keyboard activation, or disabled behavior.",
    ),
    mistake:
      "Do not remove outlines without providing a visible alternative. Label every form input.",
    debug: "button:focus { outline: none; }",
    solution:
      "button:focus-visible { outline: 3px solid #162436; outline-offset: 4px; }",
    practice:
      "Style a primary button and a secondary button with consistent spacing.",
    challenge:
      "Build a pricing card and an accessible signup form with labels and error text.",
    recap:
      "Components combine semantic structure, actual behavior, and consistent styling.",
    lab: "tokens",
    topics: [
      "Buttons / forms / cards",
      "Interactive states",
      "Semantics",
      "Dark / light themes",
    ],
  },
  {
    title: "Motion with purpose",
    why: "Transitions can explain a state change, but constant or excessive movement distracts and can make people uncomfortable.",
    what: "Transitions interpolate eligible properties when values change. Keyframes describe an animation over time. Transform changes visual coordinates without changing normal flow. Prefer restrained motion and honor prefers-reduced-motion. Measure actual performance instead of assuming every animation stays on the compositor.",
    analogy:
      "Motion is a gesture that directs attention. Too many gestures make the message harder to follow.",
    steps: [
      "Hover the card or focus its button.",
      "Adjust duration and translate distance.",
      "Enable reduced motion in your browser or operating system and confirm the alternative.",
    ],
    css: ".card { transition: transform 200ms ease, box-shadow 200ms ease; }\n.card:hover, .card:focus-within { transform: translateY(-4px); box-shadow: 0 12px 24px #17203920; }\n@media (prefers-reduced-motion: reduce) {\n  .card { transition: none; transform: none; }\n  .card:hover, .card:focus-within { transform: none; }\n}",
    explain: [
      "The transition belongs on the base state so entering and leaving both animate.",
      "translateY changes visual placement rather than flow space.",
      "Reduced motion should remove unnecessary movement, not remove access to content.",
    ],
    predict: q(
      "Where should a transition usually be declared for smooth hover-in and hover-out?",
      ["Only in :hover", "On the base rule", "In HTML text"],
      1,
      "The base rule remains active in both states, allowing changes in either direction to transition.",
    ),
    mistake:
      "Animating layout properties may trigger layout work. Transform and opacity are often good candidates, but actual compositing and paint costs depend on context.",
    debug:
      ".card:hover { transform: translateY(-4px); transition: transform 200ms; }",
    solution:
      ".card { transition: transform 200ms; }\n.card:hover { transform: translateY(-4px); }\n@media(prefers-reduced-motion:reduce) { .card { transition: none; } .card:hover { transform:none; } }",
    practice:
      "Add a 150ms button background transition and a reduced-motion alternative.",
    challenge:
      "Create a loading indicator with @keyframes and a static reduced-motion state. Label loading with text.",
    recap:
      "Animate to explain a change. Respect motion preferences and measure rendering work.",
    lab: "playground",
    topics: [
      "Transforms",
      "Transitions",
      "Keyframes",
      "Easing",
      "Reduced motion",
      "Performance",
    ],
  },
  {
    title: "Modern CSS & design tokens",
    why: "Repeating the same values makes changes error-prone. Modern CSS helps components respond consistently to themes and available space.",
    what: "Custom properties store reusable values and normally inherit. var() reads them with an optional fallback. Cascade layers organize priority. Nesting can group related selectors. Container queries let components adapt to their containing space. @supports can provide progressive enhancement.",
    analogy:
      "Design tokens are a shared specification sheet. Updating the approved paint color updates every component that uses it; it does not recolor components with hardcoded paint.",
    steps: [
      "Change the primary token in the Design System Builder.",
      "Inspect how the button and badge update together.",
      "Try @supports around a modern enhancement and keep a usable base style.",
    ],
    css: ":root { --primary: #6554d9; --space: 24px; --radius: 16px; }\n.card { padding: var(--space); border-radius: var(--radius); border-top: 5px solid var(--primary); }\nbutton, .badge { background: var(--primary); color: white; padding: 8px 12px; border: 0; border-radius: 6px; }",
    explain: [
      ":root normally selects the document’s root element.",
      "var(--space, 16px) uses a fallback when that custom property is missing or invalid at substitution.",
      "A fallback does not automatically make an unsupported final property value valid. Test modern features in your target browsers.",
    ],
    predict: q(
      "Which components update when --primary changes?",
      [
        "All elements regardless of CSS",
        "Elements whose applicable declarations use that token",
        "Only the root element",
      ],
      1,
      "Custom properties affect declarations that refer to them, subject to inheritance, scope, and the cascade.",
    ),
    mistake:
      "Modern features have independent compatibility and specification status. Check MDN compatibility tables rather than assuming universal support.",
    debug: ":root { --primary: purple; }\nbutton { background: primary; }",
    solution:
      ":root { --primary: purple; }\nbutton { background: var(--primary); color: white; }",
    practice: "Define primary, background, spacing, and radius tokens.",
    challenge:
      "Add a container query, logical properties, and an @supports fallback to a reusable card.",
    recap:
      "Use tokens to centralize decisions and progressive enhancement to keep the base experience usable.",
    lab: "tokens",
    topics: [
      "Custom properties",
      "Layers / nesting",
      "Container queries",
      "@supports",
      "Logical properties",
    ],
  },
  {
    title: "Debugging & maintainable CSS",
    why: "Randomly adding declarations hides causes. A repeatable investigation helps you fix the actual problem.",
    what: "Observe → Inspect → Hypothesize → Change → Verify. In Developer Tools, inspect matching rules, crossed-out declarations, inherited values, computed styles, and the box model. Organize CSS around components, consistent naming, reusable tokens, and deliberate layer order.",
    analogy:
      "Diagnose a machine before replacing parts. Change one variable at a time so you know which change solved the fault.",
    steps: [
      "Open Bug Hunter and describe the broken appearance.",
      "Use staged hints before revealing the solution.",
      "Repair the real CSS, then check its browser-computed result.",
    ],
    css: ".layout { display: flex; gap: 16px; }\n.card { min-width: 0; overflow-wrap: anywhere; flex: 1; }",
    explain: [
      "A missing stylesheet is a network/path problem, not a specificity problem.",
      "A nonmatching selector cannot enter the cascade for that element.",
      "Class-based component rules usually stay easier to maintain than escalating IDs and !important. BEM, CSS Modules, utilities, and Sass are organizational/tooling options rather than replacements for CSS knowledge.",
    ],
    predict: q(
      "What should you do first when a style seems ignored?",
      [
        "Add !important immediately",
        "Check loading, matching, validity, and competing rules",
        "Rewrite the whole site",
      ],
      1,
      "Inspect evidence first. The cause may occur before specificity is considered.",
    ),
    mistake:
      "A computed value is not always the exact used layout dimension. Browser layout measurements and the computed styles panel answer different questions.",
    debug:
      ".layout { display: flex; width: 300px; }\n.card { width: 500px; flex-shrink: 0; }",
    solution:
      ".layout { display: flex; max-width: 100%; }\n.card { flex: 1 1 0; min-width: 0; overflow-wrap: anywhere; }",
    practice:
      "Repair the three Bug Hunter cases without immediately revealing their solutions.",
    challenge:
      "Refactor a page into base, component, and utility layers. Document the reason for each exception.",
    recap:
      "Use evidence and one controlled change. Keep fixes understandable to your future self.",
    lab: "bugs",
    topics: [
      "DevTools",
      "Computed styles",
      "Overflow",
      "Naming / architecture",
      "Layers",
      "Tooling",
    ],
  },
  {
    title: "Accessible, professional CSS",
    why: "A finished page must work for people with different vision, input methods, devices, and preferences.",
    what: "Check contrast, visible focus, text resizing, meaningful reading order, reduced motion, and narrow-screen overflow. Test keyboard navigation and real browsers. Use logical properties for international layouts. Performance work begins with measurement of loading, layout, paint, and interaction rather than unsupported guesses.",
    analogy:
      "A building is not finished because it looks attractive. People need readable signs, usable entrances, and a reliable path through it.",
    steps: [
      "Test the platform with only a keyboard.",
      "Use the Color Studio to check an opaque foreground/background pair.",
      "Test your project at narrow widths, enlarged text, and reduced motion.",
    ],
    css: ".card { max-inline-size: 60ch; margin-inline: auto; padding: 1.5rem; }\nbutton { background: #443399; color: white; padding: .8rem 1.2rem; }\nbutton:focus-visible { outline: 3px solid #112233; outline-offset: 4px; }\n@media print { button { display: none; } body { background: white; color: black; } }",
    explain: [
      "Logical properties follow writing mode instead of assuming left-to-right content.",
      "WCAG AA text contrast generally requires 4.5:1 for normal text or 3:1 for qualifying large text. This one test is not a complete accessibility audit.",
      "@media print supplies print styling. @page controls supported page-related settings. Test the actual print output.",
    ],
    predict: q(
      "Does passing a contrast checker certify an accessible site?",
      ["Yes", "No; accessibility needs broader testing", "Only on desktop"],
      1,
      "Contrast is one requirement. Keyboard interaction, semantics, zoom, reading order, and more still need evaluation.",
    ),
    mistake:
      "Do not prevent zoom, remove focus, or claim device presets are real cross-browser testing. Test actual browsers and devices before publishing.",
    debug: "button { color: #cccccc; background: white; outline: none; }",
    solution:
      "button { color: white; background: #443399; }\nbutton:focus-visible { outline: 3px solid #112233; outline-offset: 4px; }",
    practice:
      "Audit your project’s focus, contrast, overflow, and motion behavior.",
    challenge:
      "Export your project, organize its files, commit with Git, and follow the linked GitHub Pages documentation to publish. Confirm the deployment yourself before claiming it.",
    recap:
      "Professional CSS combines usability, maintainability, compatibility, and measured performance.",
    lab: "projects",
    topics: [
      "Contrast / focus",
      "Zoom / motion",
      "Print / logical properties",
      "Performance",
      "Git / publishing",
    ],
  },
];
export const lessons: Lesson[] = definitions.map((d, i) => ({
  ...d,
  id: i + 1,
  level:
    i < 9
      ? "Foundations"
      : i < 14
        ? "Layout & components"
        : "Beyond the basics",
  minutes: [
    12, 10, 15, 20, 25, 20, 25, 20, 20, 25, 30, 30, 30, 25, 20, 25, 25, 25,
  ][i],
  html: [10, 11, 12, 16].includes(i) ? cards : card,
}));
export const milestones = [
  ["First CSS Rule", 3],
  ["Selector Explorer", 4],
  ["Box Model Master", 7],
  ["Flexbox Explorer", 11],
  ["Grid Builder", 12],
  ["Responsive Designer", 13],
  ["Bug Hunter", 17],
  ["CSS Project Creator", 18],
] as const;
export const history = [
  {
    year: "1994",
    title: "An idea for a more expressive web",
    text: "Håkon Wium Lie proposes Cascading HTML Style Sheets. Bert Bos joins the early development of CSS.",
    css: "h1 { color: navy; }",
  },
  {
    year: "1996",
    title: "CSS1 becomes a Recommendation",
    text: "Fonts, colors, text, margins, padding, and borders establish a shared styling foundation.",
    css: "h1 { color: navy; font-family: serif; }\np { margin: 1em; }",
  },
  {
    year: "1998",
    title: "CSS2 expands the toolkit",
    text: "Positioning, media types, and richer selectors help describe more complex presentations.",
    css: ".card { position: relative; }\n.badge { position: absolute; top: 0; right: 0; }",
  },
  {
    year: "2011",
    title: "CSS 2.1 refines interoperability",
    text: "The revision corrects and clarifies CSS2 behavior to better reflect interoperable implementations.",
    css: ".card { width: 240px; padding: 20px; margin: auto; }",
  },
  {
    year: "Modules",
    title: "Features evolve independently",
    text: "Selectors, backgrounds, media queries, transforms, animations, Flexbox, and Grid develop as separate modules. CSS3 is not one completed specification.",
    css: ".layout { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }",
  },
  {
    year: "Modern",
    title: "A continuously evolving platform",
    text: "Custom properties, layers, container queries, nesting, and modern color functions expand the language. There is no universal CSS4 specification replacing all modules.",
    css: ":root { --accent: #6554d9; }\n.card { color: var(--accent); border-radius: 1rem; }",
  },
];
export const projects = [
  {
    id: "profile",
    title: "The personal profile",
    tag: "BEGINNER · 25 MIN",
    description: "Turn semantic HTML into a profile worth sharing.",
    html: card,
    css: "/* Start with readable text, then build the box. */\nbody { font-family: system-ui; padding: 24px; }",
    solution:
      baseCSS +
      "\n.card { max-width: 360px; margin: 30px auto; text-align: center; border-top: 6px solid #6554d9; }\n.badge { color: #6554d9; font-size: 12px; font-weight: 700; }\nbutton { background: #5544c8; color: white; border: 0; padding: 12px 20px; border-radius: 8px; }\nbutton:focus-visible { outline: 3px solid #172039; outline-offset: 4px; }",
    steps: [
      "Set a readable font and line height.",
      "Constrain and center the card with a responsive max-width.",
      "Create a clear heading hierarchy, badge, and button.",
      "Add hover and focus-visible states.",
      "Test at 320px and export your files.",
    ],
    hint: "Use max-width rather than a rigid width. Auto inline margins distribute free space.",
  },
  {
    id: "gallery",
    title: "A responsive idea gallery",
    tag: "INTERMEDIATE · 40 MIN",
    description: "Build a content-first Grid layout that adapts gracefully.",
    html: cards,
    css: baseCSS + "\n.layout { /* Build your responsive grid here. */ }",
    solution:
      baseCSS +
      "\n.layout { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 210px), 1fr)); gap: 20px; }\n.card { min-width: 0; overflow-wrap: anywhere; }\n.card span { color: #6554d9; }",
    steps: [
      "Arrange the cards with display:grid.",
      "Use repeat(), auto-fit, and minmax().",
      "Keep a gap of at least 16px.",
      "Let long content wrap without horizontal overflow.",
      "Test intermediate widths and explain your track minimum.",
    ],
    hint: "repeat(auto-fit, minmax(min(100%, 210px), 1fr)) creates columns that also fit narrow containers.",
  },
  {
    id: "landing",
    title: "The studio landing page",
    tag: "CAPSTONE · 60 MIN",
    description:
      "Combine typography, Flexbox, Grid, tokens, and responsive design.",
    html: '<header><strong>FORM STUDIO</strong><nav><a href="#work">Our work</a> <a href="#contact">Get in touch</a></nav></header><main><section class="hero"><span>SMALL STUDIO. BIG IDEAS.</span><h1>Good design makes room for everyone.</h1><p>We build thoughtful digital spaces for people and their ideas.</p><a class="button" href="#work">Explore our work</a></section><section id="work" class="layout"><article class="card"><h2>Strategy</h2><p>Find the right problem.</p></article><article class="card"><h2>Design</h2><p>Make the idea visible.</p></article><article class="card"><h2>Development</h2><p>Build it for real people.</p></article></section></main><footer id="contact">Let’s make something useful. hello@example.com</footer>',
    css: "/* Define tokens, then style each semantic section. */\nbody { font-family: system-ui; margin: 0; }",
    solution:
      baseCSS +
      "\n:root { --primary: #5544c8; --space: 24px; }\nbody { margin: 0; padding: var(--space); }\nheader { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 16px; }\na { color: var(--primary); }\n.hero { padding-block: clamp(40px, 10vw, 100px); max-width: 750px; }\n.hero h1 { font-size: clamp(32px, 7vw, 68px); letter-spacing: -.04em; }\n.button { display: inline-block; padding: 14px 22px; background: var(--primary); color: white; border-radius: 8px; }\n.layout { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr)); gap: 20px; }\nfooter { padding-block: 40px; }\na:focus-visible { outline: 3px solid #172039; outline-offset: 4px; }",
    steps: [
      "Define a small token system.",
      "Build a wrapping Flexbox navigation.",
      "Create a fluid typographic hero.",
      "Use Grid for service cards.",
      "Verify focus, contrast, narrow widths, and reduced motion.",
      "Export files and follow the publishing guide.",
    ],
    hint: "Start narrow. Use clamp() for the headline and auto-fit for content-driven columns.",
  },
];
export const flexChallenges = [
  "Center one card on both axes",
  "Make a horizontal navigation",
  "Wrap a button group",
  "Create equal-height cards",
  "Let a search field absorb free space",
  "Push a profile link to the end with auto margin",
  "Create a pricing row that wraps",
  "Switch row to column at a content breakpoint",
  "Repair an unbreakable-text overflow",
  "Build a dashboard toolbar with wrapping actions",
];
