/**
 * KuroLabs AI — Enterprise Web Portal Application
 * Engineered with Vanilla ES6 + Tailwind CSS + Lucide Icons + Web Audio API
 * Fully Compatible with GitHub Pages (Zero Build Step Required)
 */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  initAudioSynthesizer();
  initCatEasterEgg();
  initMobileMenu();
  initProductMatrix();
  initAgentRigBuilder();
  initSelfHealingLab();
  initStoreMarket();
  initTerminalLab();
  initSetupGenerator();
  initModals();
  initClipboardUtils();
  refreshIcons();
});

function refreshIcons() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

/* ─────────────────────────────────────────────────────────────
   1. Dynamic Ambient Grid / Particle Canvas
   ───────────────────────────────────────────────────────────── */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambientCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let w = (canvas.width = window.innerWidth);
  let h = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });

  const particles = [];
  const count = Math.min(45, Math.floor(w / 35));

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
    });
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);

    // Dynamic Connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.strokeStyle = `rgba(6, 182, 212, ${0.12 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Points
    for (let p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      ctx.fillStyle = 'rgba(6, 182, 212, 0.45)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(frame);
  }

  frame();
}

/* ─────────────────────────────────────────────────────────────
   2. Web Audio Synthesizer (0kb External Audio Footprint)
   ───────────────────────────────────────────────────────────── */
let sfxEnabled = true;
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playCyberSound(type = 'click') {
  if (!sfxEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.05);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'snap') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(550, now + 0.09);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc.start(now);
      osc.stop(now + 0.09);
    } else if (type === 'heal') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.2);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (type === 'fault') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(90, now + 0.16);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc.start(now);
      osc.stop(now + 0.16);
    } else if (type === 'beep') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(620, now);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.06);
    }
  } catch (err) {
    // Audio context may require first interaction
  }
}

function initAudioSynthesizer() {
  const toggleBtn = document.getElementById('sfxToggleBtn');
  const label = document.getElementById('sfxLabel');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    sfxEnabled = !sfxEnabled;
    const iconContainer = toggleBtn.querySelector('i');
    if (sfxEnabled) {
      toggleBtn.classList.remove('sfx-muted');
      if (iconContainer) iconContainer.setAttribute('data-lucide', 'volume-2');
      if (label) label.textContent = 'SFX: ON';
      playCyberSound('click');
    } else {
      toggleBtn.classList.add('sfx-muted');
      if (iconContainer) iconContainer.setAttribute('data-lucide', 'volume-x');
      if (label) label.textContent = 'SFX: OFF';
    }
    refreshIcons();
  });

  // Attach click sound to interactive elements
  document.querySelectorAll('button, .tab-btn, .tab-switch, .filter-pill').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.id !== 'sfxToggleBtn') {
        playCyberSound('click');
      }
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   3. Cat Dialogue Easter Egg
   ───────────────────────────────────────────────────────────── */
const CAT_QUOTES = [
  "Nya! I'm Kuro. Ready to inspect code, run tests, and heal servers.",
  "AST syntax tree verified. Zero malicious tokens or unsafe imports detected!",
  "Windows DPAPI vault active: Your credentials are encrypted hardware-level.",
  "Level 2 autonomy: I write code, auto-commit rollback points, and fix bugs.",
  "Need an extra capability? Snap it instantly from the Capability Store!",
  "Git checkpoints guard your repository — every single change is reversible.",
  "Zero hallucination policy: If code breaks, self-healing diagnostic loops patch it."
];

function initCatEasterEgg() {
  const avatar = document.getElementById('catEasterEggBtn');
  const bubble = document.getElementById('catBubble');
  const text = document.getElementById('catBubbleText');
  if (!avatar || !bubble || !text) return;

  let quoteIdx = 0;
  let timer = null;

  avatar.addEventListener('click', (e) => {
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
      // Allow easter egg click without redirecting immediately
      e.preventDefault();
    }
    playCyberSound('beep');
    quoteIdx = (quoteIdx + 1) % CAT_QUOTES.length;
    text.textContent = `"${CAT_QUOTES[quoteIdx]}"`;
    bubble.classList.add('show');

    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      bubble.classList.remove('show');
    }, 4500);
  });
}

/* ─────────────────────────────────────────────────────────────
   3.1 Mobile Menu Drawer
   ───────────────────────────────────────────────────────────── */
function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
    playCyberSound('click');
  });
}

/* ─────────────────────────────────────────────────────────────
   4. Modular Product Matrix (Easily Add New Programs)
   ───────────────────────────────────────────────────────────── */
const PRODUCTS_DATA = [
  {
    id: 'kurocode',
    name: 'KuroCode Agent',
    category: 'agent',
    version: 'v0.2.0',
    status: 'Stable Release',
    statusClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    iconName: 'terminal',
    desc: 'Local-first autonomous coding companion with ReAct 2.0 loop, multi-model fallback router, and automatic Git checkpoints.',
    bullets: [
      'AST-verified runtime execution guard',
      'Multi-provider LLM routing (Gemini, Groq, Ollama)',
      'Automated self-healing failure classification',
    ],
    primaryAction: { label: 'Install Agent', action: 'installModal' },
    secondaryAction: { label: 'GitHub', url: 'https://github.com/kuroLabs-ai/KuroCodeAgent' },
  },
  {
    id: 'capability-hub',
    name: 'Capability Market',
    category: 'hub',
    version: 'v1.0.0',
    status: 'Official Hub',
    statusClass: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    iconName: 'boxes',
    desc: 'Community marketplace where developers and agents snap in Tools, Plugins, Skills, and Integrations like puzzle pieces.',
    bullets: [
      '1-click installation: /store install <name>',
      'Modular source files with GitHub branch resolving',
      'Community Pull Request workflow & catalog sync',
    ],
    primaryAction: { label: 'Browse Market', url: 'store.html' },
    secondaryAction: { label: 'Hub Repo', url: 'https://github.com/kuroLabs-ai/hub' },
  },
  {
    id: 'kurostudio',
    name: 'KuroStudio Suite',
    category: 'creative',
    version: 'v0.1.0',
    status: 'Private Beta',
    statusClass: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    iconName: 'sparkles',
    desc: 'Next-generation AI creative studio for procedural video editing, automated motion graphics, and multimodal timeline orchestration.',
    bullets: [
      'Autonomous video timeline generation from prompts',
      'Multi-track audio, speech synthesis & visual layering',
      'Direct integration with KuroCode developer toolchains',
    ],
    primaryAction: { label: 'Join Waitlist', action: 'waitlist' },
    secondaryAction: { label: 'Overview', url: 'docs.html' },
  },
];

