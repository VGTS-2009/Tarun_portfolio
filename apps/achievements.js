const groups = [
  { key: 'tech', target: '#tech-achievements', empty: 'No technical achievements added yet.' },
  { key: 'social', target: '#social-achievements', empty: 'No community achievements added yet.' },
];

for (const group of groups) {
  const container = document.querySelector(group.target);
  const items = Array.isArray(achievements[group.key]) ? achievements[group.key] : [];
  if (!items.length) {
    const empty = document.createElement('p');
    empty.className = 'viewer-empty';
    empty.textContent = group.empty;
    container.append(empty);
    continue;
  }

  for (const item of items) {
    const card = document.createElement('article');
    card.className = 'viewer-card';
    const icon = document.createElement('span');
    icon.className = 'viewer-card__icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = group.key === 'tech' ? '</>' : '✳';
    const text = document.createElement('div');
    const meta = document.createElement('span');
    meta.className = 'entry-card__meta';
    meta.textContent = [item.year, item.organization].filter(Boolean).join(' · ');
    const title = document.createElement('h3');
    title.textContent = item.title;
    text.append(meta, title);
    if (item.description) {
      const description = document.createElement('p');
      description.textContent = item.description;
      text.append(description);
    }
    card.append(icon, text);
    container.append(card);
  }
}