import { fetchRegistry, filterRegistry, getRegistryStats } from './registry.js';

let allItems = [];
let activeType = 'all';
let currentSearch = '';
let currentSort = 'name_asc';

document.addEventListener('DOMContentLoaded', () => {
  initHub();
});

async function initHub() {
  const container = document.getElementById('hub-cards-container');
  const loadingEl = document.getElementById('hub-loading');
  const errorEl = document.getElementById('hub-error');
  const emptyEl = document.getElementById('hub-empty');
  const fallbackBanner = document.getElementById('hub-fallback-banner');
  const searchInput = document.getElementById('hub-search');
  const sortSelect = document.getElementById('hub-sort');
  const clearFiltersBtn = document.getElementById('hub-clear-filters');
  const retryBtn = document.getElementById('hub-retry-btn');

  const render = () => {
    const filtered = filterRegistry(allItems, {
      search: currentSearch,
      types: activeType === 'all' ? [] : [activeType],
      sortBy: currentSort
    });

    // Update count labels
    const matchCountEl = document.getElementById('hub-match-count');
    if (matchCountEl) {
      matchCountEl.textContent = `${filtered.length} ${filtered.length === 1 ? 'capability' : 'capabilities'}`;
    }

    if (filtered.length === 0) {
      container.classList.add('hidden');
      emptyEl.classList.remove('hidden');
    } else {
      emptyEl.classList.add('hidden');
      container.classList.remove('hidden');
      renderCards(filtered, container);
    }
  };

  const loadData = async () => {
    loadingEl.classList.remove('hidden');
    errorEl.classList.add('hidden');
    emptyEl.classList.add('hidden');
    container.classList.add('hidden');
    if (fallbackBanner) fallbackBanner.classList.add('hidden');

    const result = await fetchRegistry();
    loadingEl.classList.add('hidden');

    if (!result.success) {
      errorEl.classList.remove('hidden');
      const errorMsg = document.getElementById('hub-error-msg');
      if (errorMsg) errorMsg.textContent = result.error || 'Failed to fetch capability registry.';
      return;
    }

    allItems = result.items;

    // Show fallback banner if using local offline snapshot
    if (result.isFallback && fallbackBanner) {
      fallbackBanner.classList.remove('hidden');
      const fallbackNote = document.getElementById('hub-fallback-note');
      if (fallbackNote && result.error) fallbackNote.textContent = result.error;
    }

    // Update Summary Counters
    const stats = getRegistryStats(allItems);
    updateCounter('stat-total', stats.total);
    updateCounter('stat-tools', stats.tool);
    updateCounter('stat-plugins', stats.plugin);
    updateCounter('stat-skills', stats.skill);
    updateCounter('stat-integrations', stats.integration);

    render();
  };

  // Event Listeners
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value;
      render();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      render();
    });
  }

  // Type filter buttons
  document.querySelectorAll('[data-filter-type]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-filter-type]').forEach(b => {
        b.classList.remove('bg-accent', 'text-bg', 'border-accent');
        b.classList.add('bg-surface-elevated', 'text-secondary', 'border-border');
      });
      btn.classList.add('bg-accent', 'text-bg', 'border-accent');
      btn.classList.remove('bg-surface-elevated', 'text-secondary', 'border-border');

      activeType = btn.getAttribute('data-filter-type');
      render();
    });
  });

  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      currentSearch = '';
      activeType = 'all';
      document.querySelectorAll('[data-filter-type]').forEach(b => {
        if (b.getAttribute('data-filter-type') === 'all') {
          b.classList.add('bg-accent', 'text-bg', 'border-accent');
          b.classList.remove('bg-surface-elevated', 'text-secondary', 'border-border');
        } else {
          b.classList.remove('bg-accent', 'text-bg', 'border-accent');
          b.classList.add('bg-surface-elevated', 'text-secondary', 'border-border');
        }
      });
      render();
    });
  }

  if (retryBtn) {
    retryBtn.addEventListener('click', () => loadData());
  }

  loadData();
}

function updateCounter(elementId, count) {
  const el = document.getElementById(elementId);
  if (el) el.textContent = String(count || 0);
}

