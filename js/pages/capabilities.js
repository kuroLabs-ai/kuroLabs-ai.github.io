/**
 * Capabilities Hub Browser Logic (capabilities/index.html)
 * PRD Section 7.4, 9, 10, 11
 */

import { HubClient } from '../core/hub-client.js';
import { copyToClipboard } from '../components/toast.js';

let allCapabilities = [];
let currentFilter = {
  query: '',
  type: 'all',
  tag: 'all',
  sortBy: 'name-asc'
};

export async function initCapabilitiesPage() {
  bindControls();
  await loadCapabilities();

  // Check URL hash for direct capability inspection (e.g., #tool_json_inspector)
  if (window.location.hash) {
    const targetId = window.location.hash.replace('#', '');
    const found = allCapabilities.find(c => c.id === targetId || c.name === targetId);
    if (found) {
      openDetailModal(found);
    }
  }
}

function bindControls() {
  const searchInput = document.getElementById('hub-search');
  const typeFilter = document.getElementById('hub-type-filter');
  const sortSelect = document.getElementById('hub-sort-by');
  const retryBtn = document.getElementById('hub-retry-btn');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalBackdrop = document.getElementById('capability-modal');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentFilter.query = e.target.value;
      applyFilters();
    });
  }

  if (typeFilter) {
    typeFilter.addEventListener('change', (e) => {
      currentFilter.type = e.target.value;
      applyFilters();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentFilter.sortBy = e.target.value;
      applyFilters();
    });
  }

  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      HubClient.clearCache();
      loadCapabilities(true);
    });
  }

  if (modalCloseBtn && modalBackdrop) {
    modalCloseBtn.addEventListener('click', () => closeModal());
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

async function loadCapabilities(forceReload = false) {
  const cardsContainer = document.getElementById('hub-cards-container');
  const statusContainer = document.getElementById('hub-status-container');
  const sourceIndicator = document.getElementById('hub-source-indicator');
  const loadingIndicator = document.getElementById('hub-loading');

  if (loadingIndicator) loadingIndicator.classList.remove('hidden');
  if (statusContainer) statusContainer.classList.add('hidden');
  if (cardsContainer) cardsContainer.classList.add('hidden');

  try {
    const { items, source, error } = await HubClient.getCatalog(forceReload);

    if (loadingIndicator) loadingIndicator.classList.add('hidden');

    if (error && items.length === 0) {
      showError(error);
      return;
    }

    allCapabilities = items;

    if (sourceIndicator) {
      const isRemote = source === 'remote';
      sourceIndicator.innerHTML = `
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface border border-border text-xs font-mono">
          <span class="w-2 h-2 rounded-full ${isRemote ? 'bg-accent animate-pulse-subtle' : 'bg-warning'}"></span>
          <span>Source: ${isRemote ? 'Remote GitHub Registry' : 'Local Fallback'} (${items.length} items)</span>
        </span>
      `;
    }

    renderTagPills();
    applyFilters();

  } catch (err) {
    console.error('Failed to load Hub catalog:', err);
    if (loadingIndicator) loadingIndicator.classList.add('hidden');
    showError('Network error while connecting to Capability Hub repository.');
  }
}

function showError(msg) {
  const statusContainer = document.getElementById('hub-status-container');
  const cardsContainer = document.getElementById('hub-cards-container');
  const statusMessage = document.getElementById('hub-status-message');

  if (cardsContainer) cardsContainer.classList.add('hidden');
  if (statusContainer) {
    statusContainer.classList.remove('hidden');
    if (statusMessage) statusMessage.textContent = msg;
  }
}

function renderTagPills() {
  const tagContainer = document.getElementById('hub-tag-pills');
  if (!tagContainer) return;

  const tagCounts = {};
  allCapabilities.forEach(c => {
    (c.tags || []).forEach(t => {
      tagCounts[t] = (tagCounts[t] || 0) + 1;
    });
  });

  const sortedTags = Object.keys(tagCounts).sort();

  tagContainer.innerHTML = `
    <button class="tag-pill text-xs font-mono px-2.5 py-1 rounded-full border transition-colors ${currentFilter.tag === 'all' ? 'bg-accent text-black font-semibold border-accent' : 'bg-surface border-border text-muted hover:text-text'}" data-tag="all">
      All Tags
    </button>
  ` + sortedTags.map(tag => `
    <button class="tag-pill text-xs font-mono px-2.5 py-1 rounded-full border transition-colors ${currentFilter.tag === tag ? 'bg-accent text-black font-semibold border-accent' : 'bg-surface border-border text-muted hover:text-text'}" data-tag="${escapeHtml(tag)}">
      #${escapeHtml(tag)} (${tagCounts[tag]})
    </button>
  `).join('');

  tagContainer.querySelectorAll('.tag-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      currentFilter.tag = btn.getAttribute('data-tag');
      renderTagPills();
      applyFilters();
    });
  });
}

