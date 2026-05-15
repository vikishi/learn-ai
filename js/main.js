/* ============================================================
   Developer Mastery Course Website — Main JavaScript
   ============================================================ */

/* ── Progress Tracking ──────────────────────────────────────── */
const PAGES = [
  'module-1', 'module-2', 'module-3', 'module-4', 'module-5',
  'module-6', 'module-7', 'module-8'
];

function getCurrentPage() {
  const el = document.querySelector('[data-page]');
  return el ? el.dataset.page : null;
}

function getVisited() {
  try { return JSON.parse(localStorage.getItem('dev-mastery-visited-pages') || '[]'); }
  catch { return []; }
}

function markVisited(page) {
  const visited = getVisited();
  if (!visited.includes(page)) {
    visited.push(page);
    localStorage.setItem('dev-mastery-visited-pages', JSON.stringify(visited));
  }
}

function updateProgress() {
  const visited = getVisited();
  // Only count pages that still exist in the course
  const validVisited = visited.filter(p => PAGES.includes(p));
  const pct = Math.round((validVisited.length / PAGES.length) * 100);

  const fill = document.querySelector('.sidebar-progress .progress-fill');
  const label = document.querySelector('.progress-label');

  if (fill)  fill.style.width = Math.min(pct, 100) + '%';
  if (label) label.textContent = validVisited.length + '/' + PAGES.length + ' complete';

  // Mark complete items in sidebar
  document.querySelectorAll('.nav-item[data-page]').forEach(el => {
    if (validVisited.includes(el.dataset.page)) {
      el.classList.add('complete');
    }
  });
}

/* ── Sidebar Active State ────────────────────────────────────── */
function setActiveNav() {
  const current = getCurrentPage();
  document.querySelectorAll('.nav-item[data-page]').forEach(el => {
    el.classList.toggle('active', el.dataset.page === current);
  });
}

/* ── Mobile Sidebar Toggle ───────────────────────────────────── */
function initMobileNav() {
  const toggle = document.querySelector('.sidebar-toggle');
  const layout = document.querySelector('.layout');
  const overlay = document.querySelector('.sidebar-overlay');

  if (!toggle || !layout) return;

  toggle.addEventListener('click', () => {
    layout.classList.toggle('sidebar-open');
  });

  overlay?.addEventListener('click', () => {
    layout.classList.remove('sidebar-open');
  });
}

/* ── Copy Code Buttons ───────────────────────────────────────── */
function initCopyButtons() {
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const code = btn.closest('.code-block')?.querySelector('pre > code');
      if (!code) return;

      try {
        await navigator.clipboard.writeText(code.textContent);
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy`;
          btn.classList.remove('copied');
        }, 2000);
      } catch {
        btn.textContent = 'Failed';
      }
    });
  });
}

/* ── Reading Progress Indicator ──────────────────────────────── */
function initReadingProgress() {
  const progressFill = document.querySelector('.reading-progress .progress-fill');
  if (!progressFill) return;

  window.addEventListener('scroll', () => {
    const el = document.documentElement;
    const scrolled = el.scrollTop;
    const total = el.scrollHeight - el.clientHeight;
    progressFill.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + '%';
  }, { passive: true });
}

/* ── Init ────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const page = getCurrentPage();

  // Mark current page visited
  if (page && PAGES.includes(page)) markVisited(page);

  setActiveNav();
  updateProgress();
  initMobileNav();
  initCopyButtons();
  initReadingProgress();
});
