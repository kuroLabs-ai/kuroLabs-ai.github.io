/**
 * Programs Page Logic (programs/index.html)
 */

import { DataLoader } from '../core/data-loader.js';
import { getRelativePath } from '../core/config.js';

let allPrograms = [];

export async function initProgramsPage() {
  const container = document.getElementById('programs-list');
  const searchInput = document.getElementById('programs-search');
  const statusFilter = document.getElementById('programs-status-filter');

  try {
    allPrograms = await DataLoader.getPrograms();
    renderPrograms(allPrograms);

    if (searchInput) {
      searchInput.addEventListener('input', () => handleFilter());
    }

    if (statusFilter) {
      statusFilter.addEventListener('change', () => handleFilter());
    }

  } catch (err) {
    console.error('Failed to load programs:', err);
    if (container) {
      container.innerHTML = `
        <div class="col-span-full p-8 text-center text-danger border border-border rounded-lg bg-surface">
          Error loading programs data.
        </div>
      `;
    }
  }
}

function handleFilter() {
  const searchInput = document.getElementById('programs-search');
  const statusFilter = document.getElementById('programs-status-filter');

  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const status = statusFilter ? statusFilter.value : 'all';

  const filtered = allPrograms.filter(prog => {
    // Status filter
    if (status !== 'all' && prog.statusType !== status) {
      return false;
    }

    // Query filter
    if (query) {
      const matchName = prog.name.toLowerCase().includes(query);
      const matchDesc = prog.description.toLowerCase().includes(query);
      const matchTech = prog.technologies.some(t => t.toLowerCase().includes(query));
      if (!matchName && !matchDesc && !matchTech) {
        return false;
      }
    }

    return true;
  });

  renderPrograms(filtered);
}

function renderPrograms(programs) {
  const container = document.getElementById('programs-list');
  const countBadge = document.getElementById('programs-count');
  if (!container) return;

  if (countBadge) {
    countBadge.textContent = `${programs.length} program${programs.length === 1 ? '' : 's'}`;
  }

  if (programs.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center border border-border rounded-xl bg-surface">
        <p class="text-base text-muted mb-2">No programs match the specified criteria.</p>
        <button id="clear-program-filters" class="btn-outline text-xs font-mono">Reset filters</button>
      </div>
    `;

    const resetBtn = document.getElementById('clear-program-filters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        const searchInput = document.getElementById('programs-search');
        const statusFilter = document.getElementById('programs-status-filter');
        if (searchInput) searchInput.value = '';
        if (statusFilter) statusFilter.value = 'all';
        renderPrograms(allPrograms);
      });
    }
    return;
  }

  container.innerHTML = programs.map(prog => {
    let statusBadge = '';
    if (prog.statusType === 'available') {
      statusBadge = `<span class="badge badge-status-available text-[11px]">${prog.status}</span>`;
    } else if (prog.statusType === 'in-development') {
      statusBadge = `<span class="badge badge-status-dev text-[11px]">${prog.status}</span>`;
    } else {
      statusBadge = `<span class="badge badge-status-planned text-[11px]">${prog.status}</span>`;
    }

    const techBadges = prog.technologies.map(t => `
      <span class="text-[11px] font-mono px-2 py-0.5 rounded bg-bg border border-border text-dim">
        ${escapeHtml(t)}
      </span>
    `).join('');

    const highlightsList = (prog.highlights || []).map(h => `
      <li class="flex items-start gap-2 text-xs text-muted">
        <span class="text-accent font-bold">›</span>
        <span>${escapeHtml(h)}</span>
      </li>
    `).join('');

    const detailLink = prog.detailUrl 
      ? `<a href="${getRelativePath(prog.detailUrl)}" class="btn-primary text-xs">Product Details →</a>`
      : '';

    const repoLink = prog.repository 
      ? `<a href="${prog.repository}" target="_blank" rel="noopener noreferrer" class="btn-secondary text-xs">Repository ↗</a>`
      : '';

    const docsLink = prog.documentation
      ? `<a href="${getRelativePath(prog.documentation)}" class="btn-outline text-xs">Docs</a>`
      : '';

    return `
      <div class="surface-card p-8 flex flex-col justify-between group">
        <div class="space-y-6">
          
          <!-- Card Header -->
          <div class="flex items-start justify-between gap-4">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <span class="text-xs font-mono text-accent uppercase tracking-wider">${escapeHtml(prog.category)}</span>
              </div>
              <h3 class="text-2xl font-bold text-text group-hover:text-accent transition-colors">
                ${escapeHtml(prog.name)}
              </h3>
            </div>
            <div>
              ${statusBadge}
            </div>
          </div>

          <!-- Description -->
          <p class="text-sm text-muted leading-relaxed">
            ${escapeHtml(prog.description)}
          </p>

          <!-- Highlights -->
          ${highlightsList ? `
            <ul class="space-y-1.5 pt-2 border-t border-border/60">
              ${highlightsList}
            </ul>
          ` : ''}

          <!-- Tech stack tags -->
          <div class="flex flex-wrap gap-1.5 pt-2">
            ${techBadges}
          </div>

        </div>

        <!-- Card Actions -->
        <div class="pt-8 border-t border-border mt-8 flex flex-wrap items-center gap-3">
          ${detailLink}
          ${repoLink}
          ${docsLink}
        </div>

      </div>
    `;
  }).join('');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
