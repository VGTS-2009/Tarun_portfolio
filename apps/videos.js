const videoList = document.querySelector('#video-list');

function createVideoCard(item) {
  const card = document.createElement('article');
  card.className = 'video-item';
  const title = document.createElement('h2');
  title.textContent = item.title;
  const description = document.createElement('p');
  description.textContent = item.description || '';

  if (item.type === 'file') {
    const player = document.createElement('video');
    player.className = 'video-frame';
    player.controls = true;
    player.preload = 'metadata';
    player.src = item.src;
    player.title = item.title;
    card.append(player);
  } else if (item.type === 'youtube' && /^[\w-]{11}$/.test(item.id)) {
    const player = document.createElement('iframe');
    player.className = 'video-frame';
    player.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(item.id)}`;
    player.title = item.title;
    player.loading = 'lazy';
    player.allow = 'accelerometer; encrypted-media; picture-in-picture';
    player.allowFullscreen = true;
    card.append(player);
  } else if (item.type === 'vimeo' && /^\d+$/.test(item.id)) {
    const player = document.createElement('iframe');
    player.className = 'video-frame';
    player.src = `https://player.vimeo.com/video/${encodeURIComponent(item.id)}`;
    player.title = item.title;
    player.loading = 'lazy';
    player.allow = 'autoplay; fullscreen; picture-in-picture';
    player.allowFullscreen = true;
    card.append(player);
  } else {
    return null;
  }

  const source = document.createElement('a');
  source.className = 'video-open-link';
  source.target = '_blank';
  source.rel = 'noreferrer';
  if (item.type === 'youtube') source.href = `https://www.youtube.com/watch?v=${encodeURIComponent(item.id)}`;
  if (item.type === 'vimeo') source.href = `https://vimeo.com/${encodeURIComponent(item.id)}`;
  if (item.type === 'file') source.href = item.src;
  source.textContent = 'Open original video';
  card.append(title);
  if (item.description) card.append(description);
  card.append(source);
  return card;
}

if (Array.isArray(videos) && videos.length) {
  for (const item of videos) {
    const card = createVideoCard(item);
    if (card) videoList.append(card);
  }
}

if (!videoList.children.length) {
  const empty = document.createElement('p');
  empty.className = 'empty-state';
  empty.textContent = 'No films in the collection yet.';
  videoList.append(empty);
}