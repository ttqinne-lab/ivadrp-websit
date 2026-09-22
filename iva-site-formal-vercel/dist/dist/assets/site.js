(function(){
 'use strict';
 if(typeof document==='undefined')return;
 window.ivaSiteCleanup?.();
 const controller=new AbortController(),options={signal:controller.signal};
 const observers=[];window.ivaSiteCleanup=()=>{controller.abort();observers.forEach(o=>o.disconnect());};
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const toggle=document.getElementById('original-menu-toggle'),menu=document.getElementById('original-mobile-menu');
 function closeMenu(){if(menu)menu.hidden=true;if(toggle)toggle.setAttribute('aria-expanded','false');}
 if(toggle&&menu){toggle.addEventListener('click',()=>{menu.hidden=!menu.hidden;toggle.setAttribute('aria-expanded',String(!menu.hidden));},options);menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu,options));}
 document.querySelectorAll('.original-menu').forEach(item=>item.addEventListener('toggle',()=>{if(item.open)document.querySelectorAll('.original-menu').forEach(other=>{if(other!==item)other.open=false;});},options));
 document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeMenu();document.querySelectorAll('.original-menu[open]').forEach(n=>n.open=false);}},options);
 const header=document.querySelector('header');let progress=document.querySelector('.scroll-progress');
 if(header&&!progress){progress=document.createElement('div');progress.className='scroll-progress';progress.setAttribute('aria-hidden','true');header.append(progress);}
 let topButton=document.querySelector('.to-top');if(!topButton){topButton=document.createElement('button');topButton.className='to-top';topButton.type='button';topButton.setAttribute('aria-label','返回頁首');topButton.textContent='↑';topButton.hidden=true;document.body.append(topButton);}
 topButton.addEventListener('click',()=>window.scrollTo({top:0,behavior:reduced.matches?'instant':'smooth'}),options);
 let scheduled=false;function scrollState(){scheduled=false;const length=document.documentElement.scrollHeight-window.innerHeight;const ratio=length>0?Math.max(0,Math.min(1,window.scrollY/length)):0;if(progress)progress.style.transform='scaleX('+ratio+')';topButton.hidden=window.scrollY<600;}
 window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(scrollState);}}, {passive:true,signal:controller.signal});scrollState();
 if('IntersectionObserver'in window){
  const reveal=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;reveal.unobserve(entry.target);if(!reduced.matches&&entry.target.animate)entry.target.animate([{opacity:.3,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:480,easing:'cubic-bezier(.2,.7,.2,1)'});}),{threshold:.1});
  document.querySelectorAll('.feature-card,.case-card,.contact-card,.industry-grid').forEach(n=>reveal.observe(n));observers.push(reveal);
  const links=[...document.querySelectorAll('.page-contents a')];
  if(links.length){const active=new IntersectionObserver(entries=>{const visible=entries.filter(x=>x.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top)[0];if(!visible)return;links.forEach(link=>{const id=link.getAttribute('href').split('#').pop();if(id===visible.target.id)link.setAttribute('aria-current','true');else link.removeAttribute('aria-current');});},{rootMargin:'-160px 0px -55% 0px',threshold:0});links.forEach(link=>{const node=document.getElementById(link.getAttribute('href').split('#').pop());if(node)active.observe(node);});observers.push(active);}
 }
 document.querySelectorAll('.faq-card').forEach(detail=>detail.addEventListener('toggle',()=>{if(detail.open&&!reduced.matches){const answer=detail.querySelector('p');answer?.animate?.([{opacity:.2,transform:'translateY(-4px)'},{opacity:1,transform:'translateY(0)'}],{duration:220,easing:'ease-out'});}},options));
 const filterButtons=[...document.querySelectorAll('[data-case-filter]')],caseCards=[...document.querySelectorAll('[data-case-plan]')],status=document.getElementById('case-filter-status');
 filterButtons.forEach(button=>button.addEventListener('click',()=>{const selected=button.dataset.caseFilter;filterButtons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));let count=0;caseCards.forEach(card=>{card.hidden=selected!=='all'&&card.dataset.casePlan!==selected;if(!card.hidden)count++;});if(status)status.textContent='顯示 '+count+' 宗'+(selected==='all'?'':(' '+selected))+'個案';},options));
 const copy=document.querySelector('[data-copy-address]');
 if(copy)copy.addEventListener('click',async()=>{const text=document.getElementById('office-address')?.textContent||'';const feedback=document.querySelector('.copy-feedback');try{if(!navigator.clipboard?.writeText)throw new Error('unavailable');await navigator.clipboard.writeText(text);if(feedback)feedback.textContent='地址已複製';}catch{if(feedback)feedback.textContent='請選取上方地址複製';}},options);
 function mountYouTubeVideos(){
  if(!document.createElement)return;
  const ids={index:'BTBl0DaoxkE',iva:'ZNqUn9Han0Q',suitability:'j4_BAEc4fBg',drp:'suc43VsmbVU',bankruptcy:'rkDCMvHoK0s'};
  const titles={index:'IVA／DRP 初步介紹影片',iva:'IVA 介紹影片',suitability:'IVA 適用情況影片',drp:'DRP 介紹影片',bankruptcy:'破產程序資訊影片'};
  const makeFrame=(id,title,loading='lazy')=>{
   const frame=document.createElement('iframe');
   frame.className='youtube-embed';
   frame.src='https://www.youtube.com/embed/'+id;
   frame.title=title;
   frame.loading=loading;
   frame.setAttribute('frameborder','0');
   frame.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
   frame.setAttribute('allowfullscreen','');
   frame.referrerPolicy='strict-origin-when-cross-origin';
   return frame;
  };
  const replaceContents=(host,node)=>{
   if(!host)return false;
   const existing=host.querySelector('iframe.youtube-embed');
   if(existing){
    host.dataset.youtubeMounted='true';
    return false;
   }
   if(host.dataset.youtubeMounted)return false;
   host.dataset.youtubeMounted='true';
   while(host.firstChild)host.removeChild(host.firstChild);
   host.append(node);
   return true;
  };
  const hero=document.querySelector('.review-video.page-video');
  if(hero)replaceContents(hero,makeFrame(ids.index,titles.index,'eager'));
  document.querySelectorAll('main > section').forEach(section=>{
   if(section.classList.contains('md:hidden')&&section.querySelector('.review-video'))section.remove();
  });
  const services=document.getElementById('services');
  if(services){
   const serviceVideos=[['ZNqUn9Han0Q','IVA 介紹影片'],['suc43VsmbVU','DRP 介紹影片']];
   [...services.querySelectorAll('.bg-white.rounded-card')].slice(0,2).forEach((card,index)=>{
    const media=card.querySelector('div.h-48');
    if(!media)return;
    media.classList.remove('h-48');media.classList.add('service-video');
    const videoId=media.dataset.youtubeVideo||serviceVideos[index][0];
    replaceContents(media,makeFrame(videoId,serviceVideos[index][1]));
   });
  }
  const pageVideo=document.querySelector('.inner-hero-media.page-video');
  if(pageVideo){
   const page=pageVideo.dataset.videoPage;
   if(ids[page]){pageVideo.classList.add('youtube-frame');replaceContents(pageVideo,makeFrame(ids[page],titles[page],'eager'));}
  }
  const suitability=document.getElementById('iva-suitability');
   if(suitability&&!suitability.dataset.youtubeMounted){
   if(suitability.querySelector('iframe.youtube-embed')){
    suitability.dataset.youtubeMounted='true';
   } else {
   const cards=suitability.querySelector('.feature-grid.cols-2');
   const content=[...suitability.children].find(node=>node.classList?.contains('max-w-page'));
   if(cards&&content){
    const note=content.querySelector('.section-note');
    content.querySelector('a.text-link[href*="youtube.com"]')?.remove();
    const layout=document.createElement('div');layout.className='suitability-layout';content.insertBefore(layout,cards);
    const left=document.createElement('div');left.className='suitability-cards';left.append(cards);if(note)left.append(note);
    const right=document.createElement('div');right.className='suitability-video';right.append(makeFrame(ids.suitability,titles.suitability));
    layout.append(left,right);suitability.dataset.youtubeMounted='true';
   }
   }
  }
 }
 mountYouTubeVideos();
})();
