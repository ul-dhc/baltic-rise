/* Project portrait pool; source and reuse details are in assets/credits.json. */
(() => {
  const portraits = [
  {
    "id": "laura",
    "name": "Laura Marholm",
    "dates": "1854–1928",
    "src": "assets/laura.jpg",
    "width": 263,
    "height": 353,
    "alt": "Portrait of Laura Marholm, 1889",
    "credit": "credits.html#credit-laura"
  },
  {
    "id": "ellen",
    "name": "Ellen Key",
    "dates": "1849–1926",
    "src": "assets/ellen.jpg",
    "width": 1385,
    "height": 1779,
    "alt": "Portrait of Ellen Key, 1885",
    "credit": "credits.html#credit-ellen"
  },
  {
    "id": "lou",
    "name": "Lou Andreas-Salomé",
    "dates": "1861–1937",
    "src": "assets/lou.jpg",
    "width": 2268,
    "height": 3304,
    "alt": "Portrait of Lou Andreas-Salomé, c. 1897",
    "credit": "credits.html#credit-lou"
  },
  {
    "id": "aspazija",
    "name": "Aspazija",
    "dates": "1865–1943",
    "src": "assets/aspazija.jpg",
    "width": 773,
    "height": 1200,
    "alt": "Portrait of Aspazija, c. 1912 or earlier",
    "credit": "credits.html#credit-aspazija"
  },
  {
    "id": "zenta",
    "name": "Zenta Mauriņa",
    "dates": "1897–1978",
    "src": "assets/zenta.jpg",
    "width": 284,
    "height": 431,
    "alt": "Portrait of Zenta Mauriņa, 1930s",
    "credit": "credits.html#credit-zenta"
  },
  {
    "id": "goercke",
    "name": "Elisabeth Goercke",
    "dates": "1888–1966",
    "src": "assets/goercke.jpg",
    "width": 367,
    "height": 550,
    "alt": "Portrait of Elisabeth Goercke, published in 1930",
    "credit": "credits.html#credit-goercke"
  },
{
  "id": "hunnius",
  "name": "Monika Hunnius",
  "dates": "1858–1934",
  "src": "assets/hunnius.jpg",
  "width": 430,
  "height": 550,
  "alt": "Portrait of Monika Hunnius",
  "credit": "credits.html#credit-hunnius"
},
{
  "id": "eckardt",
  "name": "Elfriede Eckardt-Skalberg",
  "dates": "1884–1964",
  "src": "assets/eckardt.jpg",
  "width": 588,
  "height": 830,
  "alt": "Portrait of Elfriede Eckardt-Skalberg",
  "credit": "credits.html#credit-eckardt"
},
{
  "id": "brincken",
  "name": "Gertrud von den Brincken",
  "dates": "1892–1982",
  "src": "assets/brincken.jpg",
  "width": 1335,
  "height": 1800,
  "alt": "Portrait of Gertrud von den Brincken",
  "credit": "credits.html#credit-brincken"
}
];
  const frames = Array.from(document.querySelectorAll('.hero .portrait'));
  if (frames.length !== 3) return;
  const storageKey = 'baltic-previous-portraits';
  function showNewSelection() {
    let previous = '';
    try { previous = localStorage.getItem(storageKey) || ''; } catch {}
    // Choose among all three-person sets, excluding the last set on this device.
    const combinations = [];
    for (let a = 0; a < portraits.length - 2; a++) {
      for (let b = a + 1; b < portraits.length - 1; b++) {
        for (let c = b + 1; c < portraits.length; c++) {
          const group = [portraits[a], portraits[b], portraits[c]];
          if (group.map(p => p.id).sort().join(',') !== previous) combinations.push(group);
        }
      }
    }
    const selected = combinations[Math.floor(Math.random() * combinations.length)];
    const selectionKey = selected.map(p => p.id).sort().join(',');
    // Shuffle the three positions as well, without repeating a writer.
    for (let i = selected.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [selected[i], selected[j]] = [selected[j], selected[i]];
    }
    frames.forEach((frame, i) => {
      const person = selected[i];
      const image = frame.querySelector('img');
      image.src = person.src;
      image.alt = person.alt;
      image.width = person.width;
      image.height = person.height;
      frame.dataset.portrait = person.id;
      const name = document.createElement('a');
      name.href = person.credit;
      name.textContent = person.name;
      name.setAttribute('aria-label', `${person.name}: portrait source and credit`);
      const years = document.createElement('span');
      years.textContent = person.dates;
      frame.querySelector('figcaption').replaceChildren(name, years);
    });
    try { localStorage.setItem(storageKey, selectionKey); } catch {}
  }
  showNewSelection();
  // Returning through browser history can restore a page without rerunning scripts.
  window.addEventListener('pageshow', event => { if (event.persisted) showNewSelection(); });
})();

