/* ========================================
   Timeless Repaints - Gallery App
   ======================================== */

const SIM_LABELS = {
  msfs: 'Microsoft Flight Simulator 2024',
  xplane: 'X-Plane 12'
};

let liveries = [];
let currentFilter = 'all';
let currentSort = 'newest';

// DOM Elements
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');
const modal = document.getElementById('liveryModal');
const modalClose = document.getElementById('modalClose');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const toast = document.getElementById('toast');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupMobileMenu();
  setupModal();
  loadLiveries();
});

// ================== Navigation ==================
function setupNavigation() {
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Allow normal navigation to admin.html
      if (link.getAttribute('href') && link.getAttribute('href') !== '#') return;

      e.preventDefault();
      const page = link.dataset.page;
      showPage(page);
      window.scrollTo(0, 0);
    });
  });
}

function showPage(pageId) {
  navLinks.forEach(l => l.classList.remove('active'));
  const activeLink = document.querySelector(`[data-page="${pageId}"]`);
  if (activeLink) activeLink.classList.add('active');

  pages.forEach(p => p.classList.remove('active'));
  const page = document.getElementById(`page-${pageId}`);
  if (page) page.classList.add('active');

  if (pageId === 'gallery') {
    renderGallery();
  } else if (pageId === 'home') {
    renderFeatured();
    updateCategoryCounts();
  }
}

function setupMobileMenu() {
  const toggle = document.getElementById('navToggle');
  const menu = document.querySelector('.nav-links');
  if (toggle && menu) {
    toggle.addEventListener('click', () => menu.classList.toggle('active'));
  }
}

// ================== API (fetch local JSON) ==================
async function loadLiveries() {
  try {
    const res = await fetch('public/liveries.json');
    if (!res.ok) throw new Error('Failed to load liveries');
    liveries = await res.json();
    renderFeatured();
    updateCategoryCounts();
    renderGallery();
  } catch (err) {
    console.error('Failed to load liveries:', err);
    showToast('Failed to load liveries', 'error');
  }
}

// ================== Home Page ==================
function updateCategoryCounts() {
  const msfsCount = liveries.filter(l => l.simulator === 'msfs').length;
  const xplaneCount = liveries.filter(l => l.simulator === 'xplane').length;
  const msfsEl = document.getElementById('count-msfs');
  const xplaneEl = document.getElementById('count-xplane');
  if (msfsEl) msfsEl.textContent = `${msfsCount} liver${msfsCount === 1 ? 'y' : 'ies'}`;
  if (xplaneEl) xplaneEl.textContent = `${xplaneCount} liver${xplaneCount === 1 ? 'y' : 'ies'}`;
}

function renderFeatured() {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;

  const featured = liveries.slice(0, 6);
  if (featured.length === 0) {
    grid.innerHTML = '<p style="color: var(--text-dim); text-align: center; grid-column: 1/-1;">No liveries yet.</p>';
    return;
  }

  grid.innerHTML = featured.map(livery => createLiveryCard(livery)).join('');

  grid.querySelectorAll('.livery-card').forEach(card => {
    card.addEventListener('click', () => openLiveryModal(card.dataset.id));
  });
}

// ================== Gallery ==================
function renderGallery() {
  const grid = document.getElementById('galleryGrid');
  const empty = document.getElementById('galleryEmpty');
  const filterSelect = document.getElementById('filterSim');
  const sortSelect = document.getElementById('sortGallery');

  if (!grid) return;

  if (filterSelect && !filterSelect.dataset.listener) {
    filterSelect.dataset.listener = 'true';
    filterSelect.addEventListener('change', (e) => { currentFilter = e.target.value; renderGallery(); });
  }
  if (sortSelect && !sortSelect.dataset.listener) {
    sortSelect.dataset.listener = 'true';
    sortSelect.addEventListener('change', (e) => { currentSort = e.target.value; renderGallery(); });
  }

  let filtered = [...liveries];

  if (currentFilter !== 'all') {
    filtered = filtered.filter(l => l.simulator === currentFilter);
  }

  if (currentSort === 'newest') {
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (currentSort === 'oldest') {
    filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } else if (currentSort === 'downloads') {
    filtered.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
  }

  if (filtered.length === 0) {
    grid.innerHTML = '';
    if (empty) empty.style.display = 'block';
    return;
  }

  if (empty) empty.style.display = 'none';
  grid.innerHTML = filtered.map(livery => createLiveryCard(livery)).join('');

  grid.querySelectorAll('.livery-card').forEach(card => {
    card.addEventListener('click', () => openLiveryModal(card.dataset.id));
  });
}

function createLiveryCard(livery) {
  const simKey = livery.simulator || 'msfs';
  const simClass = simKey === 'msfs' ? 'msfs' : 'xplane';
  const simLabel = SIM_LABELS[simKey] || simKey;
  const thumbnail = livery.thumbnail ? `public/${livery.thumbnail}` : null;
  const downloads = livery.downloads || 0;

  return `
    <article class="livery-card" data-id="${livery.id}">
      <div class="livery-card-image">
        ${thumbnail
          ? `<img src="${thumbnail}" alt="${escapeHtml(livery.title)}" onerror="this.style.display='none'; this.parentElement.querySelector('.livery-card-no-thumb').style.display='flex';">`
          : ''
        }
        <div class="livery-card-no-thumb" style="${thumbnail ? 'display:none' : ''}">&#128712;</div>
        <span class="livery-card-sim ${simClass}">${simLabel}</span>
      </div>
      <div class="livery-card-content">
        <h3>${escapeHtml(livery.title)}</h3>
        <p>${escapeHtml(livery.aircraft || '')}</p>
      </div>
      <div class="livery-card-meta">
        <span>v${escapeHtml(livery.version || '1.0')}</span>
        <span>⬇ ${downloads}</span>
      </div>
    </article>
  `;
}

// ================== Livery Modal ==================
function setupModal() {
  modalClose.addEventListener('click', closeModal);
  modalCloseBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
}

function openLiveryModal(id) {
  const livery = liveries.find(l => l.id === id);
  if (!livery) return;

  document.getElementById('modalTitle').textContent = escapeHtml(livery.title);
  document.getElementById('modalAircraft').textContent = escapeHtml(livery.aircraft || 'N/A');
  document.getElementById('modalVersion').textContent = escapeHtml(livery.version || '1.0');
  document.getElementById('modalAuthor').textContent = escapeHtml(livery.author || 'Timeless Repaints');
  document.getElementById('modalDownloads').textContent = livery.downloads || 0;
  document.getElementById('modalDescription').textContent = escapeHtml(livery.description || 'No description provided.');

  const simKey = livery.simulator || 'msfs';
  const simBadge = document.getElementById('modalSimBadge');
  simBadge.textContent = SIM_LABELS[simKey] || simKey;
  simBadge.className = `sim-badge-inline ${simKey === 'msfs' ? 'msfs' : 'xplane'}`;

  const modalImage = document.getElementById('modalImage');
  if (livery.thumbnail) {
    modalImage.src = `public/${livery.thumbnail}`;
    modalImage.style.display = 'block';
  } else {
    modalImage.style.display = 'none';
  }

  const downloadBtn = document.getElementById('modalDownload');
  downloadBtn.href = `public/${livery.filename}`;
  downloadBtn.onclick = (e) => { /* download handled natively */ };

  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('show');
  document.body.style.overflow = '';
}

// ================== Helpers ==================
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showToast(message, type = 'success') {
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  setTimeout(() => { toast.classList.remove('show'); }, 4000);
}
