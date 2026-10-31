import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { contrast, validateProgress, MAX_CODE } from "../src/engine.mjs";
import { lessons, projects } from "../src/course.ts";
test("WCAG sRGB contrast handles extremes, symmetry, and AA threshold", () => {
  assert.equal(contrast("#ffffff", "#000000"), 21);
  assert.equal(contrast("#123456", "#123456"), 1);
  assert.equal(contrast("#242044", "#eeebff"), contrast("#eeebff", "#242044"));
  assert.ok(contrast("#6554d9", "#ffffff") > 4.5);
  assert.throws(() => contrast("#fff", "#000000"));
});
test("progress import accepts valid records and removes duplicate completion", () => {
  assert.deepEqual(
    validateProgress({
      version: 1,
      completed: [1, 1, 18],
      bookmarks: [4],
      answers: { "lesson-3": false },
      projects: ["profile"],
    }),
    {
      version: 1,
      completed: [1, 18],
      bookmarks: [4],
      answers: { "lesson-3": false },
      projects: ["profile"],
    },
  );
});
test("progress import rejects malformed and out-of-range records", () => {
  const good = {
    version: 1,
    completed: [],
    bookmarks: [],
    answers: {},
    projects: [],
  };
  for (const bad of [
    { ...good, version: 2 },
    { ...good, completed: [19] },
    { ...good, completed: ["1"] },
    { ...good, answers: [] },
    { ...good, answers: { x: "yes" } },
    { ...good, answers: { "lesson-999": true } },
    { ...good, bookmarks: [0] },
    { ...good, projects: ["fake-deployment"] },
  ])
    assert.throws(() => validateProgress(bad));
  assert.equal(MAX_CODE, 100000);
});
test("every course unit has a real exercise, prediction, recap, and teaching material", () => {
  assert.equal(lessons.length, 18);
  assert.equal(new Set(lessons.map((l) => l.id)).size, 18);
  for (const l of lessons) {
    for (const key of [
      "why",
      "what",
      "analogy",
      "css",
      "html",
      "mistake",
      "debug",
      "solution",
      "practice",
      "challenge",
      "recap",
    ])
      assert.ok(l[key]?.length > 10, `${l.id}: ${key}`);
    assert.ok(l.steps.length >= 3);
    assert.ok(l.explain.length >= 3);
    assert.ok(l.predict.options[l.predict.answer]);
    assert.ok(l.predict.explain.length > 20);
  }
  assert.equal(projects.length, 3);
  assert.ok(
    projects.every((p) => p.steps.length >= 5 && p.solution.length > 250),
  );
});
test("preview policy retains opaque origin and restrictive resource policy", () => {
  const frame = fs.readFileSync(
    new URL("../src/components/Preview.tsx", import.meta.url),
    "utf8",
  );
  const engine = fs.readFileSync(
    new URL("../src/engine.mjs", import.meta.url),
    "utf8",
  );
  assert.match(frame, /sandbox="allow-scripts"/);
  assert.doesNotMatch(frame, /allow-same-origin/);
  assert.match(engine, /default-src 'none'/);
  assert.match(engine, /connect-src 'none'/);
  assert.match(engine, /form-action 'none'/);
  assert.match(engine, /script-src 'nonce-/);
  assert.match(frame, /e\.source\s*!==\s*frame\.current\?\.contentWindow/);
});
