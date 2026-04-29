# ✨ GitGlam

**Beautify GitHub markdown with a stunning reading mode — enhanced typography, themes, syntax highlighting, and more.**

GitGlam is a Chrome extension that transforms GitHub's default markdown rendering into a clean, distraction-free reading experience inspired by platforms like Medium, Notion, and more.

---

## Features

### 🎨 4 Beautiful Themes
- **Medium** — Warm serif typography inspired by Medium/Substack
- **Notion** — Clean, minimal styling inspired by Notion
- **Sepia** — Warm, easy-on-the-eyes parchment tones
- **Nord** — Cool-toned dark theme using the Nord color palette

### 📖 Reading Mode
- Optimized typography with proper line-height, spacing, and font sizing
- Centered, max-width layout (1000px) for comfortable reading
- Smooth fade-in transition when activated

### 🖥️ Code Block Enhancements
- Syntax highlighting with theme-appropriate colors
- Language labels on code blocks
- One-click copy-to-clipboard button
- Clean single-box presentation (removes GitHub's native toolbar clutter)
- Works correctly regardless of GitHub's light/dark mode setting

### 🔍 Focus Mode
- Hides GitHub navigation, sidebars, and chrome
- Distraction-free reading experience
- Toggle on/off from the popup

### 🖼️ Image Lightbox
- Click any image to view full-size in an overlay
- Smooth zoom animation

### 📊 Reading Stats
- Reading progress bar at the top of the viewport
- Estimated reading time badge

### 📑 Outline Enhancement
- Styles GitHub's native table of contents panel to match your selected theme

### ⌨️ Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `Alt + R` | Toggle reading mode |
| `Esc` | Exit reading mode |

---

## Installation

### From Source (Developer Mode)

1. Clone this repository:
   ```bash
   git clone https://github.com/istaari/GitGlam.git
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable **Developer mode** (toggle in the top-right corner)

4. Click **Load unpacked** and select the `GitGlam` folder

5. Navigate to any GitHub markdown file or repository README and click the GitGlam icon or the floating toggle button

---

## Usage

1. Navigate to any GitHub page with markdown content (README, `.md` files, issues, comments)
2. Click the **GitGlam** extension icon in the toolbar, or use `Alt + R`
3. Select your preferred theme from the popup
4. Toggle features like Focus Mode, Progress Bar, and Reading Time

---

## Project Structure

```
GitGlam/
├── manifest.json              # Extension manifest (MV3)
├── background/
│   └── service-worker.js      # Badge state & message relay
├── content/
│   ├── content.js             # Main orchestrator
│   ├── toggle-button.js       # Floating toggle button
│   ├── focus-mode.js          # Hides GitHub UI chrome
│   ├── code-blocks.js         # Code block enhancements
│   ├── image-lightbox.js      # Image zoom overlay
│   ├── reading-stats.js       # Progress bar & reading time
│   ├── github-outline.js      # Outline panel theming
│   └── styles/
│       ├── base.css           # Core reading mode layout
│       ├── theme-medium.css   # Medium theme
│       ├── theme-notion.css   # Notion theme
│       ├── theme-sepia.css    # Sepia theme
│       ├── theme-nord.css     # Nord theme
│       ├── code-blocks.css    # Code block styling
│       ├── lightbox.css       # Image lightbox styles
│       └── progress.css       # Progress bar & stats
├── popup/
│   ├── popup.html             # Extension popup UI
│   ├── popup.css              # Popup styling
│   └── popup.js               # Popup logic
├── icons/                     # Extension icons
└── fonts/                     # Custom fonts
```

---

## How It Works

- **Content Scripts** inject on `github.com/*` pages at `document_idle`
- Detects `.markdown-body` elements (READMEs, markdown file views, etc.)
- All styling is **scoped to `.markdown-body`** — never affects the surrounding GitHub UI
- Uses a cascade of CSS variables per-theme, with JS-injected `<style>` elements appended to `<body>` to override GitHub's dynamically-loaded dark mode styles
- Supports GitHub's SPA navigation (Turbo) via event listeners and MutationObserver
- State is persisted via `chrome.storage.sync`

---

## Compatibility

- ✅ GitHub markdown file views (`/blob/.../*.md`)
- ✅ Repository README sections
- ✅ Profile READMEs (special username/username repo)
- ✅ GitHub Issues & Pull Request descriptions
- ✅ Works with GitHub Light and Dark themes
- ✅ Handles GitHub SPA (Turbo) navigation

---

## Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Ideas for Contribution
- New themes (Dracula, Solarized, Catppuccin, etc.)
- Firefox/Safari port
- Custom font selection
- Export to PDF with theme styling
- Per-repo theme memory

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## Author

**Roshan Gupta** — [@istaari](https://github.com/istaari)

---

> *GitGlam — Because reading code documentation should feel as good as reading a well-designed blog post.*
