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
const CACHE = PREFIX + "202610221400";
const BASE = new URL("./", self.location).pathname;
const PRECACHE = ["./","./index.html","./manifest.webmanifest","./icons/icon-192.png","./icons/icon-512.png","./icons/apple-touch-icon.png","./assets/Applications-BP14nxS-.js","./assets/Cases-Cr5wj6KC.js","./assets/Chart-DtnB8Dou.js","./assets/Coach-DAQ-mpJB.js","./assets/CodeToolkit-CV5yQxz7.js","./assets/Compare-OMlhBRYF.js","./assets/DailyBrief-R0_5sU3_.js","./assets/DailyMastery-CYByBz80.js","./assets/DataLab-Cp8COLfz.js","./assets/Derivations-BwYe6ibM.js","./assets/Exam-oIwoAP9R.js","./assets/Formulas-Bz_iN_2E.js","./assets/Funding-DKNAL10X.js","./assets/Glossary-BzgPQ3S2.js","./assets/GraphAtlas-CUoeyZ71.js","./assets/Guide-Cb2RRVT5.js","./assets/Gym-siEiRPu_.js","./assets/Interview-BLzpzdRv.js","./assets/KaTeX_AMS-Regular-BQhdFMY1.woff2","./assets/KaTeX_Caligraphic-Bold-Dq_IR9rO.woff2","./assets/KaTeX_Caligraphic-Regular-Di6jR-x-.woff2","./assets/KaTeX_Fraktur-Bold-CL6g_b3V.woff2","./assets/KaTeX_Fraktur-Regular-CTYiF6lA.woff2","./assets/KaTeX_Main-Bold-Cx986IdX.woff2","./assets/KaTeX_Main-BoldItalic-DxDJ3AOS.woff2","./assets/KaTeX_Main-Italic-NWA7e6Wa.woff2","./assets/KaTeX_Main-Regular-B22Nviop.woff2","./assets/KaTeX_Math-BoldItalic-CZnvNsCZ.woff2","./assets/KaTeX_Math-Italic-t53AETM-.woff2","./assets/KaTeX_SansSerif-Bold-D1sUS0GD.woff2","./assets/KaTeX_SansSerif-Italic-C3H0VqGB.woff2","./assets/KaTeX_SansSerif-Regular-DDBCnlJ7.woff2","./assets/KaTeX_Script-Regular-D3wIWfF6.woff2","./assets/KaTeX_Size1-Regular-mCD8mA8B.woff2","./assets/KaTeX_Size2-Regular-Dy4dx90m.woff2","./assets/KaTeX_Size3-Regular-gV2CO0n9.woff2","./assets/KaTeX_Size4-Regular-Dl5lxZxV.woff2","./assets/KaTeX_Typewriter-Regular-CO6r4hn1.woff2","./assets/Lab-BhiV6xH7.js","./assets/Labs-AAFFIDuS.js","./assets/Learn-CluxcTtT.js","./assets/Library-B8ZZTDKZ.js","./assets/Mastery-D9d60-jR.js","./assets/Md-CJ0nmycQ.js","./assets/More-CEsk75hG.js","./assets/Motion-DIb9I8kt.js","./assets/News-9WTtykbi.js","./assets/Notebook-CAVmyGIn.js","./assets/Onboarding-C6N-m6hT.js","./assets/Opportunity-BgyhLW8n.js","./assets/Papers-Q6xrUPQf.js","./assets/Pathways-CgWbYMYR.js","./assets/PlainWords-CWyyESmx.js","./assets/Planner-wsJ3vnjS.js","./assets/Portfolio-Hsqj2Kh8.js","./assets/Practice-CHUEnNhN.js","./assets/Profile-CPkcDk-Q.js","./assets/Progress-CIUbPIcK.js","./assets/Quiz-Cp46hzaI.js","./assets/Readiness-BjjEQo5h.js","./assets/Research-DyJmlKej.js","./assets/Resources-ucJPgTvb.js","./assets/Review-usCHAwrx.js","./assets/Roadmap-DHzPosb1.js","./assets/Scholarships-LKAB5r8U.js","./assets/Search-BuETZyXR.js","./assets/Settings-5uO46HOs.js","./assets/Specialisations-CW64YPWS.js","./assets/StartHere-CmZ1qO1j.js","./assets/StudyPlan-C-4ZdGcz.js","./assets/Systems-CTAydGU9.js","./assets/Teaching-BjANgFdC.js","./assets/Thesis-CkXIeE-M.js","./assets/Thinkers-B4a8m5pW.js","./assets/TodayDeadlines-BkTViA8K.js","./assets/Topic-wFQjG2p-.js","./assets/Verify-B5D236AC.js","./assets/Vocab-CfDp6NQD.js","./assets/cases-GbWuo2r_.js","./assets/coach-DHaQGoe3.js","./assets/code-DWtTfSmM.js","./assets/curriculum-jEdzXNbd.js","./assets/datalab-s2EPwLvr.js","./assets/derivations-JpgOdNyA.js","./assets/econ-BM6Z7p4m.js","./assets/feed-Dxcebzvc.js","./assets/formulas-BAlEZBqR.js","./assets/funding-B4WVhxHL.js","./assets/glossary-DvbOPdqE.js","./assets/graphatlas-Cm5i-AAS.js","./assets/guides-CF0WTpS4.js","./assets/gym-CRg5UoVY.js","./assets/ics-DdVfyqqg.js","./assets/index-Bi6YuX7G.js","./assets/index-DWE5olcZ.css","./assets/interview-BABdqDpr.js","./assets/katex-DQ-ZjyoH.js","./assets/katex-NwSQFk4P.css","./assets/labs-BbEUoaoT.js","./assets/num-DsbRW1Q5.js","./assets/opportunities-CkrcNtJf.js","./assets/papers-Bg8ShfyA.js","./assets/pathways-Cf92e36-.js","./assets/plainwords-U7KN-uNj.js","./assets/react-CI6SGl1L.js","./assets/readiness-BDXhfX8j.js","./assets/research-D3e_USRd.js","./assets/resources-JmmU43Rp.js","./assets/specialisations-v9uRMM91.js","./assets/systems-DkwFyWt3.js","./assets/teaching-BEwGZ0-g.js","./assets/thinkers-CBqTkH2x.js","./assets/topics-CTPOyios.js","./assets/ui-C4RRwJ0o.js","./assets/vocab-Qwi10sQR.js"];

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
