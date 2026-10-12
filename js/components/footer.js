/**
 * Footer Component
 */

import { CONFIG, getRelativePath } from '../core/config.js';

export function renderFooter() {
  const footerContainer = document.getElementById('footer-mount');
  if (!footerContainer) return;

  const homePath = getRelativePath('index.html');
  const programsPath = getRelativePath('programs/index.html');
  const capabilitiesPath = getRelativePath('capabilities/index.html');
  const rigStudioPath = getRelativePath('rig-studio/index.html');
  const simulationLabPath = getRelativePath('simulation-lab/index.html');
  const docsPath = getRelativePath('docs/index.html');
  const faviconPath = getRelativePath('assets/favicon.png');

  footerContainer.innerHTML = `
    <footer class="border-t border-border bg-[#050707] text-muted text-sm mt-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          <!-- Col 1: Organization info -->
          <div class="space-y-4 md:col-span-1">
            <div class="flex items-center gap-2">
              <img src="${faviconPath}" alt="KuroLabs Emblem" class="w-5 h-5 rounded border border-border object-cover">
              <span class="font-mono font-bold text-text tracking-wider">KURO<span class="text-accent">LABS</span></span>
              <span class="text-[10px] font-mono uppercase px-1 rounded bg-surface border border-border text-muted">ai</span>
            </div>
            <p class="text-xs text-muted leading-relaxed">
              Autonomous system intelligence, self-healing developer agents, and decentralized capability registries.
            </p>
            <div class="flex items-center gap-2 text-xs font-mono text-accent">
              <span class="w-2 h-2 rounded-full bg-accent animate-pulse-subtle"></span>
              <span>All Systems Operational</span>
            </div>
          </div>

          <!-- Col 2: Architecture & Manifesto -->
          <div class="space-y-3">
            <h4 class="font-mono text-xs uppercase tracking-wider text-text font-semibold">Architecture</h4>
            <ul class="space-y-2 text-xs">
              <li><span class="text-accent font-mono">1. Programs:</span> Complete applications (KuroCodeAgent).</li>
              <li><span class="text-accent font-mono">2. Store:</span> Runtime manager inside KuroCodeAgent.</li>
              <li><span class="text-accent font-mono">3. Hub:</span> Remote decentralized capability registry.</li>
            </ul>
          </div>

          <!-- Col 3: Portal Navigation -->
          <div class="space-y-3">
            <h4 class="font-mono text-xs uppercase tracking-wider text-text font-semibold">Ecosystem</h4>
            <ul class="space-y-2 text-xs">
              <li><a href="${programsPath}" class="hover:text-accent transition-colors">Programs Directory</a></li>
              <li><a href="${capabilitiesPath}" class="hover:text-accent transition-colors">Capability Hub Browser</a></li>
              <li><a href="${rigStudioPath}" class="hover:text-accent transition-colors">Agent Rig Studio</a></li>
              <li><a href="${simulationLabPath}" class="hover:text-accent transition-colors">Simulation Lab</a></li>
              <li><a href="${docsPath}" class="hover:text-accent transition-colors">Documentation & Setup</a></li>
            </ul>
          </div>

          <!-- Col 4: Open Source Repositories -->
          <div class="space-y-3">
            <h4 class="font-mono text-xs uppercase tracking-wider text-text font-semibold">Repositories</h4>
            <ul class="space-y-2 text-xs font-mono">
              <li>
                <a href="${CONFIG.repos.agent}" target="_blank" rel="noopener noreferrer" class="hover:text-accent transition-colors flex items-center gap-1.5">
                  <span>kurolabs-ai/KuroCodeAgent</span>
                  <span class="text-[10px] text-accent">↗</span>
                </a>
              </li>
              <li>
                <a href="${CONFIG.repos.hub}" target="_blank" rel="noopener noreferrer" class="hover:text-accent transition-colors flex items-center gap-1.5">
                  <span>kurolabs-ai/hub</span>
                  <span class="text-[10px] text-accent">↗</span>
                </a>
              </li>
              <li>
                <a href="${CONFIG.repos.website}" target="_blank" rel="noopener noreferrer" class="hover:text-accent transition-colors flex items-center gap-1.5">
                  <span>kurolabs-ai/kurolabs-ai.github.io</span>
                  <span class="text-[10px] text-accent">↗</span>
                </a>
              </li>
              <li>
                <a href="${CONFIG.repos.profile}" target="_blank" rel="noopener noreferrer" class="hover:text-accent transition-colors flex items-center gap-1.5">
                  <span>kurolabs-ai/.github</span>
                  <span class="text-[10px] text-accent">↗</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div class="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-dim">
          <p>© 2026 KuroLabs AI. Open source under the MIT License.</p>
          <p class="font-mono">Dark Technical Studio × Futuristic Minimalism</p>
        </div>
      </div>
    </footer>
  `;
}
