import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Bookmark,
  Box,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Code2,
  Compass,
  Download,
  ExternalLink,
  FlaskConical,
  GraduationCap,
  Grid2X2,
  Layers3,
  Menu,
  Monitor,
  Play,
  Search,
  Settings2,
  Sparkles,
  Target,
  Terminal,
  Trophy,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import {
  baseCSS,
  flexChallenges,
  history,
  Lesson,
  lessons,
  milestones,
  projects,
} from "./course";
import { download, validateProgress } from "./engine.mjs";
import { empty, Progress, useProgress } from "./progress";
import Playground from "./components/Playground";
import Preview from "./components/Preview";
import Quiz from "./components/Quiz";
import Lab, { Bugs, LabIndex, labCatalog } from "./components/Labs";
const nav = [
  {
    label: "YOUR LEARNING PATH",
    links: [
      ["home", "Overview", Compass],
      ["zero", "Start from zero", Sparkles],
      ["learn", "Learn CSS", BookOpen],
      ["history", "CSS history", Clock3],
    ],
  },
  {
    label: "LEARN BY DOING",
    links: [
      ["labs", "Interactive labs", FlaskConical],
      ["playground", "Live playground", Code2],
      ["layout", "Layout playground", Grid2X2],
      ["challenges", "Design challenges", Target],
      ["projects", "Real projects", Layers3],
      ["bugs", "Bug Hunter", Terminal],
    ],
  },
  {
    label: "MAKE IT STICK",
    links: [
      ["quizzes", "Quizzes", CheckCircle2],
      ["reference", "CSS reference", Search],
      ["revision", "Revision cards", Bookmark],
      ["roadmap", "Learning roadmap", Compass],
    ],
  },
] as const;
const valid = [
  "home",
  "zero",
  "learn",
  "lesson",
  "history",
  "labs",
  "playground",
  "layout",
  "challenges",
  "projects",
  "bugs",
  "quizzes",
  "reference",
  "revision",
  "teacher",
  "roadmap",
  "settings",
];
function route() {
  const s = location.hash.slice(1);
  return valid.includes(s.split("/")[0]) ? s : "home";
}
export default function App() {
  const { progress, setProgress, error, complete, bookmark, answer, project } =
    useProgress();
  const [page, setPage] = useState(route),
    [mobile, setMobile] = useState(false),
    [query, setQuery] = useState("");
  const main = useRef<HTMLElement>(null);
  const drawer = useRef<HTMLElement>(null);
  const [narrow, setNarrow] = useState(
    () => matchMedia("(max-width: 760px)").matches,
  );
  useEffect(() => {
    const m = matchMedia("(max-width: 760px)");
    const changed = () => setNarrow(m.matches);
    m.addEventListener("change", changed);
    return () => m.removeEventListener("change", changed);
  }, []);
  useEffect(() => {
    if (!mobile || !narrow) return;
    const previous = document.activeElement as HTMLElement | null;
    drawer.current?.querySelector<HTMLElement>("button,a")?.focus();
    const keys = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setMobile(false);
      }
      if (e.key === "Tab") {
        const items = [
          ...drawer.current!.querySelectorAll<HTMLElement>("a,button,input"),
        ];
        const first = items[0],
          last = items.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", keys);
    return () => {
      document.removeEventListener("keydown", keys);
      previous?.focus();
    };
  }, [mobile, narrow]);
  function go(s: string) {
    location.hash = s;
    setMobile(false);
    window.scrollTo(0, 0);
  }
  useEffect(() => {
    const f = () => {
      setPage(route());
      setMobile(false);
      window.scrollTo(0, 0);
      main.current?.focus({ preventScroll: true });
    };
    window.addEventListener("hashchange", f);
    return () => window.removeEventListener("hashchange", f);
  }, []);
  const [area, param] = page.split("/");
  const lesson = lessons.find((l) => l.id === Number(param)) || lessons[0];
  useEffect(() => {
    document.title =
      (area === "home"
        ? "Learn CSS by Designing"
        : area === "lesson"
          ? lesson.title
          : area.charAt(0).toUpperCase() + area.slice(1)) + " · CSS LAB";
    if (area === "lesson")
      try {
        localStorage.setItem("csslab-current", String(lesson.id));
      } catch {}
  }, [page]);
  const next =
    lessons.find((l) => !progress.completed.includes(l.id)) || lessons[0];
  return (
    <div className="app">
      <a
        className="skip-link"
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          main.current?.focus();
        }}
      >
        Skip to learning content
      </a>
      {mobile && (
        <button
          className="scrim"
          aria-label="Close navigation"
          onClick={() => setMobile(false)}
        />
      )}
      <aside
        ref={drawer}
        id="course-navigation"
        inert={narrow && !mobile}
        role={narrow && mobile ? "dialog" : undefined}
        aria-modal={narrow && mobile ? true : undefined}
        className={"sidebar " + (mobile ? "open" : "")}
        aria-label="Main navigation"
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a")) setMobile(false);
        }}
      >
        {narrow && (
          <button
            className="nav-close"
            aria-label="Close course navigation"
            onClick={() => setMobile(false)}
          >
            <X size={19} />
          </button>
        )}
        <a className="brand" href="#home">
          <span className="brand-icon">{"{ }"}</span>
          <span>
            CSS <b>LAB</b>
            <small>LEARN CSS BY DESIGNING</small>
          </span>
        </a>
        <div className="sidebar-search">
          <Search size={15} />
          <input
            aria-label="Search lessons"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a concept…"
          />
          <kbd>/</kbd>
        </div>
        {query ? (
          <div className="search-results">
            {lessons
              .filter((l) =>
                (l.title + " " + l.topics.join(" "))
                  .toLowerCase()
                  .includes(query.toLowerCase()),
              )
              .map((l) => (
                <button
                  key={l.id}
                  onClick={() => {
                    go("lesson/" + l.id);
                    setQuery("");
                  }}
                >
                  {l.title}
                  <ChevronRight size={14} />
                </button>
              ))}
            {!lessons.some((l) =>
              (l.title + " " + l.topics.join(" "))
                .toLowerCase()
                .includes(query.toLowerCase()),
            ) && <p>No lessons match. Try “spacing” or “grid”.</p>}
          </div>
        ) : (
          nav.map((g) => (
            <nav key={g.label}>
              <span className="nav-label">{g.label}</span>
              {g.links.map(([id, label, Icon]) => (
                <a
                  key={id}
                  className={
                    area === id || (area === "lesson" && id === "learn")
                      ? "active"
                      : ""
                  }
                  href={"#" + id}
                >
                  <Icon size={17} />
                  {label}
                  {id === "labs" && <small>9</small>}
                </a>
              ))}
            </nav>
          ))
        )}
        <div className="sidebar-bottom">
          <a href="#teacher" className={area === "teacher" ? "active" : ""}>
            <GraduationCap size={18} />
            Teacher mode <span>↗</span>
          </a>
          <div className="progress-mini">
            <div>
              <span>Your learning journey</span>
              <b>{Math.round((progress.completed.length / 18) * 100)}%</b>
            </div>
            <progress value={progress.completed.length} max={18} />
            <small>
              {progress.completed.length} of 18 chapter introductions complete
            </small>
          </div>
          <a href="#settings">
            <Settings2 size={15} /> Progress & settings
          </a>
          <div className="ecosystem">
            <a
              href="https://shadabur-rahaman.github.io/html-lab/#home"
              target="_blank"
              rel="noreferrer"
            >
              HTML LAB ↗
            </a>
            <span>·</span>
            <a
              href="https://shadabur-rahaman.github.io/js-lab/"
              target="_blank"
              rel="noreferrer"
            >
              JS LAB ↗
            </a>
          </div>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <button
            className="menu-button"
            aria-label="Open navigation"
            aria-controls="course-navigation"
            aria-expanded={mobile}
            onClick={() => setMobile(!mobile)}
          >
            <Menu size={22} />
          </button>
          <div className="breadcrumb">
            Your workspace <ChevronRight size={13} />
            <span>
              {area === "home"
                ? "Overview"
                : area === "lesson"
                  ? lesson.title
                  : area === "labs" && param
                    ? labCatalog.find((x) => x[0] === param)?.[1] || "Labs"
                    : area.replace(/^./, (c) => c.toUpperCase())}
            </span>
          </div>
          <div className="topbar-right">
            <span className="local-label">
              <i className="status-dot" />
              Free to explore. Yours to create.
            </span>
            <a
              href="#roadmap"
              title="View earned milestones"
              className="avatar"
            >
              S
            </a>
          </div>
        </header>
        <main id="main-content" tabIndex={-1} ref={main}>
          {error && (
            <p className="notice" role="alert">
              {error}
            </p>
          )}
          {area === "home" ? (
            <Home go={go} next={next} progress={progress} />
          ) : area === "zero" ? (
            <Zero go={go} />
          ) : area === "learn" || area === "roadmap" ? (
            <Course go={go} progress={progress} roadmap={area === "roadmap"} />
          ) : area === "lesson" ? (
            <LessonPage
              key={lesson.id}
              lesson={lesson}
              complete={() => complete(lesson.id)}
              bookmark={() => bookmark(lesson.id)}
              isBookmarked={progress.bookmarks.includes(lesson.id)}
              completed={progress.completed.includes(lesson.id)}
              answer={answer}
              go={go}
            />
          ) : area === "labs" &&
            param &&
            labCatalog.some((x) => x[0] === param) ? (
            <Lab key={param} kind={param} />
          ) : area === "labs" || area === "layout" ? (
            <LabIndex go={go} />
          ) : area === "playground" ? (
            <>
              <Intro
                eyebrow="A BLANK CANVAS, A REAL BROWSER"
                title="Make something yours."
                text="Write semantic HTML, style it with native CSS, and explore the result. Click elements in the preview to inspect them."
              />
              <Playground
                initialHTML={lessons[0].html}
                initialCSS={
                  baseCSS +
                  "\nbutton { background: #6554d9; color: white; border: 0; border-radius: 8px; padding: 12px 20px; }"
                }
              />
            </>
          ) : area === "history" ? (
            <History />
          ) : area === "bugs" ? (
            <Bugs />
          ) : area === "projects" ? (
            <Projects progress={progress} onComplete={project} />
          ) : area === "quizzes" ? (
            <Quizzes answers={progress.answers} answer={answer} />
          ) : area === "challenges" ? (
            <Challenges />
          ) : area === "reference" ? (
            <Reference />
          ) : area === "revision" ? (
            <Revision go={go} progress={progress} />
          ) : area === "teacher" ? (
            <Teacher />
          ) : area === "settings" ? (
            <Settings progress={progress} setProgress={setProgress} />
          ) : (
            <Course go={go} progress={progress} />
          )}
          <footer className="page-footer">
            <span>
              <b>CSS LAB</b> · A little CSS. A lot of possibility.
            </span>
            <span>Built for curious minds. No account needed.</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
