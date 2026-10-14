/**
 * Simulation Lab Logic (simulation-lab/index.html)
 * PRD Section 7.6
 */

const SCENARIOS = {
  healing: {
    title: 'Self-Healing Test Suite Diagnosis',
    description: 'Simulates runtime crash traceback parsing, automated null-safety patch generation, and regression verification.',
    steps: [
      {
        phase: 'Execution Trigger',
        thought: 'Running developer test suite to verify recent changes to parser logic.',
        action: 'pytest tests/test_parser.py',
        output: [
          'test_parser.py:24: FAILED',
          'Traceback (most recent call last):',
          '  File "src/kurocode/parser.py", line 42, in parse_token',
          '    return raw_token.clean().strip()',
          'AttributeError: \'NoneType\' object has no attribute \'clean\'',
          '========================= 1 failed in 0.14s ========================='
        ],
        astStatus: 'MONITORING',
        diff: null
      },
      {
        phase: 'Diagnostics & AST Analysis',
        thought: 'AttributeError detected. Inspecting AST syntax tree around parser.py:42 to detect unhandled NoneType condition.',
        action: 'core.healing.diagnose_traceback(error)',
        output: [
          '[HealingSubsystem] Isolating crash point: parser.py:42',
          '[AST Analyzer] Variable `raw_token` can be None when stream exhausts prematurely.',
          '[Synthesizer] Generating defensive null-guard branch: if raw_token is None: return ""'
        ],
        astStatus: 'AST_SAFE',
        diff: `--- src/kurocode/parser.py
+++ src/kurocode/parser.py
@@ -40,3 +40,5 @@
 def parse_token(raw_token):
+    if raw_token is None:
+        return ""
     return raw_token.clean().strip()`
      },
      {
        phase: 'Automated Patch & Verification',
        thought: 'Applying patch and re-executing unit test suite to ensure zero regressions.',
        action: 'pytest tests/test_parser.py',
        output: [
          'tests/test_parser.py .. [100%]',
          '========================= 1 passed in 0.08s =========================',
          '[HealingSubsystem] Self-repair successful. Git checkpoint commit created: 8f2c31e'
        ],
        astStatus: 'VERIFIED_GREEN',
        diff: null
      }
    ]
  },

  security: {
    title: 'AST Security Intercept & Neutralization',
    description: 'Demonstrates zero-trust pre-execution AST syntax inspection intercepting dangerous system commands.',
    steps: [
      {
        phase: 'Dangerous Operation Encounter',
        thought: 'Agent received instruction to clean cached files, considering aggressive filesystem removal.',
        action: 'os.system("rmdir /s /q C:\\\\Windows\\\\Temp")',
        output: [
          'Analyzing intent: Recursive directory deletion requested.'
        ],
        astStatus: 'INSPECTING',
        diff: null
      },
      {
        phase: 'AST Pre-Execution Intercept',
        thought: 'AST pre-execution analyzer intercepts prohibited system call target before kernel execution.',
        action: 'core.sandbox.inspect_ast(syntax_tree)',
        output: [
          '[AST GUARD] VIOLATION DETECTED: Call to banned command "rmdir /s"',
          '[AST GUARD] Target evaluates to restricted system boundary.',
          '[PermissionGate] Action BLOCKED by Zero-Trust Rule #104.',
          '[Agent Strategy] Redirecting to safe isolated temporary directory sandbox.'
        ],
        astStatus: 'BLOCKED_VIOLATION',
        diff: null
      },
      {
        phase: 'Safe Substitution',
        thought: 'Substituting dangerous command with safe Python tempfile sandbox context manager.',
        action: 'with tempfile.TemporaryDirectory() as safe_tmp: purge_cache(safe_tmp)',
        output: [
          '[Sandbox] Isolated temp container allocated: /tmp/kuro_sandbox_882',
          '[Success] Cache purged safely with zero OS boundary risk.'
        ],
        astStatus: 'VERIFIED_SAFE',
        diff: null
      }
    ]
  },

  store: {
    title: 'Dynamic Capability Hot-Snapping',
    description: 'Simulates discovering a missing tool from the remote Hub registry and hot-snapping it into the live REPL.',
    steps: [
      {
        phase: 'Capability Gap Detection',
        thought: 'User requested cryptographic SHA-256 checksum verification. Active agent lacks crypto tool.',
        action: 'kuro > verify_hash file.bin',
        output: [
          '[Runtime] Capability "hash_calculator" not in local registry.',
          '[Store Subsystem] Querying kurolabs-ai/hub catalog for match...'
        ],
        astStatus: 'SEARCHING_HUB',
        diff: null
      },
      {
        phase: 'Store Hot-Installation',
        thought: 'Matching piece "tool_hash_calculator" found in official Hub. Downloading and verifying entrypoint.',
        action: 'kuro > /hub install hash_calculator',
        output: [
          '[Hub] Resolved branch file: tools/hash_calculator.py',
          '[AST Check] Entrypoint signature verified safe.',
          '[Hot-Reload] Snapped tool_hash_calculator (v1.0.0) into active session.'
        ],
        astStatus: 'HOT_SNAPPED',
        diff: null
      },
      {
        phase: 'Task Execution',
        thought: 'Invoking newly snapped capability with user input.',
        action: 'hash_calculator.compute("file.bin", "sha256")',
        output: [
          'Checksum SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          '[Execution Complete] Task satisfied via snapped puzzle piece.'
        ],
        astStatus: 'COMPLETE',
        diff: null
      }
    ]
  }
};

