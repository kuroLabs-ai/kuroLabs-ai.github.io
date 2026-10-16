# KuroLabs Organization Website

The central digital home of **[KuroLabs](https://github.com/kuroLabs-ai)** — an open-source engineering organization building practical software, intelligent systems, developer tools, and extensible technologies.

## 🏛️ Architecture & Tech Stack

- **Semantic Multi-Page HTML5**: Clean, accessible structure with dedicated pages for organization identity, projects, documentation, and the capability catalog.
- **Tailwind CSS & Design Tokens**: Industrial Tech / Open-Source aesthetic palette (`#0B0D0F` dark mode, `#B6F36B` electric lime accent, Inter and IBM Plex Mono typography).
- **Decoupled JavaScript Modules**:
  - `js/registry.js`: Dedicated Capability Hub client fetching live metadata from [`kuroLabs-ai/hub`](https://raw.githubusercontent.com/kuroLabs-ai/hub/main/kuro-hub.json) with local fallback snapshot.
  - `js/hub.js`: Real-time browser-based search, multi-type filtering (`tool`, `plugin`, `skill`, `integration`), and card rendering.
  - `js/hub-item.js`: Dynamic detail page (`item.html?id=...`) rendering procedural skill steps, integration auth configs, and tool manifests safely without DOM injection vulnerabilities.
  - `js/projects.js`: Data-driven project directory rendering entries from `data/projects.json`.
  - `js/docs.js`: Documentation search, active heading spy, and mobile drawer controls.
  - `js/navigation.js`: Global responsive navigation, active route highlights, and copy-to-clipboard interactions.
- **Data Stores**:
  - `data/projects.json`: Centralized metadata for current and future organization projects.
  - `data/kuro-hub.json`: Local verified fallback snapshot of the public Capability Hub registry.

---

## 📂 Site Map & Directory Structure

```
kurolabs-website/
├── index.html                           # Organization Homepage
├── about.html                           # Identity, Mission, Vision & Principles
├── community.html                       # Open-Source Participation & GitHub Guides
├── 404.html                             # Diagnostic Not-Found Page
├── projects/
│   ├── index.html                       # Data-Driven Projects Directory
│   └── kurocodeagent/
│       ├── index.html                   # KuroCodeAgent v2.0 Landing Page
│       ├── installation.html            # Verified Step-by-Step Installation Guide
│       └── docs/
│           ├── index.html               # Documentation Index & Slash Command Reference
│           ├── configuration.html       # Provider Setup & DPAPI Vault Configuration
│           └── architecture.html        # ReAct Engine & AST Sandbox Specification
├── hub/
│   ├── index.html                       # Capability Hub (Live Filterable Catalog)
│   └── item.html                        # Capability Detail View (?id=<capability_id>)
├── css/
│   ├── tokens.css                       # Color & Typography CSS Variables
│   └── global.css                       # Industrial Tech Layout & Terminal Styles
├── js/
│   ├── navigation.js                    # Navigation & Copy-to-Clipboard
│   ├── registry.js                      # Hub Data Fetching & Normalization
│   ├── hub.js                           # Hub Catalog Controller
│   ├── hub-item.js                      # Hub Item Detail Controller
│   ├── projects.js                      # Project Directory Controller
│   └── docs.js                          # Documentation Controls
├── data/
│   ├── projects.json                    # Central Organization Projects Metadata
│   └── kuro-hub.json                    # Offline Fallback Snapshot of Kuro Hub
├── assets/
│   └── favicon.png                      # Organization Brand Favicon
├── sitemap.xml                          # Search Engine Sitemap
├── robots.txt                           # Web Crawler Directives
└── README.md                            # Documentation
```

---

## 🚀 Local Development & Preview

Because this is a standard static website using ES modules, you can serve it with any local static HTTP server:

```bash
# Using Python:
python -m http.server 8000

# Using Node (npx):
npx serve .
```

Open your browser at `http://localhost:8000/`.

---

## 🧩 Adding New Projects

To add a new organization project, simply append an entry to `data/projects.json`:

```json
{
  "id": "new-project",
  "name": "Project Name",
  "short_name": "proj",
  "tagline": "Brief one-line summary",
  "description": "Full description of what the project solves.",
  "category": "Developer Tools",
  "status": "Active (v1.0)",
  "technologies": ["Rust", "CLI", "Linux"],
  "repo_url": "https://github.com/kuroLabs-ai/new-project",
  "site_url": "projects/new-project/index.html",
  "docs_url": "projects/new-project/docs/index.html",
  "featured": false,
  "highlights": [
    "Key capability 1",
    "Key capability 2"
  ]
}
```

The Projects Directory (`projects/index.html`) will automatically render the new project card without requiring any HTML modifications.

---

## 🌐 Updating Capability Hub Metadata

The Capability Hub dynamically queries GitHub's raw endpoint:
`https://raw.githubusercontent.com/kuroLabs-ai/hub/main/kuro-hub.json`

New capabilities authored and merged into `kuroLabs-ai/hub` will automatically appear on the website catalog.

---

## 📄 License

Distributed under the **MIT License**. Created for **[kuroLabs-ai](https://github.com/kuroLabs-ai)**.
