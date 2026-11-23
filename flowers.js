/* Alternate the two archival floral motifs on each new page load. */
(() => {
  const hero = document.querySelector('[data-flower-hero]');
  if (!hero) return;
  const flowers = [
    {id:'mimosa',cutout:'assets/manuscripts/mimosa-cutout.png',postcard:'assets/manuscripts/aspazija-1908-front.jpg',alt:'Yellow mimosa postcard from Aspazija’s collection',credit:'credits.html#credit-aspazija-1908',lines:['Aspazija to Rainis · 22 November 1908','Literature and Music Museum · RTMM 70998']},
    {id:'poppies',cutout:'assets/manuscripts/poppies-cutout.png',postcard:'assets/manuscripts/aspazija-poppies.png',alt:'Red poppies postcard from Aspazija’s collection',credit:'credits.html#credit-aspazija-poppies',lines:['Postcard from Aspazija’s collection','Literature and Music Museum · RTMM 266242']}
  ];
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
