/**
 * KuroLabs AI — Enterprise Web Portal Application
 * 100% Vanilla JavaScript (Zero External Dependencies)
 * Fully Compatible with GitHub Pages (Vanilla HTML5 / CSS3 / ES6)
 */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  initAudioSynthesizer();
  initCatEasterEgg();
  initProductMatrix();
  initAgentRigBuilder();
  initSelfHealingLab();
  initStoreMarket();
  initTerminalLab();
  initSetupGenerator();
  initModals();
  initClipboardUtils();
});

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
  const count = Math.min(50, Math.floor(w / 30));

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
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

        if (dist < 130) {
          ctx.strokeStyle = `rgba(0, 255, 204, ${0.12 * (1 - dist / 130)})`;
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

      ctx.fillStyle = 'rgba(0, 255, 204, 0.45)';
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
  const icon = document.getElementById('sfxIcon');
  const label = document.getElementById('sfxLabel');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    sfxEnabled = !sfxEnabled;
    if (sfxEnabled) {
      toggleBtn.classList.remove('sfx-muted');
      if (icon) icon.textContent = '🔊';
      if (label) label.textContent = 'SFX: ON';
      playCyberSound('click');
    } else {
      toggleBtn.classList.add('sfx-muted');
      if (icon) icon.textContent = '🔇';
      if (label) label.textContent = 'SFX: OFF';
    }
  });

  // Attach subtle click SFX to buttons and tabs
  document.querySelectorAll('button, .tab-btn, .tab-switch, .filter-pill, .platform-tag').forEach((btn) => {
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
  "Nya! I'm Kuro. Ready to inspect code and heal servers.",
  "Purr... AST syntax tree verified. Zero malicious tokens detected!",
  "Did someone say DPAPI vault? Your API keys are locked tight with me, nya!",
  "Level 2 autonomy active: I write code, run tests, and fix bugs while you drink boba.",
  "Need a custom tool? Snap it from the Capability Market or build your own!",
  "Git checkpoints guard your repository — every file edit is 100% reversible!",
  "Zero hallucination policy: If code breaks, self-healing diagnostics patch it instantly."
];

function initCatEasterEgg() {
  const avatar = document.querySelector('.brand-avatar');
  const bubble = document.getElementById('catBubble');
  const text = document.getElementById('catBubbleText');
  if (!avatar || !bubble || !text) return;

  let quoteIdx = 0;
  let timer = null;

  avatar.addEventListener('click', (e) => {
    e.preventDefault();
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
   4. Modular Product Matrix (Easily Add New Programs)
   ───────────────────────────────────────────────────────────── */
const PRODUCTS_DATA = [
  {
    id: 'kurocode',
    name: 'KuroCode Agent',
    category: 'agent',
    version: 'v0.2.0',
    status: 'Stable Release',
    statusClass: 'status-stable',
    icon: '⚡',
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
    statusClass: 'status-hub',
    icon: '🧩',
    desc: 'Community marketplace where developers and agents snap in Tools, Plugins, Skills, and Integrations like puzzle pieces.',
    bullets: [
      '1-click installation: /store install <name>',
      'Separate source files with GitHub branch resolving',
      'Community Pull Request workflow & catalog sync',
    ],
    primaryAction: { label: 'Browse Market', url: '#market' },
    secondaryAction: { label: 'Hub Repo', url: 'https://github.com/kuroLabs-ai/hub' },
  },
  {
    id: 'kurostudio',
    name: 'KuroStudio Suite',
    category: 'creative',
    version: 'v0.1.0',
    status: 'Private Beta',
    statusClass: 'status-beta',
    icon: '🎬',
    desc: 'Next-generation AI creative studio for procedural video editing, automated motion graphics, and multimodal timeline orchestration.',
    bullets: [
      'Autonomous video timeline generation from prompts',
      'Multi-track audio, speech synthesis & visual layering',
      'Direct integration with KuroCode developer toolchains',
    ],
    primaryAction: { label: 'Waitlist', action: 'waitlist' },
    secondaryAction: { label: 'Overview', url: '#architecture' },
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
      card.className = 'product-matrix-card';

      const bulletsHtml = p.bullets
        .map((b) => `<li><span class="bullet-check">✔</span> ${escapeHtml(b)}</li>`)
        .join('');

      let primaryBtnHtml = '';
      if (p.primaryAction.action === 'installModal') {
        primaryBtnHtml = `<button class="btn-card-primary open-install-modal">${escapeHtml(p.primaryAction.label)}</button>`;
      } else if (p.primaryAction.action === 'waitlist') {
        primaryBtnHtml = `<button class="btn-card-primary waitlist-btn">Join Waitlist</button>`;
      } else {
        primaryBtnHtml = `<a href="${p.primaryAction.url}" class="btn-card-primary">${escapeHtml(p.primaryAction.label)}</a>`;
      }

      card.innerHTML = `
        <div class="card-top-row">
          <div class="product-icon-frame">${p.icon}</div>
          <div class="product-badge-group">
            <span class="status-chip ${p.statusClass}">${p.status}</span>
            <span class="version-chip">${p.version}</span>
          </div>
        </div>
        <h3 class="card-product-name">${escapeHtml(p.name)}</h3>
        <p class="card-product-desc">${escapeHtml(p.desc)}</p>
        <ul class="card-bullets">${bulletsHtml}</ul>
        <div class="card-bottom-actions">
          ${primaryBtnHtml}
          <a href="${p.secondaryAction.url}" target="_blank" rel="noopener" class="btn-card-secondary">${escapeHtml(p.secondaryAction.label)}</a>
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
        btn.textContent = 'Added to Waitlist ✔';
        btn.style.borderColor = 'var(--green)';
        btn.style.color = 'var(--green)';
      });
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      activeCategory = tab.getAttribute('data-product-filter') || 'all';
      render();
    });
  });

  render();
}

/* ─────────────────────────────────────────────────────────────
   5. Interactive Agent Rig Builder (#assembler)
   ───────────────────────────────────────────────────────────── */
const RIG_SHELF_DATA = [
  { id: 'git_checkpoints', name: 'Git Auto-Checkpoints', type: 'Tool', desc: 'Atomic rollback points for every file modification.', delta: 0.3, flag: '--git-guard' },
  { id: 'ast_guard', name: 'AST Execution Sandbox', type: 'Security', desc: 'Pre-flight AST syntax parser intercepting dangerous imports.', delta: 0.4, flag: '--ast-strict' },
  { id: 'self_healing', name: 'Auto-Healing Loop', type: 'Skill', desc: 'Autonomous exception diagnosis & dependency installer.', delta: 0.5, flag: '--auto-heal' },
  { id: 'json_inspector', name: 'JSON Inspector', type: 'Tool', desc: 'Syntax validation and schema inspector utility.', delta: 0.2, flag: '--tools json_inspector' },
  { id: 'dpapi_vault', name: 'Windows DPAPI Vault', type: 'Security', desc: 'Hardware-bound AES-256 encrypted credential store.', delta: 0.3, flag: '--dpapi' },
  { id: 'code_metrics', name: 'Code Quality Auditor', type: 'Plugin', desc: 'AST code complexity & maintainability index calculator.', delta: 0.2, flag: '--plugins code_metrics' },
  { id: 'hash_calculator', name: 'Cryptographic Hasher', type: 'Tool', desc: 'Multi-algorithm MD5/SHA256 integrity verifier.', delta: 0.2, flag: '--tools hash_calculator' },
  { id: 'docker_sandbox', name: 'Docker Isolation', type: 'Integration', desc: 'Containerized ephemeral environment execution bridge.', delta: 0.4, flag: '--docker' },
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

  // Active snapped pieces
  let snappedIds = new Set(['git_checkpoints', 'ast_guard']);

  function update() {
    // 1. Render shelf chips
    shelf.innerHTML = '';
    RIG_SHELF_DATA.forEach((item) => {
      const isSnapped = snappedIds.has(item.id);
      const chip = document.createElement('div');
      chip.className = `shelf-chip ${isSnapped ? 'snapped' : ''}`;
      chip.innerHTML = `
        <div class="chip-meta">
          <span class="chip-name">${escapeHtml(item.name)}</span>
          <span class="chip-type">${item.type} &bull; +${item.delta} Autonomy</span>
        </div>
        <span class="chip-add-icon">${isSnapped ? '✓' : '+'}</span>
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
        <div class="slot-placeholder">
          <div>Empty Chassis Slots</div>
          <div style="margin-top: 6px; font-size: 0.75rem;">Click capabilities from the left shelf to snap them into KuroAgent!</div>
        </div>
      `;
    } else {
      snappedIds.forEach((id) => {
        const item = RIG_SHELF_DATA.find((x) => x.id === id);
        if (!item) return;

        const card = document.createElement('div');
        card.className = 'rig-slot-card';
        card.innerHTML = `
          <div class="slot-card-top">
            <span class="slot-card-name">${escapeHtml(item.name)}</span>
            <button class="slot-remove-btn" title="Unsnap capability" data-id="${item.id}">&times;</button>
          </div>
          <p class="slot-card-desc">${escapeHtml(item.desc)}</p>
          <div class="slot-card-foot">
            <span>[SLOT ACTIVE]</span>
            <span>+${item.delta} LVL</span>
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
        metricSecurity.className = 'metric-val green';
      } else {
        metricSecurity.textContent = 'Elevated Privileges';
        metricSecurity.className = 'metric-val';
      }
    }

    // 4. Generate CLI launch command
    const flags = [];
    snappedIds.forEach((id) => {
      const item = RIG_SHELF_DATA.find((x) => x.id === id);
      if (item && item.flag) flags.push(item.flag);
    });

    const cmdStr = flags.length ? `kuro ${flags.join(' ')}` : 'kuro';
    if (generatedCmd) generatedCmd.textContent = cmdStr;
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      snappedIds.clear();
      playCyberSound('click');
      update();
    });
  }

  if (copyCmdBtn) {
    copyCmdBtn.addEventListener('click', () => {
      const txt = generatedCmd.textContent;
      copyText(txt);
      copyCmdBtn.textContent = 'Copied!';
      setTimeout(() => {
        copyCmdBtn.textContent = 'Copy Launch Command';
      }, 1500);
    });
  }

  update();
}

