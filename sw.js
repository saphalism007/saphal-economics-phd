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
const CACHE = PREFIX + "202610221859";
const BASE = new URL("./", self.location).pathname;
const PRECACHE = ["./","./index.html","./manifest.webmanifest","./icons/icon-192.png","./icons/icon-512.png","./icons/apple-touch-icon.png","./assets/Applications-D_kDKDHo.js","./assets/Cases-cXDyt5KY.js","./assets/Chart-DtnB8Dou.js","./assets/Coach-CX4mWIW5.js","./assets/CodeToolkit-f5KS2tCH.js","./assets/Compare-FKl6TslE.js","./assets/ConceptMap-CcrpVppB.js","./assets/DailyBrief-c-Vl6vlp.js","./assets/DailyMastery-PEWGvYDx.js","./assets/DataLab-D0TZC4P6.js","./assets/Derivations-C_6jTDd8.js","./assets/Exam-Coh3UzTh.js","./assets/Formulas-CuTqE0H6.js","./assets/Funding-CjQgw1UM.js","./assets/Glossary-nJMk-LR-.js","./assets/GraphAtlas-Cl_VJQym.js","./assets/Guide-QUh1_uSW.js","./assets/Gym-XY6SuR33.js","./assets/Interview-Bir4uLFg.js","./assets/KaTeX_AMS-Regular-BQhdFMY1.woff2","./assets/KaTeX_Caligraphic-Bold-Dq_IR9rO.woff2","./assets/KaTeX_Caligraphic-Regular-Di6jR-x-.woff2","./assets/KaTeX_Fraktur-Bold-CL6g_b3V.woff2","./assets/KaTeX_Fraktur-Regular-CTYiF6lA.woff2","./assets/KaTeX_Main-Bold-Cx986IdX.woff2","./assets/KaTeX_Main-BoldItalic-DxDJ3AOS.woff2","./assets/KaTeX_Main-Italic-NWA7e6Wa.woff2","./assets/KaTeX_Main-Regular-B22Nviop.woff2","./assets/KaTeX_Math-BoldItalic-CZnvNsCZ.woff2","./assets/KaTeX_Math-Italic-t53AETM-.woff2","./assets/KaTeX_SansSerif-Bold-D1sUS0GD.woff2","./assets/KaTeX_SansSerif-Italic-C3H0VqGB.woff2","./assets/KaTeX_SansSerif-Regular-DDBCnlJ7.woff2","./assets/KaTeX_Script-Regular-D3wIWfF6.woff2","./assets/KaTeX_Size1-Regular-mCD8mA8B.woff2","./assets/KaTeX_Size2-Regular-Dy4dx90m.woff2","./assets/KaTeX_Size3-Regular-gV2CO0n9.woff2","./assets/KaTeX_Size4-Regular-Dl5lxZxV.woff2","./assets/KaTeX_Typewriter-Regular-CO6r4hn1.woff2","./assets/Lab-BYHDSCWE.js","./assets/Labs-tcbFeQ1X.js","./assets/Learn-KzNRXKQJ.js","./assets/Library-DIbZdvoz.js","./assets/Mastery-xImP0owO.js","./assets/Md-D6y_1Za0.js","./assets/More-DDtXQA3I.js","./assets/Motion-DIb9I8kt.js","./assets/News-Cbjg52zd.js","./assets/Notebook-DKy73_60.js","./assets/Onboarding-BFpTO6W4.js","./assets/Opportunity-qkYv_z1n.js","./assets/Papers-Ez7vLrrL.js","./assets/Pathways-B2YD_Ep6.js","./assets/PlainWords-BcYWUaOO.js","./assets/Planner-BrNhBSq1.js","./assets/Portfolio-CQD1Q8_u.js","./assets/Practice-BuHzfE9P.js","./assets/Profile-C_vghS2q.js","./assets/Progress-CFa3TA0x.js","./assets/Quiz-DA_0yfTV.js","./assets/Readiness-3SXCxMrZ.js","./assets/Research-D5pUdGLI.js","./assets/Resources-C0dG2mHe.js","./assets/Review-D1AR2XP2.js","./assets/Roadmap-BgGpp7D2.js","./assets/Scholarships-C17VfG-o.js","./assets/Search-B2Hmxt_i.js","./assets/Settings-DUUpOVlp.js","./assets/Specialisations-rb4IgkJa.js","./assets/StartHere-BaTYe1ZE.js","./assets/StudyPlan-DRp7j6Ya.js","./assets/Systems-BcJ6D86D.js","./assets/Teaching-C-c3N150.js","./assets/Thesis-CtCsk_dB.js","./assets/Thinkers-DgKGi9kt.js","./assets/TodayDeadlines-MGsZbuUm.js","./assets/Topic-DIWlVxtO.js","./assets/Verify-CgQ1CLwB.js","./assets/Vocab-zsrS1YJG.js","./assets/cases-GbWuo2r_.js","./assets/coach-blHU2H1w.js","./assets/code-DWtTfSmM.js","./assets/curriculum-CJe0LaJR.js","./assets/datalab-s2EPwLvr.js","./assets/derivations-JpgOdNyA.js","./assets/econ-BM6Z7p4m.js","./assets/feed-Dxcebzvc.js","./assets/formulas-BAlEZBqR.js","./assets/funding-BDXl2WCT.js","./assets/glossary-DvbOPdqE.js","./assets/graphatlas-Cm5i-AAS.js","./assets/guides-CF0WTpS4.js","./assets/gym-CRg5UoVY.js","./assets/ics-DdVfyqqg.js","./assets/index-CAgtBepg.js","./assets/index-jE8i3LGA.css","./assets/interview-BABdqDpr.js","./assets/katex-DQ-ZjyoH.js","./assets/katex-NwSQFk4P.css","./assets/labs-BbEUoaoT.js","./assets/num-DsbRW1Q5.js","./assets/opportunities-CkrcNtJf.js","./assets/papers-Bg8ShfyA.js","./assets/pathways-Cf92e36-.js","./assets/plainwords-U7KN-uNj.js","./assets/react-CI6SGl1L.js","./assets/readiness-BDXhfX8j.js","./assets/research-D3e_USRd.js","./assets/resources-JmmU43Rp.js","./assets/specialisations-v9uRMM91.js","./assets/systems-DkwFyWt3.js","./assets/teaching-BEwGZ0-g.js","./assets/thinkers-x0jQ3eQw.js","./assets/topics-uTGys14z.js","./assets/ui-Bk7Lyv0V.js","./assets/vocab-Qwi10sQR.js"];

const ours = (url) => url.origin === self.location.origin && url.pathname.startsWith(BASE);

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => Promise.all(PRECACHE.map((p) => fetch(p, { cache: "no-store" }).then((r) => r.ok && cache.put(p, r)).catch(() => {}))))
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
