/**
 * KuroLabs Projects Directory Controller
 * Dynamically loads and renders projects from data/projects.json
 */

document.addEventListener('DOMContentLoaded', () => {
  initProjects();
});

async function initProjects() {
  const container = document.getElementById('projects-grid');
  if (!container) return;

  const basePath = window.location.pathname.includes('/projects/') ? '../' : './';
  const dataUrl = `${basePath}data/projects.json`;

  try {
    const res = await fetch(dataUrl);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const projects = await res.json();

    let activeCategory = 'all';

    const render = () => {
      container.innerHTML = '';
      const filtered = activeCategory === 'all' 
        ? projects 
        : projects.filter(p => p.category.toLowerCase().includes(activeCategory.toLowerCase()));

      filtered.forEach(p => {
        const card = document.createElement('article');
        card.className = 'card-tech rounded-lg p-6 flex flex-col justify-between border-subtle hover:border-border-light transition-all duration-200 group';

        const top = document.createElement('div');
        
        // Header
        const header = document.createElement('div');
        header.className = 'flex items-start justify-between gap-4 mb-4';

        const titleBox = document.createElement('div');
        titleBox.innerHTML = `
          <div class="flex items-center gap-2 mb-1">
            <span class="px-2 py-0.5 text-xs font-mono rounded bg-accent-dim text-accent border border-accent/20 font-medium">${escapeHtml(p.category)}</span>
            <span class="px-2 py-0.5 text-xs font-mono rounded bg-surface-elevated text-secondary border border-border">${escapeHtml(p.status)}</span>
          </div>
          <h2 class="text-xl font-bold text-primary font-mono group-hover:text-accent transition-colors">${escapeHtml(p.name)}</h2>
          <p class="text-xs text-muted font-mono mt-0.5">${escapeHtml(p.tagline)}</p>
        `;

        header.appendChild(titleBox);
        top.appendChild(header);

        // Description
        const desc = document.createElement('p');
        desc.className = 'text-sm text-secondary leading-relaxed mb-4';
        desc.textContent = p.description;
        top.appendChild(desc);

        // Highlights
        if (p.highlights && p.highlights.length > 0) {
          const ul = document.createElement('ul');
          ul.className = 'space-y-1.5 mb-5 text-xs text-secondary';
          p.highlights.forEach(h => {
            const li = document.createElement('li');
            li.className = 'flex items-start gap-2';
            li.innerHTML = `<span class="text-accent mt-0.5 font-bold">›</span><span>${escapeHtml(h)}</span>`;
            ul.appendChild(li);
          });
          top.appendChild(ul);
        }

        // Tech stack badges
        if (p.technologies && p.technologies.length > 0) {
          const techWrap = document.createElement('div');
          techWrap.className = 'flex flex-wrap gap-1.5 mb-6';
          p.technologies.forEach(t => {
            const badge = document.createElement('span');
            badge.className = 'text-[11px] font-mono px-2 py-0.5 rounded bg-surface-elevated text-muted border border-border/70';
            badge.textContent = t;
            techWrap.appendChild(badge);
          });
          top.appendChild(techWrap);
        }

        card.appendChild(top);

        // Actions
        const actions = document.createElement('div');
        actions.className = 'pt-4 border-t border-border flex flex-wrap items-center gap-3 text-xs font-mono';

        const siteUrl = `${basePath}${p.site_url}`;
        const docsUrl = `${basePath}${p.docs_url}`;

        actions.innerHTML = `
          <a href="${siteUrl}" class="btn-primary text-xs !py-1.5 !px-3">
            <span>Explore Project</span>
            <svg class="w-3.5 h-3.5 ml-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </a>
          ${p.docs_url ? `<a href="${docsUrl}" class="btn-secondary text-xs !py-1.5 !px-3">Documentation</a>` : ''}
          <a href="${p.repo_url}" target="_blank" rel="noopener noreferrer" class="text-muted hover:text-primary transition-colors flex items-center gap-1 ml-auto">
            <svg class="w-4 h-4 inline" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
            <span>Source</span>
          </a>
        `;

        card.appendChild(actions);
        container.appendChild(card);
      });
    };

    render();

    // Category filter buttons
    document.querySelectorAll('[data-project-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-project-filter]').forEach(b => {
          b.classList.remove('bg-accent', 'text-bg', 'border-accent');
          b.classList.add('bg-surface-elevated', 'text-secondary', 'border-border');
        });
        btn.classList.add('bg-accent', 'text-bg', 'border-accent');
        btn.classList.remove('bg-surface-elevated', 'text-secondary', 'border-border');

        activeCategory = btn.getAttribute('data-project-filter');
        render();
      });
    });

  } catch (err) {
    console.error('Failed to load projects: ', err);
    container.innerHTML = `<div class="p-6 rounded-lg bg-surface border border-red-500/30 text-red-400 font-mono text-sm">Failed to load projects metadata.</div>`;
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
