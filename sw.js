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
const CACHE = PREFIX + "202610220114";
const BASE = new URL("./", self.location).pathname;
const PRECACHE = ["./","./index.html","./manifest.webmanifest","./icons/icon-192.png","./icons/icon-512.png","./icons/apple-touch-icon.png","./assets/Applications-Di-yLY3x.js","./assets/Chart-DtnB8Dou.js","./assets/Coach-VV2whywm.js","./assets/Compare-D5eFUEFN.js","./assets/DailyBrief-BNJORq7Y.js","./assets/Exam-CRf1RI9L.js","./assets/Funding-DXMIC4iA.js","./assets/Glossary-Cna_I6rs.js","./assets/Guide-D7yWPZHS.js","./assets/Gym-BjkXU63B.js","./assets/KaTeX_AMS-Regular-BQhdFMY1.woff2","./assets/KaTeX_Caligraphic-Bold-Dq_IR9rO.woff2","./assets/KaTeX_Caligraphic-Regular-Di6jR-x-.woff2","./assets/KaTeX_Fraktur-Bold-CL6g_b3V.woff2","./assets/KaTeX_Fraktur-Regular-CTYiF6lA.woff2","./assets/KaTeX_Main-Bold-Cx986IdX.woff2","./assets/KaTeX_Main-BoldItalic-DxDJ3AOS.woff2","./assets/KaTeX_Main-Italic-NWA7e6Wa.woff2","./assets/KaTeX_Main-Regular-B22Nviop.woff2","./assets/KaTeX_Math-BoldItalic-CZnvNsCZ.woff2","./assets/KaTeX_Math-Italic-t53AETM-.woff2","./assets/KaTeX_SansSerif-Bold-D1sUS0GD.woff2","./assets/KaTeX_SansSerif-Italic-C3H0VqGB.woff2","./assets/KaTeX_SansSerif-Regular-DDBCnlJ7.woff2","./assets/KaTeX_Script-Regular-D3wIWfF6.woff2","./assets/KaTeX_Size1-Regular-mCD8mA8B.woff2","./assets/KaTeX_Size2-Regular-Dy4dx90m.woff2","./assets/KaTeX_Size3-Regular-gV2CO0n9.woff2","./assets/KaTeX_Size4-Regular-Dl5lxZxV.woff2","./assets/KaTeX_Typewriter-Regular-CO6r4hn1.woff2","./assets/Lab-BhfYt78C.js","./assets/Labs-BBXbN-rW.js","./assets/Learn-qtQJu4-U.js","./assets/Library-CmbzF_vz.js","./assets/Md-lif43UUc.js","./assets/More-C0_Fgn2c.js","./assets/Motion-DIb9I8kt.js","./assets/News-Cd1cplyI.js","./assets/Onboarding-CoPl45lF.js","./assets/Opportunity-BpJDwi2J.js","./assets/Papers-6lWdT2nS.js","./assets/Pathways-KtZlt0Yz.js","./assets/Planner-Bact2TNR.js","./assets/Portfolio-GiDamSws.js","./assets/Practice-DykheQHm.js","./assets/Profile-CPI0ZcmD.js","./assets/Progress-CdY2N51y.js","./assets/Quiz-Cq2B9EkG.js","./assets/Readiness-CD1mIgfw.js","./assets/Research-gIlSXSlA.js","./assets/Resources-CwEVJ48q.js","./assets/Review-BJyzkgOc.js","./assets/Roadmap-B8DKSiOS.js","./assets/Scholarships-B_ecaz_w.js","./assets/Search-grNTXQzq.js","./assets/Settings-D2_EQljD.js","./assets/StudyPlan-DCMbTbFD.js","./assets/Systems-Arc1DSZ8.js","./assets/Thesis-CoF1hFmP.js","./assets/TodayDeadlines-CO8mIt9L.js","./assets/Topic-CZxsOVou.js","./assets/Verify-Dozb1lg9.js","./assets/Vocab-vdATV5Dv.js","./assets/coach-C7BgR_dB.js","./assets/curriculum-jEdzXNbd.js","./assets/econ-BM6Z7p4m.js","./assets/feed-Dxcebzvc.js","./assets/funding-C6T-VAYU.js","./assets/glossary-DvbOPdqE.js","./assets/guides-CF0WTpS4.js","./assets/gym-CRg5UoVY.js","./assets/ics-DdVfyqqg.js","./assets/index-BaJrBumU.js","./assets/index-ce86uRHV.css","./assets/katex-DQ-ZjyoH.js","./assets/katex-NwSQFk4P.css","./assets/labs-BbEUoaoT.js","./assets/num-DsbRW1Q5.js","./assets/opportunities-CkrcNtJf.js","./assets/papers-Bg8ShfyA.js","./assets/pathways-Cf92e36-.js","./assets/react-CI6SGl1L.js","./assets/readiness-BDXhfX8j.js","./assets/research-D3e_USRd.js","./assets/resources-JmmU43Rp.js","./assets/systems-DkwFyWt3.js","./assets/topics-CTPOyios.js","./assets/vocab-Qwi10sQR.js"];

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
