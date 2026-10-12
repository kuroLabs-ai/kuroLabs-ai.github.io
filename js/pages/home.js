/**
 * Homepage Logic (index.html)
 */

import { HubClient } from '../core/hub-client.js';
import { DataLoader } from '../core/data-loader.js';
import { copyToClipboard } from '../components/toast.js';
import { getRelativePath } from '../core/config.js';

export async function initHomePage() {
  // Bind copy buttons for terminal code snippets
  document.querySelectorAll('[data-copy-text]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const text = btn.getAttribute('data-copy-text');
      if (text) {
        copyToClipboard(text, 'Command copied!');
      }
    });
  });

  // Load featured capabilities from the live Hub
  loadHubPreview();

  // Load roadmap milestones
  loadRoadmapPreview();
}

async function loadHubPreview() {
  const container = document.getElementById('hub-preview-cards');
  if (!container) return;

  try {
    const { items, source, error } = await HubClient.getCatalog();
    
    // Update live badge in hero / header
    const hubStatusBadge = document.getElementById('hub-live-status');
    if (hubStatusBadge) {
      if (error && items.length === 0) {
        hubStatusBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-danger"></span> Hub Offline`;
      } else {
        const sourceText = source === 'remote' ? 'Live Hub' : 'Fallback Hub';
        hubStatusBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-accent animate-pulse-subtle"></span> ${sourceText} (${items.length} capabilities)`;
      }
    }

    if (items.length === 0) {
      container.innerHTML = `
        <div class="col-span-full p-6 text-center text-muted border border-border rounded-lg bg-surface">
          No capabilities available at the moment.
        </div>
      `;
      return;
    }

    // Select 4 diverse capabilities to highlight
    const sampleItems = items.slice(0, 4);
    const capabilitiesPageUrl = getRelativePath('capabilities/index.html');

    container.innerHTML = sampleItems.map(item => {
      const typeBadgeClass = `badge-${item.item_type}`;

      return `
        <div class="surface-card surface-card-interactive p-6 flex flex-col justify-between group">
          <div>
            <div class="flex items-center justify-between gap-2 mb-3">
              <span class="badge ${typeBadgeClass} uppercase text-[11px] font-mono">${item.item_type}</span>
              <span class="text-xs font-mono text-muted">v${item.version}</span>
            </div>
            <h3 class="font-mono text-base font-bold text-text group-hover:text-accent transition-colors mb-2">
              ${escapeHtml(item.name)}
            </h3>
            <p class="text-xs text-muted leading-relaxed line-clamp-2 mb-4">
              ${escapeHtml(item.description)}
            </p>
          </div>
          <div class="pt-3 border-t border-border flex items-center justify-between text-xs">
            <span class="font-mono text-dim text-[11px]">${item.tags.slice(0, 2).map(t => `#${t}`).join(' ')}</span>
            <a href="${capabilitiesPageUrl}#${item.id}" class="text-accent hover:underline text-xs font-mono flex items-center gap-1">
              Inspect →
            </a>
          </div>
        </div>
      `;
    }).join('');

  } catch (err) {
    console.error('Failed to load hub preview:', err);
    container.innerHTML = `
      <div class="col-span-full p-6 text-center text-danger border border-border rounded-lg bg-surface">
        Unable to load live capabilities preview.
      </div>
    `;
  }
}

async function loadRoadmapPreview() {
  const container = document.getElementById('roadmap-preview-list');
  if (!container) return;

  try {
    const roadmap = await DataLoader.getRoadmap();
    if (roadmap.length === 0) {
      container.innerHTML = `<p class="text-muted text-xs">No roadmap items listed.</p>`;
      return;
    }

    container.innerHTML = roadmap.slice(0, 4).map((milestone, idx) => {
      let statusBadge = '';
      if (milestone.status === 'Completed') {
        statusBadge = '<span class="badge badge-status-available text-[10px]">Completed</span>';
      } else if (milestone.status === 'In Progress' || milestone.status === 'In Development') {
        statusBadge = '<span class="badge badge-status-dev text-[10px]">In Progress</span>';
      } else {
        statusBadge = '<span class="badge badge-status-planned text-[10px]">Planned</span>';
      }

      return `
        <div class="p-4 rounded-lg bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="font-mono text-xs text-accent font-semibold">${milestone.program}</span>
              ${statusBadge}
            </div>
            <h4 class="text-sm font-semibold text-text">${escapeHtml(milestone.title)}</h4>
            <p class="text-xs text-muted">${escapeHtml(milestone.description)}</p>
          </div>
        </div>
      `;
    }).join('');

  } catch (err) {
    console.error('Failed to load roadmap preview:', err);
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