/* A small manuscript selection, with credits kept with each image. */
(() => {
  const gallery = document.querySelector('#archive-gallery');
  const corpus = document.querySelector('#corpus-manuscript');
  if (!gallery || !corpus) return;
  const items = [
    {id:'aspazija',src:'assets/manuscripts/aspazija-1895-german-1.jpg',title:'Aspazija to Rainis · 4 and 7 May 1895',credit:'Literature and Music Museum · Asp. K 2/7, inv. no. 15625 · Digital image: National Library of Latvia / RUNA',link:'credits.html#credit-aspazija-german',position:'center 35%'},
    {id:'ellen',src:'assets/manuscripts/ellen-1908-2.jpg',title:'Ellen Key to Stefan Zweig · 20 June 1908',credit:'Literaturarchiv Salzburg · SZ-SAM/AK.95 · CC BY',link:'credits.html#credit-ellen-1908',position:'center 52%'},
    {id:'lou',src:'assets/manuscripts/lou-1895-1.jpg',title:'Lou Andreas-Salomé to Marie von Ebner-Eschenbach · 26 May 1895',credit:'Wienbibliothek im Rathaus · H.I.N.-57463 · Public Domain Mark',link:'credits.html#credit-lou-1895',position:'center 40%'},
    {id:'holm',src:'assets/manuscripts/holm-conrad-1887.jpg',title:'Mia Holm to Michael Georg Conrad',credit:'Monacensia, Münchner Stadtbibliothek · MGC B 390 · Image supplied by Chiara Gianni',link:'credits.html#credit-holm-conrad',position:'center 45%'},
    {id:'marholm',src:'assets/manuscripts/marholm-schnitzler-1895.jpg',title:'Laura Marholm to Arthur Schnitzler · 24 April 1895',credit:'Image supplied by Chiara Gianni',link:'credits.html#credit-marholm-schnitzler',position:'center 55%'}
  ];
  let previous = '';
  try { previous = sessionStorage.getItem('baltic-manuscript') || ''; } catch {}
  const candidates = items.filter(item => item.id !== previous);
  let current = items.indexOf(candidates[Math.floor(Math.random() * candidates.length)]);
  const corpusItem = items.filter(item => item.id !== items[current].id)[Math.floor(Math.random() * (items.length - 1))];
  function show(figure, item) {
    const image = figure.querySelector('img');
    image.src = item.src;
    image.alt = `Handwriting: ${item.title}`;
    image.style.objectPosition = item.position;
    const fullSize = figure.querySelector(':scope > a');
    if (fullSize) {
      fullSize.href = item.src;
      fullSize.setAttribute('aria-label', `View ${item.title} at full size`);
    }
    const caption = figure.querySelector('figcaption');
    const link = document.createElement('a');
    link.href = item.link;
    link.textContent = 'Source & credit';
    caption.replaceChildren(document.createTextNode(item.title), document.createElement('br'), document.createTextNode(item.credit + ' · '), link);
  }
  function render() {
    show(gallery, items[current]);
    gallery.querySelector('[data-gallery-count]').textContent = `${current + 1} / ${items.length}`;
    try { sessionStorage.setItem('baltic-manuscript', items[current].id); } catch {}
  }
  gallery.querySelector('[data-gallery-prev]').addEventListener('click', () => {current = (current - 1 + items.length) % items.length; render();});
  gallery.querySelector('[data-gallery-next]').addEventListener('click', () => {current = (current + 1) % items.length; render();});
  show(corpus, corpusItem);
  render();
})();