function initProductMatrix() {
  const grid = document.getElementById('productsGrid');
  const tabs = document.querySelectorAll('#productFilterTabs .tab-btn');
  if (!grid) return;

  let activeCategory = 'all';

  function render() {
    grid.innerHTML = '';
    const filtered = PRODUCTS_DATA.filter((p) => activeCategory === 'all' || p.category === activeCategory);

    filtered.forEach((p) => {
      const card = document.createElement('div');
      card.className = 'group relative rounded-2xl bg-slate-900/60 border border-white/[0.08] hover:border-cyan-500/30 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-950/20';

      const bulletsHtml = p.bullets
        .map((b) => `<li class="flex items-start gap-2 text-xs text-slate-300"><i data-lucide="check" class="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5"></i> <span>${escapeHtml(b)}</span></li>`)
        .join('');

      let primaryBtnHtml = '';
      if (p.primaryAction.action === 'installModal') {
        primaryBtnHtml = `<button class="open-install-modal w-full py-2 px-3 text-xs font-semibold rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:border-cyan-500/50 transition-all font-mono">${escapeHtml(p.primaryAction.label)}</button>`;
      } else if (p.primaryAction.action === 'waitlist') {
        primaryBtnHtml = `<button class="waitlist-btn w-full py-2 px-3 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 transition-all font-mono">Join Waitlist</button>`;
      } else {
        primaryBtnHtml = `<a href="${p.primaryAction.url}" class="w-full text-center py-2 px-3 text-xs font-semibold rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:border-cyan-500/50 transition-all font-mono">${escapeHtml(p.primaryAction.label)}</a>`;
      }

      card.innerHTML = `
        <div>
          <div class="flex items-center justify-between mb-4">
            <div class="w-10 h-10 rounded-xl bg-slate-800/80 border border-white/10 flex items-center justify-center text-cyan-400 group-hover:border-cyan-500/40 group-hover:scale-105 transition-all">
              <i data-lucide="${p.iconName || 'box'}" class="w-5 h-5"></i>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-[11px] font-mono px-2 py-0.5 rounded-full border ${p.statusClass}">${p.status}</span>
              <span class="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800/60 border border-white/10 text-slate-400">${p.version}</span>
            </div>
          </div>
          <h3 class="text-lg font-semibold text-white tracking-tight group-hover:text-cyan-300 transition-colors">${escapeHtml(p.name)}</h3>
          <p class="text-xs text-slate-400 mt-2 mb-4 leading-relaxed">${escapeHtml(p.desc)}</p>
          <ul class="space-y-2 mb-6">${bulletsHtml}</ul>
        </div>
        <div class="flex items-center gap-2 pt-4 border-t border-white/[0.06]">
          ${primaryBtnHtml}
          <a href="${p.secondaryAction.url}" target="_blank" rel="noopener" class="py-2 px-3 text-xs font-medium rounded-lg bg-slate-800/40 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/10 transition-all flex items-center justify-center">
            <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
          </a>
        </div>
      `;

      grid.appendChild(card);
    });

    // Attach install modal triggers
    grid.querySelectorAll('.open-install-modal').forEach((btn) => {
      btn.addEventListener('click', () => openModal('installModal'));
    });

    grid.querySelectorAll('.waitlist-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        btn.textContent = 'Waitlist Joined ✔';
        btn.classList.add('text-emerald-400', 'border-emerald-500/40');
      });
    });

    refreshIcons();
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => {
        t.classList.remove('active', 'bg-cyan-500/10', 'text-cyan-300', 'border-cyan-500/30');
        t.classList.add('text-slate-400', 'border-transparent');
      });
      tab.classList.add('active', 'bg-cyan-500/10', 'text-cyan-300', 'border-cyan-500/30');
      tab.classList.remove('text-slate-400', 'border-transparent');
      activeCategory = tab.getAttribute('data-product-filter') || 'all';
      render();
    });
  });

  render();
}

/* ─────────────────────────────────────────────────────────────
   5. Interactive Agent Rig Builder (#assembler & builder.html)
   ───────────────────────────────────────────────────────────── */
const RIG_SHELF_DATA = [
  { id: 'git_checkpoints', name: 'Git Auto-Checkpoints', type: 'Tool', desc: 'Atomic rollback points created before file writes.', delta: 0.3, flag: '--git-guard', icon: 'git-commit' },
  { id: 'ast_guard', name: 'AST Execution Sandbox', type: 'Security', desc: 'Pre-flight AST syntax parser intercepting dangerous calls.', delta: 0.4, flag: '--ast-strict', icon: 'shield-check' },
  { id: 'self_healing', name: 'Auto-Healing Loop', type: 'Skill', desc: 'Autonomous exception diagnosis & dependency installer.', delta: 0.5, flag: '--auto-heal', icon: 'activity' },
  { id: 'json_inspector', name: 'JSON Inspector', type: 'Tool', desc: 'High-speed syntax validation and schema inspector.', delta: 0.2, flag: '--tools json_inspector', icon: 'file-json' },
  { id: 'dpapi_vault', name: 'Windows DPAPI Vault', type: 'Security', desc: 'Hardware-bound AES-256 encrypted credential store.', delta: 0.3, flag: '--dpapi', icon: 'key' },
  { id: 'code_metrics', name: 'Code Quality Auditor', type: 'Plugin', desc: 'AST code complexity & maintainability index calculator.', delta: 0.2, flag: '--plugins code_metrics', icon: 'bar-chart-2' },
  { id: 'hash_calculator', name: 'Cryptographic Hasher', type: 'Tool', desc: 'Multi-algorithm MD5/SHA256 integrity verifier.', delta: 0.2, flag: '--tools hash_calculator', icon: 'hash' },
  { id: 'docker_sandbox', name: 'Docker Isolation', type: 'Integration', desc: 'Containerized ephemeral environment execution bridge.', delta: 0.4, flag: '--docker', icon: 'box' },
];

