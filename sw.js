/*
 * Offline support for Saphal Economics PhD, published at /saphal-economics-phd/.
 *
 * On install it saves the page and every file the app needs (code chunks,
 * styles, maths fonts, icons), so the whole app, including the encyclopedia,
 * labs and funding records, works with no connection. The page always opens
 * from the saved copy, so it starts instantly; each publish changes this file,
 * the app checks for it on every launch, and a new version installs in the
 * background and then tells the page to switch over.
 *
 * Several projects share the saphalism007.github.io origin. This worker is
 * scoped to its own folder, ignores every request outside it, and only ever
 * deletes its own old caches (names starting with saphal-econ-phd-).
 *
 * Funding records inside the app carry their own "checked on" dates, so an
 * offline copy never presents scholarship information as newer than it is.
 */
const PREFIX = "saphal-econ-phd-";
const CACHE = PREFIX + "202610231500";
const BASE = new URL("./", self.location).pathname;
const PRECACHE = ["./","./index.html","./manifest.webmanifest","./icons/icon-192.png","./icons/icon-512.png","./icons/apple-touch-icon.png","./assets/Applications-t5xK0UFt.js","./assets/Backup-CGpvINzS.js","./assets/Cases-BbWAHyMy.js","./assets/Chart-DtnB8Dou.js","./assets/Coach-BGxq0GXQ.js","./assets/CodeToolkit-D4oMBQPa.js","./assets/Communities-BUaP4EVq.js","./assets/Compare-B9B_3sHz.js","./assets/ConceptMap-CuYNcAVW.js","./assets/DailyBrief-Hxpbi9oG.js","./assets/DailyMastery-DqkuL7AT.js","./assets/DataLab-DlFKufhG.js","./assets/Derivations-HifBPWEs.js","./assets/Exam-6S2F1IIO.js","./assets/Formulas-TWBQGGvf.js","./assets/Funding-D7h81Hj0.js","./assets/Glossary-BCDvsM3n.js","./assets/GraphAtlas-BHVK0-fM.js","./assets/Guide-BWCygvfv.js","./assets/Gym-BseTBvvq.js","./assets/Interview-OKNxY2fT.js","./assets/KaTeX_AMS-Regular-BQhdFMY1.woff2","./assets/KaTeX_Caligraphic-Bold-Dq_IR9rO.woff2","./assets/KaTeX_Caligraphic-Regular-Di6jR-x-.woff2","./assets/KaTeX_Fraktur-Bold-CL6g_b3V.woff2","./assets/KaTeX_Fraktur-Regular-CTYiF6lA.woff2","./assets/KaTeX_Main-Bold-Cx986IdX.woff2","./assets/KaTeX_Main-BoldItalic-DxDJ3AOS.woff2","./assets/KaTeX_Main-Italic-NWA7e6Wa.woff2","./assets/KaTeX_Main-Regular-B22Nviop.woff2","./assets/KaTeX_Math-BoldItalic-CZnvNsCZ.woff2","./assets/KaTeX_Math-Italic-t53AETM-.woff2","./assets/KaTeX_SansSerif-Bold-D1sUS0GD.woff2","./assets/KaTeX_SansSerif-Italic-C3H0VqGB.woff2","./assets/KaTeX_SansSerif-Regular-DDBCnlJ7.woff2","./assets/KaTeX_Script-Regular-D3wIWfF6.woff2","./assets/KaTeX_Size1-Regular-mCD8mA8B.woff2","./assets/KaTeX_Size2-Regular-Dy4dx90m.woff2","./assets/KaTeX_Size3-Regular-gV2CO0n9.woff2","./assets/KaTeX_Size4-Regular-Dl5lxZxV.woff2","./assets/KaTeX_Typewriter-Regular-CO6r4hn1.woff2","./assets/Lab-CI0j7ySJ.js","./assets/Labs-DSlg6b-H.js","./assets/Learn-C9o3VMki.js","./assets/Library-CV0dAvS2.js","./assets/Mastery-D5xxhWJx.js","./assets/Md-BoHh2lWx.js","./assets/More-BPl-5Wun.js","./assets/Motion-DIb9I8kt.js","./assets/News-SXFOAABJ.js","./assets/Notebook-vVcD0PnS.js","./assets/Onboarding-g_upHALY.js","./assets/Opportunity-ESnQxjI9.js","./assets/Papers-BkWWizCw.js","./assets/Pathways-DFyXBHKn.js","./assets/PlainWords-deccVjQP.js","./assets/Planner-DvZDUG9L.js","./assets/Portfolio-C-npEGl2.js","./assets/Practice-CWCrNIPi.js","./assets/Profile-BUhnwr45.js","./assets/Progress-CUJfTPwg.js","./assets/Quiz-BjkHZdP8.js","./assets/Readiness-BTWLsYdT.js","./assets/Research-BwDZKILG.js","./assets/Resources-531bfhOi.js","./assets/Review-OuarBkU6.js","./assets/Roadmap-Djg_toR7.js","./assets/Scholarships-CbC2ruAE.js","./assets/Search-BsDPAo3X.js","./assets/Settings-BAiSoXa6.js","./assets/Specialisations-B1b-h0UN.js","./assets/StartHere-DH7GyLWI.js","./assets/StudyPlan-C2n8dsRn.js","./assets/Systems-y1iF9tZf.js","./assets/Teaching-CTrMs2G6.js","./assets/Thesis-BmnTdjv9.js","./assets/Thinkers-CwjmXixu.js","./assets/TodayDeadlines-BlvFt9Ly.js","./assets/Topic-_kxwyYAv.js","./assets/Verify-uTpwO1Br.js","./assets/Vocab-D55h_Ssn.js","./assets/cases-GbWuo2r_.js","./assets/coach-BZo3jUM_.js","./assets/code-DWtTfSmM.js","./assets/communities-BHAYv56H.js","./assets/curriculum-CJe0LaJR.js","./assets/datalab-s2EPwLvr.js","./assets/derivations-JpgOdNyA.js","./assets/econ-BM6Z7p4m.js","./assets/feed-Dxcebzvc.js","./assets/formulas-BAlEZBqR.js","./assets/funding-C6qMqUzv.js","./assets/glossary-DvbOPdqE.js","./assets/graphatlas-Cm5i-AAS.js","./assets/guides-CF0WTpS4.js","./assets/gym-CRg5UoVY.js","./assets/ics-DdVfyqqg.js","./assets/index-3tJvd3N_.css","./assets/index-DLOpr-K_.js","./assets/interview-BABdqDpr.js","./assets/katex-DQ-ZjyoH.js","./assets/katex-NwSQFk4P.css","./assets/labs-BbEUoaoT.js","./assets/num-DsbRW1Q5.js","./assets/opportunities-CkrcNtJf.js","./assets/papers-Bg8ShfyA.js","./assets/pathways-Cf92e36-.js","./assets/plainwords-U7KN-uNj.js","./assets/react-CI6SGl1L.js","./assets/readiness-BDXhfX8j.js","./assets/research-D3e_USRd.js","./assets/resources-JmmU43Rp.js","./assets/specialisations-v9uRMM91.js","./assets/systems-DkwFyWt3.js","./assets/teaching-BEwGZ0-g.js","./assets/thinkers-x0jQ3eQw.js","./assets/topics-uTGys14z.js","./assets/ui-COE0Zdfj.js","./assets/vocab-Qwi10sQR.js"];