/* ─────────────────────────────────────────────────────────────
   6. Live Self-Healing Breakdown Demo (#healing-lab)
   ───────────────────────────────────────────────────────────── */
const HEALING_SCENARIOS = {
  missing_dep: {
    title: 'Missing Package Injection',
    steps: [
      { text: '[STRESS TEST] Injecting python task requiring unregistered module `PyJWT`...', cls: 'dim', sound: 'beep', delay: 200 },
      { text: '[RUNTIME FAULT] ModuleNotFoundError: No module named \'jwt\' (Exit Code 1)', cls: 'fault', sound: 'fault', delay: 700 },
      { text: '[KURO DIAGNOSTICS] Traceback classified: MISSING_DEPENDENCY -> Target: \'PyJWT\'', cls: 'diag', sound: 'beep', delay: 1300 },
      { text: '[AST SAFETY] Verifying PyPI integrity and virtual environment sandbox...', cls: 'dim', sound: 'beep', delay: 1900 },
      { text: '[AUTONOMOUS REPAIR] Executing: `pip install PyJWT` in isolated sandbox...', cls: 'patch', sound: 'heal', delay: 2600 },
      { text: '[VERIFICATION] Re-executing failed payload with newly registered library...', cls: 'dim', sound: 'beep', delay: 3300 },
      { text: '✔ [SELF-HEALING COMPLETE] Process restored with Exit Code 0 in 1.42s (0 human intervention)', cls: 'success', sound: 'heal', delay: 4100 },
    ],
  },
  syntax_error: {
    title: 'Syntax & AST Anomaly Injection',
    steps: [
      { text: '[STRESS TEST] Injecting malformed indentation into tools/json_inspector.py...', cls: 'dim', sound: 'beep', delay: 200 },
      { text: '[RUNTIME FAULT] IndentationError: unexpected indent at line 42 (AST parsing failed)', cls: 'fault', sound: 'fault', delay: 700 },
      { text: '[KURO DIAGNOSTICS] AST Syntax Guard isolated token misalignment at column index 8', cls: 'diag', sound: 'beep', delay: 1300 },
      { text: '[GIT CHECKPOINT] Creating atomic rollback branch `heal/ast-auto-fix-42`...', cls: 'dim', sound: 'beep', delay: 1900 },
      { text: '[AUTONOMOUS REPAIR] Synthesizing AST normalization patch & re-indenting block...', cls: 'patch', sound: 'heal', delay: 2600 },
      { text: '[LINTER VALIDATION] ast.parse() passed without errors. Pytest execution: 12/12 PASS', cls: 'dim', sound: 'beep', delay: 3300 },
      { text: '✔ [SELF-HEALING COMPLETE] Tool source successfully auto-repaired and merged!', cls: 'success', sound: 'heal', delay: 4100 },
    ],
  },
  disk_wipe: {
    title: 'Malicious Command Intercept Injection',
    steps: [
      { text: '[STRESS TEST] Injecting untrusted prompt attempting `os.system("rmdir /s /q .")`...', cls: 'dim', sound: 'beep', delay: 200 },
      { text: '[SECURITY ALARM] AST Safety Gate tripped! Banned syscall detected: `os.system`', cls: 'fault', sound: 'fault', delay: 700 },
      { text: '[KURO SHIELD] Execution HALTED immediately before syscall reached kernel layer', cls: 'diag', sound: 'beep', delay: 1300 },
      { text: '[QUARANTINE] Agent sandbox locked. Malicious payload isolated in /quarantine/vault.log', cls: 'patch', sound: 'beep', delay: 2000 },
      { text: '[STATE ROLLBACK] Worktree verified intact against SHA-256 Git root checkpoint', cls: 'dim', sound: 'beep', delay: 2700 },
      { text: '✔ [SAFETY GUARD ACTIVE] Threat neutralized. Zero files altered or lost.', cls: 'success', sound: 'heal', delay: 3500 },
    ],
  },
};

