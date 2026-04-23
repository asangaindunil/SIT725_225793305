/**
 * SIT725 – 5.4D Validation Tests (MANDATORY TEMPLATE)
 *
 * HOW TO RUN: (Node.js 18+ is required)
 *   1. Start MongoDB
 *   2. Start your server (npm start)
 *   3. node validation-tests.js
 *
 * DO NOT MODIFY:
 *   - Output format (TEST|, SUMMARY|, COVERAGE|)
 *   - test() function signature
 *   - Exit behaviour
 *   - coverageTracker object
 *   - Logging structure
 *
 * YOU MUST:
 *   - Modify makeValidBook() to satisfy your schema rules
 *   - Add sufficient tests to meet coverage requirements
 */

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const API_BASE = "/api/books";

// =============================
// INTERNAL STATE (DO NOT MODIFY)
// =============================

const results = [];

const coverageTracker = {
  CREATE_FAIL: 0,
  UPDATE_FAIL: 0,
  TYPE: 0,
  REQUIRED: 0,
  BOUNDARY: 0,
  LENGTH: 0,
  TEMPORAL: 0,
  UNKNOWN_CREATE: 0,
  UNKNOWN_UPDATE: 0,
  IMMUTABLE: 0,
};

// =============================
// OUTPUTS FORMAT (DO NOT MODIFY)
// =============================

function logHeader(uniqueId) {
  console.log("SIT725_VALIDATION_TESTS");
  console.log(`BASE_URL=${BASE_URL}`);
  console.log(`API_BASE=${API_BASE}`);
  console.log(`INFO|Generated uniqueId=${uniqueId}`);
}

function logResult(r) {
  console.log(
    `TEST|${r.id}|${r.name}|${r.method}|${r.path}|expected=${r.expected}|actual=${r.actual}|pass=${r.pass ? "Y" : "N"}`,
  );
}

function logSummary() {
  const failed = results.filter((r) => !r.pass).length;
  console.log(
    `SUMMARY|pass=${failed === 0 ? "Y" : "N"}|failed=${failed}|total=${results.length}`,
  );
  return failed === 0;
}

function logCoverage() {
  console.log(
    `COVERAGE|CREATE_FAIL=${coverageTracker.CREATE_FAIL}` +
      `|UPDATE_FAIL=${coverageTracker.UPDATE_FAIL}` +
      `|TYPE=${coverageTracker.TYPE}` +
      `|REQUIRED=${coverageTracker.REQUIRED}` +
      `|BOUNDARY=${coverageTracker.BOUNDARY}` +
      `|LENGTH=${coverageTracker.LENGTH}` +
      `|TEMPORAL=${coverageTracker.TEMPORAL}` +
      `|UNKNOWN_CREATE=${coverageTracker.UNKNOWN_CREATE}` +
      `|UNKNOWN_UPDATE=${coverageTracker.UNKNOWN_UPDATE}` +
      `|IMMUTABLE=${coverageTracker.IMMUTABLE}`,
  );
}

// =============================
// HTTP HELPER
// =============================

async function http(method, path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  return { status: res.status, text };
}

// =============================
// TEST REGISTRATION FUNCTION
// =============================

async function test({ id, name, method, path, expected, body, tags }) {
  const { status } = await http(method, path, body);
  const pass = status === expected;

  const result = { id, name, method, path, expected, actual: status, pass };
  results.push(result);
  logResult(result);

  // treat missing or invalid tags as []
  const safeTags = Array.isArray(tags) ? tags : [];

  safeTags.forEach((tag) => {
    if (Object.prototype.hasOwnProperty.call(coverageTracker, tag)) {
      coverageTracker[tag]++;
    }
  });
}

// =============================
// STUDENT MUST MODIFY THESE
// =============================

function makeValidBook(id) {
  return {
    id,
    title: "Valid Title",
    author: "Valid Author",
    year: 2020,
    genre: "Other",
    summary: "Valid summary text that satisfies your rules.",
    price: "9.99",
  };
}

function makeValidUpdate() {
  return {
    title: "Updated Title",
    author: "Updated Author",
    year: 2021,
    genre: "Other",
    summary: "Updated summary text.",
    price: "10.50",
  };
}

// =============================
// REQUIRED BASE TESTS (DO NOT REMOVE)
// =============================

