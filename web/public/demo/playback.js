const video = document.querySelector('video');

if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
  // Refresh the media index after an update while preserving the viewer's position and controls.
  navigator.serviceWorker.addEventListener('controllerchange', () => {
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
