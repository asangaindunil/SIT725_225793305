const fetch = require('node-fetch');

const BASE_URL = "http://localhost:3000/api/books";

let total = 0;
let passed = 0;

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
  IMMUTABLE: 0
};

function log(testId, result, message, tag) {
  total++;

  if(result){
    passed++;
    console.log(`TEST|${testId}|PASS|${tag}|${message}`);
  } else {
    console.log(`TEST|${testId}|FAIL|${tag}|${message}`);
  }

  if(tag && coverageTracker[tag] !== undefined){
    coverageTracker[tag]++;
  }
}

function makeValidBook(id){
  return {
    id: id,
    title: "Clean Code",
    author: "Robert Martin",
    year: 2008,
    genre: "Programming",
    summary: "Good book",
    price: 10.5,
    currency: "AUD"
  };
}

function makeValidUpdate(){
  return {
    title: "Updated Book",
    author: "Updated Author",
    year: 2010,
    genre: "Technology",
    summary: "Updated",
    price: 20
  };
}


async function test(){

  const uniqueId = "B" + Date.now();

  // T01 Valid create
  try {
    let res = await fetch(BASE_URL, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(makeValidBook(uniqueId))
    });

    log("T01", res.status === 201, "Valid create", "CREATE_FAIL");

  } catch(e){
    log("T01", false, e.message, "CREATE_FAIL");
  }

  // T02 Required field missing
  try {

    let book = makeValidBook("B2");
    delete book.title;

    let res = await fetch(BASE_URL,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(book)
    });

    log("T02", res.status === 400, "Missing title", "REQUIRED");

  } catch(e){
    log("T02", false, e.message, "REQUIRED");
  }

  // T03 Type validation
  try {

    let book = makeValidBook("B3");
    book.year = "abc";

    let res = await fetch(BASE_URL,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(book)
    });

    log("T03", res.status === 400, "Year type", "TYPE");

  } catch(e){
    log("T03", false, e.message, "TYPE");
  }

  // T04 Boundary test
  try {

    let book = makeValidBook("B4");
    book.year = 1700;

    let res = await fetch(BASE_URL,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(book)
    });

    log("T04", res.status === 400, "Year boundary", "BOUNDARY");

  } catch(e){
    log("T04", false, e.message, "BOUNDARY");
  }

  // T05 Length validation
  try {

    let book = makeValidBook("B5");
    book.title = "a";

    let res = await fetch(BASE_URL,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(book)
    });

    log("T05", res.status === 400, "Title length", "LENGTH");

  } catch(e){
    log("T05", false, e.message, "LENGTH");
  }

  // T06 Future year
  try {

    let book = makeValidBook("B6");
    book.year = 3000;

    let res = await fetch(BASE_URL,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(book)
    });

    log("T06", res.status === 400, "Future year", "TEMPORAL");

  } catch(e){
    log("T06", false, e.message, "TEMPORAL");
  }

  // T07 Unknown field
  try {

    let book = makeValidBook("B7");
    book.hack = "bad";

    let res = await fetch(BASE_URL,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(book)
    });

    log("T07", res.status === 400, "Unknown field", "UNKNOWN_CREATE");

  } catch(e){
    log("T07", false, e.message, "UNKNOWN_CREATE");
  }

  // T08 Update validation
  try {

    let res = await fetch(`${BASE_URL}/${uniqueId}`,{
      method:"PUT",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({title:"a"})
    });

    log("T08", res.status === 400, "Update validation", "UPDATE_FAIL");

  } catch(e){
    log("T08", false, e.message, "UPDATE_FAIL");
  }

  // T09 Immutable id
  try {

    let res = await fetch(`${BASE_URL}/${uniqueId}`,{
      method:"PUT",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({id:"NEW"})
    });

    log("T09", res.status === 400, "Immutable id", "IMMUTABLE");

  } catch(e){
    log("T09", false, e.message, "IMMUTABLE");
  }

  // T10 Unknown update
  try {

    let res = await fetch(`${BASE_URL}/${uniqueId}`,{
      method:"PUT",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({hack:"bad"})
    });

    log("T10", res.status === 400, "Unknown update", "UNKNOWN_UPDATE");

  } catch(e){
    log("T10", false, e.message, "UNKNOWN_UPDATE");
  }

  console.log(`SUMMARY|Passed:${passed}|Failed:${total-passed}|Total:${total}`);
  console.log(`COVERAGE|${JSON.stringify(coverageTracker)}`);

  process.exit(total === passed ? 0 : 1);

}

test();