(function(){
 'use strict';
 function estimate(debt,payment,plan){
  debt=Number(debt);payment=Number(payment);
  if(!Number.isFinite(debt)||!Number.isFinite(payment)||debt<=0||payment<=0)return null;
  const isDrp=plan==='drp';
  const monthly=Math.round(payment*(isDrp?.62:.52));
  const interest=Math.round(debt*(isDrp?.135:.195));
  const rawYears=Math.floor(debt/payment/12)+(isDrp?1:0);
  const years=Math.max(2,Math.min(isDrp?5:4,rawYears));
  return {debt,payment,monthly,interest,years,plan:isDrp?'drp':'iva'};
 }
 if(typeof module!=='undefined'&&module.exports)module.exports={estimate};
 if(typeof document==='undefined')return;
 const get=id=>document.getElementById(id);
 const debt=get('original-debt'),payment=get('original-payment');
 if(!debt||debt.dataset.bound)return;debt.dataset.bound='true';
 let plan='iva';
 const money=n=>'HK$ '+n.toLocaleString('en-HK',{maximumFractionDigits:2});
 function update(){
  const r=estimate(debt.value,payment.value,plan);if(!r)return;
  get('original-debt-amount').textContent=money(r.debt);
  get('original-payment-amount').textContent=money(r.payment);
  get('original-payment-result').textContent=money(r.monthly);
  get('original-interest-result').textContent=money(r.interest);
  get('original-term-result').textContent=r.years+' 年';
  get('original-status-result').textContent='視程序階段及個案';
  get('original-ratio-result').textContent=(r.payment/r.debt*100).toLocaleString('en-HK',{minimumFractionDigits:2,maximumFractionDigits:2})+'%';
  debt.setAttribute('aria-valuetext',money(r.debt));payment.setAttribute('aria-valuetext',money(r.payment));
 }
 debt.addEventListener('input',update);payment.addEventListener('input',update);update();
 const tabs=[get('original-tab-0'),get('original-tab-1')];
 function select(index){
  plan=index===0?'iva':'drp';
  tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.setAttribute('tabindex',i===index?'0':'-1');});
  get('original-plan-panel').setAttribute('aria-labelledby',tabs[index].id);
  get('original-plan-note').textContent=index===0?'目前查看 IVA 固定換算參考。IVA 涉及法定程序及債權人對建議的考慮；顯示結果不代表建議採用或必然獲接納。':'目前查看 DRP 固定換算參考。DRP 涉及與債權人協商供款安排；是否接納及實際條件須視乎個案。';
  update();
 }
 tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>select(i));tab.addEventListener('keydown',e=>{let target=null;if(e.key==='ArrowRight'||e.key==='ArrowLeft')target=1-i;if(e.key==='Home')target=0;if(e.key==='End')target=1;if(target!==null){e.preventDefault();select(target);tabs[target].focus();}});});
 // Calculator input stays on this page; enquiry handoff is handled separately.
})();
