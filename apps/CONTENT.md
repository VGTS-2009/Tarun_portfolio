# Tarun OS content files

All content remains static and editable as plain HTML and JavaScript.

## Videos

Add entries to `videos` in `videos-data.js`. The Videos app is display-only; there are no visitor-facing add or remove controls.

```js
const videos = [
  {
    title: 'Project film',
    description: 'A short description.',
    type: 'youtube',
    id: 'YOUTUBE_ID',
  },
];
```

Supported types are `youtube` (11-character video ID), `vimeo` (numeric video ID), and `file` (a relative path such as `../media/project-film.mp4`).

## Achievements

Add entries to either array in `achievements-data.js`. The app displays them under the matching Tech or Social heading.

```js
const achievements = {
  tech: [
    { title: 'Achievement', year: '2026', organization: 'Organization', description: 'Short detail.' },
  ],
  social: [],
};
```

## Field Notes

Each journal preview in `journal.html` links to its own page under `notes/`. Copy one of those HTML files to create a new note, then add a linked preview to `journal.html`.
