const apps = {
  about: { title: 'About Me', icon: '✳', src: 'apps/about.html', width: 590, height: 500, left: 80, top: 66 },
  work: { title: 'My Work', icon: 'W', src: 'apps/work.html', width: 660, height: 520, left: 135, top: 88 },
  journal: { title: 'Field Notes', icon: '✎', src: 'apps/journal.html', width: 610, height: 510, left: 185, top: 54 },
  contact: { title: 'Get in Touch', icon: '✉', src: 'apps/contact.html', width: 500, height: 430, left: 230, top: 100 },
  achievements: { title: 'Achievements', icon: '★', src: 'apps/achievements.html', width: 620, height: 520, left: 155, top: 72 },
  videos: { title: 'Videos', icon: '▶', src: 'apps/videos.html', width: 700, height: 560, left: 90, top: 60 },
  settings: { title: 'Settings', icon: '⚙', src: 'apps/settings.html', width: 560, height: 550, left: 170, top: 64 },
};

const layer = document.querySelector('#windows-layer');
const desktop = document.querySelector('.desktop');
const desktopIcons = document.querySelector('#desktop-icons');
const taskbarApps = document.querySelector('#taskbar-apps');
const startButton = document.querySelector('#start-button');
const startMenu = document.querySelector('#start-menu');
const bootScreen = document.querySelector('#boot-screen');
const bootButton = document.querySelector('#boot-button');
const bootMessage = document.querySelector('#boot-message');
const openWindows = new Map();
let topZ = 2;
const settingsKey = 'tarun-os-settings-v1';
const defaultSettings = { color: 'lagoon', pattern: 'grid', layout: 'right', positions: {} };

function getSavedSettings() {
  try {
    return { ...defaultSettings, ...JSON.parse(localStorage.getItem(settingsKey) || '{}') };
  } catch {
    return { ...defaultSettings, positions: {} };
  }
}

let currentSettings = getSavedSettings();

function saveSettings() {
  try {
    localStorage.setItem(settingsKey, JSON.stringify(currentSettings));
  } catch {
    return;
  }
}

function getIconPosition(index, layout) {
  const mobile = window.innerWidth <= 680;
  const cellWidth = mobile ? 82 : 100;
  const rowHeight = mobile ? 84 : 92;
  const columns = layout === 'bottom' ? 3 : 2;
  const row = Math.floor(index / columns);
  const column = index % columns;
  let x = 20 + column * cellWidth;
  let y = (mobile ? 245 : 70) + row * rowHeight;
  if (layout === 'right') x = Math.max(12, window.innerWidth - (mobile ? 180 : 205)) + column * cellWidth;
  if (layout === 'bottom') {
    x = Math.max(12, (window.innerWidth - columns * cellWidth) / 2) + column * cellWidth;
    y = Math.max(12, window.innerHeight - (mobile ? 138 : 145) - row * rowHeight);
  }
  return { x, y };
}

function applyIconPositions() {
  desktopIcons.querySelectorAll('.desktop-icon').forEach((icon, index) => {
    const saved = currentSettings.positions?.[icon.dataset.app];
    const point = saved || getIconPosition(index, currentSettings.layout);
    const maxX = Math.max(0, window.innerWidth - icon.offsetWidth);
    const maxY = Math.max(0, window.innerHeight - 100);
    icon.style.left = `${Math.max(0, Math.min(point.x, maxX))}px`;
    icon.style.top = `${Math.max(0, Math.min(point.y, maxY))}px`;
  });
}

function applySettings(settings, persist = true) {
  const validColors = ['lagoon', 'fern', 'brick', 'slate', 'olive'];
  const validPatterns = ['grid', 'dots', 'scanlines', 'checks', 'plain'];
  const validLayouts = ['right', 'left', 'bottom'];
  currentSettings = {
    color: validColors.includes(settings.color) ? settings.color : defaultSettings.color,
    pattern: validPatterns.includes(settings.pattern) ? settings.pattern : defaultSettings.pattern,
    layout: validLayouts.includes(settings.layout) ? settings.layout : defaultSettings.layout,
    positions: settings.positions && typeof settings.positions === 'object' ? settings.positions : {},
  };
  desktop.dataset.color = currentSettings.color;
  desktop.dataset.pattern = currentSettings.pattern;
  desktop.dataset.layout = currentSettings.layout;
  document.querySelector('meta[name="theme-color"]').content = getComputedStyle(desktop).backgroundColor;
  applyIconPositions();
  if (persist) saveSettings();
}

