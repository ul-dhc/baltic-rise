/* Rotate archival letters independently of the complementary floral motifs. */
(() => {
  const hero = document.querySelector('[data-flower-hero]');
  if (!hero) return;
  const flowers = [
    {id:'mimosa',cutout:'assets/manuscripts/mimosa-cutout.png',postcard:'assets/manuscripts/aspazija-1908-front.jpg',alt:'Yellow mimosa postcard from Aspazija’s collection',credit:'credits.html#credit-aspazija-1908',lines:['Aspazija to Rainis · 22 November 1908','Literature and Music Museum · RTMM 70998']},
    {id:'poppies',cutout:'assets/manuscripts/poppies-cutout.png',postcard:'assets/manuscripts/aspazija-poppies.png',alt:'Red poppies postcard from Aspazija’s collection',credit:'credits.html#credit-aspazija-poppies',lines:['Postcard from Aspazija’s collection','Literature and Music Museum · RTMM 266242']}
  ];
  const letters = [
    {id:'aspazija-german',author:'Aspazija',image:'assets/manuscripts/aspazija-1895-german-1.jpg'},
    {id:'holm-conrad',author:'Mia Holm',image:'assets/manuscripts/holm-conrad-1887.jpg'},
    {id:'marholm-schnitzler',author:'Laura Marholm',image:'assets/manuscripts/marholm-schnitzler-1895.jpg'},
    {id:'lou-1895',author:'Lou Andreas-Salomé',image:'assets/manuscripts/lou-1895-1.jpg'}
  ];
  let previousLetter;
  try {previousLetter=localStorage.getItem('baltic-previous-letter');} catch {}
  const previousIndex=letters.findIndex(item=>item.id===previousLetter);
  const letter=letters[previousIndex<0?Math.floor(Math.random()*letters.length):(previousIndex+1)%letters.length];
  try {localStorage.setItem('baltic-previous-letter',letter.id);} catch {}
  const letterImage=document.querySelector('[data-letter-about]');
  if(letterImage)letterImage.src=letter.image;
  const letterCredit=document.querySelector('[data-letter-credit]');
  if(letterCredit){letterCredit.href='credits.html#credit-'+letter.id;letterCredit.textContent=letter.author;}
  let last;
  try {last=localStorage.getItem('baltic-previous-flower');} catch {}
  const flower=flowers.find(item=>last&&item.id!==last)||flowers[Math.floor(Math.random()*flowers.length)];
  try {localStorage.setItem('baltic-previous-flower',flower.id);} catch {}
  const archiveFlower=flowers.find(item=>item.id!==flower.id);
  // The hero always retains the original transparent mimosa.
  hero.src=flowers[0].cutout;
  document.querySelectorAll('[data-flower-about]').forEach(image=>{image.src=flower.cutout;image.alt='';});
  document.querySelectorAll('[data-flower-postcard]').forEach(image=>{image.src=archiveFlower.postcard;image.alt=archiveFlower.alt;});
  document.querySelectorAll('[data-flower-credit]').forEach(link=>link.href=flower.credit);
  document.querySelectorAll('[data-flower-link]').forEach(link=>{link.href=archiveFlower.postcard;link.setAttribute('aria-label','View the original '+archiveFlower.alt.toLowerCase()+' at full size');});
  const caption=document.querySelector('[data-flower-caption]');
  if(caption){
    caption.replaceChildren();
    archiveFlower.lines.forEach(line=>{caption.append(document.createTextNode(line),document.createElement('br'));});
    const credit=document.createElement('a');credit.href=archiveFlower.credit;credit.textContent='Source & credit';caption.append(credit);
  }
})();
