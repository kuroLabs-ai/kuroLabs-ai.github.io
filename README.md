# KuroLabs AI — Organization Website & Software Ecosystem

The official public web portal and ecosystem explorer for **KuroLabs AI** (`kurolabs-ai`), deployed to **GitHub Pages** at:
https://kurolabs-ai.github.io/

---

## 1. Architectural Philosophy: Programs ≠ Store ≠ Hub

The website strictly communicates three distinct concepts:

```text
                         KUROLABS
                             |
               +-------------+-------------+
               |             |             |
            Website       Programs        Hub
               |             |             |
         Public portal   KuroCodeAgent  catalog.json
               |             |             |
         Browse & learn   Store runtime   tools/
               |             |            plugins/
               |             |            skills/
               |             |
               |         Discover, install
               |         and manage
               |
          Reads public catalog
          and links to source files
```

1. **Programs:** Complete standalone applications developed by KuroLabs (e.g. `KuroCodeAgent`).
2. **Store:** The runtime capability manager inside `KuroCodeAgent` that enables `/store install <name>` and manages local execution lifecycles.
3. **Hub:** The open decentralized remote registry repository (`kurolabs-ai/hub`) containing `catalog.json` and standalone capability files (`tools/`, `plugins/`, `skills/`).

---

## 2. Technology Stack

- **HTML5:** Semantic, accessible markup.
- **Tailwind CSS:** Responsive layout, spacing, typography, and utility styling via CDN.
- **Custom CSS:** Brand design tokens (`css/tokens.css`), global base styles (`css/global.css`), and UI components (`css/components.css`).
- **Vanilla JavaScript ES Modules:** Clean, decoupled modular code with zero npm build step or bundler dependencies.
- **Font Stack:** High-performance native system font stack (`system-ui`, `-apple-system`, `ui-monospace`, `Cascadia Code`, `JetBrains Mono`) with zero external network blocking.
- **Brand Assets:** Organization emblem and favicon integrated across all pages and manifests.
- **Target Platform:** GitHub Pages static hosting (`.nojekyll` enabled).

---

## 3. Project Directory Structure

```text
website/
├── index.html                   # Organization Overview & Hero Portal
├── 404.html                     # Custom 404 Route Not Found page
├── .nojekyll                    # Disables Jekyll processing on GitHub Pages
├── README.md                    # Developer and maintenance documentation
├── programs/
│   ├── index.html               # Programs Directory (data-driven)
│   └── kurocode/
│       └── index.html           # Dedicated KuroCodeAgent Product & Architecture Page
├── capabilities/
│   └── index.html               # Live Capability Hub Browser & Detail Inspector
├── rig-studio/
│   └── index.html               # Interactive Agent Rig Studio (Config & Launch Gen)
├── simulation-lab/
│   └── index.html               # Browser-based Autonomous Agent Sandbox Simulation
├── docs/
│   └── index.html               # Comprehensive Technical Docs & Setup Guide
├── data/
│   ├── programs.json            # Authoritative metadata for KuroLabs programs
│   ├── roadmap.json             # Verified ecosystem roadmap milestones
│   └── hub-fallback.json        # Resilient offline cache of Hub catalog.json
├── css/
│   ├── tokens.css               # Brand palette & CSS custom property tokens
│   ├── global.css               # Base layout, scrollbar, grid overlay, reset
│   └── components.css           # Cards, badges, buttons, modals, terminal windows
└── js/
    ├── core/
    │   ├── config.js            # Repositories, URLs, and relative path resolution
    │   ├── hub-client.js        # Hub catalog fetcher, validator, and safe normalizer
    │   └── data-loader.js       # Local JSON data loader
    ├── components/
    │   ├── navbar.js            # Desktop & mobile responsive header navigation
    │   ├── footer.js            # Universal ecosystem footer & manifesto
    │   └── toast.js             # Notification & clipboard utility
    └── pages/
        ├── home.js              # Homepage logic & live previews
        ├── programs.js          # Programs directory filter & renderer
        ├── capabilities.js      # Capability Hub browser, search, tag filters & modal
        ├── rig-studio.js        # Interactive configuration assembler & JSON export
        ├── simulation-lab.js    # Step-by-step interactive agent simulation
        └── docs.js              # Documentation search & copy blocks
```

---

## 4. Local Development

Because this project uses native JavaScript ES Modules, run a simple local web server to avoid browser `file://` CORS restrictions:

### Using Python (Recommended)
```bash
# In the repository root:
python -m http.server 8000
```
Then visit: `http://localhost:8000/`

### Using Node.js (Alternative)
```bash
npx serve .
```

---

## 5. How to Add a New Program

To add a new standalone program to the ecosystem:
1. Open `data/programs.json`.
2. Add a new JSON object adhering to the schema:
   ```json
   {
     "id": "new_program_id",
     "name": "ProgramName",
     "displayName": "DisplayName",
     "category": "Category",
     "description": "Accurate description.",
     "status": "In Development",
     "statusType": "in-development",
     "featured": false,
     "version": "0.1.0",
     "repository": "https://github.com/kurolabs-ai/new_repo",
     "documentation": "/docs/#section",
     "detailUrl": null,
     "technologies": ["Python", "AsyncIO"],
     "highlights": ["Key architectural feature 1", "Key architectural feature 2"],
     "capabilityHub": "https://github.com/kurolabs-ai/hub"
   }
   ```
3. The Programs directory (`programs/index.html`) and homepage overview will immediately display the new program dynamically.

---

## 6. How to Add or Update Capabilities

Capabilities belong to the **Capability Hub repository** (`kurolabs-ai/hub`), **not** this website:
1. Navigate to the Hub repository: [https://github.com/kurolabs-ai/hub](https://github.com/kurolabs-ai/hub).
2. Add your implementation file in `tools/`, `plugins/`, or `skills/`.
3. Add a corresponding record to `catalog.json` in `kurolabs-ai/hub`.
4. Once merged to `main`, this website automatically discovers and displays the new capability live via `https://raw.githubusercontent.com/kurolabs-ai/hub/main/catalog.json`.

---

## 7. Deployment Instructions (GitHub Pages)

1. Commit and push the repository to the `main` branch of `kurolabs-ai/kurolabs-ai.github.io`:
   ```bash
   git add .
   git commit -m "feat: complete production portal implementation"
   git push origin main
   ```
2. In the GitHub repository Settings:
   - Navigate to **Pages**.
   - Under **Build and deployment**, select **Source: Deploy from a branch**.
   - Branch: `main` / `root`.
3. GitHub Pages will publish the site at `https://kurolabs-ai.github.io/`.
