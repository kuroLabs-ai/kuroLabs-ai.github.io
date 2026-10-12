/**
 * Responsive Navigation Component
 */

import { CONFIG, getRelativePath } from '../core/config.js';

export function renderNavbar(activePage = 'home') {
  const navContainer = document.getElementById('navbar-mount');
  if (!navContainer) return;

  const links = [
    { id: 'home', label: 'Overview', path: 'index.html' },
    { id: 'programs', label: 'Programs', path: 'programs/index.html' },
    { id: 'capabilities', label: 'Capability Hub', path: 'capabilities/index.html' },
    { id: 'rig-studio', label: 'Rig Studio', path: 'rig-studio/index.html' },
    { id: 'simulation-lab', label: 'Simulation Lab', path: 'simulation-lab/index.html' },
    { id: 'docs', label: 'Docs & Setup', path: 'docs/index.html' }
  ];

  const linksHtml = links.map(link => {
    const isActive = link.id === activePage;
    const resolvedPath = getRelativePath(link.path);
    const activeClasses = isActive 
      ? 'text-accent border-b-2 border-accent font-semibold' 
      : 'text-muted hover:text-text hover:border-b-2 hover:border-border';

    return `
      <a href="${resolvedPath}" class="px-3 py-4 text-sm tracking-wide transition-colors ${activeClasses}">
        ${link.label}
      </a>
    `;
  }).join('');

  const mobileLinksHtml = links.map(link => {
    const isActive = link.id === activePage;
    const resolvedPath = getRelativePath(link.path);
    const activeClasses = isActive ? 'text-accent bg-surface-hover font-semibold' : 'text-muted hover:text-text';

    return `
      <a href="${resolvedPath}" class="block px-4 py-3 text-base rounded-md transition-colors ${activeClasses}">
        ${link.label}
      </a>
    `;
  }).join('');

  const homePath = getRelativePath('index.html');
  const faviconPath = getRelativePath('assets/favicon.png');

  navContainer.innerHTML = `
    <header class="sticky top-0 z-40 w-full glass-panel border-b border-border">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          
          <!-- Logo & Brand -->
          <div class="flex items-center gap-3">
            <a href="${homePath}" class="flex items-center gap-2.5 group text-decoration-none">
              <img src="${faviconPath}" alt="KuroLabs Emblem" class="w-7 h-7 rounded-md border border-accent/40 shadow-[0_0_10px_var(--color-accent-glow)] object-cover">
              <span class="font-mono font-bold text-lg tracking-wider text-text group-hover:text-accent transition-colors">
                KURO<span class="text-accent">LABS</span>
              </span>
              <span class="text-xs font-mono uppercase px-1.5 py-0.5 rounded bg-surface border border-border text-muted">
                ai
              </span>
            </a>
          </div>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center space-x-1" aria-label="Main Navigation">
            ${linksHtml}
          </nav>

          <!-- Right side actions -->
          <div class="hidden md:flex items-center gap-3">
            <a href="${CONFIG.repos.agent}" target="_blank" rel="noopener noreferrer" 
               class="btn-secondary text-xs font-mono py-1.5 px-3">
              <svg class="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
              </svg>
              GitHub
            </a>
          </div>

          <!-- Mobile Hamburger Toggle -->
          <div class="flex md:hidden">
            <button id="mobile-menu-toggle" type="button" 
                    class="p-2 rounded-md text-muted hover:text-text hover:bg-surface border border-border" 
                    aria-controls="mobile-menu" aria-expanded="false" aria-label="Toggle navigation menu">
              <svg id="hamburger-icon" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
              <svg id="close-icon" class="w-6 h-6 hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

        </div>
      </div>

      <!-- Mobile Menu Dropdown -->
      <div id="mobile-menu" class="hidden md:hidden border-b border-border bg-surface px-4 pt-2 pb-4 space-y-1">
        ${mobileLinksHtml}
        <div class="pt-4 border-t border-border">
          <a href="${CONFIG.repos.agent}" target="_blank" rel="noopener noreferrer" 
             class="btn-secondary w-full text-center text-sm py-2">
            View on GitHub
          </a>
        </div>
      </div>
    </header>
  `;

  // Attach mobile toggle listener
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const hamburgerIcon = document.getElementById('hamburger-icon');
  const closeIcon = document.getElementById('close-icon');

  if (toggleBtn && mobileMenu) {
    toggleBtn.addEventListener('click', () => {
      const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      toggleBtn.setAttribute('aria-expanded', String(!isExpanded));
      mobileMenu.classList.toggle('hidden');
      hamburgerIcon.classList.toggle('hidden');
      closeIcon.classList.toggle('hidden');
    });
  }
}