function applyFilters() {
  const filtered = HubClient.filterCapabilities(allCapabilities, {
    query: currentFilter.query,
    type: currentFilter.type,
    tag: currentFilter.tag
  });

  // Sort
  if (currentFilter.sortBy === 'name-asc') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (currentFilter.sortBy === 'name-desc') {
    filtered.sort((a, b) => b.name.localeCompare(a.name));
  } else if (currentFilter.sortBy === 'type') {
    filtered.sort((a, b) => a.item_type.localeCompare(b.item_type));
  }

  renderCards(filtered);
}

function renderCards(items) {
  const cardsContainer = document.getElementById('hub-cards-container');
  const countBadge = document.getElementById('hub-results-count');
  const emptyState = document.getElementById('hub-empty-state');
  const statusContainer = document.getElementById('hub-status-container');

  if (statusContainer) statusContainer.classList.add('hidden');
  if (!cardsContainer) return;

  if (countBadge) {
    countBadge.textContent = `${items.length} capability${items.length === 1 ? '' : 'ies'}`;
  }

  if (items.length === 0) {
    cardsContainer.classList.add('hidden');
    if (emptyState) {
      emptyState.classList.remove('hidden');
      const resetBtn = document.getElementById('hub-reset-filter-btn');
      if (resetBtn) {
        resetBtn.onclick = () => {
          currentFilter = { query: '', type: 'all', tag: 'all', sortBy: 'name-asc' };
          const searchInput = document.getElementById('hub-search');
          const typeFilter = document.getElementById('hub-type-filter');
          if (searchInput) searchInput.value = '';
          if (typeFilter) typeFilter.value = 'all';
          renderTagPills();
          applyFilters();
        };
      }
    }
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');
  cardsContainer.classList.remove('hidden');

  cardsContainer.innerHTML = items.map(item => {
    const badgeClass = `badge-${item.item_type}`;

    const tagsHtml = (item.tags || []).slice(0, 3).map(tag => `
      <span class="text-[10px] font-mono text-dim">#${escapeHtml(tag)}</span>
    `).join(' ');

    const sourceBtn = item.sourceUrl ? `
      <a href="${item.sourceUrl}" target="_blank" rel="noopener noreferrer" 
         class="text-dim hover:text-accent p-1 text-xs" title="Inspect source file on GitHub" onclick="event.stopPropagation();">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
        </svg>
      </a>
    ` : '';

    return `
      <div class="surface-card surface-card-interactive p-6 flex flex-col justify-between cursor-pointer group capability-item-card" data-id="${escapeHtml(item.id)}">
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="badge ${badgeClass} uppercase text-[11px] font-mono">${escapeHtml(item.item_type)}</span>
            <div class="flex items-center gap-2">
              <span class="text-xs font-mono text-muted">v${escapeHtml(item.version)}</span>
              ${sourceBtn}
            </div>
          </div>

          <div>
            <h3 class="font-mono text-lg font-bold text-text group-hover:text-accent transition-colors">
              ${escapeHtml(item.name)}
            </h3>
            <span class="text-xs font-mono text-dim block mt-0.5">by ${escapeHtml(item.author)}</span>
          </div>

          <p class="text-xs text-muted leading-relaxed line-clamp-3">
            ${escapeHtml(item.description)}
          </p>
        </div>

        <div class="pt-4 border-t border-border mt-4 flex items-center justify-between text-xs">
          <div class="flex items-center gap-1.5 overflow-hidden">
            ${tagsHtml}
          </div>
          <span class="text-accent font-mono text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Details →
          </span>
        </div>
      </div>
    `;
  }).join('');

  // Attach click events to open modal
  cardsContainer.querySelectorAll('.capability-item-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      const item = allCapabilities.find(c => c.id === id);
      if (item) openDetailModal(item);
    });
  });
}

