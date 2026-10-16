/**
 * KuroLabs Capability Hub Registry Client
 * Handles fetching, caching, validation, normalization, and filtering of kuro-hub.json
 */

const REMOTE_REGISTRY_URL = 'https://raw.githubusercontent.com/kuroLabs-ai/hub/main/kuro-hub.json';

// Detect relative path to data folder based on page depth
function getLocalFallbackPath() {
  const depth = (window.location.pathname.match(/\//g) || []).length;
  // If in /hub/ or /projects/ or similar subdirectory
  if (window.location.pathname.includes('/hub/') || window.location.pathname.includes('/projects/')) {
    return '../data/kuro-hub.json';
  }
  return 'data/kuro-hub.json';
}

let cachedRegistry = null;

export async function fetchRegistry(options = { forceRefresh: false }) {
  if (cachedRegistry && !options.forceRefresh) {
    return cachedRegistry;
  }

  let data = null;
  let isFallback = false;
  let fetchError = null;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const response = await fetch(REMOTE_REGISTRY_URL, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }

    data = await response.json();
  } catch (err) {
    console.warn('Failed to load remote registry, attempting local snapshot fallback...', err);
    fetchError = err.message || 'Network error fetching remote registry';

    try {
      const localRes = await fetch(getLocalFallbackPath());
      if (localRes.ok) {
        data = await localRes.json();
        isFallback = true;
      } else {
        throw new Error('Local snapshot unavailable');
      }
    } catch (fallbackErr) {
      console.error('Local fallback failed:', fallbackErr);
      return {
        success: false,
        items: [],
        error: fetchError || 'Unable to connect to GitHub registry or local fallback.',
        isFallback: false
      };
    }
  }

  if (!Array.isArray(data)) {
    return {
      success: false,
      items: [],
      error: 'Invalid registry payload: expected JSON array.',
      isFallback
    };
  }

  // Normalize items safely
  const normalizedItems = data.map(item => normalizeItem(item)).filter(Boolean);

  cachedRegistry = {
    success: true,
    items: normalizedItems,
    isFallback,
    error: isFallback ? `Serving local offline snapshot (${fetchError})` : null,
    total: normalizedItems.length
  };

  return cachedRegistry;
}

export function normalizeItem(raw) {
  if (!raw || typeof raw !== 'object') return null;

  const validTypes = ['tool', 'plugin', 'skill', 'integration'];
  const rawType = String(raw.item_type || 'unknown').toLowerCase().trim();
  const itemType = validTypes.includes(rawType) ? rawType : 'unknown';

  return {
    id: String(raw.id || '').trim() || `item_${Math.random().toString(36).substring(2, 9)}`,
    name: String(raw.name || raw.id || 'Unnamed Capability').trim(),
    item_type: itemType,
    description: String(raw.description || 'No description provided.').trim(),
    version: String(raw.version || '1.0.0').trim(),
    author: String(raw.author || 'kuroLabs-ai').trim(),
    tags: Array.isArray(raw.tags) ? raw.tags.map(t => String(t).trim().toLowerCase()).filter(Boolean) : [],
    file_path: raw.file_path ? String(raw.file_path).trim() : null,
    dir_path: raw.dir_path ? String(raw.dir_path).trim() : null,
    payload: (raw.payload && typeof raw.payload === 'object') ? raw.payload : {},
    raw
  };
}

export function filterRegistry(items, { search = '', types = [], sortBy = 'name_asc' } = {}) {
  let filtered = [...items];

  // Search by name, description, tags, author
  const query = search.trim().toLowerCase();
  if (query) {
    filtered = filtered.filter(item => {
      const matchName = item.name.toLowerCase().includes(query);
      const matchDesc = item.description.toLowerCase().includes(query);
      const matchAuthor = item.author.toLowerCase().includes(query);
      const matchTags = item.tags.some(tag => tag.includes(query));
      return matchName || matchDesc || matchAuthor || matchTags;
    });
  }

  // Filter by types
  if (types.length > 0 && !types.includes('all')) {
    const activeTypes = types.map(t => t.toLowerCase());
    filtered = filtered.filter(item => activeTypes.includes(item.item_type));
  }

  // Sort
  filtered.sort((a, b) => {
    if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
    if (sortBy === 'name_desc') return b.name.localeCompare(a.name);
    if (sortBy === 'type') return a.item_type.localeCompare(b.item_type) || a.name.localeCompare(b.name);
    return 0;
  });

  return filtered;
}

export function getRegistryStats(items) {
  const counts = {
    total: items.length,
    tool: 0,
    plugin: 0,
    skill: 0,
    integration: 0,
    other: 0
  };

  items.forEach(item => {
    if (counts.hasOwnProperty(item.item_type)) {
      counts[item.item_type]++;
    } else {
      counts.other++;
    }
  });

  return counts;
}

export async function getCapabilityById(id) {
  if (!id) return null;
  const reg = await fetchRegistry();
  if (!reg.success) return null;
  return reg.items.find(item => item.id === id) || null;
}
