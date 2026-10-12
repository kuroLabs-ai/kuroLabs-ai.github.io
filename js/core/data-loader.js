/**
 * Data Loader Module
 * Loads verified programs and roadmap datasets from local JSON files.
 */

import { CONFIG, getRelativePath } from './config.js';

let cachedPrograms = null;
let cachedRoadmap = null;

export class DataLoader {
  static async getPrograms() {
    if (cachedPrograms) return cachedPrograms;
    try {
      const url = getRelativePath(CONFIG.data.programsPath);
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      cachedPrograms = Array.isArray(data) ? data : [];
      return cachedPrograms;
    } catch (err) {
      console.error('[DataLoader] Failed to load programs.json:', err);
      return [];
    }
  }

  static async getRoadmap() {
    if (cachedRoadmap) return cachedRoadmap;
    try {
      const url = getRelativePath(CONFIG.data.roadmapPath);
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      cachedRoadmap = Array.isArray(data) ? data : [];
      return cachedRoadmap;
    } catch (err) {
      console.error('[DataLoader] Failed to load roadmap.json:', err);
      return [];
    }
  }
}
