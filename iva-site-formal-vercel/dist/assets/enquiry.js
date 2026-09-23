(function(){
 'use strict';
 const messageFields=[
  ['account_total_range','債務總額'],
  ['payment_range','每月還款'],
  ['stable_income','收入情況'],
  ['account_type','主要債務類型'],
  ['interest','希望了解的事項'],
  ['phone','聯絡電話']
 ];
 const formFields=['interest','account_total_range','payment_range','stable_income','account_type','phone'];
 const phoneError='請輸入有效的香港 8 位電話號碼（例如 31198466）。';
 function normalizeHKPhone(value){return String(value??'').trim().replace(/[()\s-]/g,'');}
 function isValidHKPhone(value){return /^[2-9]\d{7}$/.test(normalizeHKPhone(value));}
 function cleanValue(value){return String(value??'').replace(/[\r\n\t]+/g,' ').trim().slice(0,240);}
 function buildWhatsAppMessage(values){
  const normalized={...values,phone:normalizeHKPhone(values.phone)};
  const details=messageFields.flatMap(([key,label])=>{
   const value=cleanValue(normalized[key]);
   return value?[label+'：'+value]:[];
  });
  return ['你好，我剛剛在網站完成初步資料整理。','','基本情況如下：',...details,'','希望預約初步查詢，謝謝。'].join('\n');
 }
 function buildWhatsAppURL(values){return 'https://wa.me/85255455105?text='+encodeURIComponent(buildWhatsAppMessage(values));}
 if(typeof module!=='undefined'&&module.exports)module.exports={buildWhatsAppURL,buildWhatsAppMessage,normalizeHKPhone,isValidHKPhone};
 if(typeof document==='undefined')return;
 const dialog=document.getElementById('initial-enquiry'),form=document.getElementById('hp-enquiry');
 if(!dialog||!form||form.dataset.bound)return;
 form.dataset.bound='true';
 let opener=null,oldOverflow='';
 const phoneInput=form.elements.phone;
 const feedback=document.getElementById('enquiry-feedback');
 function validatePhone(){if(!phoneInput)return true;const valid=isValidHKPhone(phoneInput.value);if(typeof phoneInput.setCustomValidity==='function')phoneInput.setCustomValidity(valid?'':phoneError);return valid;}
 phoneInput?.addEventListener('input',validatePhone);
 phoneInput?.addEventListener('blur',validatePhone);
 function open(trigger){
  if(dialog.open)return;
  const menu=document.getElementById('original-mobile-menu'),toggle=document.getElementById('original-menu-toggle');
  if(menu)menu.hidden=true;
  if(toggle)toggle.setAttribute('aria-expanded','false');
  opener=trigger||document.activeElement;
  oldOverflow=document.body.style.overflow;
  dialog.showModal();
  window.ivaGa4?.event('form_open');
  document.body.style.overflow='hidden';
  dialog.querySelector('select')?.focus();
 }
 document.querySelectorAll('[data-open-enquiry]').forEach(button=>button.addEventListener('click',event=>{event.preventDefault();open(button);}));
 dialog.addEventListener('open-enquiry',()=>open());
 dialog.querySelector('.enquiry-close')?.addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
 dialog.addEventListener('close',()=>{document.body.style.overflow=oldOverflow;if(opener?.isConnected)opener.focus();});
 form.addEventListener('submit',event=>{
  event.preventDefault();
  const phoneValid=validatePhone();
  if(!phoneValid||!form.checkValidity()){
   if(feedback)feedback.textContent=phoneValid?'請完成必填項目並確認同意聲明。':phoneError;
   form.reportValidity();
   return;
  }
  if(form.elements.website?.value)return;
  const values={};
  formFields.forEach(key=>values[key]=form.elements[key]?.value||'');
  const targetURL=buildWhatsAppURL(values);
  dialog.close();
  const navigate=()=>window.location.assign(targetURL);
  if(window.ivaGa4?.eventBeforeNavigation)window.ivaGa4.eventBeforeNavigation('form_submit',navigate);
  else{
   if(typeof window.gtag==='function')window.gtag('event','form_submit',{transport_type:'beacon'});
   navigate();
  }
 });
 if(location.hash==='#initial-enquiry')open();
})();