function initAgentRigBuilder() {
  const shelf = document.getElementById('shelfPieces');
  const slots = document.getElementById('rigSlots');
  const metricAutonomy = document.getElementById('metricAutonomy');
  const metricCount = document.getElementById('metricCount');
  const metricSecurity = document.getElementById('metricSecurity');
  const generatedCmd = document.getElementById('rigGeneratedCmd');
  const clearBtn = document.getElementById('clearRigBtn');
  const copyCmdBtn = document.getElementById('copyRigCmdBtn');

  if (!shelf || !slots) return;

  // Active snapped pieces (default starting rig)
  let snappedIds = new Set(['git_checkpoints', 'ast_guard', 'self_healing']);

  function update() {
    // 1. Render shelf chips
    shelf.innerHTML = '';
    RIG_SHELF_DATA.forEach((item) => {
      const isSnapped = snappedIds.has(item.id);
      const chip = document.createElement('div');
      chip.className = `p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
        isSnapped
          ? 'bg-cyan-950/20 border-cyan-500/40 text-cyan-200'
          : 'bg-slate-900/60 border-white/[0.08] hover:border-cyan-500/30 text-slate-300 hover:bg-slate-800/60'
      }`;

      chip.innerHTML = `
        <div class="flex items-center gap-2.5">
          <div class="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-400">
            <i data-lucide="${item.icon || 'puzzle'}" class="w-3.5 h-3.5"></i>
          </div>
          <div>
            <div class="text-xs font-semibold text-white tracking-tight">${escapeHtml(item.name)}</div>
            <div class="text-[10px] text-slate-400 font-mono">${item.type} &bull; +${item.delta} Autonomy</div>
          </div>
        </div>
        <div class="w-6 h-6 rounded-md flex items-center justify-center text-xs font-mono ${
          isSnapped ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-400'
        }">
          ${isSnapped ? '<i data-lucide="check" class="w-3.5 h-3.5"></i>' : '<i data-lucide="plus" class="w-3.5 h-3.5"></i>'}
        </div>
      `;

      if (!isSnapped) {
        chip.addEventListener('click', () => {
          if (snappedIds.size >= 6) {
            alert('Rig chassis slots full (maximum 6 capabilities). Remove one first!');
            return;
          }
          snappedIds.add(item.id);
          playCyberSound('snap');
          update();
        });
      }
      shelf.appendChild(chip);
    });

    // 2. Render active slots
    slots.innerHTML = '';
    if (snappedIds.size === 0) {
      slots.innerHTML = `
        <div class="col-span-full p-8 rounded-xl border border-dashed border-white/10 text-center text-slate-400">
          <i data-lucide="cpu" class="w-8 h-8 text-slate-500 mx-auto mb-2"></i>
          <div class="font-medium text-slate-300 text-sm">Chassis Slots Empty</div>
          <div class="text-xs text-slate-500 mt-1">Click capabilities on the left shelf to snap them into your active KuroAgent rig!</div>
        </div>
      `;
    } else {
      snappedIds.forEach((id) => {
        const item = RIG_SHELF_DATA.find((x) => x.id === id);
        if (!item) return;

        const card = document.createElement('div');
        card.className = 'p-3.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 flex flex-col justify-between shadow-lg shadow-cyan-950/10 hover:border-cyan-400/50 transition-all';
        card.innerHTML = `
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                <i data-lucide="${item.icon || 'puzzle'}" class="w-3.5 h-3.5 text-cyan-400"></i>
                ${escapeHtml(item.name)}
              </span>
              <button class="slot-remove-btn text-slate-400 hover:text-rose-400 p-1" title="Unsnap capability" data-id="${item.id}">
                <i data-lucide="x" class="w-3.5 h-3.5"></i>
              </button>
            </div>
            <p class="text-[11px] text-slate-400 leading-snug mb-3">${escapeHtml(item.desc)}</p>
          </div>
          <div class="flex items-center justify-between pt-2 border-t border-white/[0.06] text-[10px] font-mono">
            <span class="text-cyan-400 font-semibold">[ACTIVE SLOT]</span>
            <span class="text-slate-300">+${item.delta} LVL</span>
          </div>
        `;

        card.querySelector('.slot-remove-btn').addEventListener('click', () => {
          snappedIds.delete(item.id);
          playCyberSound('click');
          update();
        });

        slots.appendChild(card);
      });
    }

    // 3. Compute metrics
    let baseAutonomy = 1.0;
    snappedIds.forEach((id) => {
      const item = RIG_SHELF_DATA.find((x) => x.id === id);
      if (item) baseAutonomy += item.delta;
    });

    if (metricAutonomy) metricAutonomy.textContent = `Level ${baseAutonomy.toFixed(1)}`;
    if (metricCount) metricCount.textContent = `${snappedIds.size} / 6 Active`;
    if (metricSecurity) {
      if (snappedIds.has('ast_guard') || snappedIds.has('dpapi_vault')) {
        metricSecurity.textContent = 'Sandboxed (Safe)';
        metricSecurity.className = 'text-xs font-mono font-bold text-emerald-400';
      } else {
        metricSecurity.textContent = 'Elevated Privileges';
        metricSecurity.className = 'text-xs font-mono font-bold text-amber-400';
      }
    }

    // 4. Generate CLI launch command
    let cmd = 'kuro';
    const flags = [];
    snappedIds.forEach((id) => {
      const item = RIG_SHELF_DATA.find((x) => x.id === id);
      if (item && item.flag) flags.push(item.flag);
    });
    if (flags.length > 0) {
      cmd += ' ' + flags.join(' ');
    }
    if (generatedCmd) generatedCmd.textContent = cmd;

    refreshIcons();
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      snappedIds.clear();
      playCyberSound('fault');
      update();
    });
  }

  if (copyCmdBtn) {
    copyCmdBtn.addEventListener('click', () => {
      if (generatedCmd) {
        copyText(generatedCmd.textContent);
        playCyberSound('click');
        const oldText = copyCmdBtn.innerHTML;
        copyCmdBtn.innerHTML = '<i data-lucide="check" class="w-3.5 h-3.5"></i> Copied!';
        refreshIcons();
        setTimeout(() => {
          copyCmdBtn.innerHTML = oldText;
          refreshIcons();
        }, 1500);
      }
    });
  }

  update();
}

/* ─────────────────────────────────────────────────────────────
   6. Live Breakdown & Self-Healing Simulator
   ───────────────────────────────────────────────────────────── */
