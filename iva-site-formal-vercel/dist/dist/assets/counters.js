(function(){
 'use strict';
 function counterValue(target,progress){return Math.round(target*(1-Math.pow(1-Math.min(1,Math.max(0,progress)),3)));}
 if(typeof module!=='undefined'&&module.exports)module.exports={counterValue};
 if(typeof document==='undefined')return;
 const section=document.getElementById('company-stats');if(!section||section.dataset.counterBound)return;
 section.dataset.counterBound='true';
 const counters=[...section.querySelectorAll('[data-count]')];
 const end=()=>counters.forEach(n=>n.textContent=Number(n.dataset.count).toLocaleString('en-HK'));
 const media=window.matchMedia('(prefers-reduced-motion: reduce)');
 if(media.matches||!('IntersectionObserver' in window)){end();return;}
 let started=false,frameId=null;
 counters.forEach(n=>n.textContent='0');
 const observer=new IntersectionObserver(entries=>{
  if(started||!entries.some(e=>e.isIntersecting))return;
  started=true;observer.disconnect();let begin=null;
  function frame(t){
   if(media.matches){end();return;}
   if(begin===null)begin=t;const progress=Math.min(1,(t-begin)/1500);
   counters.forEach(n=>n.textContent=counterValue(Number(n.dataset.count),progress).toLocaleString('en-HK'));
   if(progress<1)frameId=requestAnimationFrame(frame);else end();
  }
  frameId=requestAnimationFrame(frame);
 },{threshold:.2});observer.observe(section);
 // Respect preference changes; preserve the final accessible values.
 media.addEventListener?.('change',e=>{if(e.matches){observer.disconnect();if(frameId!==null)cancelAnimationFrame(frameId);end();}});
})();
