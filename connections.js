/* An exploratory view of the project team's working diagram. */
(() => {
  const graph=document.querySelector('#correspondence-network');
  if(!graph)return;
  const controls=document.querySelector('.places-views');
  const people=Array.from(graph.querySelectorAll('[data-person]'));
  const lines=Array.from(graph.querySelectorAll('[data-from]'));
  const positions=new Map();
  let selected='',hovered='',drag=null,ignoreClick=false;
  const narrow=matchMedia('(max-width:800px)');
  function paintSelection(){
    const id=hovered||selected, neighbours=new Set([id]);
    lines.forEach(line=>{const linked=line.dataset.from===id||line.dataset.to===id;if(linked){neighbours.add(line.dataset.from);neighbours.add(line.dataset.to);}line.classList.toggle('highlighted',!!id&&linked);line.classList.toggle('muted',!!id&&!linked);});
    people.forEach(person=>{person.classList.toggle('selected',person.dataset.person===id);person.classList.toggle('muted',!!id&&!neighbours.has(person.dataset.person));person.setAttribute('aria-pressed',String(person.dataset.person===selected));});
  }
  function draw(){
    if(!graph.clientWidth)return;
    people.forEach(person=>{
      const p=positions.get(person.dataset.person);
      // Keep full labels within the available width after resize or dragging.
      p.x=Math.max(person.offsetWidth/2+8,Math.min(graph.clientWidth-person.offsetWidth/2-8,p.x));
      p.y=Math.max(14,Math.min(graph.clientHeight-person.offsetHeight,p.y));
      person.style.left=p.x+'px';person.style.top=p.y+'px';
    });
    lines.forEach(line=>{
      const a=positions.get(line.dataset.from),b=positions.get(line.dataset.to);
      const dx=b.x-a.x,dy=b.y-a.y,length=Math.hypot(dx,dy)||1;
      const bend=(line.classList.contains('relationship')?-1:1)*Math.min(65,length*.12);
      const cx=(a.x+b.x)/2-dy/length*bend,cy=(a.y+b.y)/2+dx/length*bend;
      line.setAttribute('d',`M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`);
    });
  }
  function reset(){
    people.forEach(person=>positions.set(person.dataset.person,{x:graph.clientWidth*Number(narrow.matches?person.dataset.mobileX:person.dataset.x)/100,y:graph.clientHeight*Number(narrow.matches?person.dataset.mobileY:person.dataset.y)/100}));
    selected='';hovered='';paintSelection();draw();
  }
  people.forEach(person=>{
    person.addEventListener('click',()=>{if(ignoreClick){ignoreClick=false;return;}selected=selected===person.dataset.person?'':person.dataset.person;paintSelection();});
    person.addEventListener('pointerenter',()=>{if(!drag){hovered=person.dataset.person;paintSelection();}});
    person.addEventListener('pointerleave',()=>{hovered='';paintSelection();});
    person.addEventListener('keydown',event=>{if(event.key==='Escape'){selected='';hovered='';paintSelection();}});
  });
  graph.addEventListener('pointerdown',event=>{
    if(event.button!==0)return;
    const person=event.target.closest('[data-person]');
    // On touch screens, background gestures retain normal page scrolling.
    if(!person&&event.pointerType==='touch')return;
    drag={id:event.pointerId,person,startX:event.clientX,startY:event.clientY,moved:false,original:new Map(Array.from(positions,([id,p])=>[id,{...p}]))};
  });
  graph.addEventListener('pointermove',event=>{
    if(!drag||drag.id!==event.pointerId)return;
    const dx=event.clientX-drag.startX,dy=event.clientY-drag.startY;
    if(!drag.moved&&Math.hypot(dx,dy)<5)return;
    if(!drag.moved)graph.setPointerCapture(event.pointerId);
    drag.moved=true;graph.classList.add('dragging');
    for(const [id,p] of drag.original){if(!drag.person||id===drag.person.dataset.person)positions.set(id,{x:p.x+dx,y:p.y+dy});}
    hovered=drag.person?.dataset.person||'';paintSelection();draw();
  });
  function release(event){
    if(!drag||drag.id!==event.pointerId)return;
    ignoreClick=drag.moved;
    if(drag.moved&&drag.person)selected=drag.person.dataset.person;
    drag=null;hovered='';graph.classList.remove('dragging');paintSelection();
    // A drag must never activate a name at the release position.
    setTimeout(()=>{ignoreClick=false;},0);
  }
  graph.addEventListener('pointerup',release);graph.addEventListener('pointercancel',release);
  document.querySelector('#connections-reset').addEventListener('click',reset);
  controls.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{
    const network=button.dataset.placesView==='connections';
    document.querySelector('#birthplaces-view').hidden=network;
    document.querySelector('#connections-view').hidden=!network;
    controls.querySelectorAll('button').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
    if(network)reset();
  }));
  new ResizeObserver(()=>{if(graph.clientWidth)reset();}).observe(graph);
  const labelObserver=new ResizeObserver(()=>{if(positions.size)draw();});
  people.forEach(person=>labelObserver.observe(person));
  controls.hidden=false;
  if(location.hash==='#connections'){
    controls.querySelector('[data-places-view="connections"]').click();
    requestAnimationFrame(()=>controls.scrollIntoView({block:'start'}));
  }
})();
