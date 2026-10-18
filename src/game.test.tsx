import {test} from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import React,{act} from 'react';
const dom=new JSDOM('<!doctype html><html><body><div id="test-root"></div></body></html>',{url:'https://dead-even.test/'});
for(const key of ['window','document','HTMLElement','HTMLInputElement','HTMLTextAreaElement','HTMLButtonElement','HTMLAnchorElement','SVGElement','Element','Node','Event','MouseEvent','KeyboardEvent','localStorage','getComputedStyle'])Object.defineProperty(globalThis,key,{value:(dom.window as any)[key],configurable:true});
Object.defineProperty(globalThis,'navigator',{value:dom.window.navigator,configurable:true});
Object.assign(globalThis,{IS_REACT_ACT_ENVIRONMENT:true,requestAnimationFrame:(cb:FrameRequestCallback)=>setTimeout(()=>cb(performance.now()),16),cancelAnimationFrame:clearTimeout});
dom.window.scrollTo=()=>{};
dom.window.matchMedia=()=>({matches:true,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){},dispatchEvent(){return false;},media:'',onchange:null});
localStorage.setItem('dead-even-settings',JSON.stringify({quick:true,muted:true}));
const {createRoot}=await import('react-dom/client');
const {App}=await import('./App');
const {week}=await import('./data');
function buttons(){return [...document.querySelectorAll<HTMLButtonElement>('button')];}
async function click(button:HTMLButtonElement|undefined){assert.ok(button,'Control must exist');await act(async()=>button!.dispatchEvent(new dom.window.MouseEvent('click',{bubbles:true})));}
test('Only released challenges can be played; seven daily runs unlock on seven successive dates',async(t)=>{
 t.mock.timers.enable({apis:['Date'],now:new Date('2026-10-18T22:00:00Z')});
 let root=createRoot(document.getElementById('test-root')!);
 t.after(async()=>{await act(async()=>root.unmount());});
 await act(async()=>root.render(<App/>));
 assert.equal(document.querySelectorAll('.day-ticket:disabled').length,6,'Six future dates are locked');
 await click(buttons().find(x=>x.textContent==='Daily archive'));
 let rows=[...document.querySelectorAll('.week-row')];
 assert.equal(rows[0].querySelectorAll('button').length,1,'Today has no practice before its first daily');
 for(let i=1;i<7;i++)assert.equal(rows[i].querySelectorAll('button').length,0,'Future dates have no play or practice button');
 await click(document.querySelector<HTMLButtonElement>('.close-modal')!);
 for(let d=0;d<7;d++){
  if(d>0){await act(async()=>root.unmount());t.mock.timers.setTime(Date.parse(`2026-10-${18+d}T22:00:00Z`));root=createRoot(document.getElementById('test-root')!);await act(async()=>root.render(<App/>));}
  assert.equal(document.querySelectorAll('.day-ticket:disabled').length,6-d);
  await click(buttons().find(x=>x.classList.contains('play-button')));
  assert.ok(document.querySelector('.run-badge')?.textContent?.includes('DAILY'));
  for(let round=0;round<5;round++){
   const cards=[...document.querySelectorAll<HTMLButtonElement>('.item-card')];assert.equal(cards.length,8);
   assert.equal(document.querySelector<HTMLButtonElement>('.lock-button')!.disabled,true);
   await click(cards[0]);await click(cards[1]);await click(cards[2]);await click(cards[3]);
   assert.equal(document.querySelectorAll('.item-card[aria-pressed="true"]').length,3);
   assert.equal(cards[2].getAttribute('aria-pressed'),'false');assert.equal(document.querySelector('.final-combinations'),null);
   await click(document.querySelector<HTMLButtonElement>('.lock-button')!);
   assert.equal(document.querySelectorAll('.item-card').length,0);
   assert.ok(document.querySelector('.result-banner'));assert.equal(document.querySelector('.best-combo'),null);assert.equal(document.querySelector('.combo-ranking'),null,'Rankings stay hidden until the final report');assert.equal(document.querySelectorAll('.source-row').length,4,'Only target and chosen item measurements are exposed during the run');
   const key=`2026-10-${18+d}`;
   assert.equal(JSON.parse(localStorage.getItem('dead-even-workshop-v1')!).daily[key].answers.length,round+1);
   if(d===0&&round===1){await act(async()=>root.unmount());root=createRoot(document.getElementById('test-root')!);await act(async()=>root.render(<App/>));await click(buttons().find(x=>x.classList.contains('play-button')));assert.ok(document.querySelector('.result-banner'),'Reload restores the locked reveal');}
   await click(document.querySelector<HTMLButtonElement>('.next-button')!);
  }
  assert.ok(document.querySelector('.results'));assert.equal(document.querySelectorAll('.combo-ranking').length,5);for(const ranking of document.querySelectorAll('.combo-ranking')){assert.ok(ranking.querySelectorAll('.combination-row').length>=5);assert.ok(ranking.querySelectorAll('.combination-row').length<=6);assert.ok(ranking.querySelector('.your-combination'));}assert.equal(document.querySelectorAll('.result-breakdown button').length,5);
  await click(buttons().find(x=>x.textContent?.includes('COPY MY RESULTS')));
  assert.ok(document.querySelector<HTMLTextAreaElement>('.copy-fallback')!.value.endsWith('https://dead-even.test/'));
 }
 const saved=JSON.parse(localStorage.getItem('dead-even-workshop-v1')!);
 assert.equal(Object.keys(saved.daily).length,7);assert.equal(Object.keys(saved.practice).length,0);
 for(let d=0;d<7;d++)assert.equal(saved.daily[`2026-10-${18+d}`].complete,true);
 await click(buttons().find(x=>x.textContent?.includes('Replay in practice')));
 for(const key of ['1','2','3'])await act(async()=>document.body.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key,bubbles:true})));
 await act(async()=>document.body.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'Enter',bubbles:true})));
 assert.ok(document.querySelector('.result-banner'),'Completed daily can be replayed with keyboard controls');
 const after=JSON.parse(localStorage.getItem('dead-even-workshop-v1')!);
 assert.equal(after.practice[6].answers.length,1);assert.deepEqual(after.daily,saved.daily,'Replay never changes daily scores');
});
