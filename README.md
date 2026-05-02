# ✨ GitGlam

**Beautify GitHub markdown with a stunning reading mode — enhanced typography, themes, syntax highlighting, and more.**

GitGlam is a Chrome extension that transforms GitHub's default markdown rendering into a clean, distraction-free reading experience inspired by platforms like Medium, Notion, and more.

---

## Features

| Feature | Description |
|---------|-------------|
| **🎨 4 Themes** | Medium, Notion, Sepia, and Nord — each with matched code syntax colors |
| **📖 Reading Mode** | Optimized typography, centered layout, adjustable column width (600–1400px) |
| **🖥️ Code Blocks** | Language labels, one-click copy, clean single-box design |
| **🔍 Focus Mode** | Hides GitHub chrome with cinematic slide/fade transitions |
| **🖼️ Image Lightbox** | Click any image to view full-size in a smooth zoom overlay |
| **📊 Reading Stats** | Progress bar + reading time badge pinned to the top-right corner |
| **🎬 Scroll Animations** | Content fades in as you scroll; active paragraph stays highlighted |
| **📑 Outline Theming** | GitHub's native TOC panel styled to match your selected theme |
| **🔤 Font Size** | Slider control (12–24px), scales content and outline proportionally |
| **🌙 Night Shift** | Warm color filter to reduce eye strain in low light |
| **🫥 Auto-Hide Toggle** | Floating button fades out after 3 seconds of inactivity |

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
2. Select your preferred theme from the popup
3. Toggle features like Focus Mode, Progress Bar, and Reading Time

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
│   ├── focus-mode.js          # Hides GitHub UI chrome (cinematic transitions)
│   ├── code-blocks.js         # Code block enhancements
│   ├── animations.js          # Scroll animations & focus highlight
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