const SCENARIOS = {
  missing_dep: {
    title: 'Missing Package Error',
    sub: 'ModuleNotFoundError: No module named jwt',
    steps: [
      { type: 'err', text: '[Runtime Fault] ModuleNotFoundError: No module named "jwt" detected in tools/auth_token.py' },
      { type: 'warn', text: '[Diagnostician] Kuro AST Engine classified fault: DEPENDENCY_MISSING' },
      { type: 'info', text: '[Rollback Engine] Creating atomic Git checkpoint: pre_heal_dep_checkpoint_0x9f1a' },
      { type: 'info', text: '[Auto-Repair] Resolving PyPI dependency: pip install pyjwt cryptography' },
      { type: 'ok', text: '[Sandbox Verify] Test suite re-run: 14 tests PASSED (0 failures)' },
      { type: 'ok', text: '[Autonomous Recovery] State healed successfully in 1.42s &bull; Resuming execution loop.' },
    ],
  },
  syntax_error: {
    title: 'Syntax & AST Bug',
    sub: 'IndentationError: unexpected indent in tool',
    steps: [
      { type: 'err', text: '[AST Parser Fault] IndentationError at tools/calculator.py line 42: unexpected indent' },
      { type: 'warn', text: '[Diagnostician] Kuro AST Engine classified fault: SYNTAX_INDENTATION_PARSE_FAIL' },
      { type: 'info', text: '[Rollback Engine] Restoring pristine file state from git checkpoint: commit 3a9e201' },
      { type: 'info', text: '[Code Synthesis] Running AST re-indentation autofix on AST grammar tree' },
      { type: 'ok', text: '[Sandbox Verify] Syntax tree validated with ast.parse() &bull; Clean syntax tree confirmed' },
      { type: 'ok', text: '[Autonomous Recovery] Code repaired automatically &bull; Resuming task execution.' },
    ],
  },
  disk_wipe: {
    title: 'Malicious Code Attempt',
    sub: 'Dangerous os.system("rmdir /s") intercepted',
    steps: [
      { type: 'err', text: '[Security Alert] Untrusted script requested: os.system("rmdir /s /q C:\\Users\\...")' },
      { type: 'warn', text: '[AST Sandbox] Forbidden AST Token detected: Call(os.system) with destructive shell args' },
      { type: 'warn', text: '[Policy Enforcer] Execution blocked immediately. Violation code: SEC_AST_DANGEROUS_CALL' },
      { type: 'info', text: '[Telemetry Dispatch] Incident logged in security ledger &bull; Agent session isolated' },
      { type: 'ok', text: '[System Protected] Zero filesystem modifications permitted &bull; Host integrity preserved.' },
    ],
  },
};

function initSelfHealingLab() {
  const scenarioBtns = document.querySelectorAll('.scenario-btn');
  const triggerBtn = document.getElementById('triggerFaultBtn');
  const phaseText = document.getElementById('healingPhaseText');
  const logBox = document.getElementById('healingLogBox');

  if (!triggerBtn || !logBox) return;

  let activeScenario = 'missing_dep';
  let isRunning = false;

  scenarioBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (isRunning) return;
      scenarioBtns.forEach((b) => {
        b.classList.remove('active', 'border-cyan-500/40', 'bg-cyan-950/20');
        b.classList.add('border-white/[0.08]', 'bg-slate-900/60');
      });
      btn.classList.add('active', 'border-cyan-500/40', 'bg-cyan-950/20');
      btn.classList.remove('border-white/[0.08]', 'bg-slate-900/60');

      activeScenario = btn.getAttribute('data-scenario') || 'missing_dep';
      logBox.innerHTML = `<div class="heal-line dim">Scenario selected: <strong class="text-white">${SCENARIOS[activeScenario].title}</strong>. Click "Inject Fault" below to trigger Kuro's diagnosis loop...</div>`;
      if (phaseText) phaseText.innerHTML = '<span class="text-cyan-400 font-semibold font-mono">STATUS: IDLE &bull; READY FOR STRESS TEST</span>';
    });
  });

  triggerBtn.addEventListener('click', () => {
    if (isRunning) return;
    isRunning = true;
    triggerBtn.disabled = true;
    triggerBtn.classList.add('opacity-50', 'cursor-not-allowed');

    playCyberSound('fault');
    logBox.innerHTML = '';
    if (phaseText) phaseText.innerHTML = '<span class="text-rose-400 font-semibold font-mono animate-pulse">STATUS: FAULT INJECTED &bull; DIAGNOSTIC LOOP RUNNING...</span>';

    const steps = SCENARIOS[activeScenario].steps;
    let stepIndex = 0;

    function nextStep() {
      if (stepIndex >= steps.length) {
        isRunning = false;
        triggerBtn.disabled = false;
        triggerBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        if (phaseText) phaseText.innerHTML = '<span class="text-emerald-400 font-semibold font-mono">STATUS: FAULT RESOLVED &bull; ALL SYSTEMS RESTORED (100%)</span>';
        playCyberSound('heal');
        return;
      }

      const st = steps[stepIndex];
      const line = document.createElement('div');
      line.className = `heal-line ${st.type}`;
      
      let icon = 'info';
      if (st.type === 'err') icon = 'alert-triangle';
      if (st.type === 'warn') icon = 'alert-circle';
      if (st.type === 'ok') icon = 'check-circle-2';

      line.innerHTML = `<i data-lucide="${icon}" class="w-3.5 h-3.5 flex-shrink-0 mt-0.5"></i> <span>${st.text}</span>`;
      logBox.appendChild(line);
      logBox.scrollTop = logBox.scrollHeight;
      refreshIcons();

      stepIndex++;
      setTimeout(nextStep, 550);
    }

    nextStep();
  });
}

/* ─────────────────────────────────────────────────────────────
   7. Capability Market & Puzzle Store
   ───────────────────────────────────────────────────────────── */
const STORE_PIECES_DATA = [
  {
    name: 'json_inspector',
    type: 'tool',
    desc: 'Fast JSON formatter, syntax validator, and schema validator utility.',
    tags: ['json', 'format', 'parser', 'utility'],
    filePath: 'tools/json_inspector.py',
    author: 'kuroLabs-ai',
  },
  {
    name: 'hash_calculator',
    type: 'tool',
    desc: 'Compute MD5, SHA1, SHA256, or SHA512 cryptographic checksums.',
    tags: ['crypto', 'sha256', 'hash', 'security'],
    filePath: 'tools/hash_calculator.py',
    author: 'kuroLabs-ai',
  },
  {
    name: 'regex_tester',
    type: 'tool',
    desc: 'Tests regular expressions against candidate text with match groups.',
    tags: ['regex', 'pattern', 'text', 'testing'],
    filePath: 'tools/regex_tester.py',
    author: 'kuroLabs-ai',
  },
  {
    name: 'currency_converter',
    type: 'tool',
    desc: 'Calculates foreign exchange conversions using baseline currency ratios.',
    tags: ['finance', 'currency', 'math', 'rates'],
    filePath: 'tools/currency_converter.py',
    author: 'kuroLabs-ai',
  },
  {
    name: 'code_metrics',
    type: 'plugin',
    desc: 'Analyzes Python source files to calculate lines of code and function count.',
    tags: ['metrics', 'analysis', 'code-quality', 'audit'],
    filePath: 'plugins/code_metrics/main.py',
    author: 'kuroLabs-ai',
  },
  {
    name: 'dependency_guard',
    type: 'plugin',
    desc: 'Scans requirements.txt to flag unpinned or vulnerable packages.',
    tags: ['dependencies', 'security', 'pip', 'safety'],
    filePath: 'plugins/dependency_guard/main.py',
    author: 'kuroLabs-ai',
  },
  {
    name: 'tdd_refactoring',
    type: 'skill',
    desc: 'Test-Driven Development refactoring routine (Red -> Green -> Refactor -> Verify).',
    tags: ['tdd', 'testing', 'refactor', 'workflow'],
    filePath: 'skills/tdd_refactoring/SKILL.md',
    author: 'kuroLabs-ai',
  },
  {
    name: 'security_audit',
    type: 'skill',
    desc: 'Automated security inspection checking AST dangerous calls, secrets, and permissions.',
    tags: ['security', 'audit', 'ast', 'sandbox'],
    filePath: 'skills/security_audit/SKILL.md',
    author: 'kuroLabs-ai',
  },
  {
    name: 'gitlab',
    type: 'integration',
    desc: 'GitLab REST API connector for repository inspection, issue tracking, and CI/CD pipelines.',
    tags: ['gitlab', 'vcs', 'ci-cd', 'devops'],
    filePath: 'kurocode.integrations.gitlab',
    author: 'community',
  },
  {
    name: 'slack',
    type: 'integration',
    desc: 'Slack Webhook connector for dispatching operational alerts and team notifications.',
    tags: ['slack', 'notifications', 'alerts', 'chatops'],
    filePath: 'kurocode.integrations.slack',
    author: 'community',
  },
];