function getTypeColor(type) {
  switch (type) {
    case 'tool':
      return { bg: 'rgba(56, 189, 248, 0.1)', text: '#38BDF8', border: 'rgba(56, 189, 248, 0.3)' };
    case 'plugin':
      return { bg: 'rgba(168, 85, 247, 0.1)', text: '#A855F7', border: 'rgba(168, 85, 247, 0.3)' };
    case 'skill':
      return { bg: 'rgba(182, 243, 107, 0.1)', text: '#B6F36B', border: 'rgba(182, 243, 107, 0.3)' };
    case 'integration':
      return { bg: 'rgba(251, 146, 60, 0.1)', text: '#FB923C', border: 'rgba(251, 146, 60, 0.3)' };
    default:
      return { bg: 'rgba(156, 163, 175, 0.1)', text: '#9CA3AF', border: 'rgba(156, 163, 175, 0.3)' };
  }
}

function renderCards(items, container) {
  container.innerHTML = '';

  items.forEach(item => {
    const card = document.createElement('article');
    card.className = 'card-tech rounded-lg p-5 flex flex-col justify-between hover:border-border-light transition-all duration-200 group relative';

    const topSection = document.createElement('div');

    // Header row: Type badge & Version
    const headerRow = document.createElement('div');
    headerRow.className = 'flex items-center justify-between mb-3';

    const typeBadge = document.createElement('span');
    const colors = getTypeColor(item.item_type);
    typeBadge.className = 'px-2 py-0.5 text-xs font-mono rounded font-medium tracking-wide uppercase';
    typeBadge.style.backgroundColor = colors.bg;
    typeBadge.style.color = colors.text;
    typeBadge.style.border = `1px solid ${colors.border}`;
    typeBadge.textContent = item.item_type;

    const versionBadge = document.createElement('span');
    versionBadge.className = 'text-xs font-mono text-muted';
    versionBadge.textContent = `v${item.version}`;

    headerRow.appendChild(typeBadge);
    headerRow.appendChild(versionBadge);
    topSection.appendChild(headerRow);

    // Title
    const title = document.createElement('h3');
    title.className = 'text-base font-semibold text-primary mb-2 font-mono group-hover:text-accent transition-colors';
    title.textContent = item.name;
    topSection.appendChild(title);

    // Description
    const desc = document.createElement('p');
    desc.className = 'text-sm text-secondary line-clamp-3 mb-4 leading-relaxed';
    desc.textContent = item.description;
    topSection.appendChild(desc);

    card.appendChild(topSection);

    // Bottom section: Tags and Link
    const bottomSection = document.createElement('div');
    bottomSection.className = 'pt-3 border-t border-border/50 mt-2';

    // Tags list
    if (item.tags && item.tags.length > 0) {
      const tagsContainer = document.createElement('div');
      tagsContainer.className = 'flex flex-wrap gap-1.5 mb-3';
      item.tags.slice(0, 4).forEach(tag => {
        const tagEl = document.createElement('span');
        tagEl.className = 'text-[11px] font-mono px-1.5 py-0.5 rounded bg-surface-elevated text-secondary border border-border/60';
        tagEl.textContent = tag;
        tagsContainer.appendChild(tagEl);
      });
      if (item.tags.length > 4) {
        const moreTag = document.createElement('span');
        moreTag.className = 'text-[11px] font-mono px-1.5 py-0.5 rounded bg-surface-elevated text-muted';
        moreTag.textContent = `+${item.tags.length - 4}`;
        tagsContainer.appendChild(moreTag);
      }
      bottomSection.appendChild(tagsContainer);
    }

    // Action button
    const linkRow = document.createElement('div');
    linkRow.className = 'flex items-center justify-between text-xs font-mono';

    const authorText = document.createElement('span');
    authorText.className = 'text-muted';
    authorText.textContent = `by ${item.author}`;

    const viewLink = document.createElement('a');
    viewLink.href = `item.html?id=${encodeURIComponent(item.id)}`;
    viewLink.className = 'text-accent hover:underline flex items-center gap-1 font-medium';
    viewLink.innerHTML = `<span>View Details</span> <svg class="w-3.5 h-3.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>`;

    linkRow.appendChild(authorText);
    linkRow.appendChild(viewLink);
    bottomSection.appendChild(linkRow);

    card.appendChild(bottomSection);
    container.appendChild(card);
  });
}
