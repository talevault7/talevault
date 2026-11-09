/* =========================================================
   TaleVault — content rendering
   Uses the theme's original CSS (mkm.css) and main.js.
   This file renders content.json into each page.
   ========================================================= */
(function () {
  "use strict";
  var S = null;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var uri = function (svg) { return "data:image/svg+xml;utf8," + encodeURIComponent(svg.replace(/\s{2,}/g, " ")); };

  /* ---------- placeholder pages (until real images exist) ---------- */
  function coverSvg(t) {
    var a = (t.art && t.art.a) || "#9053ff", b = (t.art && t.art.b) || "#1a0b2e";
    var label = (t.art && t.art.label) || t.title.slice(0, 2).toUpperCase();
    return uri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + a + '"/><stop offset="1" stop-color="' + b + '"/></linearGradient></defs>' +
      '<rect width="400" height="600" fill="url(#g)"/>' +
      '<g fill="#fff" opacity=".1"><circle cx="70" cy="100" r="130"/><circle cx="350" cy="520" r="160"/></g>' +
      '<g stroke="#fff" stroke-opacity=".14" stroke-width="2"><path d="M0 470 L400 370"/><path d="M0 505 L400 405"/></g>' +
      '<text x="200" y="295" text-anchor="middle" font-family="system-ui,sans-serif" font-size="120" font-weight="800" fill="#fff" fill-opacity=".92">' + esc(label) + '</text>' +
      '<text x="200" y="352" text-anchor="middle" font-family="system-ui,sans-serif" font-size="22" font-weight="700" fill="#fff" fill-opacity=".7">' + esc(t.title) + '</text></svg>');
  }
  function cover(t) { return t.cover || coverSvg(t); }
  function pagePh(t, num, i, total) {
    var a = (t.art && t.art.a) || "#9053ff";
    return uri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1200">' +
      '<rect width="800" height="1200" fill="#f2efe7"/>' +
      '<rect x="36" y="36" width="728" height="1128" fill="none" stroke="#191919" stroke-width="3"/>' +
      '<g fill="none" stroke="#191919" stroke-width="3"><rect x="66" y="66" width="324" height="306"/><rect x="410" y="66" width="324" height="306"/>' +
      '<rect x="66" y="392" width="668" height="330"/><rect x="66" y="742" width="324" height="392"/><rect x="410" y="742" width="324" height="392"/></g>' +
      '<g fill="' + a + '" fill-opacity=".13"><rect x="66" y="66" width="324" height="306"/><rect x="66" y="742" width="324" height="392"/></g>' +
      '<text x="400" y="585" text-anchor="middle" font-family="system-ui,sans-serif" font-size="44" font-weight="800" fill="#191919">' + esc(t.title) + '</text>' +
      '<text x="400" y="640" text-anchor="middle" font-family="system-ui,sans-serif" font-size="28" fill="#555">Chapter ' + num + ' — page ' + i + ' / ' + total + '</text>' +
      '<g><ellipse cx="560" cy="190" rx="160" ry="70" fill="#fff" stroke="#191919" stroke-width="3"/>' +
      '<text x="560" y="182" text-anchor="middle" font-family="system-ui,sans-serif" font-size="24" fill="#191919">' + esc((t.voices && t.voices[(i - 1) % t.voices.length]) || "") + '</text>' +
      '<text x="560" y="216" text-anchor="middle" font-family="system-ui,sans-serif" font-size="16" fill="#777">' + esc(t.title) + '</text></g>' +
      '</svg>');
  }
  /* until real pages exist: B&W manga page composed from cover art (inline SVG panels + bubble) */
  function pageInline(t, c, i, total) {
    var cv = cover(t);
    var crops = [[0,0,600,450],[0,450,600,450],[0,150,600,600],[150,0,450,675],[0,0,450,675],[150,225,450,675]];
    var lay = (i % 2) ? [[40,90,720,430],[40,540,350,330],[410,540,350,330],[40,890,720,250]]
                      : [[40,90,350,500],[410,90,350,500],[40,610,720,300],[40,930,720,210]];
    var panels = lay.map(function (r, k) {
      var cr = crops[(i + k) % crops.length];
      var filt = (i === 1 && k === 0) ? "" : ' style="filter:grayscale(1) contrast(1.08)"';
      return '<svg x="' + r[0] + '" y="' + r[1] + '" width="' + r[2] + '" height="' + r[3] + '" viewBox="' + cr.join(" ") + '" preserveAspectRatio="xMidYMid slice">' +
        '<image href="' + cv + '" width="600" height="900"' + filt + '/></svg>' +
        '<rect x="' + r[0] + '" y="' + r[1] + '" width="' + r[2] + '" height="' + r[3] + '" fill="none" stroke="#111" stroke-width="4"/>';
    }).join("");
    var v = (t.voices && t.voices[(i - 1) % t.voices.length]) || "";
    var half = Math.ceil(v.length / 2);
    var l1 = v.slice(0, half), l2 = v.slice(half);
    var bubble = '<g><ellipse cx="545" cy="255" rx="195" ry="95" fill="#fff" stroke="#111" stroke-width="4"/>' +
      '<path d="M505 335 L485 390 L548 340 Z" fill="#fff" stroke="#111" stroke-width="4"/>' +
      '<text x="545" y="' + (l2 ? 245 : 265) + '" text-anchor="middle" font-family="system-ui,sans-serif" font-size="30" font-weight="700" fill="#111">' + esc(l1) + '</text>' +
      (l2 ? '<text x="545" y="288" text-anchor="middle" font-family="system-ui,sans-serif" font-size="30" font-weight="700" fill="#111">' + esc(l2) + '</text>' : "") +
      "</g>";
    var sents = (t.description || "").split(/。/).filter(function (s) { return s.trim(); });
    var nar = (sents[(i - 1) % Math.max(sents.length, 1)] || "").trim();
    var caption = "";
    if (nar) {
      var lines = [];
      for (var k = 0; k < nar.length && lines.length < 3; k += 30) lines.push(nar.slice(k, k + 30));
      caption = '<g><rect x="40" y="1000" width="720" height="' + (lines.length * 34 + 30) + '" fill="#fff" stroke="#111" stroke-width="3"/>' +
        lines.map(function (ln, xi) {
          return '<text x="60" y="' + (1035 + xi * 34) + '" font-family="system-ui,sans-serif" font-size="24" fill="#111">' + esc(ln) + "</text>";
        }).join("") + "</g>";
    }
    return '<svg class="mkm-page" viewBox="0 0 800 1200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + esc(t.title) + ' page ' + i + '">' +
      '<rect width="800" height="1200" fill="#fdfdf8"/>' +
      '<text x="40" y="58" font-family="system-ui,sans-serif" font-size="30" font-weight="800" fill="#111">' + esc(t.title) + " — 第" + esc(c.num) + "話 " + esc(c.title) + "</text>" +
      panels + bubble + caption +
      '<text x="760" y="1185" text-anchor="end" font-family="system-ui,sans-serif" font-size="22" fill="#666">' + i + " / " + total + "</text>" +
      "</svg>";
  }
  function imgTag(p, lazy) {
    if (p.text) return '<article class="mkm-prose">' + p.text.map(function (pp) { return '<p>' + esc(pp) + '</p>'; }).join("") + '</article>';
    if (p.inline) return p.inline;
    return '<img src="' + p.real + '" alt="Page ' + p.i + '" ' + (lazy ? 'loading="lazy" ' : "") +
      'onerror="this.onerror=null;this.src=\'' + p.ph + '\'">';
  }
  function pad(n) { return String(n).padStart(3, "0"); }
  /* chapter pages: `images: [urls]` ho to wo, warna `dir` + 001.jpg … */
  function pageList(t, c) {
    var out = [];
    if (c.body) {
      var paras = c.body.split(/\n\n+/).filter(function (x) { return x.trim(); });
      for (var q = 0; q < paras.length; q += 4) out.push({ text: paras.slice(q, q + 4), i: out.length + 1, inline: null, ph: null, real: null });
      if (!out.length) out.push({ text: [c.body], i: 1, inline: null, ph: null, real: null });
      return out;
    }
    if (c.images && c.images.length) {
      c.images.forEach(function (u, i) {
        out.push({ real: u, ph: pagePh(t, c.num, i + 1, c.images.length), i: i + 1, inline: null });
      });
    } else if (c.dir) {
      var n = c.pages || 0;
      for (var i = 1; i <= n; i++) out.push({ real: c.dir + pad(i) + ".jpg", ph: pagePh(t, c.num, i, n), i: i, inline: null });
    } else {
      out.push({ text: ["이 화의 본문은 준비 중입니다. 곧 업데이트될 예정이니 다른 화를 먼저 읽어 주세요.", "새 화와 새 이야기는 매주 추가됩니다."], i: 1, inline: null, ph: null, real: null });
    }
    return out;
  }
  function bg(t) {
    var a = (t.art && t.art.a) || "#9053ff";
    return uri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 700">' +
      '<rect width="1600" height="700" fill="#0a0a12"/>' +
      '<circle cx="1180" cy="330" r="420" fill="' + a + '" opacity=".28"/>' +
      '<circle cx="1420" cy="180" r="220" fill="#12d4e7" opacity=".18"/>' +
      '<circle cx="900" cy="560" r="180" fill="#fff" opacity=".05"/></svg>');
  }

  /* ---------- data helpers ---------- */
  function find(id) { return S.titles.filter(function (t) { return t.id === id; })[0]; }
  function chs(t) { return (t.chapters || []).slice().sort(function (a, b) { return b.num - a.num; }); }
  function chOf(t, num) { return chs(t).filter(function (c) { return c.num === Number(num); })[0] || chs(t)[0]; }
  function latestCh(t) { return chs(t)[0]; }
  function firstCh(t) { return chs(t).slice(-1)[0]; }
  function views(n) { return n >= 1e6 ? (n / 1e6).toFixed(1) + "M" : n >= 1e3 ? Math.round(n / 1e3) + "K" : String(n || 0); }
  function date(s) { var d = new Date(s + "T00:00:00"); return d.toLocaleDateString("ko-KR", { day: "numeric", month: "short", year: "numeric" }); }
  function genres() {
    var set = {};
    S.titles.forEach(function (t) { (t.genres || []).forEach(function (g) { set[g] = 1; }); });
    return Object.keys(set).sort();
  }
  function allChapters() {
    var out = [];
    S.titles.forEach(function (t) { chs(t).forEach(function (c) { out.push({ t: t, c: c }); }); });
    return out.sort(function (a, b) { return b.c.date.localeCompare(a.c.date); });
  }
  function history() { try { return JSON.parse(localStorage.getItem("mkm-read")) || []; } catch (e) { return []; } }
  function remember(id, ch) {
    var h = history().filter(function (x) { return x.id !== id; });
    h.unshift({ id: id, ch: ch, at: Date.now() });
    try { localStorage.setItem("mkm-read", JSON.stringify(h.slice(0, 20))); } catch (e) {}
  }
  function resume(id) { return history().filter(function (x) { return x.id === id; })[0]; }

  /* ---------- ADS (assets/ads.json = control panel) ---------- */
  var ADS = null;
  function loadContent() {
    return fetch("assets/content.json")
      .then(function (r) { if (!r.ok) throw new Error("content.json"); return r.json(); })
      .then(function (j) { S = j; window.SITE = j; });
  }
  function loadStyle() {
    var map = { accent: "--mkm-accent", accent2: "--mkm-accent-2", bg: "--mkm-bg", surface: "--mkm-surface",
      surface2: "--mkm-surface-2", border: "--mkm-border", radius: "--mkm-radius", container: "--mkm-container", font: "--mkm-font" };
    return fetch("assets/style.json").then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
      if (!j) return;
      Object.keys(map).forEach(function (k) { if (j[k]) document.documentElement.style.setProperty(map[k], j[k]); });
      if (j.gridMin) {
        var g = document.createElement("style");
        g.textContent = ".mkm-grid{grid-template-columns:repeat(auto-fill,minmax(" + (Number(j.gridMin) || 180) + "px,1fr))}";
        document.head.appendChild(g);
      }
    }).catch(function () {});
  }
  function loadSeo() {
    return fetch("assets/seo.json").then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
      if (!j || !j.ga) return;
      var s1 = document.createElement("script");
      s1.async = true;
      s1.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(j.ga);
      document.head.appendChild(s1);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { dataLayer.push(arguments); };
      window.gtag("js", new Date());
      window.gtag("config", j.ga);
    }).catch(function () {});
  }
  function loadAds() {
    return fetch("assets/ads.json")
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) { ADS = j; })
      .catch(function () { ADS = null; });
  }
  function adHTML(slot) {
    if (!ADS || !ADS.enabled) return "";
    var s = ADS.slots && ADS.slots[slot];
    if (!s || !s.on || !s.code) return "";
    return '<div class="mkm-ad mkm-ad-' + slot + '"><span class="mkm-ad-label">광고</span>' + s.code + "</div>";
  }
  function paintAds() {
    $$("[data-ad]").forEach(function (el) {
      var html = adHTML(el.getAttribute("data-ad"));
      if (html) { el.outerHTML = html; } else { el.remove(); }
    });
  }

  /* ---------- SEO: title, meta, canonical, OG, JSON-LD ---------- */
  var DOMAIN = "https://talevault.mkm.fan";
  function meta(name, content, prop) {
    var el = document.querySelector('meta[' + (prop ? 'property' : 'name') + '="' + name + '"]');
    if (!el) { el = document.createElement("meta"); prop ? el.setAttribute("property", name) : el.setAttribute("name", name); document.head.appendChild(el); }
    el.setAttribute("content", content);
  }
  function baseKw() {
    return "talevault, talevault.mkm.fan, 무료 소설, 단편 소설, 연재 소설, 이야기 읽기, 오리지널 스토리, 한국 단편, new chapters daily";
  }
  function seo(title, desc, kw, path, ogType, ogImage, ld) {
    document.title = title;
    meta("description", desc);
    meta("keywords", kw);
    meta("og:title", title, 1); meta("og:description", desc, 1);
    meta("og:type", ogType || "website", 1); meta("og:url", DOMAIN + path, 1);
    meta("og:site_name", S.name, 1); meta("og:locale", "ko_KR", 1);
    if (ogImage) meta("og:image", DOMAIN + "/" + ogImage, 1);
    meta("twitter:card", "summary_large_image"); meta("twitter:title", title); meta("twitter:description", desc);
    var cl = document.querySelector('link[rel="canonical"]');
    if (!cl) { cl = document.createElement("link"); cl.rel = "canonical"; document.head.appendChild(cl); }
    cl.href = DOMAIN + path;
    var old = document.getElementById("mkm-ld"); if (old) old.remove();
    if (ld) { var sc = document.createElement("script"); sc.type = "application/ld+json"; sc.id = "mkm-ld"; sc.textContent = JSON.stringify(ld); document.head.appendChild(sc); }
  }
  function crumbs(t, c) {
    var items = [{ name: "Home", url: DOMAIN + "/" }, { name: "Manga", url: DOMAIN + "/search.html" }];
    if (t) items.push({ name: t.title, url: DOMAIN + "/story.html?id=" + t.id });
    if (t && c) items.push({ name: c.num + "화", url: DOMAIN + "/read.html?id=" + t.id + "&ch=" + c.num });
    return { "@type": "BreadcrumbList", "itemListElement": items.map(function (x, i) {
      return { "@type": "ListItem", position: i + 1, name: x.name, item: x.url }; }) };
  }

  /* ---------- shared chrome ---------- */
  function chrome() {
    $$("[data-year]").forEach(function (n) { n.textContent = new Date().getFullYear(); });
    $$(".mkm-footer-about").forEach(function (n) { n.textContent = S.tagline; });
    var fg = $(".mkm-footer-genres");
    if (fg) fg.innerHTML = genres().slice(0, 8).map(function (g) { return '<li><a href="search.html?s=' + encodeURIComponent(g) + '">' + esc(g) + "</a></li>"; }).join("");
    var soc = $(".mkm-social");
    if (soc) soc.innerHTML = S.social.map(function (s) {
      return '<a href="' + esc(s.url) + '" rel="noopener">' + esc(s.label) + "</a>";
    }).join("");
  }

  /* ---------- shared sidebar (genres + latest updates) ---------- */
  function sidebar() {
    var el = $(".mkm-sidebar");
    if (!el) return;
    el.innerHTML =
      '<div class="mkm-widget"><h3 class="mkm-widget-title">장르</h3><div class="mkm-genre-list">' +
      genres().map(function (g) { return '<a href="search.html?s=' + encodeURIComponent(g) + '">' + esc(g) + "</a>"; }).join("") +
      '</div></div>' +
      '<div class="mkm-widget"><h3 class="mkm-widget-title">최신 업데이트</h3><ul class="mkm-latest-list">' +
      allChapters().slice(0, 6).map(function (x) {
        return '<li><img src="' + cover(x.t) + '" onerror="this.onerror=null;this.src=\'' + coverSvg(x.t) + '\'" alt="" loading="lazy" width="44" height="58">' +
          '<div><p class="t"><a href="story.html?id=' + esc(x.t.id) + '">' + esc(x.t.title) + "</a></p>" +
          '<span class="c">Ch. ' + esc(x.c.num) + " · " + esc(date(x.c.date)) + "</span></div></li>";
      }).join("") + "</ul></div>" +
      '<div data-ad="sidebar"></div>';
  }

  /* ---------- card (template-parts/card.php jaisa) ---------- */
  function card(t) {
    var g = (t.genres || []).slice(0, 3);
    var lc = latestCh(t);
    return '<article class="mkm-card"><a href="story.html?id=' + esc(t.id) + '" aria-label="' + esc(t.title) + '">' +
      '<div class="mkm-card-cover"><img src="' + cover(t) + '" onerror="this.onerror=null;this.src=\'' + coverSvg(t) + '\'" alt="' + esc(t.title) + ' 표지" loading="lazy" width="300" height="400">' +
      (lc ? '<span class="mkm-card-chapter">Ch. ' + esc(lc.num) + "</span>" : "") + "</div></a>" +
      '<div class="mkm-card-body"><h3 class="mkm-card-title"><a href="story.html?id=' + esc(t.id) + '">' + esc(t.title) + "</a></h3>" +
      '<div class="mkm-card-genres">' + g.map(function (x) { return '<a class="mkm-genre" href="search.html?s=' + encodeURIComponent(x) + '">' + esc(x) + "</a>"; }).join("") + "</div>" +
      '<p class="mkm-card-excerpt">' + esc((t.description || "").slice(0, 96)) + '…</p>' +
      '<div class="mkm-card-meta"><span>' + esc(t.status || "연재중") + '</span><a class="mkm-card-link" href="read.html?id=' + esc(t.id) + "&ch=" + (lc ? lc.num : 1) + '">읽기 →</a></div></div></article>';
  }
  /* related posts: shared genre */
  function related(t) {
    var rel = S.titles.filter(function (x) {
      return x.id !== t.id && (x.genres || []).some(function (g) { return (t.genres || []).indexOf(g) > -1; });
    }).slice(0, 4);
    if (!rel.length) return "";
    return '<div class="mkm-section" id="mkm-rel" style="margin-top:26px"><div class="mkm-section-head">' +
      '<div><h2 class="mkm-title">관련 이야기</h2><p class="mkm-subtitle">' + esc(t.title) + '를 읽은 독자에게 추천</p></div></div>' +
      '<div class="mkm-grid">' + rel.map(card).join("") + "</div></div>";
  }

  /* ================= HOME ================= */
  function home() {
    var root = $("#home-root");
    if (!root) return;
    var slides = S.slides.map(function (s, i) {
      var t = find(s.titleId) || S.titles[0];
      return '<section class="mkm-hero mkm-hero-slide' + (cover(t) ? " has-cover" : "") + '" style="--mkm-hero-bg:url(&quot;' + bg(t) + '&quot;)">' +
        '<div class="mkm-container mkm-hero-inner">' +
        '<div class="mkm-hero-cover"><img src="' + cover(t) + '" onerror="this.onerror=null;this.src=\'' + coverSvg(t) + '\'" alt="' + esc(t.title) + ' 표지"' + (i ? ' loading="lazy"' : "") + '></div>' +
        '<div class="mkm-hero-content">' +
        (s.badge ? '<span class="mkm-badge">' + esc(s.badge) + "</span>" : "") +
        "<h1>" + esc(s.title) + "</h1><p>" + esc(s.text) + "</p>" +
        '<div class="mkm-hero-actions">' +
        (s.btn1 ? '<a class="mkm-btn" href="' + esc(s.btn1.href) + '">' + esc(s.btn1.label) + "</a>" : "") +
        (s.btn2 ? '<a class="mkm-btn mkm-btn-ghost" href="' + esc(s.btn2.href) + '">' + esc(s.btn2.label) + "</a>" : "") +
        "</div>" +
        (s.stats ? '<div class="mkm-stats">' + s.stats.map(function (x) {
          return '<div class="mkm-stat"><span class="mkm-stat-num">' + esc(x.num) + '</span><span class="mkm-stat-label">' + esc(x.label) + "</span></div>";
        }).join("") + "</div>" : "") +
        "</div></div></section>";
    }).join("");
    var f = S.feature, ft = find(f.mangaId), fc = ft ? chOf(ft, f.chapterNum) : null;
    var ordered = allChapters().map(function (x) { return x.t; }).filter(function (t, i, arr) { return arr.indexOf(t) === i; });
    S.titles.forEach(function (t) { if (ordered.indexOf(t) === -1) ordered.push(t); });
    var main = '<div class="mkm-container"><div class="mkm-layout"><div>' +
      '<div class="mkm-section mkm-listing-section" id="latest"><div class="mkm-section-head">' +
      '<div><h2 class="mkm-title">최신 이야기</h2><p class="mkm-subtitle">' + ordered.length + ' 개의 오리지널 스토리 — 매일 업데이트</p></div>' +
      '<a class="mkm-btn mkm-btn-sm mkm-btn-ghost" href="search.html">전체 보기</a></div>' +
      '<div class="mkm-grid">' + ordered.map(card).join("") + "</div></div>" +
      '</div><div class="mkm-sidebar"></div></div></div>';
    var reader = "";
    if (ft && fc) {
      var plist = pageList(ft, fc);
      var n = Math.min(f.previewPages || 3, plist.length);
      reader = '<section class="mkm-container mkm-home-reader" id="reader" aria-label="Chapter reader">' +
        '<div class="mkm-home-reader-title"><span>지금 읽는 중</span><h2>' + esc(fc.num) + '화: ' + esc(fc.title) + '</h2><p>' + esc(ft.title) + '</p></div>' +
        '<div class="mkm-reader-images">' + plist.slice(0, n).map(function (p, k) { return imgTag(p, k > 1); }).join("") + "</div>" +
        '<p class="mkm-home-reader-link"><a href="read.html?id=' + esc(ft.id) + "&ch=" + esc(fc.num) + '">이 화 읽기 →</a></p></section>';
    }
    root.innerHTML = '<div class="mkm-hero-slider" id="hero-slider" aria-label="Featured highlights">' + slides +
      (S.slides.length > 1 ? '<div class="mkm-slider-controls" hidden><button type="button" class="mkm-slider-prev" aria-label="Previous slide">&#8592;</button><button type="button" class="mkm-slider-next" aria-label="Next slide">&#8594;</button></div>' : "") +
      "</div>" +
      '<div data-ad="home"></div>' + main + reader;
    $$(".mkm-hero-slide", root).forEach(function (sl, i) { sl.hidden = i !== 0; });
    sidebar();
    paintAds();
    seo(S.name + " | 오리지널 이야기 무료 연재",
      S.tagline + " " + S.about.slice(0, 140),
      baseKw() + ", " + genres().join(", "),
      "/", "website", null,
      { "@context": "https://schema.org", "@graph": [
        { "@type": "WebSite", name: S.name, url: DOMAIN + "/", inLanguage: ["ja", "en"],
          potentialAction: { "@type": "SearchAction", target: DOMAIN + "/search.html?s={query}", "query-input": "required name=query" } },
        { "@type": "ItemList", numberOfItems: S.titles.length,
          itemListElement: S.titles.slice(0, 20).map(function (t, i) {
            return { "@type": "ListItem", position: i + 1, url: DOMAIN + "/story.html?id=" + t.id, name: t.title }; }) }
      ] });
  }

  function manga(id) {
    var t = find(id);
    var box = $("#detail");
    if (!box) return;
    if (!t) { box.innerHTML = '<div class="mkm-container mkm-page"><p class="mkm-empty">이야기를 찾을 수 없습니다. <a href="index.html">홈으로</a></p></div>'; return; }
    document.title = t.title + " — " + S.name;
    seo(t.title + " (" + (t.alt || "") + ") 전 화 무료 | " + S.name,
      t.description.slice(0, 155),
      t.title + ", " + (t.alt || "") + ", " + t.genres.join(", ") + ", " + t.author + ", 무료 연재 소설, " + baseKw(),
      "/story.html?id=" + t.id, "book", t.cover,
      { "@context": "https://schema.org", "@graph": [
        { "@type": "BookSeries", name: t.title, alternateName: t.alt || "", url: DOMAIN + "/story.html?id=" + t.id,
          inLanguage: "ko", image: DOMAIN + "/" + (t.cover || ""), author: { "@type": "Person", name: t.author },
          illustrator: { "@type": "Person", name: t.artist }, genre: (t.genres || []).join(", "),
          aggregateRating: { "@type": "AggregateRating", ratingValue: t.rating, ratingCount: t.views },
          numberOfPages: (t.chapters || []).length },
        crumbs(t, null)
      ] });
    var r = resume(t.id);
    var lc = latestCh(t), fc = firstCh(t);
    box.innerHTML = '<div class="mkm-container mkm-page">' +
      '<nav class="mkm-breadcrumb" aria-label="Breadcrumb"><a href="index.html">홈</a> <span>/</span> <a href="search.html">이야기</a> <span>/</span> <span>' + esc(t.title) + "</span></nav>" +
      '<nav class="mkm-toc" aria-label="목차"><span>목차:</span><a href="#mkm-syn">줄거리</a><a href="#mkm-chs">챕터</a><a href="#mkm-rel">관련</a></nav>' +
      '<div class="mkm-layout"><div>' +
      '<div class="mkm-single">' +
      '<div class="mkm-cover"><img src="' + cover(t) + '" onerror="this.onerror=null;this.src=\'' + coverSvg(t) + '\'" alt="' + esc(t.title) + ' 표지" width="280" height="420"></div>' +
      '<div class="mkm-info"><h1>' + esc(t.title) + '</h1><p class="alt">' + esc(t.alt || "") + "</p>" +
      '<div class="mkm-meta">' +
      '<span class="mkm-meta-item"><b>상태:</b> ' + esc(t.status) + "</span>" +
      '<span class="mkm-meta-item"><b>형태:</b> ' + esc(t.type) + "</span>" +
      '<span class="mkm-meta-item"><b>저자:</b> ' + esc(t.author) + "</span>" +
      '<span class="mkm-meta-item"><b>그림:</b> ' + esc(t.artist) + "</span>" +
      '<span class="mkm-meta-item"><b>시작:</b> ' + esc(t.year) + "</span>" +
      '<span class="mkm-meta-item"><b>평점:</b> ★ ' + esc(t.rating) + "</span>" +
      '<span class="mkm-meta-item"><b>조회:</b> ' + views(t.views) + "</span></div>" +
      '<div class="mkm-card-genres">' + t.genres.map(function (g) { return '<a class="mkm-genre" href="search.html?s=' + encodeURIComponent(g) + '">' + esc(g) + "</a>"; }).join("") + "</div>" +
      '<div class="mkm-hero-actions" style="margin-top:16px">' +
      (r ? '<a class="mkm-btn" href="read.html?id=' + esc(t.id) + '&ch=' + esc(r.ch) + '>이어 읽기 ' + esc(r.ch) + '화</a>' : "") +
      '<a class="mkm-btn' + (r ? " mkm-btn-ghost" : "") + '" href="read.html?id=' + esc(t.id) + "&ch=" + (fc ? fc.num : 1) + '">첫 화부터 읽기</a>' +
      '<a class="mkm-btn mkm-btn-ghost" href="read.html?id=' + esc(t.id) + "&ch=" + (lc ? lc.num : 1) + '">최신화 ' + (lc ? esc(lc.num) : "") + '화</a></div>' +
      '<div class="mkm-description" id="mkm-syn"><h3>줄거리</h3><p>' + esc(t.description) + "</p></div>" +
      "</div></div>" +
      '<div class="mkm-chapter-list" id="mkm-chs" style="margin-top:20px"><div class="mkm-chapter-list-head"><h3>챕터 목록</h3><span>' + chs(t).length + '화</span></div><ul>' +
      chs(t).map(function (c) {
        return '<li' + (r && r.ch === c.num ? ' class="is-current"' : "") + '><a href="read.html?id=' + esc(t.id) + '&ch=' + esc(c.num) + '"><span class="num">' + esc(c.num) + '화</span><span>' + esc(c.title) + '</span><span class="date">' + esc(date(c.date)) + ' · ' + (c.body ? c.body.split(/\s+/).length : (c.pages || (c.images || []).length)) + '자</span></a></li>';
      }).join("") + "</ul></div>" +
      related(t) +
      "</div><div class=\"mkm-sidebar\"></div></div></div>";
    sidebar();
    paintAds();
  }

  /* ================= READER ================= */
  function reader(id, num) {
    var t = find(id);
    var stage = $("#reader-stage");
    if (!stage) return;
    if (!t) { stage.innerHTML = '<p class="mkm-empty">이야기를 찾을 수 없습니다.</p>'; return; }
    var list = chs(t), c = chOf(t, num), idx = list.indexOf(c);
    document.title = t.title + " " + c.num + "화 — " + S.name;
    seo(t.title + " " + c.num + "화 — " + c.title + " | " + S.name,
      t.title + " " + c.num + "화 " + c.title + " — talevault.mkm.fan에서 무료로 읽으세요. " + t.description.slice(0, 90),
      t.title + " " + c.num + "화, " + t.title + " 무료 읽기, 연재 소설, " + baseKw(),
      "/read.html?id=" + t.id + "&ch=" + c.num, "article", t.cover,
      { "@context": "https://schema.org", "@graph": [
        { "@type": "WebPage", name: t.title + " " + c.num + "화", inLanguage: "ko", isPartOf: { "@type": "BookSeries", name: t.title, url: DOMAIN + "/story.html?id=" + t.id } },
        crumbs(t, c)
      ] });
    remember(t.id, c.num);

    $("#r-title").innerHTML = '第' + esc(c.num) + '話:' + esc(c.title) +
      ' <span style="color:var(--mkm-muted);font-size:.85rem">· <a href="story.html?id=' + esc(t.id) + '">' + esc(t.title) + "</a></span>";
    $("#all-ch").href = "story.html?id=" + encodeURIComponent(t.id);

    var sel = $("#ch-select");
    sel.innerHTML = list.map(function (x) {
      return '<option value="' + esc(x.num) + '"' + (x.num === c.num ? " selected" : "") + ">第' + esc(x.num) + '話 ' + esc(x.title) + '</option>";
    }).join("");
    sel.onchange = function () { location.href = "read.html?id=" + t.id + "&ch=" + sel.value; };

    var imgsEl = $("#reader-images");
    var mode = localStorage.getItem("mkm-mode") || "strip";
    var width = localStorage.getItem("mkm-width") || "";
    var cur = 0, pages = pageList(t, c);
    function paint() {
      var wrap = $("#reader-wrap");
      wrap.className = "mkm-reader" + (mode === "strip" && width ? " " + width : "");
      imgsEl.classList.toggle("is-paged", mode === "paged");
      if (mode === "strip") {
        var every = (ADS && ADS.enabled && ADS.slots.reader_inline.on) ? (Number(ADS.slots.reader_inline.every) || 5) : 0;
        imgsEl.innerHTML = pages.map(function (p, i) {
          var h = imgTag(p, i > 1);
          if (every && (i + 1) % every === 0 && i + 1 < pages.length) h += adHTML("reader_inline");
          return h;
        }).join("");
      } else {
        imgsEl.innerHTML = imgTag(pages[cur], false);
      }
      $("#p-count").textContent = (mode === "paged" ? cur + 1 : 1) + " / " + pages.length + " 페이지";
      $("#mode-btn").textContent = mode === "strip" ? "페이지 모드" : "세로 스크롤";
      $("#pg-prev").hidden = mode !== "paged";
      $("#pg-next").hidden = mode !== "paged";
      $("#width-btn").hidden = mode !== "strip";
      $("#width-btn").textContent = "너비: " + (width === "narrow" ? "좁게" : width === "wide" ? "넓게" : "보통");
      var pb = $("#ch-prev"); pb.disabled = idx >= list.length - 1;
      var nb = $("#ch-next"); nb.disabled = idx <= 0;
    }
    paint();

    $("#mode-btn").onclick = function () {
      mode = mode === "strip" ? "paged" : "strip";
      localStorage.setItem("mkm-mode", mode); cur = 0; paint();
    };
    $("#width-btn").onclick = function () {
      width = width === "" ? "narrow" : width === "narrow" ? "wide" : "";
      localStorage.setItem("mkm-width", width); paint();
    };
    $("#pg-prev").onclick = function () { if (cur > 0) { cur--; paint(); } };
    $("#pg-next").onclick = function () { if (cur < pages.length - 1) { cur++; paint(); } };
    $("#ch-prev").onclick = function () { if (idx < list.length - 1) location.href = "read.html?id=" + t.id + "&ch=" + list[idx + 1].num; };
    $("#ch-next").onclick = function () { if (idx > 0) location.href = "read.html?id=" + t.id + "&ch=" + list[idx - 1].num; };
    document.addEventListener("keydown", function (e) {
      if (mode !== "paged") return;
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); $("#pg-next").click(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); $("#pg-prev").click(); }
    });

    /* progress bar */
    var bar = $("#prog-bar");
    function prog() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
    }
    window.addEventListener("scroll", prog, { passive: true }); prog();

    sidebar();
    paintAds();
  }

  /* ================= SEARCH ================= */
  function search(q) {
    var box = $("#results");
    if (!box) return;
    var term = (q || "").trim().toLowerCase();
    $("#q-label").textContent = term ? '검색 결과: "' + q + '"' : "모든 이야기 보기";
    seo((term ? q + " 검색 결과 | " : "이야기 목록 | ") + S.name,
      "오리지널 스토리 " + S.titles.length + "편을 검색하고 무료로 읽으세요. 매일 새로운 화가 올라옵니다.",
      (term ? q + ", " : "") + "이야기 목록, 장르 검색, 무료 연재, " + baseKw(),
      "/search.html" + (term ? "?s=" + encodeURIComponent(q) : ""), "website", null,
      { "@context": "https://schema.org", "@type": "CollectionPage", name: S.name + " 이야기 목록", inLanguage: "ko" });
    var hits = S.titles.filter(function (t) {
      if (!term) return true;
      return (t.title + " " + (t.alt || "") + " " + t.author + " " + t.genres.join(" ") + " " + t.description).toLowerCase().indexOf(term) > -1;
    });
    box.innerHTML = hits.length
      ? '<div class="mkm-search-results">' + hits.map(function (t) {
          var lc = latestCh(t);
          return '<article class="mkm-search-result"><span class="mkm-search-type">' + esc(t.type) + " · " + esc(t.status) + "</span>" +
            "<h2><a href=\"story.html?id=" + esc(t.id) + '">' + esc(t.title) + "</a></h2>" +
            '<div class="mkm-card-genres">' + t.genres.map(function (g) { return '<a class="mkm-genre" href="search.html?s=' + encodeURIComponent(g) + '">' + esc(g) + "</a>"; }).join("") + "</div>" +
            '<p class="mkm-search-excerpt">' + esc(t.description.slice(0, 160)) + "…</p>" +
            '<p class="mkm-card-meta"><span>' + (lc ? "최신: " + esc(lc.num) + "화 · " + esc(date(lc.date)) : "") + '</span><a class="mkm-card-link" href="story.html?id=' + esc(t.id) + '">열기 →</a></p></article>';
        }).join("") + "</div>"
      : '<p class="mkm-empty">"' + esc(q) + '"과(와) 일치하는 이야기가 없습니다.</p>';
    sidebar();
    paintAds();
  }

  /* ---------- boot ---------- */
  Promise.all([loadContent(), loadAds(), loadStyle(), loadSeo()]).then(function () {
    var css = document.createElement("style");
    css.textContent = ".mkm-prose{max-width:760px;margin:0 auto 14px;background:var(--mkm-surface);border:1px solid var(--mkm-border);border-radius:var(--mkm-radius);padding:30px 34px;font-size:1.03rem;line-height:1.95}.mkm-prose p{margin:0 0 1.15em}.mkm-prose p:first-child::first-letter{font-size:2.6em;font-weight:800;float:left;line-height:1;margin:4px 8px 0 0;color:var(--mkm-accent)}" +
      ".mkm-toc{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:12px 0 4px;font-size:.84rem}.mkm-toc span{color:var(--mkm-muted);font-weight:700}.mkm-toc a{color:var(--mkm-accent-2);text-decoration:none;border:1px solid var(--mkm-border);border-radius:999px;padding:4px 12px;background:var(--mkm-surface)}.mkm-footer-grid.has-four{grid-template-columns:1.5fr 1fr 1fr 1fr}@media(max-width:900px){.mkm-footer-grid.has-four{grid-template-columns:1fr 1fr}}" +
      ".mkm-card-excerpt{color:var(--mkm-muted);font-size:.78rem;line-height:1.45;margin:7px 0 0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}" +
      ".mkm-reader-images>svg.mkm-page{width:100%;height:auto;margin:0 auto 10px;border-radius:6px;background:#fdfdf8;display:block}" +
      ".mkm-reader-images.is-paged>svg.mkm-page{width:auto;max-width:100%;max-height:80vh}" +
      ".mkm-home-reader .mkm-reader-images>svg.mkm-page{margin:0 auto;border-radius:0}" +
      ".mkm-home-reader .mkm-reader-images>svg.mkm-page:first-child{border-radius:8px 8px 0 0}";
    document.head.appendChild(css);
    chrome();
    var p = document.body.dataset.route || document.body.dataset.page;
    var q = new URLSearchParams(location.search);
    if (p === "home") home();
    else if (p === "manga" || p === "story") manga(q.get("id"));
    else if (p === "read") reader(q.get("id"), q.get("ch") || 1);
    else if (p === "search") search(q.get("s") || "");
  }).catch(function (e) {
    var m = document.querySelector(".mkm-main");
    if (m) m.innerHTML = '<div class="mkm-container mkm-page"><p class="mkm-empty">콘텐츠를 불러오지 못했습니다: ' +
      (e && e.message ? e.message : "") + "</p></div>";
  });
})();