function initStoreMarket() {
  const grid = document.getElementById('marketPiecesGrid');
  const search = document.getElementById('storeSearchInput');
  const filterPills = document.querySelectorAll('#storeFilterButtons .filter-pill');

  if (!grid) return;

  let currentCategory = 'all';
  let searchQuery = '';

  function updateCounts() {
    const elAll = document.getElementById('countAll');
    const elTools = document.getElementById('countTools');
    const elPlugins = document.getElementById('countPlugins');
    const elSkills = document.getElementById('countSkills');
    const elIntegs = document.getElementById('countIntegs');

    if (elAll) elAll.textContent = STORE_PIECES_DATA.length;
    if (elTools) elTools.textContent = STORE_PIECES_DATA.filter((p) => p.type === 'tool').length;
    if (elPlugins) elPlugins.textContent = STORE_PIECES_DATA.filter((p) => p.type === 'plugin').length;
    if (elSkills) elSkills.textContent = STORE_PIECES_DATA.filter((p) => p.type === 'skill').length;
    if (elIntegs) elIntegs.textContent = STORE_PIECES_DATA.filter((p) => p.type === 'integration').length;
  }

  function getBadgeConfig(type) {
    switch (type) {
      case 'tool':
        return { label: 'TOOL', icon: 'wrench', cls: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' };
      case 'plugin':
        return { label: 'PLUGIN', icon: 'plug', cls: 'bg-violet-500/10 text-violet-400 border-violet-500/30' };
      case 'skill':
        return { label: 'SKILL', icon: 'brain', cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
      case 'integration':
        return { label: 'INTEG', icon: 'network', cls: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
      default:
        return { label: 'PIECE', icon: 'puzzle', cls: 'bg-slate-800 text-slate-300 border-white/10' };
    }
  }

  function render() {
    grid.innerHTML = '';
    const q = searchQuery.toLowerCase().trim();

    const filtered = STORE_PIECES_DATA.filter((p) => {
      const matchType = currentCategory === 'all' || p.type === currentCategory;
      const matchQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));

      return matchType && matchQuery;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full py-16 text-center text-slate-400">
          <i data-lucide="search-x" class="w-10 h-10 mx-auto text-slate-600 mb-2"></i>
          <p class="text-sm">No puzzle pieces found matching "<span class="text-white">${escapeHtml(q)}</span>".</p>
          <button id="emptyStatePublishBtn" class="mt-3 px-3.5 py-1.5 text-xs rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all font-mono">
            + Publish this Capability
          </button>
        </div>
      `;
      const btn = document.getElementById('emptyStatePublishBtn');
      if (btn) btn.addEventListener('click', () => openModal('publishModal'));
      refreshIcons();
      return;
    }

    filtered.forEach((p) => {
      const badge = getBadgeConfig(p.type);
      const card = document.createElement('div');
      card.className = 'group rounded-2xl bg-slate-900/60 border border-white/[0.08] hover:border-cyan-500/40 p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-cyan-950/20';

      const tagsHtml = p.tags
        .slice(0, 3)
        .map((t) => `<span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800/80 border border-white/10 text-slate-400">#${escapeHtml(t)}</span>`)
        .join('');

      card.innerHTML = `
        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1.5 ${badge.cls}">
              <i data-lucide="${badge.icon}" class="w-3 h-3"></i>
              ${badge.label}
            </span>
            <span class="text-[11px] font-mono text-slate-500">${escapeHtml(p.filePath.split('/')[0])}</span>
          </div>
          <h4 class="text-base font-semibold text-white tracking-tight group-hover:text-cyan-300 transition-colors">${escapeHtml(p.name)}</h4>
          <p class="text-xs text-slate-400 mt-1.5 mb-4 leading-relaxed line-clamp-2">${escapeHtml(p.desc)}</p>
          <div class="flex flex-wrap gap-1.5 mb-4">${tagsHtml}</div>
        </div>
        <div class="pt-3 border-t border-white/[0.06]">
          <button class="piece-snap-btn w-full py-2 px-3 text-xs font-mono font-medium rounded-lg bg-slate-800/80 hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-500/30 transition-all flex items-center justify-between group/btn" data-name="${p.name}">
            <span class="truncate">/store install ${p.name}</span>
            <span class="copy-tooltip text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300 flex items-center gap-1">
              <i data-lucide="copy" class="w-3 h-3"></i> Snap
            </span>
          </button>
        </div>
      `;

      grid.appendChild(card);
    });

    // Snap buttons
    grid.querySelectorAll('.piece-snap-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-name');
        copyText(`/store install ${name}`);
        playCyberSound('click');
        const tip = btn.querySelector('.copy-tooltip');
        tip.innerHTML = '<i data-lucide="check" class="w-3 h-3 text-emerald-400"></i> Copied!';
        tip.classList.add('bg-emerald-950/80', 'text-emerald-300', 'border', 'border-emerald-500/40');
        refreshIcons();
        setTimeout(() => {
          tip.innerHTML = '<i data-lucide="copy" class="w-3 h-3"></i> Snap';
          tip.classList.remove('bg-emerald-950/80', 'text-emerald-300', 'border', 'border-emerald-500/40');
          refreshIcons();
        }, 1500);
      });
    });

    refreshIcons();
  }

  filterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      filterPills.forEach((p) => {
        p.classList.remove('active', 'bg-cyan-500/10', 'text-cyan-300', 'border-cyan-500/30');
        p.classList.add('text-slate-400', 'border-white/10', 'bg-slate-900/60');
      });
      pill.classList.add('active', 'bg-cyan-500/10', 'text-cyan-300', 'border-cyan-500/30');
      pill.classList.remove('text-slate-400', 'border-white/10', 'bg-slate-900/60');
      currentCategory = pill.getAttribute('data-type') || 'all';
      playCyberSound('click');
      render();
    });
  });

  if (search) {
    search.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      render();
    });
  }

  updateCounts();
  render();
}

