/**
 * KuroLabs Global Navigation & Utility Script
 */

function initAll() {
  initMobileMenu();
  initActiveNavLinks();
  initCopyButtons();
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}

function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeBtn = document.getElementById('mobile-menu-close');

  if (!toggleBtn || !mobileMenu) return;

  const openMenu = () => {
    mobileMenu.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
    toggleBtn.setAttribute('aria-expanded', 'true');
  };

  const closeMenu = () => {
    mobileMenu.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
    toggleBtn.setAttribute('aria-expanded', 'false');
  };

  const toggleMenu = () => {
    if (mobileMenu.classList.contains('hidden')) {
      openMenu();
    } else {
      closeMenu();
    }
  };

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenu();
    });
  }

  // Close when clicking any nav link in the mobile drawer
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
      closeMenu();
    }
  });

  // Close when clicking on the backdrop area of the mobile menu
  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
      closeMenu();
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

function initCopyButtons() {
  document.querySelectorAll('[data-copy-target], [data-copy-text]').forEach(btn => {
    // Avoid double-binding listeners
    if (btn.dataset.copyBound === 'true') return;
    btn.dataset.copyBound = 'true';

    btn.addEventListener('click', async () => {
      const targetId = btn.getAttribute('data-copy-target');
      const targetEl = targetId ? document.getElementById(targetId) : null;
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

// Expose on window for module scripts or direct invocations
window.initCopyButtons = initCopyButtons;
window.initMobileMenu = initMobileMenu;
