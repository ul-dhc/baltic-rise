/* Applied before page paint. Reading choices stay on this device only. */
(() => {
  const root = document.documentElement;
  let theme;
  let size;
  try { theme = localStorage.getItem('baltic-theme'); size = localStorage.getItem('baltic-text-size'); } catch {}
  root.dataset.theme = ['light', 'dark'].includes(theme) ? theme : (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  root.dataset.textSize = ['standard', 'large', 'larger'].includes(size) ? size : 'standard';
})();
