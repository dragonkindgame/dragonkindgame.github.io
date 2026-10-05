document.querySelectorAll('.nav-group').forEach((group) => {
  let closeTimer;
  group.addEventListener('pointerenter', (event) => {
    if (event.pointerType !== 'mouse') return;
    window.clearTimeout(closeTimer);
    document.querySelectorAll('.nav-group[open]').forEach((openGroup) => {
      if (openGroup !== group) openGroup.removeAttribute('open');
    });
    group.setAttribute('open', '');
  });
  group.addEventListener('pointerleave', (event) => {
    if (event.pointerType === 'mouse') closeTimer = window.setTimeout(() => group.removeAttribute('open'), 90);
  });
});

document.addEventListener('click', (event) => {
  document.querySelectorAll('.nav-group[open]').forEach((group) => {
    if (!group.contains(event.target)) group.removeAttribute('open');
  });
});

const timerForm = document.querySelector('[data-retry-form]');
const timerOutput = document.querySelector('[data-retry-output]');
const timerNote = document.querySelector('[data-retry-note]');
const timerReset = document.querySelector('[data-retry-reset]');
const storageKey = 'dragonkindRetryEndsAt';
let timerInterval;

const formatTime = (remaining) => {
  const hours = Math.floor(remaining / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, '0')).join(':');
};

const renderTimer = () => {
  const endsAt = Number(localStorage.getItem(storageKey) || 0);
  const remaining = Math.max(0, endsAt - Date.now());
  timerOutput.value = formatTime(remaining);
  timerOutput.textContent = timerOutput.value;
  if (endsAt && remaining === 0) {
    window.clearInterval(timerInterval);
    localStorage.removeItem(storageKey);
    timerNote.textContent = 'Your saved wait has ended. Check the official game before starting another attempt.';
  }
};

const beginTicking = () => {
  window.clearInterval(timerInterval);
  renderTimer();
  timerInterval = window.setInterval(renderTimer, 1000);
};

timerForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(timerForm);
  const hours = Math.max(0, Math.min(24, Number(data.get('hours')) || 0));
  const minutes = Math.max(0, Math.min(59, Number(data.get('minutes')) || 0));
  const duration = ((hours * 60) + minutes) * 60000;
  if (!duration) {
    timerNote.textContent = 'Choose at least one minute before starting.';
    return;
  }
  localStorage.setItem(storageKey, String(Date.now() + duration));
  timerNote.textContent = 'Countdown saved in this browser. Match it to the wait shown in your official game.';
  beginTicking();
});

timerReset?.addEventListener('click', () => {
  window.clearInterval(timerInterval);
  localStorage.removeItem(storageKey);
  timerOutput.value = '04:00:00';
  timerOutput.textContent = timerOutput.value;
  timerNote.textContent = 'Timer reset. Adjust the controls to match the official screen.';
});

if (localStorage.getItem(storageKey)) beginTicking();

document.querySelectorAll('[data-video-id]').forEach((button) => {
  button.addEventListener('click', () => {
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${button.dataset.videoId}?autoplay=1`;
    iframe.title = button.dataset.videoTitle;
    iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    button.replaceWith(iframe);
  }, { once: true });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') document.querySelectorAll('.nav-group[open]').forEach((group) => group.removeAttribute('open'));
});