function openDetailModal(item) {
  const modal = document.getElementById('capability-modal');
  if (!modal) return;

  document.getElementById('modal-title').textContent = item.name;
  document.getElementById('modal-type').textContent = item.item_type;
  document.getElementById('modal-type').className = `badge badge-${item.item_type} uppercase font-mono text-xs`;
  document.getElementById('modal-version').textContent = `v${item.version}`;
  document.getElementById('modal-author').textContent = `Author: ${item.author}`;
  document.getElementById('modal-description').textContent = item.description;

  // Tags
  const tagsContainer = document.getElementById('modal-tags');
  if (tagsContainer) {
    tagsContainer.innerHTML = (item.tags || []).map(t => `
      <span class="badge badge-tool text-xs">#${escapeHtml(t)}</span>
    `).join(' ');
  }

  // File Path & Source Link
  const pathSection = document.getElementById('modal-path-section');
  const pathText = document.getElementById('modal-file-path');
  const sourceLink = document.getElementById('modal-source-link');
  if (pathSection) {
    if (item.filePath && item.sourceUrl) {
      pathSection.classList.remove('hidden');
      pathText.textContent = item.filePath;
      sourceLink.href = item.sourceUrl;
    } else {
      pathSection.classList.add('hidden');
    }
  }

  // Store install command
  const installCmdEl = document.getElementById('modal-install-cmd');
  if (installCmdEl) {
    installCmdEl.textContent = item.installCommand;
  }

  const copyBtn = document.getElementById('modal-copy-cmd-btn');
  if (copyBtn) {
    copyBtn.onclick = () => {
      copyToClipboard(item.installCommand, `Copied: ${item.installCommand}`);
    };
  }

  // Raw URL install command (if file path exists)
  const urlCmdSection = document.getElementById('modal-url-cmd-section');
  const urlCmdEl = document.getElementById('modal-url-cmd');
  const copyUrlBtn = document.getElementById('modal-copy-url-cmd-btn');
  if (urlCmdSection && urlCmdEl) {
    if (item.filePath) {
      const rawUrl = `https://raw.githubusercontent.com/kurolabs-ai/hub/main/${item.filePath}`;
      const urlInstallCmd = `/store install ${rawUrl}`;
      urlCmdEl.textContent = urlInstallCmd;
      urlCmdSection.classList.remove('hidden');
      if (copyUrlBtn) {
        copyUrlBtn.onclick = () => {
          copyToClipboard(urlInstallCmd, `Copied URL install command!`);
        };
      }
    } else {
      urlCmdSection.classList.add('hidden');
    }
  }

  // Required Environment Variables (for Integrations)
  const envSection = document.getElementById('modal-env-section');
  const envList = document.getElementById('modal-env-list');
  if (envSection && envList) {
    const requiredEnv = item.payload && Array.isArray(item.payload.required_env) ? item.payload.required_env : [];
    if (requiredEnv.length > 0) {
      envSection.classList.remove('hidden');
      envList.innerHTML = requiredEnv.map(envVar => `
        <span class="px-2 py-1 rounded bg-[#0a120f] border border-accent/40 font-mono text-xs text-accent">
          ${escapeHtml(envVar)}
        </span>
      `).join('');
    } else {
      envSection.classList.add('hidden');
    }
  }

  // Payload inspector (safe formatted JSON)
  const payloadSection = document.getElementById('modal-payload-section');
  const payloadPre = document.getElementById('modal-payload-pre');
  if (payloadSection && payloadPre) {
    if (item.payload && Object.keys(item.payload).length > 0) {
      payloadSection.classList.remove('hidden');
      payloadPre.textContent = JSON.stringify(item.payload, null, 2);
    } else {
      payloadSection.classList.add('hidden');
    }
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('capability-modal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