function focusWindow(windowElement) {
  topZ += 1;
  windowElement.style.zIndex = topZ;
  document.querySelectorAll('.app-window').forEach((item) => item.classList.toggle('is-active', item === windowElement));
  document.querySelectorAll('.taskbar-app').forEach((item) => item.classList.toggle('is-active', item.dataset.windowId === windowElement.dataset.windowId));
}

function openApp(appId) {
  const app = apps[appId];
  if (!app) return;
  startMenu.hidden = true;
  startButton.setAttribute('aria-expanded', 'false');
  const existing = openWindows.get(appId);
  if (existing) {
    existing.window.hidden = false;
    focusWindow(existing.window);
    return;
  }

  const windowElement = document.createElement('section');
  windowElement.className = 'app-window is-active';
  windowElement.dataset.windowId = appId;
  windowElement.setAttribute('role', 'dialog');
  windowElement.setAttribute('aria-label', app.title);
  windowElement.style.width = `${app.width}px`;
  windowElement.style.height = `${app.height}px`;
  windowElement.style.left = `${Math.max(12, Math.min(app.left, window.innerWidth - app.width - 12))}px`;
  windowElement.style.top = `${Math.max(12, Math.min(app.top, window.innerHeight - app.height - 60))}px`;

  const titlebar = document.createElement('div');
  titlebar.className = 'window-titlebar';
  titlebar.innerHTML = `<span class="window-title-icon" aria-hidden="true">${app.icon}</span><span class="window-title">${app.title}</span><div class="window-controls"><button class="window-control" type="button" data-action="minimize" aria-label="Minimize ${app.title}">_</button><button class="window-control" type="button" data-action="maximize" aria-label="Maximize ${app.title}">□</button><button class="window-control" type="button" data-action="close" aria-label="Close ${app.title}">×</button></div>`;
  const content = document.createElement('div');
  content.className = 'window-content';
  const frame = document.createElement('iframe');
  frame.src = app.src;
  frame.title = app.title;
  frame.loading = 'eager';
  frame.addEventListener('load', () => {
    if (appId === 'settings') frame.contentWindow.postMessage({ type: 'settings-init', settings: currentSettings }, '*');
  });
  content.append(frame);
  windowElement.append(titlebar, content);

  const taskbarButton = document.createElement('button');
  taskbarButton.className = 'taskbar-app is-active';
  taskbarButton.type = 'button';
  taskbarButton.dataset.windowId = appId;
  taskbarButton.innerHTML = `<span class="taskbar-app__icon" aria-hidden="true">${app.icon}</span><span class="taskbar-app__label">${app.title}</span>`;
  taskbarApps.append(taskbarButton);
  layer.append(windowElement);
  openWindows.set(appId, { window: windowElement, taskbarButton, frame });
  focusWindow(windowElement);

  windowElement.addEventListener('pointerdown', () => focusWindow(windowElement));
  titlebar.addEventListener('pointerdown', (event) => {
    if (event.target.closest('button') || windowElement.classList.contains('is-maximized')) return;
    const startX = event.clientX;
    const startY = event.clientY;
    const startLeft = windowElement.offsetLeft;
    const startTop = windowElement.offsetTop;
    titlebar.setPointerCapture(event.pointerId);
    const move = (pointerEvent) => {
      windowElement.style.left = `${Math.max(0, Math.min(window.innerWidth - 80, startLeft + pointerEvent.clientX - startX))}px`;
      windowElement.style.top = `${Math.max(0, Math.min(window.innerHeight - 90, startTop + pointerEvent.clientY - startY))}px`;
    };
    const finish = () => {
      titlebar.removeEventListener('pointermove', move);
      titlebar.removeEventListener('pointerup', finish);
      titlebar.removeEventListener('pointercancel', finish);
    };
    titlebar.addEventListener('pointermove', move);
    titlebar.addEventListener('pointerup', finish);
    titlebar.addEventListener('pointercancel', finish);
  });

  titlebar.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'close') closeApp(appId);
    if (action === 'minimize') windowElement.hidden = true;
    if (action === 'maximize') windowElement.classList.toggle('is-maximized');
  });
  taskbarButton.addEventListener('click', () => {
    if (!windowElement.hidden && windowElement.classList.contains('is-active')) windowElement.hidden = true;
    else windowElement.hidden = false;
    focusWindow(windowElement);
  });
}