/* ─────────────────────────────────────────────────────────────
   8. Interactive Terminal Lab Simulator
   ───────────────────────────────────────────────────────────── */
function initTerminalLab() {
  const output = document.getElementById('terminalOutput');
  const input = document.getElementById('terminalInput');
  const execBtn = document.getElementById('terminalExecBtn');
  const presets = document.querySelectorAll('.preset-btn');

  if (!output || !input) return;

  function print(html, cls = '') {
    const el = document.createElement('div');
    el.className = `term-entry ${cls}`;
    el.innerHTML = html;
    output.appendChild(el);
    output.scrollTop = output.scrollHeight;
  }

  // Initial greeting
  print('<span class="cyan">KURO 2.0 Autonomous Terminal Intelligence &bull; Ready</span>');
  print('<span class="dim">Type any slash command or click a quick preset on the left.</span>');

  function runCmd(raw) {
    const cmd = raw.trim();
    if (!cmd) return;

    print(`<span class="console-prompt">kuro &gt;</span> ${escapeHtml(cmd)}`);
    const lower = cmd.toLowerCase();

    if (lower === 'clear' || lower === '/clear') {
      output.innerHTML = '';
      return;
    }

    if (lower === '/help' || lower === 'help') {
      print('<span class="cyan">KURO 2.0 Command Reference:</span>');
      print('  <span class="cyan">/store list</span>                - List all puzzle-piece capabilities');
      print('  <span class="cyan">/store install &lt;name|url&gt;</span>    - 1-click install tool/plugin/skill');
      print('  <span class="cyan">/store update</span>              - Sync catalog from https://github.com/kuroLabs-ai/hub');
      print('  <span class="cyan">/heal status</span>               - Dedicated self-healing AST diagnostics');
      print('  <span class="cyan">/system</span>                    - Real-time hardware telemetry');
      print('  <span class="cyan">clear</span>                      - Reset console viewport');
      return;
    }

    if (lower === '/store list' || lower === 'store list') {
      print('<span class="cyan">🧩 Kuro Capability Store — Installed & Available Pieces:</span>');
      print('┌──────────────┬──────────────────┬──────────────┬──────────────────────────────────────────┐', 'dim');
      print('│ <span class="cyan">TYPE</span>         │ <span class="cyan">PIECE NAME</span>       │ <span class="cyan">STATUS</span>       │ <span class="cyan">DESCRIPTION</span>                              │');
      print('├──────────────┼──────────────────┼──────────────┼──────────────────────────────────────────┤', 'dim');
      print('│ <span class="cyan">TOOL</span>         │ json_inspector   │ <span class="green">✓ Installed</span>  │ Fast JSON formatter and syntax validator │');
      print('│ <span class="cyan">TOOL</span>         │ hash_calculator  │ <span class="dim">○ Available</span>  │ Cryptographic MD5/SHA256 checksums       │');
      print('│ <span class="cyan">TOOL</span>         │ regex_tester     │ <span class="dim">○ Available</span>  │ Regex tester & match group extractor     │');
      print('│ <span class="cyan">TOOL</span>         │ currency_convert │ <span class="dim">○ Available</span>  │ Exchange rates baseline math utility     │');
      print('│ <span class="cyan">PLUGIN</span>       │ code_metrics     │ <span class="dim">○ Available</span>  │ Codebase lines of code & metrics audit   │');
      print('│ <span class="cyan">SKILL</span>        │ tdd_refactoring  │ <span class="green">✓ Installed</span>  │ Red -> Green -> Refactor TDD pipeline    │');
      print('│ <span class="cyan">SKILL</span>        │ security_audit   │ <span class="dim">○ Available</span>  │ Automated AST security inspection        │');
      print('│ <span class="cyan">INTEG</span>        │ gitlab           │ <span class="dim">○ Available</span>  │ GitLab REST API & CI/CD connector        │');
      print('│ <span class="cyan">INTEG</span>        │ slack            │ <span class="dim">○ Available</span>  │ Slack Webhook operational alert bridge   │');
      print('└──────────────┴──────────────────┴──────────────┴──────────────────────────────────────────┘', 'dim');
      return;
    }

    if (lower === '/store update' || lower === 'store update') {
      print('<span class="cyan">🌐 Contacting Online Community Hub (kuroLabs-ai/hub)...</span>');
      setTimeout(() => {
        print('<span class="green">✔ [OK] Successfully synced 10 online puzzle pieces from GitHub!</span>');
        print('<span class="dim">Catalog source: https://raw.githubusercontent.com/kuroLabs-ai/hub/main/catalog.json</span>');
        playCyberSound('heal');
      }, 350);
      return;
    }

    if (lower.startsWith('/store install') || lower.startsWith('store install')) {
      const target = raw.split(/\s+/)[2] || 'piece';
      print(`<span class="dim">Resolving source for puzzle piece '${target}'...</span>`);
      setTimeout(() => {
        print('<span class="dim">[Sandbox] AST code safety analysis: PASS (0 violations)</span>');
        print(`<span class="green">✔ [OK] Puzzle piece '${target}' hot-registered into Kuro runtime without restart!</span>`);
        playCyberSound('snap');
      }, 300);
      return;
    }

    if (lower === '/heal status' || lower === 'heal status') {
      print('<span class="cyan">🩺 Dedicated Self-Healing Subsystem:</span>');
      print('  <span class="dim">Status:</span>       <span class="green">Active & Watching</span>');
      print('  <span class="dim">Detector:</span>     AST & Runtime Exception Classifier');
      print('  <span class="dim">Diagnostician:</span> Rule-based & LLM Diagnostic Pipeline');
      print('  <span class="dim">Repairer:</span>     Pip dependency resolver & Syntax autofixer');
      print('  <span class="dim">Rollback:</span>     Git Checkpoints Enabled (100% Reversible)');
      return;
    }

    if (lower === '/system' || lower === 'system') {
      print('<span class="cyan">💻 Live Hardware Telemetry:</span>');
      print('  <span class="dim">OS:</span>      Windows 11 Pro / x86_64');
      print('  <span class="dim">Runtime:</span> Python 3.13.3 [KuroCode v0.2.0]');
      print('  <span class="dim">Sandbox:</span> Strict Mode (Restricted Imports Enforced)');
      print('  <span class="dim">Memory:</span>  SQLite Vector-Hybrid Database Attached (0 leaks)');
      return;
    }

    print(`<span class="yellow">Command '${escapeHtml(raw)}' processed. Type <span class="cyan">/help</span> for commands.</span>`);
  }

  function submit() {
    const val = input.value;
    input.value = '';
    runCmd(val);
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submit();
  });

  if (execBtn) execBtn.addEventListener('click', submit);

  presets.forEach((btn) => {
    btn.addEventListener('click', () => {
      presets.forEach((p) => p.classList.remove('active', 'border-cyan-500/40', 'bg-cyan-950/20'));
      btn.classList.add('active', 'border-cyan-500/40', 'bg-cyan-950/20');
      const cmd = btn.getAttribute('data-cmd');
      if (cmd) {
        input.value = cmd;
        submit();
      }
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   9. 1-Click Environment Setup Generator (#setup-gen & docs.html)
   ───────────────────────────────────────────────────────────── */
function initSetupGenerator() {
  const osBtns = document.querySelectorAll('#osOptions .ctrl-btn');
  const providerBtns = document.querySelectorAll('#providerOptions .ctrl-btn');
  const safetyBtns = document.querySelectorAll('#safetyOptions .ctrl-btn');
  const preview = document.getElementById('generatedEnvBox');
  const copyBtn = document.getElementById('copyEnvBtn');

  if (!preview) return;

  let selectedOS = 'windows';
  let selectedProvider = 'gemini';
  let selectedSafety = 'strict';

  function compileConfig() {
    let envLines = [
      '# ========================================================',
      '# KuroCode Agent — Environment Configuration (.env)',
      `# Generated for OS: ${selectedOS.toUpperCase()} | Provider: ${selectedProvider.toUpperCase()}`,
      '# ========================================================',
      '',
    ];

    if (selectedProvider === 'gemini') {
      envLines.push('# Google Gemini (Free Tier API Key from https://aistudio.google.com/)');
      envLines.push('GEMINI_API_KEY="AIzaSyYourGeminiApiKeyHere"');
      envLines.push('DEFAULT_PROVIDER="gemini"');
      envLines.push('DEFAULT_MODEL="gemini-2.0-flash"');
    } else if (selectedProvider === 'groq') {
      envLines.push('# Groq Cloud (Ultra-Fast Llama-3 from https://console.groq.com/)');
      envLines.push('GROQ_API_KEY="gsk_YourGroqApiKeyHere"');
      envLines.push('DEFAULT_PROVIDER="groq"');
      envLines.push('DEFAULT_MODEL="llama-3.3-70b-versatile"');
    } else if (selectedProvider === 'ollama') {
      envLines.push('# Ollama (100% Offline & Private Local Inference)');
      envLines.push('OLLAMA_BASE_URL="http://localhost:11434"');
      envLines.push('DEFAULT_PROVIDER="ollama"');
      envLines.push('DEFAULT_MODEL="qwen2.5-coder:7b"');
    } else if (selectedProvider === 'openrouter') {
      envLines.push('# OpenRouter (Multi-Provider Aggregator)');
      envLines.push('OPENROUTER_API_KEY="sk-or-v1-YourKeyHere"');
      envLines.push('DEFAULT_PROVIDER="openrouter"');
      envLines.push('DEFAULT_MODEL="anthropic/claude-3.5-sonnet"');
    }

    envLines.push('');
    envLines.push('# Security & Execution Guard');
    if (selectedSafety === 'strict') {
      envLines.push('KURO_SAFE_MODE=true');
      envLines.push('KURO_REQUIRE_CONFIRMATION=true');
      envLines.push('KURO_GIT_CHECKPOINTS=true');
    } else {
      envLines.push('KURO_SAFE_MODE=false');
      envLines.push('KURO_REQUIRE_CONFIRMATION=false');
      envLines.push('KURO_GIT_CHECKPOINTS=true');
    }

    envLines.push('');
    envLines.push('# Community Capability Hub');
    envLines.push('HUB_CATALOG_URL="https://raw.githubusercontent.com/kuroLabs-ai/hub/main/catalog.json"');
    envLines.push('');
    envLines.push('# ========================================================');
    envLines.push('# Terminal Startup Command:');
    envLines.push('# ========================================================');

    if (selectedOS === 'windows') {
      envLines.push('git clone https://github.com/kuroLabs-ai/KuroCodeAgent.git');
      envLines.push('cd KuroCodeAgent');
      envLines.push('python -m venv venv');
      envLines.push('.\\venv\\Scripts\\activate');
      envLines.push('pip install -e .');
      envLines.push('kuro');
    } else if (selectedOS === 'macos') {
      envLines.push('git clone https://github.com/kuroLabs-ai/KuroCodeAgent.git');
      envLines.push('cd KuroCodeAgent');
      envLines.push('python3 -m venv venv');
      envLines.push('source venv/bin/activate');
      envLines.push('pip install -e .');
      envLines.push('kuro');
    } else {
      // linux
      envLines.push('git clone https://github.com/kuroLabs-ai/KuroCodeAgent.git');
      envLines.push('cd KuroCodeAgent');
      envLines.push('python3 -m venv venv');
      envLines.push('source venv/bin/activate');
      envLines.push('pip install -e .');
      envLines.push('kuro');
    }

    preview.textContent = envLines.join('\n');
  }

  function bindGroup(buttons, callback) {
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => {
          b.classList.remove('active', 'border-cyan-500/40', 'bg-cyan-950/20', 'text-cyan-300');
          b.classList.add('border-white/[0.08]', 'bg-slate-900/60', 'text-slate-400');
        });
        btn.classList.add('active', 'border-cyan-500/40', 'bg-cyan-950/20', 'text-cyan-300');
        btn.classList.remove('border-white/[0.08]', 'bg-slate-900/60', 'text-slate-400');
        playCyberSound('click');
        callback(btn.getAttribute('data-val'));
        compileConfig();
      });
    });
  }

  bindGroup(osBtns, (val) => (selectedOS = val));
  bindGroup(providerBtns, (val) => (selectedProvider = val));
  bindGroup(safetyBtns, (val) => (selectedSafety = val));

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      copyText(preview.textContent);
      playCyberSound('click');
      const old = copyBtn.innerHTML;
      copyBtn.innerHTML = '<i data-lucide="check" class="w-3.5 h-3.5"></i> Copied!';
      refreshIcons();
      setTimeout(() => {
        copyBtn.innerHTML = old;
        refreshIcons();
      }, 1500);
    });
  }

  compileConfig();
}

