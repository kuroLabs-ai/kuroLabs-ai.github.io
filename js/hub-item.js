import { getCapabilityById } from './registry.js';
import { initCopyButtons } from './navigation.js';

document.addEventListener('DOMContentLoaded', () => {
  initItemDetail();
});

async function initItemDetail() {
  const loadingEl = document.getElementById('item-loading');
  const errorEl = document.getElementById('item-error');
  const contentEl = document.getElementById('item-content');

  const params = new URLSearchParams(window.location.search);
  const itemId = params.get('id');

  if (!itemId) {
    showError('No capability ID specified in URL query.');
    return;
  }

  try {
    const item = await getCapabilityById(itemId);
    if (!item) {
      showError(`Capability with ID "${itemId}" was not found in the official registry.`);
      return;
    }

    renderItem(item);
  } catch (err) {
    showError('Error loading capability details: ' + (err.message || 'Unknown error'));
  }

  function showError(msg) {
    if (loadingEl) loadingEl.classList.add('hidden');
    if (contentEl) contentEl.classList.add('hidden');
    if (errorEl) {
      errorEl.classList.remove('hidden');
      const msgEl = document.getElementById('item-error-msg');
      if (msgEl) msgEl.textContent = msg;
    }
  }

  function renderItem(item) {
    if (loadingEl) loadingEl.classList.add('hidden');
    if (errorEl) errorEl.classList.add('hidden');
    if (contentEl) contentEl.classList.remove('hidden');

    // Page Title
    document.title = `${item.name} (${item.item_type}) — Kuro Labs Capability Hub`;

    // Breadcrumb and headers
    setText('breadcrumb-item-name', item.name);
    setText('item-title', item.name);
    setText('item-id', item.id);
    setText('item-desc', item.description);
    setText('item-version', `v${item.version}`);
    setText('item-author', item.author);

    // Type Badge
    const typeBadge = document.getElementById('item-type-badge');
    if (typeBadge) {
      typeBadge.textContent = item.item_type.toUpperCase();
      applyTypeStyle(typeBadge, item.item_type);
    }

    // Source Path
    const pathContainer = document.getElementById('item-path-container');
    const pathValue = item.file_path || item.dir_path;
    if (pathValue && pathContainer) {
      pathContainer.classList.remove('hidden');
      setText('item-path', pathValue);
      const pathLabel = document.getElementById('item-path-label');
      if (pathLabel) pathLabel.textContent = item.dir_path ? 'Directory Path' : 'File Path';
    }

    // GitHub Source URL
    const sourceLink = document.getElementById('item-source-link');
    if (sourceLink) {
      if (pathValue) {
        sourceLink.href = `https://github.com/kuroLabs-ai/hub/blob/main/${pathValue}`;
      } else {
        sourceLink.href = `https://github.com/kuroLabs-ai/hub`;
      }
    }

    // Tags
    const tagsContainer = document.getElementById('item-tags-container');
    if (tagsContainer) {
      tagsContainer.innerHTML = '';
      if (item.tags && item.tags.length > 0) {
        item.tags.forEach(tag => {
          const span = document.createElement('span');
          span.className = 'text-xs font-mono px-2 py-1 rounded bg-surface-elevated text-secondary border border-border';
          span.textContent = tag;
          tagsContainer.appendChild(span);
        });
      } else {
        tagsContainer.innerHTML = '<span class="text-xs text-muted font-mono">No tags provided</span>';
      }
    }

    // CLI Install command
    const installCmd = document.getElementById('item-install-cmd');
    if (installCmd) {
      installCmd.textContent = `kuro /hub install ${item.name}`;
      const copyBtn = document.getElementById('item-copy-install-btn');
      if (copyBtn) copyBtn.setAttribute('data-copy-text', `kuro /hub install ${item.name}`);
    }

    // Payload Details Section
    renderPayloadSection(item);

    // Initialize copy buttons
    initCopyButtons();
    if (window.lucide) window.lucide.createIcons();
  }

  function renderPayloadSection(item) {
    const payloadContainer = document.getElementById('item-payload-section');
    if (!payloadContainer) return;

    payloadContainer.innerHTML = '';

    // 1. SKILL: Procedural Steps
    if (item.item_type === 'skill' && Array.isArray(item.payload?.steps)) {
      const section = document.createElement('div');
      section.className = 'card-tech rounded-lg p-6 border-subtle mb-6';
      
      const heading = document.createElement('h3');
      heading.className = 'text-lg font-semibold text-primary mb-4 flex items-center gap-2';
      heading.innerHTML = `<svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg> Procedural Execution Routine`;
      section.appendChild(heading);

      const intro = document.createElement('p');
      intro.className = 'text-sm text-secondary mb-4';
      intro.textContent = 'When invoked via KuroCodeAgent CLI, this skill executes the following structured workflow:';
      section.appendChild(intro);

      const ol = document.createElement('ol');
      ol.className = 'space-y-3';
      item.payload.steps.forEach((step, idx) => {
        const li = document.createElement('li');
        li.className = 'flex items-start gap-3 p-3 rounded bg-surface border border-border/60 text-sm';
        
        const num = document.createElement('span');
        num.className = 'flex-shrink-0 w-6 h-6 rounded-full bg-accent-dim text-accent border border-accent/30 font-mono text-xs flex items-center justify-center font-bold';
        num.textContent = String(idx + 1);

        const text = document.createElement('span');
        text.className = 'text-primary font-mono leading-relaxed';
        text.textContent = step;

        li.appendChild(num);
        li.appendChild(text);
        ol.appendChild(li);
      });
      section.appendChild(ol);

      // Usage snippet for skill
      const skillSnippet = document.createElement('div');
      skillSnippet.className = 'mt-5 pt-4 border-t border-border/50';
      skillSnippet.innerHTML = `
        <span class="text-xs text-muted font-mono block mb-2">Execute directly in KuroCode terminal:</span>
        <div class="flex items-center justify-between p-2.5 rounded bg-bg border border-border font-mono text-xs text-accent">
          <code>/${escapeHtml(item.name)} [your prompt or parameters]</code>
        </div>
      `;
      section.appendChild(skillSnippet);

      payloadContainer.appendChild(section);
      return;
    }

    // 2. INTEGRATION: Auth & Environment
    if (item.item_type === 'integration' && (item.payload?.auth_type || item.payload?.env_var)) {
      const section = document.createElement('div');
      section.className = 'card-tech rounded-lg p-6 border-subtle mb-6';

      const heading = document.createElement('h3');
      heading.className = 'text-lg font-semibold text-primary mb-4 flex items-center gap-2';
      heading.innerHTML = `<svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg> Service Integration Configuration`;
      section.appendChild(heading);

      const grid = document.createElement('div');
      grid.className = 'grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4';

      if (item.payload.auth_type) {
        const authBox = document.createElement('div');
        authBox.className = 'p-3 rounded bg-surface border border-border/60';
        authBox.innerHTML = `
          <span class="text-xs text-muted font-mono block mb-1">Declared Auth Mechanism</span>
          <span class="text-sm font-mono text-primary font-medium">${escapeHtml(item.payload.auth_type)}</span>
        `;
        grid.appendChild(authBox);
      }

      if (item.payload.env_var) {
        const envBox = document.createElement('div');
        envBox.className = 'p-3 rounded bg-surface border border-border/60';
        envBox.innerHTML = `
          <span class="text-xs text-muted font-mono block mb-1">Required Environment Variable</span>
          <code class="text-sm font-mono text-accent font-semibold">${escapeHtml(item.payload.env_var)}</code>
        `;
        grid.appendChild(envBox);
      }
      section.appendChild(grid);

      const securityNote = document.createElement('div');
      securityNote.className = 'p-3 rounded bg-surface border-l-2 border-accent text-xs text-secondary leading-relaxed';
      securityNote.textContent = 'Note: KuroCodeAgent encrypts sensitive credentials using the local Windows DPAPI Vault or AES-256 fallback. Real secrets are never shared or transmitted.';
      section.appendChild(securityNote);

      payloadContainer.appendChild(section);
      return;
    }

    // 3. TOOL or PLUGIN: Entrypoint & Execution Details
    if ((item.item_type === 'tool' || item.item_type === 'plugin') && item.payload?.entrypoint) {
      const section = document.createElement('div');
      section.className = 'card-tech rounded-lg p-6 border-subtle mb-6';

      const heading = document.createElement('h3');
      heading.className = 'text-lg font-semibold text-primary mb-4 flex items-center gap-2';
      heading.innerHTML = `<svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg> Execution Manifest`;
      section.appendChild(heading);

      const entryBox = document.createElement('div');
      entryBox.className = 'p-3 rounded bg-surface border border-border/60 mb-4';
      entryBox.innerHTML = `
        <span class="text-xs text-muted font-mono block mb-1">Entrypoint Reference</span>
        <code class="text-sm font-mono text-primary font-semibold">${escapeHtml(item.payload.entrypoint)}</code>
      `;
      section.appendChild(entryBox);

      const note = document.createElement('p');
      note.className = 'text-xs text-secondary';
      note.textContent = item.item_type === 'tool' 
        ? 'Discrete Python tool compiled and validated with the KuroCode AST Sandbox before runtime execution.'
        : 'Modular package installed into plugins/ directory with isolated dependencies.';
      section.appendChild(note);

      payloadContainer.appendChild(section);
      return;
    }

    // 4. GENERIC PAYLOAD FALLBACK
    if (item.payload && Object.keys(item.payload).length > 0) {
      const section = document.createElement('div');
      section.className = 'card-tech rounded-lg p-6 border-subtle mb-6';

      const heading = document.createElement('h3');
      heading.className = 'text-lg font-semibold text-primary mb-4';
      heading.textContent = 'Manifest Metadata';
      section.appendChild(heading);

      const pre = document.createElement('pre');
      pre.className = 'p-4 rounded bg-bg border border-border font-mono text-xs text-secondary overflow-x-auto';
      pre.textContent = JSON.stringify(item.payload, null, 2);
      section.appendChild(pre);

      payloadContainer.appendChild(section);
    }
  }

  function applyTypeStyle(badgeEl, type) {
    switch (type) {
      case 'tool':
        badgeEl.className = 'px-2.5 py-1 text-xs font-mono rounded font-semibold tracking-wide uppercase bg-sky-500/10 text-sky-400 border border-sky-500/30';
        break;
      case 'plugin':
        badgeEl.className = 'px-2.5 py-1 text-xs font-mono rounded font-semibold tracking-wide uppercase bg-purple-500/10 text-purple-400 border border-purple-500/30';
        break;
      case 'skill':
        badgeEl.className = 'px-2.5 py-1 text-xs font-mono rounded font-semibold tracking-wide uppercase bg-accent/10 text-accent border border-accent/30';
        break;
      case 'integration':
        badgeEl.className = 'px-2.5 py-1 text-xs font-mono rounded font-semibold tracking-wide uppercase bg-orange-500/10 text-orange-400 border border-orange-500/30';
        break;
      default:
        badgeEl.className = 'px-2.5 py-1 text-xs font-mono rounded font-semibold tracking-wide uppercase bg-neutral-800 text-secondary border border-border';
    }
  }

  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val || '';
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
