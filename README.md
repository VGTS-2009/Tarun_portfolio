# ✳ Tarun OS

<p align="center">
  <strong>A little portfolio with a desktop-sized point of view.</strong><br>
  A retro-inspired, interactive home for selected work, field notes, and everything in between.
</p>

<p align="center">
  <a href="https://github.com/VGTS-2009/Tarun_portfolio"><img alt="Built with HTML, CSS, and JavaScript" src="https://img.shields.io/badge/built%20with-HTML%20%2F%20CSS%20%2F%20JS-087e82?style=flat-square"></a>
  <img alt="No build step" src="https://img.shields.io/badge/build%20step-none-f4c96b?style=flat-square">
  <img alt="Static website" src="https://img.shields.io/badge/site-static-e9a387?style=flat-square">
</p>

<p align="center">
  <a href="#-take-a-look-around">Explore</a> ·
  <a href="#-run-it-locally">Run locally</a> ·
  <a href="#-make-it-yours">Make it yours</a>
</p>

---

## A desktop, not just a landing page

Power on **Tarun OS** and explore a portfolio dressed up as a tiny personal computer. Its familiar desktop, app windows, and taskbar give the work a playful frame; the content stays readable, lightweight, and easy to make your own.

## ✨ Take a look around

| App | What’s inside |
| --- | --- |
| **About Me** | A short introduction, working style, and things I like to do |
| **My Work** | Selected projects, from neighborhood food to climate research |
| **Field Notes** | Small observations and unfinished thoughts |
| **Get in Touch** | A friendly way to start a conversation |
| **Achievements** | Tech and social milestones |
| **Videos** | A home for project films and other moving pictures |
| **Settings** | Desktop preferences |

## 🎛 The feel of it

- **Old-computer charm:** boot screen, desktop icons, app windows, Start menu, and taskbar.
- **Small by design:** plain HTML, CSS, and JavaScript; no framework, package install, or build step.
- **Content you can actually edit:** pages are readable HTML, and achievements and videos live in straightforward JavaScript data files.
- **Responsive and accessible foundations:** semantic pages, labelled controls, and layouts designed to adapt to smaller screens.

## 🚀 Run it locally

No dependencies to install. Clone the repository and serve the project root with any static-file server:

```sh
git clone https://github.com/VGTS-2009/Tarun_portfolio.git
cd Tarun_portfolio
```

For example, with Python installed:

```sh
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000). You can also open `index.html` directly, but a local server is recommended for consistent browser behavior.

## 🧩 Make it yours

Start by replacing the sample content with your own:

1. **Introduction:** edit `apps/about.html`.
2. **Selected projects:** update `apps/work.html` and the project pages in `apps/projects/`.
3. **Field notes:** edit `apps/journal.html` and add pages in `apps/notes/`.
4. **Videos:** add entries to `apps/videos-data.js`. Supported types are YouTube, Vimeo, and relative paths to video files.
5. **Achievements:** add entries to `apps/achievements-data.js` under `tech` or `social`.
6. **Contact:** update `apps/contact.html` with your own contact details.
7. **Look and feel:** tune the desktop in `styles.css` and the app pages in `apps/app.css`.

More detail about updating the content collections is in [`apps/CONTENT.md`](apps/CONTENT.md).

## 📁 Project map

```text
.
├── index.html              # Desktop and boot screen
├── styles.css              # Desktop styling
├── desktop.js              # Desktop interactions and app windows
└── apps/
    ├── *.html              # App pages
    ├── app.css             # Shared app-page styling
    ├── *-data.js           # Editable video and achievement data
    ├── notes/              # Individual field notes
    └── projects/           # Individual project pages
```

## 🌐 Publish with GitHub Pages

This is a static site and can be hosted directly from the repository:

1. Open the repository’s **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select `main` and the `/ (root)` folder, then save.

Once GitHub Pages finishes publishing, the site URL will appear in the Pages settings.

---

<p align="center">
  Made with curiosity, careful details, and a slightly unreasonable belief that websites can feel like places.
</p>
