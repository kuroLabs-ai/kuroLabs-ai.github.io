/**
 * Rig Studio Page Logic (rig-studio/index.html)
 * PRD Section 7.5
 */

import { HubClient } from '../core/hub-client.js';
import { copyToClipboard, showToast } from '../components/toast.js';

let availableCapabilities = [];
let selectedCapabilities = new Set(['tool_json_inspector', 'skill_tdd_refactoring']);

const PROVIDER_DEFAULTS = {
  gemini: { model: 'gemini-1.5-pro', envKey: 'GEMINI_API_KEY', endpoint: 'https://generativelanguage.googleapis.com' },
  groq: { model: 'llama-3.3-70b-versatile', envKey: 'GROQ_API_KEY', endpoint: 'https://api.groq.com/openai/v1' },
  ollama: { model: 'llama3:latest', envKey: 'OLLAMA_BASE_URL', endpoint: 'http://localhost:11434/v1' },
  openrouter: { model: 'anthropic/claude-3.5-sonnet', envKey: 'OPENROUTER_API_KEY', endpoint: 'https://openrouter.ai/api/v1' }
};

export async function initRigStudioPage() {
  bindFormEvents();
  await loadHubSlots();
  updateLiveConfig();
}

async function loadHubSlots() {
  const container = document.getElementById('rig-capabilities-container');
  if (!container) return;

  try {
    const { items } = await HubClient.getCatalog();
    availableCapabilities = items;

    if (items.length === 0) {
      container.innerHTML = `<p class="text-xs text-muted">No capabilities available to snap.</p>`;
      return;
    }

    container.innerHTML = items.map(item => {
      const isChecked = selectedCapabilities.has(item.id);
      return `
        <label class="flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer ${isChecked ? 'bg-surface-hover border-accent/60' : 'bg-surface border-border hover:border-border-hover'}">
          <div class="flex items-center gap-3">
            <input type="checkbox" value="${item.id}" ${isChecked ? 'checked' : ''} class="rig-cap-checkbox accent-accent w-4 h-4 rounded">
            <div>
              <span class="font-mono text-xs font-bold text-text">${escapeHtml(item.name)}</span>
              <span class="text-[10px] text-dim block">${escapeHtml(item.item_type)} • v${escapeHtml(item.version)}</span>
            </div>
          </div>
          <span class="badge badge-${item.item_type} text-[10px] uppercase font-mono">${escapeHtml(item.item_type)}</span>
        </label>
      `;
    }).join('');

    container.querySelectorAll('.rig-cap-checkbox').forEach(cb => {
      cb.addEventListener('change', () => {
        if (cb.checked) {
          selectedCapabilities.add(cb.value);
        } else {
          selectedCapabilities.delete(cb.value);
        }
        updateLiveConfig();
      });
    });

  } catch (err) {
    console.error('Failed to load capabilities for rig studio:', err);
    container.innerHTML = `<p class="text-xs text-danger">Failed to load capability slots.</p>`;
  }
}

function bindFormEvents() {
  const formElements = [
    'rig-provider',
    'rig-model',
    'rig-role',
    'rig-ast-guard',
    'rig-safe-mode',
    'rig-memory'
  ];

  formElements.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', () => {
        if (id === 'rig-provider') {
          handleProviderChange();
        }
        updateLiveConfig();
      });
    }
  });

  // Action buttons
  const copyJsonBtn = document.getElementById('copy-rig-json-btn');
  if (copyJsonBtn) {
    copyJsonBtn.addEventListener('click', () => {
      const code = document.getElementById('rig-json-output').textContent;
      copyToClipboard(code, 'Rig configuration copied!');
    });
  }

  const downloadJsonBtn = document.getElementById('download-rig-json-btn');
  if (downloadJsonBtn) {
    downloadJsonBtn.addEventListener('click', () => downloadConfig());
  }

  const copyCmdBtn = document.getElementById('copy-rig-cmd-btn');
  if (copyCmdBtn) {
    copyCmdBtn.addEventListener('click', () => {
      const cmd = document.getElementById('rig-cmd-output').textContent;
      copyToClipboard(cmd, 'Launch command copied!');
    });
  }
}

function handleProviderChange() {
  const providerEl = document.getElementById('rig-provider');
  const modelEl = document.getElementById('rig-model');
  if (!providerEl || !modelEl) return;

  const provider = providerEl.value;
  const config = PROVIDER_DEFAULTS[provider];
  if (config) {
    modelEl.value = config.model;
  }
}

function updateLiveConfig() {
  const providerEl = document.getElementById('rig-provider');
  const modelEl = document.getElementById('rig-model');
  const roleEl = document.getElementById('rig-role');
  const astGuardEl = document.getElementById('rig-ast-guard');
  const safeModeEl = document.getElementById('rig-safe-mode');
  const memoryEl = document.getElementById('rig-memory');

  const provider = providerEl ? providerEl.value : 'gemini';
  const model = modelEl ? modelEl.value : 'gemini-1.5-pro';
  const role = roleEl ? roleEl.value : 'System Engineer';
  const astGuard = astGuardEl ? astGuardEl.checked : true;
  const safeMode = safeModeEl ? safeModeEl.checked : true;
  const memory = memoryEl ? memoryEl.value : 'sqlite_hybrid';

  // Construct rigorous config object matching KuroCode schema
  const rigConfig = {
    version: '1.0',
    rig_name: `custom-${role.toLowerCase().replace(/[^a-z0-9]/g, '-')}-rig`,
    agent: {
      role: role,
      cognitive_loop: 'ReAct_2.0',
      memory_driver: memory
    },
    model_router: {
      primary_provider: provider,
      model_name: model,
      failover_enabled: true
    },
    safety_gates: {
      ast_syntax_inspector: astGuard,
      safe_mode_confirmations: safeMode,
      vault_storage: 'dpapi_encrypted'
    },
    snapped_capabilities: Array.from(selectedCapabilities)
  };

  const jsonStr = JSON.stringify(rigConfig, null, 2);
  const jsonOutput = document.getElementById('rig-json-output');
  if (jsonOutput) {
    jsonOutput.textContent = jsonStr;
  }

  // Update CLI command
  const cmdOutput = document.getElementById('rig-cmd-output');
  if (cmdOutput) {
    cmdOutput.textContent = `kuro --config kuro_rig.json`;
  }

  // Update selected count badge
  const countBadge = document.getElementById('rig-selected-count');
  if (countBadge) {
    countBadge.textContent = `${selectedCapabilities.size} capability slot${selectedCapabilities.size === 1 ? '' : 's'} snapped`;
  }
}

function downloadConfig() {
  const jsonStr = document.getElementById('rig-json-output').textContent;
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'kuro_rig.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Downloaded kuro_rig.json', 'success');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
