/**
 * KuroLabs Documentation Controller
 * Handles sidebar toggling, active section tracking, in-page search, and code copying
 */

document.addEventListener('DOMContentLoaded', () => {
  initDocsSidebar();
  initDocsSearch();
  initHeadingObserver();
});

function initDocsSidebar() {
  const toggleBtn = document.getElementById('docs-sidebar-toggle');
  const sidebar = document.getElementById('docs-sidebar');
  const backdrop = document.getElementById('docs-sidebar-backdrop');
  const closeBtn = document.getElementById('docs-sidebar-close');

  if (!toggleBtn || !sidebar) return;

  const toggle = (show) => {
    const isShown = show ?? sidebar.classList.contains('-translate-x-full');
    if (isShown) {
      sidebar.classList.remove('-translate-x-full');
      if (backdrop) backdrop.classList.remove('hidden');
      document.body.classList.add('overflow-hidden', 'md:overflow-auto');
    } else {
      sidebar.classList.add('-translate-x-full');
      if (backdrop) backdrop.classList.add('hidden');
      document.body.classList.remove('overflow-hidden', 'md:overflow-auto');
    }
  };

  toggleBtn.addEventListener('click', () => toggle(true));
  if (closeBtn) closeBtn.addEventListener('click', () => toggle(false));
  if (backdrop) backdrop.addEventListener('click', () => toggle(false));
}

function initDocsSearch() {
  const searchInput = document.getElementById('docs-quick-search');
  if (!searchInput) return;

  const sections = document.querySelectorAll('article section[id]');
  const sidebarLinks = document.querySelectorAll('#docs-sidebar nav a');

  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase().trim();

    if (!term) {
      sidebarLinks.forEach(link => link.parentElement?.classList.remove('opacity-25'));
      sections.forEach(sec => sec.classList.remove('opacity-20'));
      return;
    }

    // Filter sidebar
    sidebarLinks.forEach(link => {
      const text = link.textContent.toLowerCase();
      if (text.includes(term)) {
        link.parentElement?.classList.remove('opacity-25');
      } else {
        link.parentElement?.classList.add('opacity-25');
      }
    });

    // Dim non-matching article sections
    sections.forEach(sec => {
      const content = sec.textContent.toLowerCase();
      if (content.includes(term)) {
        sec.classList.remove('opacity-20');
      } else {
        sec.classList.add('opacity-20');
      }
    });
  });
}

function initHeadingObserver() {
  const headings = document.querySelectorAll('article h2[id], article h3[id]');
  const navLinks = document.querySelectorAll('#docs-sidebar nav a');
  if (headings.length === 0 || navLinks.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && (href.endsWith(`#${id}`) || href === `#${id}`)) {
              link.classList.add('text-accent', 'border-l-2', 'border-accent', 'bg-accent-dim/30');
              link.classList.remove('text-secondary', 'border-transparent');
            } else if (href && href.includes('#')) {
              link.classList.remove('text-accent', 'border-l-2', 'border-accent', 'bg-accent-dim/30');
              link.classList.add('text-secondary', 'border-transparent');
            }
          });
        }
      });
    },
    { rootMargin: '-80px 0px -70% 0px' }
  );

  headings.forEach(h => observer.observe(h));
}