let currentScenarioKey = 'healing';
let currentStepIndex = 0;
let isPlaying = false;
let playInterval = null;
let speedMs = 2400;

export function initSimulationLabPage() {
  bindControls();
  loadScenario('healing');
}

function bindControls() {
  const scenarioSelect = document.getElementById('sim-scenario-select');
  const playBtn = document.getElementById('sim-play-btn');
  const stepBtn = document.getElementById('sim-step-btn');
  const resetBtn = document.getElementById('sim-reset-btn');
  const speedToggle = document.getElementById('sim-speed-toggle');

  if (scenarioSelect) {
    scenarioSelect.addEventListener('change', (e) => {
      loadScenario(e.target.value);
    });
  }

  if (playBtn) {
    playBtn.addEventListener('click', () => togglePlay());
  }

  if (stepBtn) {
    stepBtn.addEventListener('click', () => nextStep());
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => resetSimulation());
  }

  if (speedToggle) {
    speedToggle.addEventListener('click', () => {
      if (speedMs === 2400) {
        speedMs = 1200;
        speedToggle.textContent = 'Speed: 2x';
      } else {
        speedMs = 2400;
        speedToggle.textContent = 'Speed: 1x';
      }
      if (isPlaying) {
        stopPlay();
        startPlay();
      }
    });
  }
}

function loadScenario(key) {
  stopPlay();
  currentScenarioKey = key;
  currentStepIndex = 0;

  const scenario = SCENARIOS[key];
  if (!scenario) return;

  const descEl = document.getElementById('sim-scenario-desc');
  if (descEl) descEl.textContent = scenario.description;

  renderCurrentStep();
}

function togglePlay() {
  if (isPlaying) {
    stopPlay();
  } else {
    startPlay();
  }
}

function startPlay() {
  const scenario = SCENARIOS[currentScenarioKey];
  if (currentStepIndex >= scenario.steps.length - 1) {
    currentStepIndex = 0;
  }
  isPlaying = true;
  updatePlayButton(true);

  playInterval = setInterval(() => {
    if (currentStepIndex < scenario.steps.length - 1) {
      currentStepIndex++;
      renderCurrentStep();
    } else {
      stopPlay();
    }
  }, speedMs);
}

function stopPlay() {
  isPlaying = false;
  clearInterval(playInterval);
  updatePlayButton(false);
}

function nextStep() {
  stopPlay();
  const scenario = SCENARIOS[currentScenarioKey];
  if (currentStepIndex < scenario.steps.length - 1) {
    currentStepIndex++;
    renderCurrentStep();
  }
}

function resetSimulation() {
  stopPlay();
  currentStepIndex = 0;
  renderCurrentStep();
}

function updatePlayButton(running) {
  const playBtn = document.getElementById('sim-play-btn');
  if (!playBtn) return;
  playBtn.innerHTML = running 
    ? `<span class="font-bold">❚❚</span> Pause` 
    : `<span class="font-bold">▶</span> Run Simulation`;
}

function renderCurrentStep() {
  const scenario = SCENARIOS[currentScenarioKey];
  const step = scenario.steps[currentStepIndex];

  // Update progress indicator
  const stepIndicator = document.getElementById('sim-step-indicator');
  if (stepIndicator) {
    stepIndicator.textContent = `Step ${currentStepIndex + 1} of ${scenario.steps.length}: ${step.phase}`;
  }

  // Update Thought Stream
  const thoughtEl = document.getElementById('sim-thought-stream');
  if (thoughtEl) {
    thoughtEl.textContent = step.thought;
  }

  // Update Action
  const actionEl = document.getElementById('sim-action');
  if (actionEl) {
    actionEl.textContent = step.action;
  }

  // Update Terminal Output
  const termBody = document.getElementById('sim-terminal-output');
  if (termBody) {
    termBody.innerHTML = step.output.map(line => {
      let colorClass = 'text-muted';
      if (line.includes('FAILED') || line.includes('AttributeError') || line.includes('VIOLATION') || line.includes('BLOCKED')) {
        colorClass = 'text-danger font-bold';
      } else if (line.includes('passed') || line.includes('successful') || line.includes('Hot-Reload') || line.includes('Success')) {
        colorClass = 'text-accent font-bold';
      } else if (line.includes('[AST') || line.includes('[Healing') || line.includes('[Store')) {
        colorClass = 'text-warning';
      }
      return `<div class="${colorClass}">${escapeHtml(line)}</div>`;
    }).join('');
  }

  // Update AST Gate Status
  const astGateEl = document.getElementById('sim-ast-gate');
  if (astGateEl) {
    let gateBadge = `<span class="badge badge-tool">${step.astStatus}</span>`;
    if (step.astStatus === 'BLOCKED_VIOLATION') {
      gateBadge = `<span class="badge" style="background: rgba(255,104,104,0.2); color: #ff6868; border: 1px solid #ff6868;">${step.astStatus}</span>`;
    } else if (step.astStatus === 'VERIFIED_GREEN' || step.astStatus === 'VERIFIED_SAFE' || step.astStatus === 'HOT_SNAPPED' || step.astStatus === 'COMPLETE') {
      gateBadge = `<span class="badge badge-status-available">${step.astStatus}</span>`;
    }
    astGateEl.innerHTML = gateBadge;
  }

  // Update Diff section
  const diffSection = document.getElementById('sim-diff-section');
  const diffPre = document.getElementById('sim-diff-content');
  if (diffSection && diffPre) {
    if (step.diff) {
      diffSection.classList.remove('hidden');
      diffPre.textContent = step.diff;
    } else {
      diffSection.classList.add('hidden');
    }
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
