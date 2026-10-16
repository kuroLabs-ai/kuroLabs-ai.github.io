/**
 * KuroLabs Global Navigation & Utility Script
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initActiveNavLinks();
  initCopyButtons();
  if (window.lucide) {
    window.lucide.createIcons();
  }
});

function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeBtn = document.getElementById('mobile-menu-close');

  if (!toggleBtn || !mobileMenu) return;

  const toggle = (show) => {
    const isExpanded = show ?? mobileMenu.classList.contains('hidden');
    if (isExpanded) {
      mobileMenu.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
      toggleBtn.setAttribute('aria-expanded', 'true');
    } else {
      mobileMenu.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  };

  toggleBtn.addEventListener('click', () => toggle());
  if (closeBtn) closeBtn.addEventListener('click', () => toggle(false));

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
      toggle(false);
    }
  });
}

function initActiveNavLinks() {
  const currentPath = window.location.pathname.replace(/\/index\.html$/, '/').replace(/\/$/, '');
  const links = document.querySelectorAll('header nav a, #mobile-menu a');

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('#')) return;

    // Normalizing link path
    const url = new URL(link.href, window.location.origin);
    const linkPath = url.pathname.replace(/\/index\.html$/, '/').replace(/\/$/, '');

    if ((currentPath === '' && (linkPath === '' || linkPath === '/')) ||
        (linkPath !== '' && currentPath.endsWith(linkPath))) {
      link.classList.add('text-accent', 'font-medium');
      link.classList.remove('text-secondary');
    }
  });
}

export function initCopyButtons() {
  document.querySelectorAll('[data-copy-target]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const targetId = btn.getAttribute('data-copy-target');
      const targetEl = document.getElementById(targetId);
      const textToCopy = targetEl ? (targetEl.innerText || targetEl.textContent) : btn.getAttribute('data-copy-text');

      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy.trim());
        const originalHtml = btn.innerHTML;
        btn.innerHTML = `<svg class="w-4 h-4 text-accent inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg><span class="text-accent text-xs">Copied!</span>`;
        btn.classList.add('border-accent');
        setTimeout(() => {
          btn.innerHTML = originalHtml;
          btn.classList.remove('border-accent');
          if (window.lucide) window.lucide.createIcons();
        }, 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    });
  });
}
