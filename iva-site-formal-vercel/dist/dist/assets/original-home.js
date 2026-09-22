(function(){
 'use strict';
 function estimate(total,payment,plan){
  total=Number(total);payment=Number(payment);
  if(!Number.isFinite(total)||!Number.isFinite(payment)||total<=0||payment<=0)return null;
  const drp=plan==='drp';
  const monthly=Math.round(payment*(drp?.62:.52));
  const interest=Math.round(total*(drp?.135:.195));
  const rawYears=Math.floor(total/payment/12)+(drp?1:0);
  const years=Math.max(2,Math.min(drp?5:4,rawYears));
  return {total,payment,monthly,interest,years,drp};
 }
 if(typeof module!=='undefined'&&module.exports)module.exports={estimate};
 if(typeof document==='undefined')return;
 const get=id=>document.getElementById(id);
 const total=get('original-debt'),payment=get('original-payment');
 if(!total||!payment||total.dataset.bound)return;
 total.dataset.bound='true';
 const money=n=>'HK$ '+Number(n).toLocaleString('en-HK',{maximumFractionDigits:0});
 let plan='iva';
 function update(){
  const result=estimate(total.value,payment.value,plan);if(!result)return;
  get('original-debt-amount')?.replaceChildren(document.createTextNode(money(result.total)));
  get('original-payment-amount')?.replaceChildren(document.createTextNode(money(result.payment)));
  get('original-payment-result')?.replaceChildren(document.createTextNode(money(result.monthly)));
  get('original-interest-result')?.replaceChildren(document.createTextNode(money(result.interest)));
  get('original-term-result')?.replaceChildren(document.createTextNode(result.years+' 年'));
  get('original-status-result')?.replaceChildren(document.createTextNode('視程序階段及個案'));
  get('original-ratio-result')?.replaceChildren(document.createTextNode((result.payment/result.total*100).toLocaleString('en-HK',{minimumFractionDigits:2,maximumFractionDigits:2})+'%'));
  total.setAttribute('aria-valuetext',money(result.total));payment.setAttribute('aria-valuetext',money(result.payment));
 }
 total.addEventListener('input',update);payment.addEventListener('input',update);update();
 const tabs=[get('original-tab-0'),get('original-tab-1')];
 function select(index){
  plan=index===0?'iva':'drp';
  tabs.forEach((tab,i)=>{if(!tab)return;tab.setAttribute('aria-selected',String(i===index));tab.setAttribute('tabindex',i===index?'0':'-1');});
  const panel=get('original-plan-panel');if(panel&&tabs[index])panel.setAttribute('aria-labelledby',tabs[index].id);
  const note=get('original-plan-note');if(note)note.textContent=index===0?'目前查看 IVA 固定換算參考。實際供款、利息安排、年期及法律效果均須按完整資料確認。':'目前查看 DRP 固定換算參考。實際供款、利息安排、年期及條件須視乎個案及相關機構回覆。';
  update();
 }
 tabs.forEach((tab,i)=>{if(!tab)return;tab.addEventListener('click',()=>select(i));tab.addEventListener('keydown',event=>{let target=null;if(event.key==='ArrowRight'||event.key==='ArrowLeft')target=1-i;if(event.key==='Home')target=0;if(event.key==='End')target=1;if(target!==null){event.preventDefault();select(target);tabs[target]?.focus();}});});
})();
