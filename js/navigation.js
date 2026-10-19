/**
 * KuroLabs Global Navigation & Utility Script
 */

// Immediate global helpers for mobile menu
window.openMobileMenu = function() {
  const mobileMenu = document.getElementById('mobile-menu');
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  if (!mobileMenu) return;

  mobileMenu.classList.remove('hidden');
  mobileMenu.style.setProperty('display', 'block', 'important');
  document.body.classList.add('overflow-hidden');
  if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'true');
};

window.closeMobileMenu = function() {
  const mobileMenu = document.getElementById('mobile-menu');
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  if (!mobileMenu) return;

  mobileMenu.classList.add('hidden');
  mobileMenu.style.setProperty('display', 'none', 'important');
  document.body.classList.remove('overflow-hidden');
  if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
};

window.toggleMobileMenu = function() {
  const mobileMenu = document.getElementById('mobile-menu');
  if (!mobileMenu) return;

  const isHidden = mobileMenu.classList.contains('hidden') || 
                   mobileMenu.style.display === 'none' || 
                   (window.getComputedStyle && window.getComputedStyle(mobileMenu).display === 'none');

  if (isHidden) {
    window.openMobileMenu();
  } else {
    window.closeMobileMenu();
  }
};

function initAll() {
  try { initMobileMenu(); } catch(e) { console.warn('initMobileMenu error:', e); }
  try { initActiveNavLinks(); } catch(e) { console.warn('initActiveNavLinks error:', e); }
  try { initCopyButtons(); } catch(e) { console.warn('initCopyButtons error:', e); }
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    try { window.lucide.createIcons(); } catch(e) {}
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

  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      window.toggleMobileMenu();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      window.closeMobileMenu();
    });
  }

  if (mobileMenu) {
    // Close when clicking any nav link in the mobile drawer
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        window.closeMobileMenu();
      });
    });

    // Close when clicking directly on the backdrop area
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) {
        window.closeMobileMenu();
      }
    });
  }

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.closeMobileMenu();
    }
  });
}

function initActiveNavLinks() {
  try {
    if (!window.location || !window.location.pathname) return;
    const currentPath = window.location.pathname.replace(/\/index\.html$/, '/').replace(/\/$/, '');
    const links = document.querySelectorAll('header nav a, #mobile-menu a');

    const baseOrigin = (window.location.origin && window.location.origin !== 'null') 
      ? window.location.origin 
      : 'https://kurolabs-ai.github.io';

    links.forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('#')) return;

      try {
        const url = new URL(link.href, baseOrigin);
        const linkPath = url.pathname.replace(/\/index\.html$/, '/').replace(/\/$/, '');

        if ((currentPath === '' && (linkPath === '' || linkPath === '/')) ||
            (linkPath !== '' && currentPath.endsWith(linkPath))) {
          link.classList.add('text-accent', 'font-medium');
          link.classList.remove('text-secondary');
        }
      } catch (err) {
        // ignore individual link parsing errors
      }
    });
  } catch (err) {
    console.warn('Error in initActiveNavLinks:', err);
  }
}

function initCopyButtons() {
  document.querySelectorAll('[data-copy-target], [data-copy-text]').forEach(btn => {
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
        btn.innerHTML = `<svg class="w-4 h-4 text-accent inline mr-1 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg><span class="text-accent text-xs">Copied!</span>`;
        btn.classList.add('border-accent');
        setTimeout(() => {
          btn.innerHTML = originalHtml;
          btn.classList.remove('border-accent');
          if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
          }
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
