const video = document.querySelector('video');

if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
  // Repair a player already opened through the old cache when the fixed worker takes over.
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!video.error && video.seekable.length && video.seekable.end(video.seekable.length - 1) >= video.duration - 0.1) return;
    const time = video.ended ? 0 : video.currentTime;
    const playing = !video.paused && !video.ended;
    const rate = video.playbackRate;
    video.addEventListener('loadedmetadata', () => {
      video.currentTime = Math.min(time, video.duration);
      video.playbackRate = rate;
      if (playing) video.play().catch(() => {});
    }, { once: true });
    video.load();
  }, { once: true });
  navigator.serviceWorker.getRegistration().then(registration => registration?.update()).catch(() => {});
}
