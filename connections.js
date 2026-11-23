/* Lightweight working diagram supplied by the project team. */
(() => {
  const graph=document.querySelector('#correspondence-network');
  if(!graph)return;
  const controls=document.querySelector('.places-views');
  const people=Array.from(graph.querySelectorAll('[data-person]'));
  const lines=Array.from(graph.querySelectorAll('[data-from]'));
  let selected='';
  function highlight(id){
    selected=id;
    const neighbours=new Set([id]);
    lines.forEach(line=>{const linked=line.dataset.from===id||line.dataset.to===id;if(linked){neighbours.add(line.dataset.from);neighbours.add(line.dataset.to);}line.classList.toggle('highlighted',!!id&&linked);line.classList.toggle('muted',!!id&&!linked);});
    people.forEach(person=>{person.classList.toggle('selected',person.dataset.person===id);person.classList.toggle('muted',!!id&&!neighbours.has(person.dataset.person));person.setAttribute('aria-pressed',String(person.dataset.person===id));});
  }
  people.forEach(person=>{
    person.addEventListener('click',()=>highlight(selected===person.dataset.person?'':person.dataset.person));
    person.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();highlight(selected===person.dataset.person?'':person.dataset.person);}if(event.key==='Escape')highlight('');});
  });
  document.querySelector('#connections-reset').addEventListener('click',()=>highlight(''));
  controls.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{
    const network=button.dataset.placesView==='connections';
    document.querySelector('#birthplaces-view').hidden=network;
    document.querySelector('#connections-view').hidden=!network;
    controls.querySelectorAll('button').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  }));
  controls.hidden=false;
})();
