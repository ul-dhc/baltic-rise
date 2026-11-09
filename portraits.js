/* Verified portrait pool; source and reuse details are in assets/credits.json. */
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
