
/* Comparison table: accessible filtering, scroll reveal and restrained desktop perspective. */
(() => {
  'use strict';
  const section = document.querySelector('#comparison');
  if (!section) return;
  const rows = [...section.querySelectorAll('tbody tr')];
  const modes = [...section.querySelectorAll('[data-comparison-mode]')];
  const count = section.querySelector('#comparison-count');
  const panel = section.querySelector('#comparison-panel');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function setMode(mode) {
    let visible = 0;
    rows.forEach(row => {
      const show = mode === 'all' || row.dataset.strength === 'true';
      row.hidden = !show;
      if (show) { visible++; row.classList.remove('comparison-row-in'); if (!reduced) { void row.offsetWidth; row.classList.add('comparison-row-in'); } }
    });
    modes.forEach(btn => { const active = btn.dataset.comparisonMode === mode; btn.classList.toggle('is-active', active); btn.setAttribute('aria-pressed', String(active)); });
    count.textContent = `${visible} preparation pillar${visible === 1 ? '' : 's'}`;
  }
  modes.forEach(btn => btn.addEventListener('click', () => setMode(btn.dataset.comparisonMode)));
  setMode('all');
  const reveals = section.querySelectorAll('.comparison-reveal');
  if ('IntersectionObserver' in window && !reduced) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), {threshold:.12,rootMargin:'0px 0px -35px 0px'});
    reveals.forEach(el => observer.observe(el));
  } else reveals.forEach(el => el.classList.add('is-visible'));
  if (panel && !reduced && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    let frame = 0;
    panel.addEventListener('pointermove', e => {
      const r = panel.getBoundingClientRect(); const x = (e.clientX-r.left)/r.width-.5; const y = (e.clientY-r.top)/r.height-.5;
      cancelAnimationFrame(frame); frame = requestAnimationFrame(() => { panel.style.transform = `perspective(1500px) rotateX(${(-y*1.15).toFixed(2)}deg) rotateY(${(x*1.45).toFixed(2)}deg) translateY(-2px)`; });
    }, {passive:true});
    panel.addEventListener('pointerleave', () => { cancelAnimationFrame(frame); panel.style.transform = ''; }, {passive:true});
  }
})();
