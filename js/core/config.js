/**
 * KuroLabs Ecosystem Configuration
 * Core URLs, repositories, and path resolution.
 */

export const CONFIG = {
  orgName: 'KuroLabs AI',
  orgHandle: 'kurolabs-ai',
  orgUrl: 'https://github.com/kurolabs-ai',
  
  repos: {
    website: 'https://github.com/kurolabs-ai/kurolabs-ai.github.io',
    agent: 'https://github.com/kurolabs-ai/KuroCodeAgent',
    hub: 'https://github.com/kurolabs-ai/hub',
    profile: 'https://github.com/kurolabs-ai/.github'
  },

  hub: {
    remoteCatalogUrl: 'https://raw.githubusercontent.com/kurolabs-ai/hub/main/kuro-hub.json',
    blobBaseUrl: 'https://github.com/kurolabs-ai/hub/blob/main/',
    fallbackDataPath: 'data/hub-fallback.json'
  },

  data: {
    programsPath: 'data/programs.json',
    roadmapPath: 'data/roadmap.json'
  }
};

/**
 * Resolves paths correctly relative to current page location or root.
 * Handles deep directories like /programs/kurocode/ vs root /.
 */
export function getRelativePath(targetPath) {
  // Normalize targetPath removing leading slash
  const cleanPath = targetPath.startsWith('/') ? targetPath.slice(1) : targetPath;
  
  // Calculate directory depth of current page
  const pathname = window.location.pathname;
  // If we are at /index.html or /: depth is 0
  // If we are at /programs/ or /capabilities/: depth is 1
  // If we are at /programs/kurocode/: depth is 2
  const segments = pathname.split('/').filter(Boolean);
  
  // If the last segment is a file (e.g. index.html), pop it
  if (segments.length > 0 && segments[segments.length - 1].includes('.')) {
    segments.pop();
  }

  // Determine how many '../' we need
  let prefix = '';
  for (let i = 0; i < segments.length; i++) {
    prefix += '../';
  }

  return prefix + cleanPath;
}