/* ─────────────────────────────────────────────────────────────
   10. Interactive Modals Management
   ───────────────────────────────────────────────────────────── */
function openModal(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.add('open');
    playCyberSound('click');
    refreshIcons();
  }
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.remove('open');
    playCyberSound('click');
  }
}

function initModals() {
  // Modal triggers
  const openInstallBtn = document.getElementById('openInstallModalBtn');
  const heroInstallBtn = document.getElementById('heroInstallBtn');
  const closeInstallBtn = document.getElementById('closeInstallModalBtn');

  if (openInstallBtn) openInstallBtn.addEventListener('click', () => openModal('installModal'));
  if (heroInstallBtn) heroInstallBtn.addEventListener('click', () => openModal('installModal'));
  if (closeInstallBtn) closeInstallBtn.addEventListener('click', () => closeModal('installModal'));

  // Publish Modal
  const openSubmitBtn = document.getElementById('openSubmitPieceBtn');
  const footerPublishLink = document.getElementById('footerPublishLink');
  const closePublishBtn = document.getElementById('closePublishModalBtn');

  if (openSubmitBtn) openSubmitBtn.addEventListener('click', () => openModal('publishModal'));
  if (footerPublishLink) {
    footerPublishLink.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('publishModal');
    });
  }
  if (closePublishBtn) closePublishBtn.addEventListener('click', () => closeModal('publishModal'));

  // Add Product Modal
  const openAddProdBtn = document.getElementById('openAddProductModalBtn');
  const closeAddProdBtn = document.getElementById('closeAddProductModalBtn');

  if (openAddProdBtn) openAddProdBtn.addEventListener('click', () => openModal('addProductModal'));
  if (closeAddProdBtn) closeAddProdBtn.addEventListener('click', () => closeModal('addProductModal'));

  // Close on outside click
  document.querySelectorAll('.modal-overlay').forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
  });

  // Install Tabs
  const installTabs = document.querySelectorAll('#installTabs .tab-switch');
  installTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      installTabs.forEach((t) => {
        t.classList.remove('active', 'border-cyan-500/40', 'bg-cyan-950/20', 'text-cyan-300');
        t.classList.add('border-white/[0.08]', 'bg-slate-900/60', 'text-slate-400');
      });
      tab.classList.add('active', 'border-cyan-500/40', 'bg-cyan-950/20', 'text-cyan-300');
      tab.classList.remove('border-white/[0.08]', 'bg-slate-900/60', 'text-slate-400');
      const target = tab.getAttribute('data-tab');

      document.querySelectorAll('.install-tab-content').forEach((c) => c.classList.add('hidden'));
      const targetEl = document.getElementById(`tabContent${target.charAt(0).toUpperCase() + target.slice(1)}`);
      if (targetEl) targetEl.classList.remove('hidden');
    });
  });

  // Publish Piece Form
  const publishForm = document.getElementById('publishPieceForm');
  const previewBox = document.getElementById('blueprintPreviewBox');
  const jsonCode = document.getElementById('blueprintJsonCode');
  const copyBlueprintBtn = document.getElementById('copyBlueprintBtn');

  if (publishForm) {
    publishForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('pieceName').value.trim().toLowerCase();
      const type = document.getElementById('pieceType').value;
      const desc = document.getElementById('pieceDesc').value.trim();
      const filePath = document.getElementById('pieceFilePath').value.trim();
      const author = document.getElementById('pieceAuthor').value.trim();
      const tags = document
        .getElementById('pieceTags')
        .value.split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      const blueprint = {
        id: `${type}_${name}`,
        name: name,
        item_type: type,
        description: desc,
        version: '1.0.0',
        author: author,
        tags: tags.length ? tags : [type, 'community'],
        file_path: filePath,
        payload: {
          entrypoint: name,
        },
      };

      if (jsonCode) jsonCode.textContent = JSON.stringify(blueprint, null, 2);
      if (previewBox) previewBox.classList.remove('hidden');
      playCyberSound('heal');

      // Also dynamically add to local market list immediately!
      STORE_PIECES_DATA.unshift({
        name: name,
        type: type,
        desc: desc,
        tags: tags,
        filePath: filePath,
        author: author,
      });
      initStoreMarket();
    });
  }

  if (copyBlueprintBtn) {
    copyBlueprintBtn.addEventListener('click', () => {
      if (jsonCode) {
        copyText(jsonCode.textContent);
        playCyberSound('click');
        const old = copyBlueprintBtn.innerHTML;
        copyBlueprintBtn.innerHTML = '<i data-lucide="check" class="w-3.5 h-3.5"></i> Copied!';
        refreshIcons();
        setTimeout(() => {
          copyBlueprintBtn.innerHTML = old;
          refreshIcons();
        }, 1500);
      }
    });
  }

  // Add Product Form
  const addProdForm = document.getElementById('addProductForm');
  if (addProdForm) {
    addProdForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('prodName').value.trim();
      const category = document.getElementById('prodCategory').value;
      const desc = document.getElementById('prodDesc').value.trim();
      const version = document.getElementById('prodVersion').value.trim() || 'v0.1.0';
      const status = document.getElementById('prodStatus').value.trim() || 'Custom';
      const repoUrl = document.getElementById('prodRepoUrl').value.trim();

      PRODUCTS_DATA.push({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name: name,
        category: category,
        version: version,
        status: status,
        statusClass: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
        iconName: 'box',
        desc: desc,
        bullets: ['Custom community product', 'Integrated with KuroLabs ecosystem'],
        primaryAction: { label: 'Explore', url: repoUrl },
        secondaryAction: { label: 'Repo', url: repoUrl },
      });

      initProductMatrix();
      closeModal('addProductModal');
      addProdForm.reset();
      playCyberSound('heal');

      const pSec = document.getElementById('products');
      if (pSec) pSec.scrollIntoView({ behavior: 'smooth' });
    });
  }
}

