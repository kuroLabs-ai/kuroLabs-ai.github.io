/**
 * Hub Client Module
 * Authoritative client for fetching, validating, and normalizing Capability Hub catalog items.
 * Complies with PRD Section 9.3 & Section 9.5 (Payload Safety).
 */

import { CONFIG, getRelativePath } from './config.js';

let cachedCatalog = null;
let lastSourceUsed = null; // 'remote' | 'fallback'

export class HubClient {
  /**
   * Fetches the capability catalog.
   * Tries remote raw GitHub URL first; on failure, falls back to local data/hub-fallback.json.
   * @param {boolean} forceRefresh - If true, bypasses in-memory cache.
   * @returns {Promise<{ items: Array, source: string, error: string|null }>}
   */
  static async getCatalog(forceRefresh = false) {
    if (cachedCatalog && !forceRefresh) {
      return { items: cachedCatalog, source: lastSourceUsed, error: null };
    }

    let rawData = null;
    let source = 'remote';
    let errorMessage = null;

    try {
      const response = await fetch(CONFIG.hub.remoteCatalogUrl, {
        cache: forceRefresh ? 'reload' : 'default'
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }

      rawData = await response.json();
      lastSourceUsed = 'remote';
    } catch (remoteErr) {
      console.warn('[HubClient] Remote catalog fetch failed, attempting local fallback:', remoteErr);
      try {
        const fallbackUrl = getRelativePath(CONFIG.hub.fallbackDataPath);
        const fallbackResp = await fetch(fallbackUrl);
        if (!fallbackResp.ok) {
          throw new Error(`Fallback HTTP ${fallbackResp.status}`);
        }
        rawData = await fallbackResp.json();
        lastSourceUsed = 'fallback';
      } catch (fallbackErr) {
        console.error('[HubClient] Both remote and fallback catalog requests failed:', fallbackErr);
        errorMessage = 'Unable to connect to Capability Hub or load local catalog fallback.';
        return { items: [], source: 'none', error: errorMessage };
      }
    }

    if (!Array.isArray(rawData)) {
      console.error('[HubClient] Invalid catalog schema: Expected JSON array', rawData);
      return { items: [], source: lastSourceUsed, error: 'Catalog schema invalid (expected array of capabilities).' };
    }

    // Validate and normalize individual records
    const normalizedItems = rawData
      .map(entry => HubClient.normalizeEntry(entry))
      .filter(Boolean);

    cachedCatalog = normalizedItems;
    return { items: normalizedItems, source: lastSourceUsed, error: null };
  }

  /**
   * Clears the catalog cache to trigger a fresh fetch on retry.
   */
  static clearCache() {
    cachedCatalog = null;
    lastSourceUsed = null;
  }

  /**
   * Validates and normalizes an individual capability record.
   * Omits unsafe or invalid records without throwing.
   */
  static normalizeEntry(entry) {
    if (!entry || typeof entry !== 'object') return null;

    // Must have at least an id or name
    const id = String(entry.id || entry.name || '').trim();
    const name = String(entry.name || entry.id || 'Unnamed Capability').trim();
    if (!id) return null;

    const item_type = String(entry.item_type || 'tool').toLowerCase().trim();
    const description = String(entry.description || 'No description provided.').trim();
    const version = String(entry.version || '1.0.0').trim();
    const author = String(entry.author || 'kuroLabs-ai').trim();
    
    // Normalize tags as array of strings
    let tags = [];
    if (Array.isArray(entry.tags)) {
      tags = entry.tags.map(t => String(t).trim()).filter(Boolean);
    }

    // Sanitize relative file path to prevent directory traversal
    let filePath = null;
    let sourceUrl = null;
    if (entry.file_path && typeof entry.file_path === 'string') {
      const cleanPath = entry.file_path.replace(/^[\\/]+/, '');
      if (!cleanPath.includes('..')) {
        filePath = cleanPath;
        sourceUrl = `${CONFIG.hub.blobBaseUrl}${cleanPath}`;
      }
    }

    // Safe payload encapsulation (pure data, never executable)
    const payload = (entry.payload && typeof entry.payload === 'object') ? entry.payload : {};

    return {
      id,
      name,
      item_type,
      description,
      version,
      author,
      tags,
      filePath,
      sourceUrl,
      payload,
      // Verified Store command
      installCommand: `/store install ${name}`
    };
  }

  /**
   * Filter and search capabilities
   */
  static filterCapabilities(items, { query = '', type = 'all', tag = 'all' } = {}) {
    const q = query.trim().toLowerCase();
    
    return items.filter(item => {
      // Type filter
      if (type !== 'all' && item.item_type !== type.toLowerCase()) {
        return false;
      }

      // Tag filter
      if (tag !== 'all' && !item.tags.includes(tag.toLowerCase())) {
        return false;
      }

      // Query filter
      if (q) {
        const inName = item.name.toLowerCase().includes(q);
        const inDesc = item.description.toLowerCase().includes(q);
        const inAuthor = item.author.toLowerCase().includes(q);
        const inType = item.item_type.toLowerCase().includes(q);
        const inTags = item.tags.some(t => t.toLowerCase().includes(q));

        if (!inName && !inDesc && !inAuthor && !inType && !inTags) {
          return false;
        }
      }

      return true;
    });
  }
}