async function run() {
  const uniqueId = `b${Date.now()}`;
  logHeader(uniqueId);

  const createPath = API_BASE;
  const updatePath = (id) => `${API_BASE}/${id}`;

  // ---- T01 Valid CREATE ----
  await test({
    id: "T01",
    name: "Valid create",
    method: "POST",
    path: createPath,
    expected: 201,
    body: makeValidBook(uniqueId),
    tags: [],
  });

  // ---- T02 Duplicate ID ----
  await test({
    id: "T02",
    name: "Duplicate ID",
    method: "POST",
    path: createPath,
    expected: 409,
    body: makeValidBook(uniqueId),
    tags: ["CREATE_FAIL"],
  });

  // ---- T03 Immutable ID ----
  await test({
    id: "T03",
    name: "Immutable ID on update",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { ...makeValidUpdate(), id: "b999" },
    tags: ["UPDATE_FAIL", "IMMUTABLE"],
  });

  // ---- T04 Unknown field CREATE ----
  await test({
    id: "T04",
    name: "Unknown field CREATE",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now() + 1}`), hack: true },
    tags: ["CREATE_FAIL", "UNKNOWN_CREATE"],
  });

  // ---- T05 Unknown field UPDATE ----
  await test({
    id: "T05",
    name: "Unknown field UPDATE",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { ...makeValidUpdate(), hack: true },
    tags: ["UPDATE_FAIL", "UNKNOWN_UPDATE"],
  });

  // =============================
  // ADDITIONAL TESTS
  // =============================

  // T06 Required field missing
  const missingTitle = makeValidBook(`b${Date.now() + 2}`);
  delete missingTitle.title;

  await test({
    id: "T06",
    name: "Missing required title",
    method: "POST",
    path: createPath,
    expected: 400,
    body: missingTitle,
    tags: ["CREATE_FAIL", "REQUIRED"],
  });

  // T07 Type validation
  await test({
    id: "T07",
    name: "Invalid year type",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now() + 3}`), year: "abc" },
    tags: ["CREATE_FAIL", "TYPE"],
  });

  // T08 Boundary validation
  await test({
    id: "T08",
    name: "Year below boundary",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now() + 4}`), year: 1700 },
    tags: ["CREATE_FAIL", "BOUNDARY"],
  });

  // T09 Length validation
  await test({
    id: "T09",
    name: "Short title",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now() + 5}`), title: "A" },
    tags: ["CREATE_FAIL", "LENGTH"],
  });

  // T10 Temporal validation
  await test({
    id: "T10",
    name: "Future year",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now() + 6}`), year: 3000 },
    tags: ["CREATE_FAIL", "TEMPORAL"],
  });

  // T11 Update validation
  await test({
    id: "T11",
    name: "Update invalid",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { ...makeValidUpdate(), title: "A" },
    tags: ["UPDATE_FAIL", "LENGTH"],
  });

  await test({
    id: "T12",
    name: "Update missing author",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { ...makeValidUpdate(), author: "" },
    tags: ["UPDATE_FAIL", "REQUIRED"],
  });

  await test({
    id: "T13",
    name: "Update invalid year",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { ...makeValidUpdate(), year: 1700 },
    tags: ["UPDATE_FAIL", "BOUNDARY"],
  });

  // T14 Price type validation
  await test({
    id: "T14",
    name: "Invalid price type",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now() + 7}`), price: "abc" },
    tags: ["CREATE_FAIL", "TYPE"],
  });

  // T15 Price boundary validation
  await test({
    id: "T15",
    name: "Negative price",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now() + 8}`), price: -5 },
    tags: ["CREATE_FAIL", "BOUNDARY"],
  });

  // T16 Genre required
  const missingGenre = makeValidBook(`b${Date.now() + 9}`);
  delete missingGenre.genre;

  await test({
    id: "T16",
    name: "Missing genre",
    method: "POST",
    path: createPath,
    expected: 400,
    body: missingGenre,
    tags: ["CREATE_FAIL", "REQUIRED"],
  });

  // T17 Author length
  await test({
    id: "T17",
    name: "Author too short",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now() + 10}`), author: "A" },
    tags: ["CREATE_FAIL", "LENGTH"],
  });

  // T18 Summary length
  await test({
    id: "T18",
    name: "Summary too long",
    method: "POST",
    path: createPath,
    expected: 400,
    body: {
      ...makeValidBook(`b${Date.now() + 11}`),
      summary: "A".repeat(600),
    },
    tags: ["CREATE_FAIL", "LENGTH"],
  });

  // T19 Update type validation
  await test({
    id: "T19",
    name: "Update invalid year type",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { ...makeValidUpdate(), year: "bad" },
    tags: ["UPDATE_FAIL", "TYPE"],
  });

  // T20 Update temporal validation
  await test({
    id: "T20",
    name: "Update future year",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { ...makeValidUpdate(), year: 3000 },
    tags: ["UPDATE_FAIL", "TEMPORAL"],
  });

  // T21 Title too long
  await test({
    id: "T21",
    name: "Title too long",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now() + 17}`), title: "A".repeat(150) },
    tags: ["CREATE_FAIL", "LENGTH"],
  });

  // T22 Currency enum validation
  await test({
    id: "T22",
    name: "Invalid currency enum",
    method: "POST",
    path: createPath,
    expected: 400,
    body: {
      ...makeValidBook(`b${Date.now() + 12}`),
      currency: "LKR",
    },
    tags: ["CREATE_FAIL", "TYPE"],
  });

  //T23 ID too short
  await test({
    id: "T23",
    name: "ID too short",
    method: "POST",
    path: createPath,
    expected: 400,
    body: {
      ...makeValidBook("a"),
    },
    tags: ["CREATE_FAIL", "LENGTH"],
  });

  //T24 ID too long
  await test({
    id: "T24",
    name: "ID too long",
    method: "POST",
    path: createPath,
    expected: 400,
    body: {
      ...makeValidBook("a".repeat(25)),
    },
    tags: ["CREATE_FAIL", "LENGTH"],
  });

  //T25 Price zero validation
  await test({
    id: "T25",
    name: "Price zero invalid",
    method: "POST",
    path: createPath,
    expected: 400,
    body: {
      ...makeValidBook(`b${Date.now() + 13}`),
      price: 0,
    },
    tags: ["CREATE_FAIL", "BOUNDARY"],
  });

  //T26 Valid create without summary
  const noSummary = makeValidBook(`b${Date.now() + 14}`);
  delete noSummary.summary;

  await test({
    id: "T26",
    name: "Create without summary",
    method: "POST",
    path: createPath,
    expected: 201,
    body: noSummary,
    tags: [],
  });

  //T27 Default currency applied
  const noCurrency = makeValidBook(`b${Date.now() + 15}`);
  delete noCurrency.currency;

  await test({
    id: "T27",
    name: "Create without currency uses default",
    method: "POST",
    path: createPath,
    expected: 201,
    body: noCurrency,
    tags: [],
  });

  // T28 Missing ID
  const missingId = makeValidBook(`b${Date.now() + 16}`);
  delete missingId.id;

  await test({
    id: "T28",
    name: "Missing ID",
    method: "POST",
    path: createPath,
    expected: 400,
    body: missingId,
    tags: ["CREATE_FAIL", "REQUIRED"],
  });

  // T29 Missing price
  const missingPrice = makeValidBook(`b${Date.now()+21}`);
  delete missingPrice.price;

  await test({
    id: "T29",
    name: "Missing price",
    method: "POST",
    path: createPath,
    expected: 400,
    body: missingPrice,
    tags: ["CREATE_FAIL", "REQUIRED"]
  });

  //T30 Author too long
  await test({
    id: "T30",
    name: "Author too long",
    method: "POST",
    path: createPath,
    expected: 400,
    body: {
      ...makeValidBook(`b${Date.now()+18}`),
      author: "A".repeat(60)
    },
    tags: ["CREATE_FAIL", "LENGTH"]
  });

  //T31 Genre too short
  await test({
    id: "T31",
    name: "Genre too short",
    method: "POST",
    path: createPath,
    expected: 400,
    body: {
      ...makeValidBook(`b${Date.now()+19}`),
      genre: "AB"
    },
    tags: ["CREATE_FAIL", "LENGTH"]
  });

  //T32 Genre too long
  await test({
    id: "T32",
    name: "Genre too long",
    method: "POST",
    path: createPath,
    expected: 400,
    body: {
      ...makeValidBook(`b${Date.now()+20}`),
      genre: "A".repeat(50)
    },
    tags: ["CREATE_FAIL", "LENGTH"]
  });

  // T33 Update invalid currency
  await test({
    id: "T33",
    name: "Update invalid currency",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: {
      ...makeValidUpdate(),
      currency: "LKR"
    },
    tags: ["UPDATE_FAIL", "TYPE"]
  });


  const pass = logSummary();
  logCoverage();

  process.exit(pass ? 0 : 1);
}

run().catch((err) => {
  console.error("ERROR", err);
  process.exit(2);
});