function closeApp(appId) {
  const entry = openWindows.get(appId);
  if (!entry) return;
  entry.window.remove();
  entry.taskbarButton.remove();
  openWindows.delete(appId);
}

document.querySelectorAll('[data-app]').forEach((button) => {
  button.addEventListener('click', () => {
    if (!button.dataset.wasDragged) openApp(button.dataset.app);
  });
  if (!button.classList.contains('desktop-icon')) return;
  let dragStart;
  let dragged = false;
  button.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    const bounds = button.getBoundingClientRect();
    dragStart = { pointerX: event.clientX, pointerY: event.clientY, left: bounds.left, top: bounds.top };
    dragged = false;
    button.setPointerCapture(event.pointerId);
  });
  button.addEventListener('pointermove', (event) => {
    if (!dragStart || !(event.buttons & 1)) return;
    const deltaX = event.clientX - dragStart.pointerX;
    const deltaY = event.clientY - dragStart.pointerY;
    if (!dragged && Math.hypot(deltaX, deltaY) < 5) return;
    dragged = true;
    button.style.left = `${Math.max(0, Math.min(window.innerWidth - button.offsetWidth, dragStart.left + deltaX))}px`;
    button.style.top = `${Math.max(0, Math.min(window.innerHeight - 100, dragStart.top + deltaY))}px`;
    currentSettings.positions[button.dataset.app] = { x: parseFloat(button.style.left), y: parseFloat(button.style.top) };
    saveSettings();
  });
  const finishDrag = () => {
    if (dragged) {
      const appId = button.dataset.app;
      currentSettings.positions[appId] = { x: parseFloat(button.style.left), y: parseFloat(button.style.top) };
      saveSettings();
      button.dataset.wasDragged = 'true';
      requestAnimationFrame(() => delete button.dataset.wasDragged);
    }
    dragStart = undefined;
  };
  button.addEventListener('pointerup', finishDrag);
  button.addEventListener('pointercancel', finishDrag);
});

window.addEventListener('message', (event) => {
  const settingsWindow = openWindows.get('settings');
  if (!settingsWindow || event.source !== settingsWindow.frame.contentWindow) return;
  if (event.data?.type !== 'settings-change') return;
  const layoutChanged = event.data.settings?.layout !== currentSettings.layout;
  applySettings({ ...currentSettings, ...event.data.settings, positions: layoutChanged ? {} : currentSettings.positions });
  settingsWindow.frame.contentWindow.postMessage({ type: 'settings-saved' }, '*');
});

window.addEventListener('resize', applyIconPositions);
applySettings(currentSettings, false);
startButton.addEventListener('click', () => {
  startMenu.hidden = !startMenu.hidden;
  startButton.setAttribute('aria-expanded', String(!startMenu.hidden));
});
document.addEventListener('pointerdown', (event) => {
  if (!startMenu.hidden && !startMenu.contains(event.target) && !startButton.contains(event.target)) {
    startMenu.hidden = true;
    startButton.setAttribute('aria-expanded', 'false');
  }
});

function updateClock() {
  const now = new Date();
  document.querySelector('#clock').textContent = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(now);
}
updateClock();
setInterval(updateClock, 30_000);

function playBootChime() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  try {
    const audio = new AudioContextClass();
    audio.resume();
    [523.25, 659.25, 783.99, 1046.5].forEach((frequency, index) => {
      const start = audio.currentTime + index * 0.13;
      const oscillator = audio.createOscillator();
      const volume = audio.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      volume.gain.setValueAtTime(0.0001, start);
      volume.gain.exponentialRampToValueAtTime(0.12, start + 0.025);
      volume.gain.exponentialRampToValueAtTime(0.0001, start + 0.42);
      oscillator.connect(volume);
      volume.connect(audio.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.44);
    });
    window.setTimeout(() => audio.close(), 1200);
  } catch {
    return;
  }
}

bootButton.addEventListener('click', () => {
  bootButton.disabled = true;
  bootScreen.classList.add('is-booting');
  bootMessage.textContent = 'Loading Tarun OS…';
  playBootChime();
  window.setTimeout(() => { bootMessage.textContent = 'Restoring desktop settings…'; }, 650);
  window.setTimeout(() => { bootMessage.textContent = 'Starting your desktop…'; }, 1200);
  window.setTimeout(() => {
    bootScreen.classList.add('is-complete');
    desktop.inert = false;
    desktop.setAttribute('aria-hidden', 'false');
    window.setTimeout(() => {
      bootScreen.hidden = true;
      startButton.focus();
    }, 300);
  }, 1750);
});