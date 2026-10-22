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
const CACHE = PREFIX + "202610220113";
const BASE = new URL("./", self.location).pathname;
const PRECACHE = ["./","./index.html","./manifest.webmanifest","./icons/icon-192.png","./icons/icon-512.png","./icons/apple-touch-icon.png","./assets/Applications-B249ekQk.js","./assets/Chart-DtnB8Dou.js","./assets/Coach-Zz_gnwmr.js","./assets/Compare-B4pMvVBR.js","./assets/DailyBrief-Ce118u6S.js","./assets/Exam-_SUH4oG2.js","./assets/Funding-ObStGxXW.js","./assets/Glossary-DCy8hw5J.js","./assets/Guide-Ci7e07VY.js","./assets/Gym-CNWkR-6y.js","./assets/KaTeX_AMS-Regular-BQhdFMY1.woff2","./assets/KaTeX_Caligraphic-Bold-Dq_IR9rO.woff2","./assets/KaTeX_Caligraphic-Regular-Di6jR-x-.woff2","./assets/KaTeX_Fraktur-Bold-CL6g_b3V.woff2","./assets/KaTeX_Fraktur-Regular-CTYiF6lA.woff2","./assets/KaTeX_Main-Bold-Cx986IdX.woff2","./assets/KaTeX_Main-BoldItalic-DxDJ3AOS.woff2","./assets/KaTeX_Main-Italic-NWA7e6Wa.woff2","./assets/KaTeX_Main-Regular-B22Nviop.woff2","./assets/KaTeX_Math-BoldItalic-CZnvNsCZ.woff2","./assets/KaTeX_Math-Italic-t53AETM-.woff2","./assets/KaTeX_SansSerif-Bold-D1sUS0GD.woff2","./assets/KaTeX_SansSerif-Italic-C3H0VqGB.woff2","./assets/KaTeX_SansSerif-Regular-DDBCnlJ7.woff2","./assets/KaTeX_Script-Regular-D3wIWfF6.woff2","./assets/KaTeX_Size1-Regular-mCD8mA8B.woff2","./assets/KaTeX_Size2-Regular-Dy4dx90m.woff2","./assets/KaTeX_Size3-Regular-gV2CO0n9.woff2","./assets/KaTeX_Size4-Regular-Dl5lxZxV.woff2","./assets/KaTeX_Typewriter-Regular-CO6r4hn1.woff2","./assets/Lab-aPNvz-4m.js","./assets/Labs-CdiWVJJm.js","./assets/Learn-DRkCVktb.js","./assets/Library-B5Gq27dd.js","./assets/Md-BJ-fwwqr.js","./assets/More-r2l3zQp5.js","./assets/Motion-DIb9I8kt.js","./assets/News-6C7qKG2Z.js","./assets/Onboarding-rwsSpPKf.js","./assets/Opportunity-CjQepZzG.js","./assets/Papers-DqN9z7ma.js","./assets/Pathways-D6GZdKbw.js","./assets/Planner-CRNN0-Py.js","./assets/Portfolio-fsmSbjwf.js","./assets/Practice-DOPDAUtR.js","./assets/Profile-CQrOkcQ1.js","./assets/Progress-Bem7HyeL.js","./assets/Quiz-DxrQiRtD.js","./assets/Readiness-iqEBsg67.js","./assets/Research-DxdyQO7V.js","./assets/Resources-BX0v7Bhm.js","./assets/Review-DwxlHnz8.js","./assets/Roadmap-CSV_wQZC.js","./assets/Scholarships-D8VG61ej.js","./assets/Search-DGB7M9yB.js","./assets/Settings-oGJ6_Lmi.js","./assets/StudyPlan-Cj9VYItk.js","./assets/Systems-DHozL2Bl.js","./assets/Thesis-DMA5agfh.js","./assets/TodayDeadlines-D9hqs1CX.js","./assets/Topic-BztQTsjM.js","./assets/Verify-BzArnkvy.js","./assets/Vocab-Bu_LqVDi.js","./assets/coach-mkWIjJO-.js","./assets/curriculum-jEdzXNbd.js","./assets/econ-BM6Z7p4m.js","./assets/feed-Dxcebzvc.js","./assets/funding-BgOIPtL5.js","./assets/glossary-DvbOPdqE.js","./assets/guides-CF0WTpS4.js","./assets/gym-CRg5UoVY.js","./assets/ics-DdVfyqqg.js","./assets/index-V-zXFdx_.js","./assets/index-ce86uRHV.css","./assets/katex-DQ-ZjyoH.js","./assets/katex-NwSQFk4P.css","./assets/labs-BbEUoaoT.js","./assets/num-DsbRW1Q5.js","./assets/opportunities-CkrcNtJf.js","./assets/papers-Bg8ShfyA.js","./assets/pathways-Cf92e36-.js","./assets/react-CI6SGl1L.js","./assets/readiness-BDXhfX8j.js","./assets/research-D3e_USRd.js","./assets/resources-JmmU43Rp.js","./assets/systems-DkwFyWt3.js","./assets/topics-CTPOyios.js","./assets/vocab-Qwi10sQR.js"];

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