const ours = (url) => url.origin === self.location.origin && url.pathname.startsWith(BASE);

// A file under assets/ has a fingerprint of its contents in its name, so a
// copy already saved by the version before is the same file. It is reused
// instead of downloaded again. Every file used to be downloaded again on every
// publish, about 120 of them, on a phone, several times a day.
const fingerprinted = (p) => p.includes("/assets/");

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => Promise.all(PRECACHE.map((p) =>
        (fingerprinted(p) ? caches.match(p) : Promise.resolve(undefined))
          .then((saved) => saved || fetch(p, { cache: "no-store" }))
          .then((r) => r && r.ok && cache.put(p, r))
          .catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith(PREFIX) && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
      .then(() => self.clients.matchAll({ type: "window" }))
      .then((clients) => clients.forEach((c) => c.postMessage({ type: "sep-updated" })))
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (!ours(url)) return;
  if (url.pathname.endsWith("/version.json") || url.pathname.endsWith("/version.txt") || url.pathname.endsWith("/sw.js")) return;

  if (request.mode === "navigate" && (url.pathname === BASE || url.pathname === BASE + "index.html")) {
    event.respondWith(
      caches.open(CACHE)
        .then((cache) => cache.match("./index.html"))
        .then((hit) => hit || fetch(BASE, { cache: "no-store" }).then((response) => {
          if (response.ok) { const copy = response.clone(); caches.open(CACHE).then((c) => c.put("./index.html", copy)); }
          return response;
        }))
        .catch(() => caches.match("./index.html").then((hit) => hit || Response.error()))
    );
    return;
  }

  event.respondWith(
    caches.match(request, { ignoreSearch: true }).then((hit) => hit || fetch(request).then((response) => {
      if (response.ok && url.pathname.includes("/assets/")) { const copy = response.clone(); caches.open(CACHE).then((c) => c.put(request, copy)); }
      return response;
    }))
  );
});
