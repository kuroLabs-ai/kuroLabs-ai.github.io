# 🌐 KuroLabs AI — Organization Website & Web Portal

The official web portal and developer interface for **[KuroLabs AI](https://github.com/kuroLabs-ai)**, built using **100% Vanilla HTML5, CSS3, and modern JavaScript**. Designed for instant zero-config hosting on **GitHub Pages**.

---

## ✨ Out-of-the-Box Features

- **🧩 Interactive Agent Rig Builder (`#assembler`)**:
  Snap tools, skills, plugins, and security modules into active runtime slots. Dynamically computes autonomy ratings, active capability counts, AST safety sandboxing status, and compiles a ready-to-run 1-click CLI launch command (`kuro --git-guard --ast-strict ...`).
- **🩺 Live Self-Healing Breakdown Demo (`#healing-lab`)**:
  Simulate runtime crashes (`Missing Package`, `Syntax & AST Bug`, `Malicious Code Attempt`) and watch Kuro diagnose the fault, create atomic rollback points, auto-install dependencies, or isolate threats in an animated terminal log.
- **🔊 Procedural Web Audio Synthesizer (0 KB Footprint)**:
  Real-time cybernetic sound effects (snaps, chimes, fault alarms, blips) generated mathematically via the browser's native Web Audio API oscillators. Zero external audio downloads, zero 404 risks, with a 1-click SFX mute toggle.
- **🐱 Interactive Kuro Cat Easter Egg**:
  Click the mascot avatar in the navigation bar to trigger witty cyber-cat dialogue bubble hints regarding AST security, DPAPI vaults, and autonomous engineering.
- **⚙️ 1-Click Environment Setup Generator (`#setup-gen`)**:
  Interactive matrix selector for target OS (Windows, Linux, macOS), LLM Provider (Gemini, Groq, Ollama, OpenRouter), and Safety Mode. Compiles `.env` configurations and shell startup commands with 1-click clipboard copy.
- **💻 Interactive Terminal Lab Simulator (`#terminal-suite`)**:
  Hands-on interactive console with real slash commands (`/store list`, `/store install <piece>`, `/store update`, `/heal status`, `/system`, `clear`) and one-click quick presets.
- **📦 Dynamic Product Matrix & Custom Program Submissions**:
  Filter products by category (`Agents`, `Marketplace`, `Creative AI`) and add custom community programs on the fly.
- **🛒 Capability Store & Blueprint Generator**:
  Live search and category filtering for tools, plugins, skills, and integrations with an automated JSON schema generator for GitHub Pull Requests.
- **⚡ Zero Build Tooling**: Pure vanilla code. No `npm`, no Webpack, no Vite, no node_modules required.

---

## 🚀 How to Deploy to GitHub Pages (2 Methods)

### Method 1: Host as Organization Profile (`https://kurolabs-ai.github.io`)

1. In your organization `kuroLabs-ai`, create a new public repository named:
   ```text
   kuroLabs-ai.github.io
   ```
2. Copy the contents of this `website/` folder (`index.html`, `style.css`, `app.js`, and `assets/`) into the root of that repository.
3. Push to `main`. GitHub Pages will automatically deploy your organization website at:
   **`https://kurolabs-ai.github.io`**

---

### Method 2: Deploy from a Branch in an Existing Repository

If you want to host it from your `KuroCodeAgent` or `hub` repository:

1. Create a `gh-pages` branch:
   ```bash
   git checkout -b gh-pages
   ```
2. Move `website/*` files to the root of the branch.
3. Commit and push:
   ```bash
   git add index.html style.css app.js assets
   git commit -m "feat: publish KuroLabs web portal"
   git push -u origin gh-pages
   ```
4. In GitHub under **Settings ➔ Pages**, set the source to **Deploy from a branch: gh-pages**.

---

## 🔗 Official Organization Repositories

- **Organization**: [https://github.com/kuroLabs-ai](https://github.com/kuroLabs-ai)
- **Main Agent**: [https://github.com/kuroLabs-ai/KuroCodeAgent](https://github.com/kuroLabs-ai/KuroCodeAgent)
- **Capability Hub**: [https://github.com/kuroLabs-ai/hub](https://github.com/kuroLabs-ai/hub)

*Maintained with 💜 by KuroLabs AI.*