function Intro({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div className="page-intro">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{text}</p>
    </div>
  );
}
function Home({
  go,
  next,
  progress,
}: {
  go: (s: string) => void;
  next: Lesson;
  progress: Progress;
}) {
  const [styled, setStyled] = useState(true),
    [demo, setDemo] = useState("studio"),
    [padding, setPadding] = useState(24),
    [radius, setRadius] = useState(16),
    [color, setColor] = useState("#6757da");
  const html =
    '<header><div class="logo">form<span>®</span></div><nav>About &nbsp; Work &nbsp; Contact ↗</nav></header><section class="hero"><span class="kicker">A SMALL STUDIO WITH BIG IDEAS</span><h1>Good design.<br>A little different.</h1><p>Thoughtful spaces for bold ideas.<br>Built with curiosity, crafted with care.</p><a class="cta" href="#work">Explore our work &nbsp; ↗</a><div class="sculpture"><div></div><i></i><b></b></div></section><footer id="work"><span>01 — BRAND & DIGITAL</span><span>MADE TO MAKE A DIFFERENCE ↗</span></footer>';
  const demoCSS = `*{box-sizing:border-box}body{font-family:system-ui,sans-serif;color:#24233d;background:#f1f0e9;padding:24px;margin:0}header{display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #d6d5ce;padding-bottom:14px}.logo{font-size:28px;letter-spacing:-2px;font-weight:800}.logo span{font-size:12px;vertical-align:top;letter-spacing:0}nav{font-size:10px}.hero{position:relative;min-height:305px;padding-top:36px}.kicker{font-size:8px;letter-spacing:1.5px;font-weight:700}h1{font-size:36px;line-height:1.05;letter-spacing:-2.3px;margin:16px 0;color:#29263d}p{font-size:11px;line-height:1.7;color:#646174}.cta{display:inline-block;background:#29263d;color:white;text-decoration:none;font-size:10px;padding:11px 16px;margin-top:10px;border-radius:5px}.sculpture{position:absolute;right:0;top:142px;width:140px;height:140px}.sculpture div{position:absolute;inset:0 30px 30px 0;border-radius:100% 100% 0 100%;background:linear-gradient(135deg,#c3baff,#8876d9);transform:rotate(-15deg);box-shadow:8px 14px 20px #35265d20}.sculpture i{position:absolute;inset:65px 0 0 65px;border-radius:100% 100% 100% 0;background:linear-gradient(135deg,#e5e7bb,#b1bc8e);transform:rotate(14deg);box-shadow:8px 14px 20px #35265d20}.sculpture b{position:absolute;width:70px;height:70px;border-radius:50%;background:#f1f0e9;top:56px;left:50px}footer{display:flex;justify-content:space-between;border-top:1px solid #d6d5ce;padding-top:16px;font-size:7px;letter-spacing:1px}@media(max-width:430px){h1{font-size:35px}.sculpture{transform:scale(.75);transform-origin:right bottom;opacity:.55;top:105px}.hero{min-height:310px}}`;
  return (
    <>
      <div className="home-badge">
        <span className="pill">
          <i /> YOUR CSS JOURNEY STARTS HERE
        </span>
        <span className="muted">No experience required. Just curiosity.</span>
      </div>
      <section className="home-hero">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1>
            HTML builds the page.
            <br />
            CSS brings the
            <br />
            <em>design to life.</em>
          </h1>
          <p>
            Don’t just write CSS. Understand why your design works.
            <br className="desktop" /> Learn visually. Experiment freely. Build
            with confidence.
          </p>
          <div className="hero-actions">
            <button
              className="button primary"
              onClick={() => go("lesson/" + next.id)}
            >
              {progress.completed.length
                ? "Continue learning"
                : "Start learning CSS"}
              <ArrowRight size={17} />
            </button>
            <button className="button secondary" onClick={() => go("labs")}>
              Explore the labs <FlaskConical size={16} />
            </button>
          </div>
          <div className="hero-proof">
            <span>
              <CheckCircle2 size={14} />
              Real browser previews
            </span>
            <span>
              <CheckCircle2 size={14} />
              Learn at your pace
            </span>
            <span>
              <CheckCircle2 size={14} />
              100% free
            </span>
          </div>
        </motion.div>
        <div className="hero-demo">
          <div className="browser-chrome">
            <div className="window-dots">
              <i />
              <i />
              <i />
            </div>
            <span>your-first-website.html</span>
            <ExternalLink size={12} />
          </div>
          <div className="demo-frame">
            <Preview
              html={html}
              css={styled ? demoCSS : ""}
              width={480}
              height={404}
            />
          </div>
          <div className="demo-toggle">
            <span>
              <Sparkles size={14} />
              Same HTML. A whole new feeling.
            </span>
            <label>
              CSS{" "}
              <button
                className={"switch " + (styled ? "on" : "")}
                aria-label="Toggle CSS styling"
                role="switch"
                aria-checked={styled}
                onClick={() => setStyled(!styled)}
              >
                <i />
              </button>
              <b>{styled ? "ON" : "OFF"}</b>
            </label>
          </div>
          <span className="demo-note">
            ↑ Flip the switch. See what CSS makes possible.
          </span>
        </div>
      </section>
      <div className="home-stats">
        <div>
          <BookOpen size={19} />
          <b>18</b>
          <span>chapter introductions</span>
        </div>
        <div>
          <FlaskConical size={19} />
          <b>9</b>
          <span>hands-on labs</span>
        </div>
        <div>
          <Layers3 size={19} />
          <b>3</b>
          <span>guided projects</span>
        </div>
        <div>
          <GraduationCap size={20} />
          <b>Built for</b>
          <span>learners & classrooms</span>
        </div>
      </div>
      <section>
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              LESS THEORY IN THE AIR. MORE IDEAS IN YOUR HANDS.
            </span>
            <h2>
              See it. Change it. <em>Understand it.</em>
            </h2>
          </div>
          <button className="text-button" onClick={() => go("labs")}>
            All interactive labs <ArrowRight size={15} />
          </button>
        </div>
        <div className="featured-labs">
          {labCatalog.slice(0, 3).map(([id, name, desc], i) => (
            <button
              className="lab-card"
              onClick={() => go("labs/" + id)}
              key={id}
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
                    <i>01</i>
                    <i>02</i>
                    <i>03</i>
                  </div>
                ) : (
                  <div className="mini-grid">
                    {Array.from({ length: 6 }, (_, n) => (
                      <i key={n} />
                    ))}
                  </div>
                )}
                <span className="art-tag">
                  {
                    [
                      "SPACE, MADE VISIBLE",
                      "FIND YOUR FLOW",
                      "EVERYTHING IN ITS PLACE",
                    ][i]
                  }
                </span>
              </div>
              <div className="lab-card-copy">
                <h3>
                  {name}
                  <ArrowRight size={16} />
                </h3>
                <p>{desc}</p>
                <span className="lab-link">
                  Open the lab <ChevronRight size={12} />
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>
      <section className="journey-banner">
        <div>
          <span className="eyebrow">FROM “WHAT IS CSS?” TO “I MADE THAT.”</span>
          <h2>
            A clear path. <em>Your own pace.</em>
          </h2>
          <p>Start with a single rule. Build up to responsive websites.</p>
        </div>
        <button className="button secondary" onClick={() => go("roadmap")}>
          See the learning roadmap
          <ArrowRight size={16} />
        </button>
      </section>
      <section>
        <div className="section-heading">
          <div>
            <span className="eyebrow">YOUR FIRST EXPERIMENT</span>
            <h2>A small change. A different design.</h2>
          </div>
          <div className="tabs">
            <button
              className={demo === "studio" ? "active" : ""}
              onClick={() => setDemo("studio")}
            >
              Design a card
            </button>
            <button
              className={demo === "responsive" ? "active" : ""}
              onClick={() => setDemo("responsive")}
            >
              Try responsive
            </button>
          </div>
        </div>
        {demo === "studio" ? (
          <div className="first-card panel">
            <div>
              <label className="control">
                <span>Accent color</span>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </label>
              <label className="control">
                <span>Padding · {padding}px</span>
                <input
                  aria-label="Card padding"
                  type="range"
                  min={8}
                  max={48}
                  value={padding}
                  onChange={(e) => setPadding(+e.target.value)}
                />
              </label>
              <label className="control">
                <span>Corner radius · {radius}px</span>
                <input
                  aria-label="Card corner radius"
                  type="range"
                  min={0}
                  max={40}
                  value={radius}
                  onChange={(e) => setRadius(+e.target.value)}
                />
              </label>
              <pre>{`.card {\n  padding: ${padding}px;\n  border-radius: ${radius}px;\n  border-top: 5px solid ${color};\n}`}</pre>
              <button className="text-button" onClick={() => go("playground")}>
                Edit every detail in the playground
                <ArrowRight size={15} />
              </button>
            </div>
            <Preview
              html={lessons[0].html}
              css={
                baseCSS +
                `\n.card { padding:${padding}px; border-radius:${radius}px; border-top:5px solid ${color}; }\nbutton { background:${color}; color:white; border:0; padding:12px 16px; border-radius:8px; }`
              }
              width={440}
              height={340}
            />
          </div>
        ) : (
          <Lab kind="responsive" />
        )}
      </section>
      <div className="classroom-card">
        <GraduationCap size={30} />
        <div>
          <h3>Learning together is a little more powerful.</h3>
          <p>
            Speaking notes, prediction questions, pacing, and full-screen
            experiments for your classroom.
          </p>
        </div>
        <button className="button secondary" onClick={() => go("teacher")}>
          Enter teacher mode
          <ArrowRight size={16} />
        </button>
      </div>
    </>
  );
}
function Zero({ go }: { go: (s: string) => void }) {
  return (
    <>
      <Intro
        eyebrow="CSS FROM ZERO"
        title="You don’t need a head start."
        text="No design or programming experience needed. Your browser is enough for the first lessons."
      />
      <div className="zero-grid">
        {[
          [
            "01",
            "Meet the page",
            "HTML gives the page its structure: headings, paragraphs, buttons. CSS makes choices about their appearance.",
          ],
          [
            "02",
            "Give it one instruction",
            "A selector chooses an element. A property is the characteristic. A value is the setting you want.",
          ],
          [
            "03",
            "See it happen",
            "Open the CSS tab, change color: blue to color: purple, and watch the same heading update.",
          ],
          [
            "04",
            "Make a mistake on purpose",
            "Try colour instead of color. The browser ignores an unknown property. Fix the name and try again.",
          ],
        ].map(([n, t, p]) => (
          <div className="panel" key={n}>
            <span className="step-number">{n}</span>
            <h3>{t}</h3>
            <p>{p}</p>
          </div>
        ))}
      </div>
      <Playground
        initialHTML="<h1>My first styled page</h1><p>I can learn this one change at a time.</p>"
        initialCSS="h1 {\n  color: blue;\n  font-size: 32px;\n}\np { font-family: system-ui; }"
        storageKey="zero"
        title="Your virtual index.html and style.css"
        hint="Change blue to purple. The selector stays h1; only the color value changes."
      />
      <div className="callout">
        <strong>When you are ready for real files</strong>
        <p>
          Create a project folder. In VS Code, save index.html and style.css
          inside it. Add{" "}
          <code>{'<link rel="stylesheet" href="style.css">'}</code> inside the
          HTML head. Open index.html in a browser. Right-click the heading and
          choose Inspect to see the browser’s styles.
        </p>
      </div>
      <button className="button primary" onClick={() => go("lesson/1")}>
        Begin chapter one
        <ArrowRight size={16} />
      </button>
    </>
  );
}
function Course({
  go,
  progress,
  roadmap = false,
}: {
  go: (s: string) => void;
  progress: Progress;
  roadmap?: boolean;
}) {
  return (
    <>
      <Intro
        eyebrow={roadmap ? "YOUR LEARNING ROADMAP" : "LEARN WITH UNDERSTANDING"}
        title={
          roadmap
            ? "One discovery at a time."
            : "From a first rule to a real design."
        }
        text="18 chapter introductions with editable examples, prediction checks, debugging practice, and teacher notes. Advanced chapters introduce the topics; the full advanced masterclasses remain future work."
      />
      {["Foundations", "Layout & components", "Beyond the basics"].map(
        (group, i) => (
          <section key={group}>
            <div className="section-heading">
              <div>
                <span className="eyebrow">PATH 0{i + 1}</span>
                <h2>{group}</h2>
              </div>
              <span className="muted">
                {i === 2
                  ? "INTRODUCTORY COVERAGE"
                  : "LEARN → EXPERIMENT → PRACTICE"}
              </span>
            </div>
            <div className="course-list">
              {lessons
                .filter((l) => l.level === group)
                .map((l) => (
                  <button
                    className="course-row"
                    key={l.id}
                    onClick={() => go("lesson/" + l.id)}
                  >
                    <span
                      className={
                        "lesson-number " +
                        (progress.completed.includes(l.id) ? "done" : "")
                      }
                    >
                      {progress.completed.includes(l.id) ? (
                        <Check size={18} />
                      ) : (
                        String(l.id).padStart(2, "0")
                      )}
                    </span>
                    <div>
                      <h3>{l.title}</h3>
                      <p>{l.topics.join(" · ")}</p>
                    </div>
                    <span className="duration">
                      <Clock3 size={13} />
                      {l.minutes} min
                    </span>
                    <ChevronRight size={16} />
                  </button>
                ))}
            </div>
          </section>
        ),
      )}
      {roadmap && (
        <div className="milestones">
          {milestones.map(([name, id]) => (
            <div
              className={
                "panel " + (progress.completed.includes(id) ? "earned" : "")
              }
              key={id}
            >
              <Award size={25} />
              <h3>{name}</h3>
              <p>
                {progress.completed.includes(id)
                  ? "Self-reported lesson milestone earned"
                  : "Complete chapter " + id + " when you feel ready"}
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
function LessonPage({
  lesson: l,
  complete,
  bookmark,
  isBookmarked,
  completed,
  answer,
  go,
}: {
  lesson: Lesson;
  complete: () => void;
  bookmark: () => void;
  isBookmarked: boolean;
  completed: boolean;
  answer: (id: string, b: boolean) => void;
  go: (s: string) => void;
}) {
  const [tab, setTab] = useState("Understand");
  return (
    <>
      <button className="text-button" onClick={() => go("learn")}>
        <ArrowLeft size={15} />
        All chapters
      </button>
      <div className="page-intro">
        <span className="eyebrow">
          CHAPTER {String(l.id).padStart(2, "0")} · {l.level.toUpperCase()} ·{" "}
          {l.minutes} MIN
        </span>
        <h1>
          {l.title}
          <em>.</em>
        </h1>
        <div className="chips">
          {l.topics.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <button className="text-button" onClick={bookmark}>
          <Bookmark size={15} fill={isBookmarked ? "currentColor" : "none"} />
          {isBookmarked ? "Bookmarked" : "Bookmark this lesson"}
        </button>
      </div>
      <div className="tabs lesson-tabs">
        {["Understand", "Experiment", "Practice & debug", "Quick check"].map(
          (t) => (
            <button
              key={t}
              className={t === tab ? "active" : ""}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ),
        )}
      </div>
      {tab === "Understand" ? (
        <>
          <div className="two-col">
            <div className="panel">
              <span className="eyebrow">WHY DOES THIS EXIST?</span>
              <p>{l.why}</p>
            </div>
            <div className="panel">
              <span className="eyebrow">THINK OF IT THIS WAY</span>
              <p>{l.analogy}</p>
            </div>
          </div>
          <div className="prose">
            <h2>The idea, in plain English.</h2>
            <p>{l.what}</p>
            <h3>Read the syntax</h3>
            <pre>{l.css}</pre>
            {l.explain.map((e, i) => (
              <p key={e}>
                <b>{i + 1}.</b> {e}
              </p>
            ))}
          </div>
          <div className="callout">
            <strong>Keep an eye on this</strong>
            <p>{l.mistake}</p>
          </div>
          <button
            className="button primary"
            onClick={() => setTab("Experiment")}
          >
            Try the idea
            <ArrowRight size={16} />
          </button>
        </>
      ) : tab === "Experiment" ? (
        <>
          <div className="panel">
            <span className="eyebrow">YOUR EXPERIMENT</span>
            <ol>
              {l.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </div>
          <Playground
            initialHTML={l.html}
            initialCSS={baseCSS + "\n" + l.css}
            solution={baseCSS + "\n" + l.css}
            storageKey={"lesson-" + l.id}
            title={l.title + " · experiment"}
          />
          <button
            className="button secondary"
            onClick={() =>
              go(
                l.lab === "playground"
                  ? "playground"
                  : ["history", "bugs", "projects"].includes(l.lab)
                    ? l.lab
                    : "labs/" + l.lab,
              )
            }
          >
            Open the related lab
            <FlaskConical size={16} />
          </button>
        </>
      ) : tab === "Practice & debug" ? (
        <>
          <h2>Find the cause. Repair the rule.</h2>
          <p>
            Compare what you expected with what the browser rendered. Change one
            thing, then verify.
          </p>
          <Playground
            initialHTML={l.html}
            initialCSS={baseCSS + "\n" + l.debug}
            solution={baseCSS + "\n" + l.solution}
            hint={l.mistake}
            storageKey={"debug-" + l.id}
          />
          <div className="two-col">
            <div className="panel">
              <span className="eyebrow">GUIDED PRACTICE</span>
              <p>{l.practice}</p>
            </div>
            <div className="panel">
              <span className="eyebrow">YOUR INDEPENDENT CHALLENGE</span>
              <p>{l.challenge}</p>
            </div>
          </div>
        </>
      ) : (
        <>
          <Quiz q={l.predict} id={"lesson-" + l.id} onAnswer={answer} />
          <div className="callout">
            <strong>Take this with you.</strong>
            <p>{l.recap}</p>
          </div>
          <div className="completion panel">
            <Award size={35} />
            <div>
              <h3>
                {completed
                  ? "A discovery you can come back to."
                  : "Feeling ready to move forward?"}
              </h3>
              <p>Completion is your own learning check. Revisit any time.</p>
            </div>
            <button
              className="button primary"
              onClick={() => {
                complete();
                go(l.id < 18 ? "lesson/" + (l.id + 1) : "projects");
              }}
            >
              {completed ? "Continue" : "Mark complete & continue"}
              <ArrowRight size={16} />
            </button>
          </div>
        </>
      )}
      <div className="lesson-pagination">
        <button onClick={() => go(l.id > 1 ? "lesson/" + (l.id - 1) : "learn")}>
          <ArrowLeft size={14} />
          Previous
        </button>
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/CSS"
          target="_blank"
          rel="noreferrer"
        >
          Explore MDN CSS
          <ExternalLink size={13} />
        </a>
        <button
          onClick={() => go(l.id < 18 ? "lesson/" + (l.id + 1) : "projects")}
        >
          Next chapter
          <ArrowRight size={14} />
        </button>
      </div>
    </>
  );
}
function History() {
  const [era, setEra] = useState(0);
  return (
    <>
      <Intro
        eyebrow="THE CSS EVOLUTION TIME MACHINE"
        title="A better web, one idea at a time."
        text="Trace the problems that shaped the language. These examples run in your modern browser; they are teaching recreations, not historical browser emulation."
      />
      <div className="timeline">
        {history.map((h, i) => (
          <button
            className={era === i ? "active" : ""}
            key={h.year}
            onClick={() => setEra(i)}
          >
            <i />
            {h.year}
          </button>
        ))}
      </div>
      <div className="panel era">
        <span className="eyebrow">{history[era].year}</span>
        <h2>{history[era].title}</h2>
        <p>{history[era].text}</p>
      </div>
      <Playground
        key={era}
        initialHTML={lessons[0].html}
        initialCSS={baseCSS + "\n" + history[era].css}
        storageKey={"era-" + era}
      />
      <p className="muted">
        Specification milestones do not imply simultaneous browser adoption.
        Sources:{" "}
        <a
          href="https://www.w3.org/Style/CSS/"
          target="_blank"
          rel="noreferrer"
        >
          W3C CSS
        </a>{" "}
        ·{" "}
        <a
          href="https://www.w3.org/Style/CSS20/history.html"
          target="_blank"
          rel="noreferrer"
        >
          W3C CSS history
        </a>
        .
      </p>
    </>
  );
}
function Projects({
  progress,
  onComplete,
}: {
  progress: Progress;
  onComplete: (s: string) => void;
}) {
  const [id, setId] = useState(0),
    [checks, setChecks] = useState<Record<string, boolean>>({});
  const p = projects[id];
  return (
    <>
      <Intro
        eyebrow="BUILD SOMETHING YOU CAN CALL YOURS"
        title="Ideas become real here."
        text="Three guided projects. Start from a brief, build in the browser, and export HTML and CSS files you can publish."
      />
      <div className="project-cards">
        {projects.map((p, i) => (
          <button
            className={"panel " + (id === i ? "selected" : "")}
            key={p.id}
            onClick={() => setId(i)}
          >
            <span className="eyebrow">{p.tag}</span>
            <h3>{p.title}</h3>
            <p>{p.description}</p>
            <span>
              {progress.projects.includes(p.id)
                ? "Self-reviewed ✓"
                : "Open project →"}
            </span>
          </button>
        ))}
      </div>
      <div className="panel project-brief">
        <h2>{p.title} · your brief</h2>
        <div className="checklist">
          {p.steps.map((s, i) => (
            <label key={s}>
              <input
                type="checkbox"
                checked={!!checks[p.id + i]}
                onChange={(e) =>
                  setChecks({ ...checks, [p.id + i]: e.target.checked })
                }
              />
              {s}
            </label>
          ))}
        </div>
      </div>
      <Playground
        key={id}
        initialHTML={p.html}
        initialCSS={p.css}
        solution={p.solution}
        hint={p.hint}
        storageKey={"project-" + p.id}
      />
      <div className="two-col">
        <div className="panel">
          <span className="eyebrow">REVIEW RUBRIC</span>
          <p>
            Score 0–2 each: semantic structure, visual hierarchy, layout
            resilience, accessibility, and readable CSS. Explain the evidence
            for your score.
          </p>
          <button
            className="button primary"
            disabled={!p.steps.every((_, i) => checks[p.id + i])}
            onClick={() => onComplete(p.id)}
          >
            Mark project self-reviewed
            <Check size={15} />
          </button>
        </div>
        <div className="panel">
          <span className="eyebrow">FROM LOCAL FILES TO A LIVE WEBSITE</span>
          <p>
            Export and unzip the project. Open it locally, inspect it, and test
            at narrow and wide widths. Create a Git repository and push it to
            GitHub. Follow the provider’s current setup guide.
          </p>
          <a
            className="text-button"
            href="https://docs.github.com/en/pages/quickstart"
            target="_blank"
            rel="noreferrer"
          >
            GitHub Pages publishing guide
            <ExternalLink size={14} />
          </a>
          <p className="muted">
            Export does not deploy your project. Verify the real hosting result
            before reporting it published.
          </p>
        </div>
      </div>
    </>
  );
}
function Quizzes({
  answers,
  answer,
}: {
  answers: Record<string, boolean>;
  answer: (id: string, b: boolean) => void;
}) {
  const [id, setId] = useState(1);
  return (
    <>
      <Intro
        eyebrow="PAUSE. REASON. THEN CHECK."
        title="How well does the idea stick?"
        text="18 prediction questions with explanations. Your latest result for each question is saved in this browser."
      />
      <div className="quiz-summary">
        <Trophy size={24} />
        <strong>
          {Object.values(answers).filter(Boolean).length} / 18 correct
        </strong>
        <span>{Object.keys(answers).length} questions attempted</span>
      </div>
      <div className="quiz-steps">
        {lessons.map((l) => (
          <button
            className={
              (id === l.id ? "active " : "") +
              (answers["lesson-" + l.id] ? "solved" : "")
            }
            aria-label={"Question " + l.id}
            key={l.id}
            onClick={() => setId(l.id)}
          >
            {answers["lesson-" + l.id] ? <Check size={15} /> : l.id}
          </button>
        ))}
      </div>
      <span className="eyebrow">{lessons[id - 1].title}</span>
      <Quiz
        key={id}
        q={lessons[id - 1].predict}
        id={"lesson-" + id}
        onAnswer={answer}
      />
      <button
        className="button secondary"
        disabled={id === 18}
        onClick={() => setId(id + 1)}
      >
        Next question
        <ArrowRight size={15} />
      </button>
    </>
  );
}
function Challenges() {
  const [selected, setSelected] = useState(0);
  return (
    <>
      <Intro
        eyebrow="DESIGN CHALLENGES"
        title="A brief. A constraint. Your solution."
        text="Ten progressive Flexbox briefs. These are open-ended exercises: use the live browser result and self-review criteria rather than a single text match."
      />
      <div className="challenge-layout">
        <div className="panel challenge-list">
          {flexChallenges.map((s, i) => (
            <button
              className={selected === i ? "active" : ""}
              key={s}
              onClick={() => setSelected(i)}
            >
              <span>{String(i + 1).padStart(2, "0")}</span>
              {s}
            </button>
          ))}
        </div>
        <div>
          <h2>{flexChallenges[selected]}</h2>
          <p>
            Build this with native CSS. Keep the DOM order meaningful, preserve
            keyboard focus, and test at 320px and 900px. Explain your choice of
            axis, alignment, and sizing.
          </p>
          <Playground
            key={selected}
            initialHTML={lessons[10].html}
            initialCSS={
              baseCSS +
              "\n.layout { display: flex; gap: 16px; }\n.card { flex: 1 1 150px; min-width: 0; }"
            }
            storageKey={"challenge-" + selected}
            hint="Identify the main axis first. Choose direction, alignment, wrapping, and item sizing deliberately."
          />
          <div className="callout">
            <strong>Self-review</strong>
            <p>
              Does the layout satisfy the brief? Does it remain readable when
              narrow? Can you explain why each declaration is needed? Save a
              version before trying another solution.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
const referenceEntries = [
  [
    "display",
    "Selects the box layout behavior.",
    "display: block | inline | inline-block | flex | grid | none",
    "Not inherited. Initial: inline. UA rules make many HTML elements block-level.",
  ],
  [
    "color",
    "Sets foreground text color.",
    "color: #6554d9;",
    "Inherited. Initial depends on the user agent.",
  ],
  [
    "background",
    "A shorthand for background image, color, positioning, and related settings.",
    "background: linear-gradient(135deg, #eeebff, #d8f5f0);",
    "Not inherited. Omitted shorthand parts reset to their initial values.",
  ],
  [
    "padding",
    "Space inside the border.",
    "padding: 16px 24px;",
    "Not inherited. Initial: 0. Percentages use the containing block’s inline size.",
  ],
  [
    "margin",
    "Space outside the border.",
    "margin: 20px auto;",
    "Not inherited. Initial: 0. Some block margins collapse.",
  ],
  [
    "box-sizing",
    "Chooses which box the declared dimensions describe.",
    "box-sizing: border-box;",
    "Not inherited. Initial: content-box.",
  ],
  [
    "width",
    "Sets an element’s preferred width, subject to constraints and layout.",
    "width: min(100%, 600px);",
    "Not inherited. Initial: auto.",
  ],
  [
    "min-width",
    "Sets a minimum width constraint.",
    "min-width: 0;",
    "Not inherited. Initial: auto; automatic minimums depend on layout context.",
  ],
  [
    "font-size",
    "Sets the font size.",
    "font-size: clamp(1.5rem, 5vw, 3rem);",
    "Inherited. Initial: medium.",
  ],
  [
    "line-height",
    "Controls line box height.",
    "line-height: 1.6;",
    "Inherited. Initial: normal. Unitless values scale with each element’s font size.",
  ],
  [
    "gap",
    "Spacing between grid/flex items or multicol columns.",
    "gap: 16px;",
    "Not inherited. Initial: normal; behavior depends on the layout.",
  ],
  [
    "justify-content",
    "Distributes space along the main axis in Flexbox or inline axis in Grid.",
    "justify-content: space-between;",
    "Not inherited. Initial: normal.",
  ],
  [
    "align-items",
    "Aligns items on the cross axis in Flexbox and block axis in Grid.",
    "align-items: center;",
    "Not inherited. Initial: normal.",
  ],
  [
    "flex",
    "Shorthand for grow, shrink, and basis.",
    "flex: 1 1 160px;",
    "Not inherited. Initial: 0 1 auto.",
  ],
  [
    "grid-template-columns",
    "Defines explicit column tracks.",
    "grid-template-columns: repeat(3, minmax(0, 1fr));",
    "Not inherited. Initial: none.",
  ],
  [
    "position",
    "Selects the positioning scheme.",
    "position: relative;",
    "Not inherited. Initial: static.",
  ],
  [
    "z-index",
    "Sets stack level where applicable and can establish a stacking context.",
    "z-index: 2;",
    "Not inherited. Initial: auto. Context boundaries constrain ordering.",
  ],
  [
    "overflow",
    "Controls behavior for content outside the padding box.",
    "overflow: auto;",
    "Not inherited. Initial: visible. Axes interact when values differ.",
  ],
  [
    "border-radius",
    "Rounds border corners.",
    "border-radius: 16px;",
    "Not inherited. Initial: 0.",
  ],
  [
    "box-shadow",
    "Adds shadows without taking layout space.",
    "box-shadow: 0 12px 24px #17203920;",
    "Not inherited. Initial: none.",
  ],
  [
    "transform",
    "Transforms the element’s visual coordinate space.",
    "transform: translateY(-4px);",
    "Not inherited. Initial: none. Can establish stacking and containing-block behavior.",
  ],
  [
    "transition",
    "Animates changes between eligible property values.",
    "transition: transform 200ms ease;",
    "Not inherited. Respect reduced-motion preferences.",
  ],
  [
    "custom properties",
    "Stores reusable values that normally inherit.",
    "--primary: #6554d9; color: var(--primary);",
    "Unregistered custom properties inherit. @property can change this.",
  ],
  [
    "@media",
    "Conditionally applies rules for an environment.",
    "@media (min-width: 640px) { .layout { display: grid; } }",
    "An at-rule, not an inherited property.",
  ],
  [
    "@container",
    "Conditionally applies rules using a query container.",
    "@container (min-width: 400px) { .card { display: flex; } }",
    "Requires an appropriate ancestor query container for size queries.",
  ],
  [
    "@layer",
    "Organizes cascade priority into named layers.",
    "@layer reset, base, components;",
    "Normal later layers win; important layer order is reversed.",
  ],
  [
    ":focus-visible",
    "Matches focus when the UA determines a visible indicator is appropriate.",
    ":focus-visible { outline: 3px solid navy; }",
    "Pseudo-class. Keep visible keyboard focus.",
  ],
  [
    ":where()",
    "Matches a selector list with zero specificity.",
    ":where(header, footer) { padding: 1rem; }",
    "The pseudo-class and its arguments add zero specificity.",
  ],
  [
    "clamp()",
    "Clamps a preferred calculated value between a minimum and maximum.",
    "font-size: clamp(1.5rem, 4vw, 3rem);",
    "A function; unit compatibility and expression validity still apply.",
  ],
];
function Reference() {
  const [query, setQuery] = useState(""),
    [entry, setEntry] = useState(referenceEntries[0]);
  return (
    <>
      <Intro
        eyebrow="CSS REFERENCE"
        title="Find the rule. Understand the reason."
        text="A focused V1 reference for the properties and mechanisms used in the labs. Follow MDN for full syntax and current compatibility tables."
      />
      <div className="reference-layout">
        <div className="panel">
          <label className="search-field">
            <Search size={16} />
            <input
              aria-label="Search CSS reference"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search properties, selectors…"
            />
          </label>
          <div className="reference-list">
            {referenceEntries
              .filter((e) =>
                e.join(" ").toLowerCase().includes(query.toLowerCase()),
              )
              .map((e) => (
                <button
                  className={entry[0] === e[0] ? "active" : ""}
                  key={e[0]}
                  onClick={() => setEntry(e)}
                >
                  <code>{e[0]}</code>
                  <ChevronRight size={13} />
                </button>
              ))}
            {!referenceEntries.some((e) =>
              e.join(" ").toLowerCase().includes(query.toLowerCase()),
            ) && <p>No entries match.</p>}
          </div>
        </div>
        <div className="panel reference-detail">
          <span className="eyebrow">A RULE WORTH UNDERSTANDING</span>
          <h2>{entry[0]}</h2>
          <p>{entry[1]}</p>
          <pre>{entry[2]}</pre>
          <p>{entry[3]}</p>
          <a
            className="text-button"
            href={
              "https://developer.mozilla.org/en-US/search?q=" +
              encodeURIComponent(entry[0] + " CSS")
            }
            target="_blank"
            rel="noreferrer"
          >
            Full MDN reference & compatibility
            <ExternalLink size={14} />
          </a>
          <button
            className="button secondary"
            onClick={() => (location.hash = "playground")}
          >
            Try it in the playground
            <Code2 size={15} />
          </button>
        </div>
      </div>
    </>
  );
}
function Revision({
  go,
  progress,
}: {
  go: (s: string) => void;
  progress: Progress;
}) {
  const [id, setId] = useState(0),
    [flipped, setFlipped] = useState(false),
    [only, setOnly] = useState(false);
  const list = only
    ? lessons.filter((l) => progress.bookmarks.includes(l.id))
    : lessons;
  const l = list[Math.min(id, list.length - 1)];
  return (
    <>
      <Intro
        eyebrow="SMALL RECALLS. STRONGER UNDERSTANDING."
        title="A fresh look at what you know."
        text="Say the idea out loud before revealing the recap. Bookmark lessons to build a personal revision set."
      />
      <label className="toggle">
        <input
          type="checkbox"
          checked={only}
          onChange={(e) => {
            setOnly(e.target.checked);
            setId(0);
            setFlipped(false);
          }}
        />{" "}
        Bookmarked lessons only
      </label>
      {l ? (
        <>
          <button
            className={"flashcard panel " + (flipped ? "flipped" : "")}
            onClick={() => setFlipped(!flipped)}
          >
            <span className="eyebrow">
              CHAPTER {l.id} · {flipped ? "THE IDEA" : "CAN YOU EXPLAIN IT?"}
            </span>
            <h2>{l.title}</h2>
            <p>
              {flipped
                ? l.recap
                : "Why does this concept exist? Give an everyday example, then explain where the analogy stops."}
            </p>
            <span>
              {flipped
                ? "Click to return to the question"
                : "Click to reveal the recap"}
            </span>
          </button>
          <div className="flash-controls">
            <button
              className="button secondary"
              disabled={id === 0}
              onClick={() => {
                setId(id - 1);
                setFlipped(false);
              }}
            >
              <ArrowLeft size={15} />
              Previous
            </button>
            <span>
              {id + 1} of {list.length}
            </span>
            <button
              className="button secondary"
              disabled={id === list.length - 1}
              onClick={() => {
                setId(id + 1);
                setFlipped(false);
              }}
            >
              Next
              <ArrowRight size={15} />
            </button>
          </div>
          <button className="text-button" onClick={() => go("lesson/" + l.id)}>
            Revisit this lesson
            <ArrowRight size={15} />
          </button>
        </>
      ) : (
        <p className="callout">
          No bookmarks yet. Open a lesson and choose “Bookmark this lesson”.
        </p>
      )}
    </>
  );
}
function Teacher() {
  const [id, setId] = useState(1),
    [seconds, setSeconds] = useState(0),
    [running, setRunning] = useState(false),
    [solutions, setSolutions] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const l = lessons[id - 1];
  useEffect(() => {
    if (!running) return;
    const start = Date.now() - seconds * 1000;
    const timer = setInterval(
      () => setSeconds(Math.floor((Date.now() - start) / 1000)),
      500,
    );
    return () => clearInterval(timer);
  }, [running]);
  return (
    <div className="teacher" ref={ref}>
      <Intro
        eyebrow="CLASSROOM READY · TEACHER MODE"
        title="Make the idea click."
        text="A presenter view with speaking notes, prediction prompts, live demonstrations, and flexible class pacing."
      />
      <div className="teacher-toolbar panel">
        <label>
          Lesson{" "}
          <select
            value={id}
            onChange={(e) => {
              setId(+e.target.value);
              setSolutions(false);
            }}
          >
            {lessons.map((l) => (
              <option value={l.id} key={l.id}>
                {l.id}. {l.title}
              </option>
            ))}
          </select>
        </label>
        <div className="timer">
          <Clock3 size={19} />
          <b>
            {Math.floor(seconds / 60)
              .toString()
              .padStart(2, "0")}
            :{(seconds % 60).toString().padStart(2, "0")}
          </b>
          <button onClick={() => setRunning(!running)}>
            {running ? "Pause" : "Start"}
          </button>
          <button
            onClick={() => {
              setRunning(false);
              setSeconds(0);
            }}
          >
            Reset
          </button>
        </div>
        <button
          className="button secondary"
          onClick={() => {
            if (document.fullscreenElement) document.exitFullscreen();
            else ref.current?.requestFullscreen().catch(() => {});
          }}
        >
          <Monitor size={15} />
          Present fullscreen
        </button>
      </div>
      <div className="teaching-notes">
        {[
          ["What to explain", l.what],
          ["Why it matters", l.why],
          ["An everyday analogy", l.analogy],
          ["What to demonstrate", l.steps.join(" ")],
          ["What to ask", l.predict.prompt],
          [
            "Expected answer",
            l.predict.options[l.predict.answer] + ". " + l.predict.explain,
          ],
          ["Common confusion", l.mistake],
          ["Practice · 2–5 minutes", l.practice],
          [
            "Transition",
            id < 18
              ? "Next, connect this idea to " +
                lessons[id].title.toLowerCase() +
                "."
              : "Bring these ideas together in the studio landing page project.",
          ],
        ].map(([t, p]) => (
          <div className="panel" key={t}>
            <span className="eyebrow">{t.toUpperCase()}</span>
            <p>{p}</p>
          </div>
        ))}
      </div>
      <Playground
        key={id}
        initialHTML={l.html}
        initialCSS={baseCSS + "\n" + l.css}
        solution={baseCSS + "\n" + l.solution}
        storageKey={"teacher-" + id}
        title="Live classroom demonstration"
      />
      <button
        className="button secondary"
        onClick={() => setSolutions(!solutions)}
      >
        {solutions ? "Hide" : "Show"} exercise solution
      </button>
      {solutions && <pre>{l.solution}</pre>}
      <div className="two-col">
        <div className="panel">
          <h3>Flexible 60-minute session</h3>
          <ul>
            <li>5 min · Recall the previous lesson</li>
            <li>10 min · Explain through an analogy</li>
            <li>10 min · Live visualization and prediction</li>
            <li>15 min · Guided CSS coding</li>
            <li>10 min · Independent practice</li>
            <li>5 min · Debug a deliberate mistake</li>
            <li>5 min · Quiz and recap</li>
          </ul>
          <p className="muted">
            Extend difficult topics over multiple sessions. Do not rush to fit
            the timer.
          </p>
        </div>
        <div className="panel">
          <h3>Homework & assessment</h3>
          <p>{l.challenge}</p>
          <p>
            Assess 0–2 each: valid CSS, explained reasoning, responsive
            resilience, accessible states, and maintainable structure. Ask
            learners to demonstrate their result and justify one design
            decision.
          </p>
          <button
            className="text-button"
            onClick={() =>
              download(
                "teacher-notes-" + id + ".txt",
                [
                  l.title,
                  l.what,
                  l.why,
                  l.analogy,
                  ...l.steps,
                  l.predict.prompt,
                  l.predict.explain,
                  l.practice,
                  l.challenge,
                  l.solution,
                ].join("\n\n"),
              )
            }
          >
            <Download size={15} />
            Download lesson notes
          </button>
        </div>
      </div>
      <details className="panel">
        <summary>Suggested 18-session teaching sequence</summary>
        <ol>
          {[
            "Introduction, history, and first CSS",
            "Selectors and syntax",
            "Cascade and inheritance",
            "Colors and typography",
            "Box model and spacing",
            "Display and positioning",
            "Flexbox fundamentals",
            "Flexbox practical layouts",
            "Grid",
            "Responsive design",
            "Component styling",
            "Transitions and animations",
            "Modern CSS and tokens",
            "Debugging and Developer Tools",
            "Accessibility and performance",
            "Guided project",
            "Independent project",
            "Presentation, testing, and publishing",
          ].map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </details>
    </div>
  );
}
function Settings({
  progress,
  setProgress,
}: {
  progress: Progress;
  setProgress: (p: Progress) => void;
}) {
  const [notice, setNotice] = useState(""),
    [reset, setReset] = useState(false);
  async function load(file?: File) {
    if (!file) return;
    if (file.size > 100000) {
      setNotice("Progress files must be smaller than 100 KB.");
      return;
    }
    try {
      setProgress(validateProgress(JSON.parse(await file.text())));
      setNotice("Progress imported successfully.");
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Could not import this file.");
    }
  }
  return (
    <>
      <Intro
        eyebrow="YOUR PROGRESS, YOUR BROWSER"
        title="Keep your discoveries close."
        text="Progress, bookmarks, and small experiments stay on this browser. They do not automatically transfer to another device. Export a backup before clearing browser data."
      />
      <div className="two-col">
        <div className="panel">
          <h3>Progress backup</h3>
          <p>
            {progress.completed.length} completed chapter introductions ·{" "}
            {progress.bookmarks.length} bookmarks ·{" "}
            {Object.keys(progress.answers).length} questions attempted.
          </p>
          <button
            className="button primary"
            onClick={() =>
              download(
                "css-lab-progress.json",
                JSON.stringify(progress, null, 2),
                "application/json",
              )
            }
          >
            <Download size={15} />
            Export progress
          </button>
          <label className="import-label">
            Import a progress backup
            <input
              type="file"
              accept=".json,application/json"
              onChange={(e) => {
                load(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
          </label>
        </div>
        <div className="panel">
          <h3>Reset local learning data</h3>
          <p>
            Reset progress, bookmarks, quiz results, and saved CSS LAB
            experiments in this browser. Export anything you want to keep first.
          </p>
          <button className="button secondary" onClick={() => setReset(true)}>
            Reset learning data
          </button>
          {reset && (
            <div className="callout">
              <strong>Delete this browser’s CSS LAB learning data?</strong>
              <div className="actions">
                <button
                  onClick={() => {
                    try {
                      Object.keys(localStorage)
                        .filter((k) => k.startsWith("csslab-"))
                        .forEach((k) => localStorage.removeItem(k));
                      setProgress({ ...empty });
                      setNotice("Local learning data reset.");
                      setReset(false);
                    } catch {
                      setNotice("Browser storage is unavailable.");
                    }
                  }}
                >
                  Yes, delete local data
                </button>
                <button onClick={() => setReset(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
      {notice && (
        <p className="notice" role="status">
          {notice}
        </p>
      )}
    </>
  );
}
