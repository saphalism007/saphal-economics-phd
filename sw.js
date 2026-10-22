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
const CACHE = PREFIX + "202610220008";
const BASE = new URL("./", self.location).pathname;
const PRECACHE = ["./","./index.html","./manifest.webmanifest","./icons/icon-192.png","./icons/icon-512.png","./icons/apple-touch-icon.png","./assets/Applications-Bqn85B8N.js","./assets/Chart-DtnB8Dou.js","./assets/Compare-C3WLOVMx.js","./assets/DailyBrief-CDfiAzIK.js","./assets/Exam-C0zyivur.js","./assets/Funding--pS8t3Pm.js","./assets/Glossary-Cpn0JvnM.js","./assets/Guide-BAOZpoy1.js","./assets/KaTeX_AMS-Regular-BQhdFMY1.woff2","./assets/KaTeX_Caligraphic-Bold-Dq_IR9rO.woff2","./assets/KaTeX_Caligraphic-Regular-Di6jR-x-.woff2","./assets/KaTeX_Fraktur-Bold-CL6g_b3V.woff2","./assets/KaTeX_Fraktur-Regular-CTYiF6lA.woff2","./assets/KaTeX_Main-Bold-Cx986IdX.woff2","./assets/KaTeX_Main-BoldItalic-DxDJ3AOS.woff2","./assets/KaTeX_Main-Italic-NWA7e6Wa.woff2","./assets/KaTeX_Main-Regular-B22Nviop.woff2","./assets/KaTeX_Math-BoldItalic-CZnvNsCZ.woff2","./assets/KaTeX_Math-Italic-t53AETM-.woff2","./assets/KaTeX_SansSerif-Bold-D1sUS0GD.woff2","./assets/KaTeX_SansSerif-Italic-C3H0VqGB.woff2","./assets/KaTeX_SansSerif-Regular-DDBCnlJ7.woff2","./assets/KaTeX_Script-Regular-D3wIWfF6.woff2","./assets/KaTeX_Size1-Regular-mCD8mA8B.woff2","./assets/KaTeX_Size2-Regular-Dy4dx90m.woff2","./assets/KaTeX_Size3-Regular-gV2CO0n9.woff2","./assets/KaTeX_Size4-Regular-Dl5lxZxV.woff2","./assets/KaTeX_Typewriter-Regular-CO6r4hn1.woff2","./assets/Lab-CLMpJ9jj.js","./assets/Labs-BFP7hINq.js","./assets/Learn-Ce1iqcTP.js","./assets/Library-CCItwr1T.js","./assets/Md-BxvxMitw.js","./assets/More-DKiJclAz.js","./assets/News-CdQP06sl.js","./assets/Onboarding-CKo1G_HI.js","./assets/Opportunity-De_Rngaz.js","./assets/Papers-B6pCJCkX.js","./assets/Planner-U3Cy5tHR.js","./assets/Portfolio-7AP0oTpt.js","./assets/Practice-DdUoaZnd.js","./assets/Profile-BMawdW4u.js","./assets/Progress-BUc4q2VM.js","./assets/Quiz-B6BArvd2.js","./assets/Readiness-BCkj9_04.js","./assets/Research-BdgtmQqB.js","./assets/Resources-CNBR9a8M.js","./assets/Review-CWp8l1Rw.js","./assets/Roadmap-Bgqv34Nl.js","./assets/Scholarships-BTsbh6gn.js","./assets/Search-BsJ-WokY.js","./assets/Settings-DQXYecW5.js","./assets/Systems-DmxBF3n-.js","./assets/Thesis-Cv9pcrdl.js","./assets/TodayDeadlines-BHPb0Hn8.js","./assets/Topic-C9lCIQJ-.js","./assets/Verify-ZfCCoThe.js","./assets/Vocab-DnHR9JYi.js","./assets/curriculum-jEdzXNbd.js","./assets/econ-BM6Z7p4m.js","./assets/feed-Dxcebzvc.js","./assets/funding-DkOAd0j-.js","./assets/glossary-DvbOPdqE.js","./assets/guides-B_xsv2i2.js","./assets/ics-DdVfyqqg.js","./assets/index-7dEkid4T.css","./assets/index-Qwi10sQR.js","./assets/index-uR64lP0q.js","./assets/katex-DQ-ZjyoH.js","./assets/katex-NwSQFk4P.css","./assets/labs-BbEUoaoT.js","./assets/num-DsbRW1Q5.js","./assets/opportunities-CkrcNtJf.js","./assets/papers-Bg8ShfyA.js","./assets/react-CI6SGl1L.js","./assets/readiness-BDXhfX8j.js","./assets/research-D3e_USRd.js","./assets/resources-BXx_Ui0Q.js","./assets/systems-DkwFyWt3.js","./assets/topics-CTPOyios.js"];

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
