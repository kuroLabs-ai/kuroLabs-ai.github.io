/**
 * Docs Page Logic (docs/index.html)
 * PRD Section 7.7
 */

import { copyToClipboard } from '../components/toast.js';

export function initDocsPage() {
  bindCopyButtons();
  bindDocsSearch();
  bindSidebarScrollSpy();
}

function bindCopyButtons() {
  document.querySelectorAll('.doc-copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const codeBlock = btn.closest('.code-block-wrapper')?.querySelector('code');
      if (codeBlock) {
        copyToClipboard(codeBlock.textContent, 'Code copied to clipboard!');
      }
    });
  });
}

function bindDocsSearch() {
  const searchInput = document.getElementById('docs-search');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    const sections = document.querySelectorAll('.doc-section');

    sections.forEach(sec => {
      if (!q) {
        sec.style.display = '';
        return;
      }
      const text = sec.textContent.toLowerCase();
      if (text.includes(q)) {
        sec.style.display = '';
      } else {
        sec.style.display = 'none';
      }
    });
  });
}

function bindSidebarScrollSpy() {
  const links = document.querySelectorAll('.docs-nav-link');
  const sections = document.querySelectorAll('.doc-section');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      if (sec.offsetTop <= scrollPos) {
        currentId = sec.id;
      }
    });

    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${currentId}`) {
        link.classList.add('text-accent', 'font-bold', 'border-l-2', 'border-accent', 'pl-3');
        link.classList.remove('text-muted');
      } else {
        link.classList.remove('text-accent', 'font-bold', 'border-l-2', 'border-accent', 'pl-3');
        link.classList.add('text-muted');
      }
    });
  });
}
