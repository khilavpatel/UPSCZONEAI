/* 3D coverflow slider built from the existing #feature-grid cards (links and click behaviour are kept). */
(() => {
  "use strict";
  function init() {
    const grid = document.getElementById("feature-grid"), sec = document.getElementById("features");
    if (!grid || !sec) return;
    const cards = [...grid.querySelectorAll(".feature-card")], n = cards.length;
    if (n < 3) return;
    const RM = matchMedia("(prefers-reduced-motion:reduce)").matches;
    sec.classList.add("slider-on");
    const stage = document.createElement("div"); stage.className = "s3d"; stage.tabIndex = 0;
    stage.setAttribute("role", "region"); stage.setAttribute("aria-roledescription", "carousel"); stage.setAttribute("aria-label", "The AI systems. Use the arrow keys to move.");
    const track = document.createElement("div"); track.className = "s3d-track"; stage.appendChild(track);
    cards.forEach(c => { c.classList.add("s3d-card"); track.appendChild(c); });
    const ctl = document.createElement("div"); ctl.className = "s3d-ctl";
    ctl.innerHTML = '<button type="button" id="s3d-prev" aria-label="Previous system">←</button><div class="bar" aria-hidden="true"><i></i></div><output id="s3d-count" aria-live="off"></output><button type="button" id="s3d-play" aria-label="Pause autoplay">❚❚</button><button type="button" id="s3d-next" aria-label="Next system">→</button>';
    grid.hidden = true; grid.after(stage, ctl);
    const bar = ctl.querySelector(".bar i"), count = ctl.querySelector("output"), play = ctl.querySelector("#s3d-play");
    let a = 0, timer = null, hold = false, userPaused = RM, dragged = false;
    const gapOf = () => (cards[0].offsetWidth || 280) * (innerWidth < 820 ? .5 : .62);
    function layout() {
      const gap = gapOf();
      cards.forEach((c, i) => {
        let d = i - a; if (d > n / 2) d -= n; if (d < -n / 2) d += n;
        const ad = Math.abs(d), hide = ad > 3;
        c.style.transform = `translate(-50%,-50%) translateX(${d * gap}px) translateZ(${ad === 0 ? 70 : -ad * 140}px) rotateY(${-d * 34}deg) scale(${ad === 0 ? 1 : .92})`;
        c.style.opacity = hide ? 0 : 1 - ad * .2; c.style.zIndex = 100 - ad * 10; c.style.visibility = hide ? "hidden" : "visible";
        c.classList.toggle("on", ad === 0); c.tabIndex = ad === 0 ? 0 : -1; c.setAttribute("aria-hidden", hide ? "true" : "false");
      });
      count.textContent = `${a + 1} / ${n}`; bar.style.width = ((a + 1) / n * 100) + "%";
    }
    const go = k => { a = (a + k + n) % n; layout(); };
    function tick() { clearInterval(timer); if (!userPaused && !hold) timer = setInterval(() => go(1), 4500); }
    ctl.querySelector("#s3d-prev").onclick = () => { go(-1); tick(); };
    ctl.querySelector("#s3d-next").onclick = () => { go(1); tick(); };
    play.onclick = () => { userPaused = !userPaused; play.textContent = userPaused ? "▶" : "❚❚"; play.setAttribute("aria-label", userPaused ? "Start autoplay" : "Pause autoplay"); tick(); };
    if (userPaused) { play.textContent = "▶"; play.setAttribute("aria-label", "Start autoplay"); }
    stage.addEventListener("keydown", e => { if (e.key === "ArrowRight") { go(1); tick(); e.preventDefault(); } else if (e.key === "ArrowLeft") { go(-1); tick(); e.preventDefault(); } });
    [stage, ctl].forEach(el => { el.addEventListener("pointerenter", () => { hold = true; tick(); }); el.addEventListener("pointerleave", () => { hold = false; tick(); }); el.addEventListener("focusin", () => { hold = true; tick(); }); el.addEventListener("focusout", () => { hold = false; tick(); }); });
    let sx = null;
    stage.addEventListener("pointerdown", e => { sx = e.clientX; dragged = false; });
    stage.addEventListener("pointerup", e => { if (sx === null) return; const dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 45) { dragged = true; go(dx < 0 ? 1 : -1); tick(); } });
    stage.addEventListener("click", e => {
      const c = e.target.closest(".s3d-card"); if (!c) return;
      if (dragged) { dragged = false; e.stopImmediatePropagation(); e.preventDefault(); return; }
      if (!c.classList.contains("on")) { e.stopImmediatePropagation(); e.preventDefault(); a = cards.indexOf(c); layout(); tick(); }
    }, true);
    if (!RM) stage.addEventListener("pointermove", e => { const r = stage.getBoundingClientRect(); track.style.transform = `rotateY(${((e.clientX - r.left) / r.width - .5) * 8}deg) rotateX(${-((e.clientY - r.top) / r.height - .5) * 5}deg)`; });
    stage.addEventListener("pointerleave", () => track.style.transform = "");
    addEventListener("resize", layout);
    layout(); tick();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
