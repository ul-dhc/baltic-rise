const root = document.documentElement;
const themeButton = document.querySelector('#theme-toggle');
const sizeButton = document.querySelector('#text-size-toggle');
const readingStatus = document.querySelector('#reading-status');
function savePreference(key, value) { try { localStorage.setItem(key, value); } catch {} }
function updateThemeControl() {
  const dark = root.dataset.theme === 'dark';
  themeButton?.setAttribute('aria-pressed', String(dark));
  themeButton?.setAttribute('title', dark ? 'Switch to light mode' : 'Switch to dark mode');
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#211b24' : '#f8f4ed');
}
updateThemeControl();
themeButton?.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  savePreference('baltic-theme', root.dataset.theme);
  updateThemeControl();
});
const textSizes = ['standard', 'large', 'larger'];
function updateSizeControl() {
  const current = root.dataset.textSize;
  const next = textSizes[(textSizes.indexOf(current) + 1) % textSizes.length];
  const action = next === 'standard' ? 'Restore standard text size' : 'Increase text size';
  const label = `${action}. Current size: ${current}.`;
  sizeButton?.setAttribute('aria-label', label);
  sizeButton?.setAttribute('title', label);
}
updateSizeControl();
sizeButton?.addEventListener('click', () => {
  const next = textSizes[(textSizes.indexOf(root.dataset.textSize) + 1) % textSizes.length];
  root.dataset.textSize = next;
  savePreference('baltic-text-size', next);
  updateSizeControl();
  if (readingStatus) readingStatus.textContent = `Text size: ${next}.`;
});
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
  let stored;
  try { stored = localStorage.getItem('baltic-theme'); } catch {}
  if (!stored) { root.dataset.theme = event.matches ? 'dark' : 'light'; updateThemeControl(); }
});
const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  toggle?.setAttribute('aria-expanded', 'false');
  toggle?.setAttribute('aria-label', 'Open menu');
  navigation?.classList.remove('open');
}
toggle?.addEventListener('click', () => {
  const expanded = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!expanded));
  toggle.setAttribute('aria-label', expanded ? 'Open menu' : 'Close menu');
  navigation?.classList.toggle('open', !expanded);
});
navigation?.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') { closeMenu(); toggle.focus(); }
});
const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
const search = document.querySelector('#writer-search');
const writers = Array.from(document.querySelectorAll('.person'));
function filterWriters() {
  const query = normalize(search.value);
  let count = 0;
  writers.forEach(writer => {
    const matches = normalize(writer.dataset.search).includes(query);
    writer.hidden = !matches;
    if (matches) count++;
  });
  document.querySelector('#no-results').hidden = count !== 0;
  document.querySelector('#search-status').textContent = `${count} ${count === 1 ? 'writer' : 'writers'} found`;
}
search?.addEventListener('input', filterWriters);
function openLinkedBiography() {
  if (!/^#woman-\d+$/.test(location.hash)) return;
  const person = document.querySelector(location.hash);
  if (!person) return;
  if (search) { search.value = ''; filterWriters(); }
  person.open = true;
  person.scrollIntoView({ block: 'start' });
  person.querySelector('summary')?.focus({ preventScroll: true });
}
window.addEventListener('hashchange', openLinkedBiography);
openLinkedBiography();

// A theme-aware select-only combobox; the native select remains the no-script fallback.
function enhanceWriterSelect() {
  const select = document.querySelector('#map-writer');
  if (!select) return null;
  const label = document.querySelector('label[for="map-writer"]');
  if (label) label.id = 'map-writer-label';
  const wrapper = document.createElement('div'); wrapper.className = 'writer-picker';
  const trigger = document.createElement('button'); trigger.type = 'button'; trigger.id = 'map-writer-trigger'; trigger.className = 'writer-picker-trigger';
  trigger.setAttribute('role', 'combobox'); trigger.setAttribute('aria-haspopup', 'listbox'); trigger.setAttribute('aria-expanded', 'false'); trigger.setAttribute('aria-controls', 'map-writer-options'); trigger.setAttribute('aria-labelledby', 'map-writer-label map-writer-value');
  const value = document.createElement('span'); value.id = 'map-writer-value';
  trigger.append(value);
  // Official Lucide chevron-down geometry.
  const ns = 'http://www.w3.org/2000/svg'; const arrow = document.createElementNS(ns, 'svg');
  for (const [key, val] of Object.entries({viewBox:'0 0 24 24',fill:'none',stroke:'currentColor','stroke-width':'1.7','stroke-linecap':'round','stroke-linejoin':'round',class:'icon','aria-hidden':'true',focusable:'false'})) arrow.setAttribute(key,val);
  const path = document.createElementNS(ns,'path'); path.setAttribute('d','m6 9 6 6 6-6'); arrow.append(path); trigger.append(arrow);
  const list = document.createElement('div'); list.id = 'map-writer-options'; list.className = 'writer-picker-options'; list.setAttribute('role','listbox'); list.setAttribute('aria-labelledby','map-writer-label'); list.hidden = true;
  const sourceOptions = Array.from(select.options); const options = [];
  let active = select.selectedIndex; let buffer = ''; let bufferTimer;
  function highlight(index) {
    active = (index + options.length) % options.length;
    options.forEach((option,i) => option.classList.toggle('active',i===active));
    trigger.setAttribute('aria-activedescendant', options[active].id);
    options[active].scrollIntoView({block:'nearest'});
  }
  function close() { list.hidden = true; trigger.setAttribute('aria-expanded','false'); trigger.removeAttribute('aria-activedescendant'); }
  function open() { list.hidden = false; trigger.setAttribute('aria-expanded','true'); highlight(select.selectedIndex); }
  function sync() {
    value.textContent = select.options[select.selectedIndex].textContent;
    options.forEach((option,i) => option.setAttribute('aria-selected',String(i===select.selectedIndex)));
  }
  function choose(index) {
    select.value = sourceOptions[index].value;
    sync(); close(); trigger.focus({preventScroll:true});
    select.dispatchEvent(new Event('change',{bubbles:true}));
  }
  sourceOptions.forEach((option,i) => {
    const item = document.createElement('div'); item.id = `map-writer-option-${i}`; item.className = 'writer-picker-option'; item.setAttribute('role','option'); item.setAttribute('aria-selected',String(i===select.selectedIndex)); item.textContent = option.textContent;
    item.addEventListener('click',()=>choose(i));
    item.addEventListener('pointermove',()=>highlight(i));
    list.append(item); options.push(item);
  });
  trigger.addEventListener('click',()=>list.hidden?open():close());
  trigger.addEventListener('keydown',event=>{
    const key = event.key;
    if (key==='Tab') { close(); return; }
    if (key==='Escape') { if (!list.hidden) {event.preventDefault();close();} return; }
    if (key==='Enter'||key===' ') {event.preventDefault();if(list.hidden)open();else choose(active);return;}
    if (['ArrowDown','ArrowUp','Home','End'].includes(key)) {
      event.preventDefault(); if(list.hidden){open();if(key==='Home')highlight(0);else if(key==='End')highlight(options.length-1);return;}
      highlight(key==='Home'?0:key==='End'?options.length-1:active+(key==='ArrowDown'?1:-1));return;
    }
    if (key.length===1&&!event.ctrlKey&&!event.metaKey&&!event.altKey) {
      event.preventDefault();if(list.hidden)open();clearTimeout(bufferTimer);buffer+=normalize(key);
      const found = sourceOptions.findIndex(option=>normalize(option.textContent).startsWith(buffer));
      if(found>=0)highlight(found);bufferTimer=setTimeout(()=>{buffer='';},700);
    }
  });
  document.addEventListener('pointerdown',event=>{if(!wrapper.contains(event.target))close();});
  select.addEventListener('change',sync);
  wrapper.append(trigger,list); select.after(wrapper); select.hidden = true; if(label)label.htmlFor=trigger.id; sync();
  return {sync};
}
const writerPicker = enhanceWriterSelect();

// Every map location has a native HTML control and an equivalent text listing.
const map = document.querySelector('#baltic-map');
if (map && typeof birthplaceData !== 'undefined') {
  const panel = document.querySelector('#map-panel');
  const writerSelect = document.querySelector('#map-writer');
  const regionButton = document.querySelector('#map-region');
  const latviaButton = document.querySelector('#map-latvia');
  let selectedPlace = birthplaceData[0];
  let zoomed = false;
  function setZoom(latvia) {
    zoomed = latvia;
    map.setAttribute('viewBox', latvia ? '395 280 285 155' : '0 0 945 620');
    map.classList.toggle('zoomed', latvia);
    regionButton.setAttribute('aria-pressed', String(!latvia));
    latviaButton.setAttribute('aria-pressed', String(latvia));
    map.querySelectorAll('.map-place').forEach(point => {
      const place = birthplaceData.find(p => p.id === point.dataset.mapPlace);
      point.setAttribute('transform', `translate(${place.x},${place.y}) scale(${latvia ? .4 : 1})`);
    });
  }
  function showPlace(place, selectedWriter = '') {
    selectedPlace = place;
    if (zoomed && place.country !== 'Latvia') setZoom(false);
    map.querySelectorAll('.map-place').forEach(point => point.classList.toggle('selected', point.dataset.mapPlace === place.id));
    document.querySelectorAll('[data-place]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.place === place.id)));
    writerSelect.value = selectedWriter;
    writerPicker?.sync();
    panel.replaceChildren();
    const category = document.createElement('p'); category.className = 'eyebrow'; category.textContent = 'Place of birth';
    const title = document.createElement('h3'); title.textContent = place.name;
    const country = document.createElement('p'); country.textContent = place.country;
    const list = document.createElement('ul');
    place.writers.forEach(writer => {
      const item = document.createElement('li');
      const link = document.createElement('a'); link.href = '#' + writer.anchor; link.textContent = writer.name;
      link.addEventListener('click', () => { if (location.hash === '#' + writer.anchor) openLinkedBiography(); });
      item.append(link); list.append(item);
    });
    panel.append(category, title, country, list);
    if (place.source) {
      const source = document.createElement('a'); source.href = place.source; source.textContent = 'Biographical source'; source.className = 'map-source'; panel.append(source);
    }
    document.querySelector('#map-title').textContent = `Birthplaces around the Baltic Sea: ${place.name} highlighted`;
  }
  document.querySelectorAll('[data-place]').forEach(button => button.addEventListener('click', () => showPlace(birthplaceData.find(p => p.id === button.dataset.place))));
  writerSelect.addEventListener('change', () => {
    if (!writerSelect.value) return;
    const place = birthplaceData.find(p => p.people.includes(Number(writerSelect.value)));
    showPlace(place, writerSelect.value);
  });
  regionButton.addEventListener('click', () => setZoom(false));
  latviaButton.addEventListener('click', () => {
    if (selectedPlace.country !== 'Latvia') showPlace(birthplaceData[0]);
    setZoom(true);
  });
  showPlace(selectedPlace);
}
