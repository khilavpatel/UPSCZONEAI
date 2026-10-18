/* review.html — data, interactions, WebGL "battle" scene. Figures are supplied by the UPSC ZONE team. */
(() => {
  "use strict";
  const RM = matchMedia("(prefers-reduced-motion:reduce)").matches, $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const COMP = ["Traditional coaching", "Generic AI (ChatGPT, Claude)", "AI startups"];
  const P = [
    ["Mains evaluation turnaround","Under 15 seconds, 24×7","10 to 20 business days","About 5 seconds, but shallow and not UPSC-specific","1 to 3 minutes with queue caps"],
    ["Evaluation rubric","10-point UPSC rubric: intro, body, conclusion, keywords, flowcharts, dimensions (GS 1–4)","2–3 vague red-pen remarks","Generic praise; no UPSC structure or marks","Basic prompt summary; misses 2nd ARC, committees, SC judgments"],
    ["Handwritten sheet OCR","Handwritten sheet OCR with line-by-line margin notes","Scanned PDF back after 2 weeks with minimal notes","Fails on cursive handwriting","Slow OCR; struggles with tables, maps, flowcharts"],
    ["Prelims PYQ engine","1995–2024 PYQs with option-by-option elimination reasoning","Bulky printed books with static answer keys","Often invents explanations or picks the wrong key","Small question pool; no adaptive difficulty"],
    ["Current affairs mapping","Daily synthesis of PIB, The Hindu, Indian Express, PRS and NITI Aayog mapped to GS topics","150-page monthly magazines, about 45 days late","Generic web search; random blogs","Irregular RSS feeds without UPSC filtering"],
    ["Ethics and Essay","Philosophers, 2nd ARC frameworks, case-study stakeholder mapping, 100+ essay structures","Standard theory lectures","Corporate HR advice, not civil-service dilemmas","Superficial ethical quotes"],
    ["24/7 mentor","Instant mentor at 2 AM","300:1 student-to-mentor ratio; rushed token appointments","Generic chatbot with no civil-services roadmap","Automated bot with daily message limits"],
    ["Annual cost","₹1,999–₹4,999 per year, all-inclusive","₹2,50,000–₹5,00,000+ (fees plus Delhi rent and living)","₹21,000 per year, plus coaching test series","₹12,000–₹25,000 per year, with credit top-ups"],
    ["Hindi and English","Bilingual engine with UPSC administrative terminology","Hindi batches often get secondary faculty and delayed material","Literal, translated-sounding Hindi","Mostly English-only; Hindi OCR fails often"],
    ["Data grounding","Grounded on official UPSC keys, NCERTs, standard books and the Economic Survey","High static knowledge; human errors in answer keys","Known to hallucinate constitutional articles and rulings","Untested prompt chains without multi-source checks"],
  ];
  const NAMES = ["UPSC ZONE AI", "Traditional", "Generic AI", "AI startups"];
  const M = [
    { t: "Average GS Mains score improvement", u: " marks", v: [38.5, 11.2, -4.5, 14.0], max: 40, plus: 1 },
    { t: "Prelims trap-detection accuracy", u: "%", v: [98.4, 82.0, 54.2, 76.5], max: 100 },
  ];
  $("#mets").innerHTML = M.map(m => `<div class="met rv"><h3>${m.t}</h3>` + m.v.map((v, i) => `<div class="br ${i === 0 ? "us" : ""} ${v < 0 ? "neg" : ""}"><span>${NAMES[i]}</span><i data-w="${Math.max(2, Math.abs(v) / m.max * 100)}"></i><b>${m.plus && v > 0 ? "+" : ""}${v}${m.u.trim() === "%" ? "%" : ""}</b></div>`).join("") + `</div>`).join("");
  const PR = [["UPSC ZONE AI", 4999, "₹1,999–₹4,999 / yr"], ["Traditional", 500000, "₹2.5L–₹5L+ / yr"], ["Generic AI + test series", 21000, "₹21,000 / yr"], ["AI startups", 25000, "₹12k–₹25k / yr"]];
  $("#price").innerHTML = PR.map((p, i) => `<div class="br ${i === 0 ? "us" : ""}"><span>${p[0]}</span><i data-w="${Math.max(4, Math.log10(p[1]) / Math.log10(500000) * 100)}"></i><b style="width:auto;white-space:nowrap">${p[2]}</b></div>`).join("");
  const AU = [["Answer evaluations per month", "90–150", "6–12 (limited by batch test schedule)"], ["Time to spot a conceptual weakness", "Under 15 seconds", "14–21 days"], ["Prelims MCQs practiced and analyzed", "1,500+ per month", "About 300 per month in weekend tests"], ["One-year prep cost (remote aspirant)", "₹3,999", "₹2,80,000+ (₹4,50,000+ if staying in Delhi)"]];
  $("#audit").innerHTML = "<thead><tr><th>Measure</th><th>UPSC ZONE AI</th><th>Traditional coaching</th></tr></thead><tbody>" + AU.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join("") + "</tbody>";
  const F = [["15-second answer evaluation","Write at 2 AM, snap a photo or type, and get a 10-point UPSC rubric critique in about 15 seconds."],["UPSC rubric alignment","Checks introduction hooks, multi-dimensional body arguments, diagrams and a balanced way forward."],["30-year Prelims PYQ traps","Questions from 1995 to 2024 mapped to elimination tactics and statement-pair logic."],["Daily PIB and Hindu synthesis","News filtered by GS 1–4 headers, with instant Prelims MCQs and Mains questions."],["GS-4 Ethics and case-study engine","Frameworks for dilemmas: Nolan principles, 2nd ARC ethics, stakeholder matrix, administrative choices."],["Pricing aimed at aspirants","Mains, Prelims, mentor and CSAT in one plan, priced below a month of a Delhi PG room."]];
  $("#feat").innerHTML = F.map(f => `<div class="tilt rv"><h3>${f[0]}</h3><p>${f[1]}</p></div>`).join("");

  let sel = 0, setHi = () => {};
  function matrix() {
    $("#bm-comp").textContent = COMP[sel];
    $("#bm-body").innerHTML = P.map(r => `<tr class="rv"><th scope="row">${r[0]}</th><td class="us">${r[1]}</td><td>${r[2 + sel]}</td></tr>`).join("");
    $$("#bm-body tr").forEach((tr, i) => setTimeout(() => tr.classList.add("in"), RM ? 0 : i * 70));
  }
  $$("[role=tab]").forEach((b, i) => b.addEventListener("click", () => { sel = i; $$("[role=tab]").forEach(x => x.setAttribute("aria-selected", x === b)); matrix(); setHi(i); }));
  matrix();

  const calc = $("#calc"), out = $("#calc-out");
  function upd() {
    const v = Number(calc.value);
    if (!calc.value || !(v > 0)) { out.innerHTML = "<p>Enter your yearly spend in rupees to see the difference.</p>"; return; }
    const s = v - 3999;
    out.innerHTML = s > 0 ? `<p class="save">₹${s.toLocaleString("en-IN")} less</p><p>That is ${Math.round(s / v * 100)}% lower than ₹${v.toLocaleString("en-IN")}, compared with the ₹3,999 one-year figure for UPSC ZONE AI.</p>` : "<p>At this spend, UPSC ZONE AI’s ₹3,999 one-year figure is not lower than what you pay now.</p>";
  }
  calc.addEventListener("input", upd); upd();

  const ct = el => { const n = +el.dataset.n, d = +el.dataset.d || 0, t0 = performance.now(); (function f(t) { const k = RM ? 1 : Math.min(1, (t - t0) / 1400); el.textContent = (n * (1 - Math.pow(1 - k, 3))).toFixed(d); if (k < 1) requestAnimationFrame(f); })(t0); };
  const io = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; const t = e.target; t.classList.add("in"); t.querySelectorAll("[data-w]").forEach(i => i.style.width = i.dataset.w + "%"); t.querySelectorAll("[data-n]").forEach(ct); io.unobserve(t); }), { threshold: .15 });
  $$(".rv,#price,.big-stats").forEach(el => io.observe(el));
  if (!RM) $$(".tilt").forEach(c => { c.addEventListener("pointermove", e => { const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; c.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(8px)`; }); c.addEventListener("pointerleave", () => c.style.transform = ""); });

  const cv = $(".hero-cv"); let gl = false;
  try { const c = document.createElement("canvas"); gl = !!(window.THREE && (c.getContext("webgl2") || c.getContext("webgl"))); } catch (e) {}
  if (!gl) { cv.remove(); return; }
  const r = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true }); r.setPixelRatio(Math.min(devicePixelRatio, 2));
  const sc = new THREE.Scene(), cam = new THREE.PerspectiveCamera(45, 1, .1, 100); cam.position.z = 10;
  sc.add(new THREE.AmbientLight(0x88aa99, .8)); const pl = new THREE.PointLight(0xc8f547, 3, 40); pl.position.set(4, 4, 6); sc.add(pl);
  const g = new THREE.Group(); sc.add(g);
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.1, 1), new THREE.MeshStandardMaterial({ color: 0x1c4436, emissive: 0xc8f547, emissiveIntensity: .8, flatShading: true }));
  const shell = new THREE.Mesh(new THREE.IcosahedronGeometry(1.6, 2), new THREE.MeshBasicMaterial({ color: 0xf3c13a, wireframe: true, transparent: true, opacity: .35 }));
  g.add(core, shell);
  const cols = [0xc05f2b, 0x4a7fbf, 0x9be5b9];
  const rivals = cols.map((c, i) => { const grp = new THREE.Group(); grp.rotation.set(1.0 + i * .3, i * 1.2, 0); const R = 3 + i * .7;
    grp.add(new THREE.Mesh(new THREE.TorusGeometry(R, .01, 8, 128), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: .45 })));
    const m = new THREE.Mesh(new THREE.SphereGeometry(.28, 24, 24), new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: .3 })); grp.add(m); g.add(grp); return { m, R, ph: i * 2 }; });
  const N = 400, pa = new Float32Array(N * 3); for (let i = 0; i < N * 3; i++) pa[i] = (Math.random() - .5) * 24;
  const pg = new THREE.BufferGeometry(); pg.setAttribute("position", new THREE.BufferAttribute(pa, 3)); sc.add(new THREE.Points(pg, new THREE.PointsMaterial({ size: .04, color: 0xdccb92, transparent: true, opacity: .6 })));
  let hi = 0; setHi = i => { hi = i; };
  const host = cv.parentElement, size = () => { r.setSize(host.clientWidth, host.clientHeight, false); cam.aspect = host.clientWidth / host.clientHeight; cam.updateProjectionMatrix(); g.position.x = innerWidth > 820 ? 3 : 0; }; size(); addEventListener("resize", size);
  let mx = 0, my = 0, t = 0, live = true; addEventListener("pointermove", e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; });
  new IntersectionObserver(es => live = es[0].isIntersecting).observe(cv);
  (function f() { requestAnimationFrame(f); if (!live || document.hidden) return; t += RM ? 0 : .012;
    core.rotation.y = t; shell.rotation.x = -t * .6; core.material.emissiveIntensity = .7 + Math.sin(t * 3) * .2;
    rivals.forEach((o, i) => { const a = t * (.8 - i * .15) + o.ph; o.m.position.set(Math.cos(a) * o.R, Math.sin(a) * o.R, 0); const k = i === hi ? 1.8 : 1; o.m.scale.lerp(new THREE.Vector3(k, k, k), .12); o.m.material.emissiveIntensity = i === hi ? 1 : .3; });
    g.rotation.y += (mx * .8 - g.rotation.y) * .05; g.rotation.x += (my * .4 + .1 - g.rotation.x) * .05; r.render(sc, cam); })();
})();
