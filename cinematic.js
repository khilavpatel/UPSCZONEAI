/* UPSC ZONE AI — cinematic.js: real WebGL (Three.js) chakra core, scroll-driven story, reveals. */
(() => {
  "use strict";
  const RM = matchMedia("(prefers-reduced-motion:reduce)").matches;
  const root = document.documentElement;
  root.classList.add("cine-on");
  document.querySelectorAll(".hero-copy>*,.hero-side>*").forEach((el, i) => el.style.setProperty("--i", i));
  requestAnimationFrame(() => setTimeout(() => document.body.classList.add("cine-ready"), 60));

  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
  document.querySelectorAll(".pillars .wrap>*,.demo-section .wrap>*,.features .wrap>*,.compare .wrap>*,.cta-band .wrap>*").forEach(el => { el.classList.add("rv"); io.observe(el); });

  const S = ["Polity","History","Geography","Economy","Environment","Science & Tech","Ethics","International Relations","Society","Internal Security","Essay","CSAT"];
  const st = document.getElementById("subj-track");
  if (st) st.innerHTML = [...S, ...S].map(s => `<span>${s}</span>`).join("");

  const STEPS = [
    ["Learn", "Every concept explained at three depth levels, from quick revision to full Mains depth.", 0xc8f547],
    ["Practice", "Mock tests and previous-year questions, generated around what you still miss.", 0xf3c13a],
    ["Analyze", "Your results show which subjects and sub-topics lose you marks.", 0x9be5b9],
    ["Revise", "Revision arrives at the moment you are about to forget.", 0x4a7fbf],
    ["Focus", "Lock-In Mode keeps you on the plan until the day’s work is done.", 0xc05f2b],
  ];
  let hasGL = false;
  try { const c = document.createElement("canvas"); hasGL = !!(window.THREE && (c.getContext("webgl2") || c.getContext("webgl"))); } catch (e) {}
  const hs = document.getElementById("story-cv"), hh = document.querySelector(".hero-cv");
  if (!hasGL) { [hs, hh].forEach(c => c && c.remove()); return; }

  function scene(canvas, host) {
    const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    r.setPixelRatio(Math.min(devicePixelRatio, 2));
    const sc = new THREE.Scene(), cam = new THREE.PerspectiveCamera(45, 1, .1, 100); cam.position.z = 9;
    sc.add(new THREE.AmbientLight(0x88aa99, .8));
    const pl = new THREE.PointLight(0xc8f547, 3, 40); pl.position.set(4, 4, 6); sc.add(pl);
    const g = new THREE.Group(); sc.add(g);
    const gold = new THREE.MeshStandardMaterial({ color: 0xf3c13a, emissive: 0x4a3300, metalness: .85, roughness: .3 });
    const wheel = new THREE.Group();
    wheel.add(new THREE.Mesh(new THREE.TorusGeometry(2, .07, 16, 96), gold));
    for (let i = 0; i < 24; i++) { const geo = new THREE.BoxGeometry(.03, 2, .03); geo.translate(0, 1, 0); const s = new THREE.Mesh(geo, gold); s.rotation.z = i / 24 * Math.PI * 2; wheel.add(s); }
    const hub = new THREE.Mesh(new THREE.SphereGeometry(.34, 24, 24), new THREE.MeshStandardMaterial({ color: 0x1c4436, emissive: 0xc8f547, emissiveIntensity: .9 }));
    wheel.add(hub); g.add(wheel);
    const orbit = new THREE.Group(); orbit.rotation.x = 1.15; g.add(orbit);
    orbit.add(new THREE.Mesh(new THREE.TorusGeometry(3.4, .012, 8, 128), new THREE.MeshBasicMaterial({ color: 0x9be5b9, transparent: true, opacity: .5 })));
    const nodes = STEPS.map((s, i) => { const m = new THREE.Mesh(new THREE.SphereGeometry(.16, 20, 20), new THREE.MeshStandardMaterial({ color: s[2], emissive: s[2], emissiveIntensity: .6 })); orbit.add(m); return m; });
    const N = 350, pa = new Float32Array(N * 3); for (let i = 0; i < N * 3; i++) pa[i] = (Math.random() - .5) * 22;
    const pg = new THREE.BufferGeometry(); pg.setAttribute("position", new THREE.BufferAttribute(pa, 3));
    const pts = new THREE.Points(pg, new THREE.PointsMaterial({ size: .04, color: 0xdccb92, transparent: true, opacity: .6 })); sc.add(pts);
    const size = () => { const w = host.clientWidth, h = host.clientHeight; r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); };
    size(); addEventListener("resize", size);
    return { r, sc, cam, g, wheel, nodes, pts, size, live: true };
  }
  const place = (o, t, active, p) => o.nodes.forEach((n, i) => { const a = t * .5 + i / 5 * Math.PI * 2; n.position.set(Math.cos(a) * 3.4, Math.sin(a) * 3.4, 0); const k = i === active ? 1.9 : 1; n.scale.lerp(new THREE.Vector3(k, k, k), .12); });

  let mx = 0, my = 0; addEventListener("pointermove", e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; });
  const H = hh && scene(hh, hh.parentElement), T = hs && scene(hs, hs.parentElement);
  [H, T].forEach(o => { if (!o) return; new IntersectionObserver(es => { o.live = es[0].isIntersecting; }).observe(o.r.domElement); });
  if (H) H.g.position.x = innerWidth > 820 ? 2.4 : 0;

  const track = document.querySelector(".story-track"), h2 = document.getElementById("st-h"), pp = document.getElementById("st-p"), dots = [...document.querySelectorAll(".story-dots li")];
  let cur = -1, tt = 0;
  function setStep(i) {
    if (i === cur) return; cur = i;
    [h2, pp].forEach(e => e.classList.add("swap"));
    setTimeout(() => { h2.textContent = STEPS[i][0]; pp.textContent = STEPS[i][1]; [h2, pp].forEach(e => e.classList.remove("swap")); }, RM ? 0 : 200);
    dots.forEach((d, j) => d.classList.toggle("on", j <= i));
  }
  let sp = 0;
  function frame() {
    requestAnimationFrame(frame); if (document.hidden) return; tt += RM ? 0 : .012;
    if (H && H.live) {
      H.wheel.rotation.z = tt * .4; H.g.rotation.y = mx * .6; H.g.rotation.x = my * .3 + .15; place(H, tt, -1); H.r.render(H.sc, H.cam);
    }
    if (T && T.live && track) {
      const b = track.getBoundingClientRect(), p = Math.min(1, Math.max(0, -b.top / (b.height - innerHeight))); sp += (p - sp) * .1;
      const a = Math.min(4, Math.floor(p * 5)); setStep(a);
      T.wheel.rotation.z = sp * Math.PI * 4; T.g.rotation.y = Math.sin(sp * 6) * .5 + mx * .4; T.g.rotation.x = .2 + my * .3;
      T.cam.position.z = 10 - sp * 3.2; place(T, sp * 14 + tt, a); T.pts.rotation.y = sp * 2;
      T.r.render(T.sc, T.cam);
    }
  }
  setStep(0); frame();
})();
