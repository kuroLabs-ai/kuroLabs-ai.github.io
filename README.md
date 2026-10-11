# 🌐 KuroLabs AI — Developer Web Portal & Ecosystem Suite

The official modern web portal for **[KuroLabs AI](https://github.com/kuroLabs-ai)**, engineered with **Tailwind CSS**, **Lucide Icons**, and vanilla ES6 JavaScript. Designed for zero-build deployment on **GitHub Pages**.

---

## 🎨 Modern Developer Aesthetic & Design Philosophy

- **Linear / Raycast / Supabase Style**: High-contrast obsidian slate (`#070b14`), ultra-fine 1px borders, subtle cyber-cyan glows, and clean Plus Jakarta Sans & JetBrains Mono typography.
- **Lucide Vector Icons**: Crisp, uniform developer iconography throughout all components, badges, buttons, toolbars, and modal dialogs.
- **Tailwind CSS Utility Engine**: Fast, responsive layout grid without bulky frameworks.
- **Zero Build Tooling**: Works right out of the box in any browser or static hosting (GitHub Pages, Vercel, Cloudflare Pages).

---

## 📄 Multi-Page Architecture

1. **`index.html` — Platform Overview**:
   - Hero with quick 1-click install command copy (`git clone ...` / `pip install -e .`).
   - Four Architecture Pillars (ReAct 2.0 Loop, AST Execution Sandbox, Zero-Shot Self-Healing, Windows DPAPI Vault).
   - Live Self-Healing Breakdown demonstration.
   - Interactive Product Suite Matrix with "+ Add Program" modal.
2. **`builder.html` — Agent Rig Studio**:
   - Visual workbench for assembling custom autonomous agent runtime builds.
   - Capability shelves (Security, Tools, Skills, Integrations, Plugins).
   - Active 6-slot chassis, live Autonomy Rating calculator, and 1-click CLI launch command generator (`kuro --git-guard --ast-strict ...`).
3. **`store.html` — Capability Market & Marketplace**:
   - Searchable and categorized registry of single-file tools, plugins, skills, and connectors.
   - 1-click `/store install <name>` copy buttons.
   - Interactive "+ Publish Capability" modal with automated PR-ready `catalog.json` blueprint generator.
4. **`lab.html` — Interactive Terminal & Simulation Lab**:
   - Interactive bash terminal console with real slash commands (`/store list`, `/store update`, `/heal status`, `/system`, `/help`, `clear`).
   - Hands-on Self-Healing Fault Injection Simulator (Missing Package, Syntax Bug, Malicious Script Interception).
5. **`docs.html` — Documentation & 1-Click Setup**:
   - Interactive matrix setup generator: Target OS (Windows, Linux, macOS) × LLM Provider (Gemini, Groq, Ollama, OpenRouter) × Security Mode (Strict Safe, Dev Mode).
   - Instant `.env` and startup script output with 1-click clipboard copy.
   - Complete CLI runtime flags and options reference table.

---

## 🚀 How to Deploy to GitHub Pages

### Method 1: Host as Organization Profile (`https://kurolabs-ai.github.io`)

1. In your organization `kuroLabs-ai`, create a new public repository named:
   ```text
   kuroLabs-ai.github.io
   ```
2. Copy the contents of this `website/` directory (`index.html`, `builder.html`, `store.html`, `lab.html`, `docs.html`, `style.css`, `app.js`, `assets/`) into the repository root.
3. Push to `main`. GitHub Pages will automatically deploy your organization website at:
   **`https://kurolabs-ai.github.io`**

### Method 2: Deploy from a Branch in an Existing Repository

1. Create a `gh-pages` branch:
   ```bash
   git checkout -b gh-pages
   ```
2. Move `website/*` files to the root of the branch.
3. Commit and push:
   ```bash
   git add .
   git commit -m "feat: publish modernized KuroLabs web portal"
   git push -u origin gh-pages
   ```
4. In GitHub under **Settings ➔ Pages**, set the source to **Deploy from a branch: gh-pages**.

---

## 🔗 Official Organization Repositories

- **Organization**: [https://github.com/kuroLabs-ai](https://github.com/kuroLabs-ai)
- **Main Agent**: [https://github.com/kuroLabs-ai/KuroCodeAgent](https://github.com/kuroLabs-ai/KuroCodeAgent)
- **Capability Hub**: [https://github.com/kuroLabs-ai/hub](https://github.com/kuroLabs-ai/hub)

*Maintained with 💜 by KuroLabs AI.*