/* ─────────────────────────────────────────────────────────────
   11. Clipboard Utilities
   ───────────────────────────────────────────────────────────── */
function initClipboardUtils() {
  const quickCopyBox = document.getElementById('quickCopyBox');
  if (quickCopyBox) {
    quickCopyBox.addEventListener('click', () => {
      const text = document.getElementById('commandText').textContent;
      copyText(text);
      playCyberSound('click');
      const tip = quickCopyBox.querySelector('.copy-tooltip');
      if (tip) {
        tip.innerHTML = '<i data-lucide="check" class="w-3 h-3 text-emerald-400"></i> Copied';
        refreshIcons();
        setTimeout(() => {
          tip.innerHTML = '<i data-lucide="copy" class="w-3 h-3"></i> Copy';
          refreshIcons();
        }, 1500);
      }
    });
  }

  document.querySelectorAll('.btn-copy-code').forEach((btn) => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-copy');
      if (text) {
        copyText(text);
        playCyberSound('click');
        const old = btn.innerHTML;
        btn.innerHTML = '<i data-lucide="check" class="w-3 h-3 text-emerald-400"></i> Copied';
        refreshIcons();
        setTimeout(() => {
          btn.innerHTML = old;
          refreshIcons();
        }, 1500);
      }
    });
  });
}

function copyText(str) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(str);
  } else {
    const ta = document.createElement('textarea');
    ta.value = str;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