function initSelfHealingLab() {
  const scenarioBtns = document.querySelectorAll('.scenario-btn');
  const triggerBtn = document.getElementById('triggerFaultBtn');
  const phaseText = document.getElementById('healingPhaseText');
  const logBox = document.getElementById('healingLogBox');

  if (!triggerBtn || !logBox) return;

  let activeScenarioKey = 'missing_dep';
  let isRunning = false;

  scenarioBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (isRunning) return;
      scenarioBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeScenarioKey = btn.getAttribute('data-scenario') || 'missing_dep';
      playCyberSound('click');
      phaseText.innerHTML = `STATUS: READY &bull; SCENARIO [${activeScenarioKey.toUpperCase()}]`;
      logBox.innerHTML = `<div class="heal-line dim">Scenario selected: <strong>${HEALING_SCENARIOS[activeScenarioKey].title}</strong>. Click "Inject Fault" to observe Kuro's diagnosis loop...</div>`;
    });
  });

  triggerBtn.addEventListener('click', () => {
    if (isRunning) return;
    isRunning = true;
    triggerBtn.disabled = true;
    triggerBtn.textContent = 'Self-Healing in Progress...';
    phaseText.innerHTML = '<span class="live-dot" style="background: var(--rose);"></span> RUNNING FAULT DIAGNOSIS LOOP...';
    logBox.innerHTML = '';

    const scenario = HEALING_SCENARIOS[activeScenarioKey];
    scenario.steps.forEach((step, idx) => {
      setTimeout(() => {
        const line = document.createElement('div');
        line.className = `heal-line ${step.cls}`;
        line.innerHTML = step.text;
        logBox.appendChild(line);
        logBox.scrollTop = logBox.scrollHeight;
        if (step.sound) playCyberSound(step.sound);

        if (idx === scenario.steps.length - 1) {
          isRunning = false;
          triggerBtn.disabled = false;
          triggerBtn.textContent = 'Inject Fault & Watch Self-Healing';
          phaseText.innerHTML = '<span class="live-dot" style="background: var(--green);"></span> RECOVERY SUCCESS &bull; SYSTEM STABLE';
        }
      }, step.delay);
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   7. Capability Market & Store Pieces (Loadable from catalog.json)
   ───────────────────────────────────────────────────────────── */
const STORE_PIECES_DATA = [
  {
    name: 'json_inspector',
    type: 'tool',
    desc: 'Fast JSON formatter, syntax validator, and schema inspector.',
    tags: ['json', 'formatter', 'validator'],
    filePath: 'tools/json_inspector.py',
  },
  {
    name: 'hash_calculator',
    type: 'tool',
    desc: 'Compute MD5, SHA1, SHA256, or SHA512 cryptographic checksums.',
    tags: ['crypto', 'sha256', 'hash'],
    filePath: 'tools/hash_calculator.py',
  },
  {
    name: 'regex_tester',
    type: 'tool',
    desc: 'Tests regular expressions against candidate text with match groups.',
    tags: ['regex', 'pattern', 'text'],
    filePath: 'tools/regex_tester.py',
  },
  {
    name: 'currency_converter',
    type: 'tool',
    desc: 'Calculates foreign exchange conversions using baseline currency ratios.',
    tags: ['finance', 'currency', 'math'],
    filePath: 'tools/currency_converter.py',
  },
  {
    name: 'code_metrics',
    type: 'plugin',
    desc: 'Analyzes Python source files to calculate lines of code and function count.',
    tags: ['metrics', 'analysis', 'code-quality'],
    filePath: 'plugins/code_metrics/main.py',
  },
  {
    name: 'dependency_guard',
    type: 'plugin',
    desc: 'Scans requirements.txt to flag unpinned or vulnerable packages.',
    tags: ['dependencies', 'security', 'pip'],
    filePath: 'plugins/dependency_guard/main.py',
  },
  {
    name: 'tdd_refactoring',
    type: 'skill',
    desc: 'Test-Driven Development refactoring routine (Red -> Green -> Refactor -> Verify).',
    tags: ['tdd', 'testing', 'refactor'],
    filePath: 'skills/tdd_refactoring/SKILL.md',
  },
  {
    name: 'security_audit',
    type: 'skill',
    desc: 'Automated security inspection checking AST dangerous calls, secrets, and permissions.',
    tags: ['security', 'audit', 'ast'],
    filePath: 'skills/security_audit/SKILL.md',
  },
  {
    name: 'gitlab',
    type: 'integration',
    desc: 'GitLab REST API connector for repository inspection, issue tracking, and CI/CD pipelines.',
    tags: ['gitlab', 'vcs', 'ci-cd'],
    filePath: 'kurocode.integrations.gitlab',
  },
  {
    name: 'slack',
    type: 'integration',
    desc: 'Slack Webhook connector for dispatching operational alerts and team notifications.',
    tags: ['slack', 'notifications', 'alerts'],
    filePath: 'kurocode.integrations.slack',
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
      grid.innerHTML = `<div class="term-entry dim" style="grid-column: 1/-1; text-align: center; padding: 48px;">No puzzle pieces match '${escapeHtml(q)}'. Click '+ Publish Piece' to add it!</div>`;
      return;
    }

    filtered.forEach((p) => {
      const card = document.createElement('div');
      card.className = 'piece-card';

      const tagsHtml = p.tags
        .map((t) => `<span class="tag-pill">#${escapeHtml(t)}</span>`)
        .join('');

      card.innerHTML = `
        <div class="piece-top">
          <span class="piece-badge badge-${p.type}">${p.type.toUpperCase()}</span>
          <span class="dim" style="font-size: 0.72rem; font-family: var(--font-mono);">${p.filePath.split('/')[0]}</span>
        </div>
        <h4 class="piece-title">${escapeHtml(p.name)}</h4>
        <p class="piece-desc">${escapeHtml(p.desc)}</p>
        <div class="piece-tags-row">${tagsHtml}</div>
        <button class="piece-snap-btn" data-name="${p.name}">
          <span>/store install ${p.name}</span>
          <span class="copy-tooltip">Snap</span>
        </button>
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
        tip.textContent = 'Copied!';
        tip.style.color = '#03060d';
        tip.style.background = 'var(--green)';
        setTimeout(() => {
          tip.textContent = 'Snap';
          tip.style.color = '';
          tip.style.background = '';
        }, 1500);
      });
    });
  }

  filterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      filterPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.getAttribute('data-type') || 'all';
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
      presets.forEach((p) => p.classList.remove('active'));
      btn.classList.add('active');
      const cmd = btn.getAttribute('data-cmd');
      if (cmd) {
        input.value = cmd;
        submit();
      }
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   9. 1-Click Environment Setup Generator (#setup-gen)
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
        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
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
      copyBtn.textContent = 'Copied!';
      setTimeout(() => {
        copyBtn.textContent = 'Copy Configuration';
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
      installTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.getAttribute('data-tab');

      document.querySelectorAll('.install-tab-content').forEach((c) => c.classList.remove('active'));
      if (target === 'pip') document.getElementById('tabContentPip').classList.add('active');
      if (target === 'binary') document.getElementById('tabContentBinary').classList.add('active');
      if (target === 'source') document.getElementById('tabContentSource').classList.add('active');
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

      jsonCode.textContent = JSON.stringify(blueprint, null, 2);
      previewBox.style.display = 'block';
      playCyberSound('heal');

      // Also dynamically add to local market list immediately!
      STORE_PIECES_DATA.unshift({
        name: name,
        type: type,
        desc: desc,
        tags: tags,
        filePath: filePath,
      });
      initStoreMarket();
    });
  }

  if (copyBlueprintBtn) {
    copyBlueprintBtn.addEventListener('click', () => {
      copyText(jsonCode.textContent);
      playCyberSound('click');
      copyBlueprintBtn.textContent = 'Copied!';
      setTimeout(() => {
        copyBlueprintBtn.textContent = 'Copy JSON';
      }, 1500);
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
        statusClass: 'status-custom',
        icon: '📦',
        desc: desc,
        bullets: ['Custom community product', 'Integrated with KuroLabs ecosystem'],
        primaryAction: { label: 'Explore', url: repoUrl },
        secondaryAction: { label: 'Repo', url: repoUrl },
      });

      initProductMatrix();
      closeModal('addProductModal');
      addProdForm.reset();
      playCyberSound('heal');

      // Scroll to products
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
      tip.textContent = 'Copied!';
      setTimeout(() => {
        tip.textContent = 'Copy';
      }, 1500);
    });
  }

  document.querySelectorAll('.btn-copy-code').forEach((btn) => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-copy');
      if (text) {
        copyText(text);
        playCyberSound('click');
        const old = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => {
          btn.textContent = old;
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
