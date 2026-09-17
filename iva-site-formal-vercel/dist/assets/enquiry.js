(function(){
 'use strict';
 const fields=[
  ['debt_range','欠款總額範圍'],
  ['payment_range','現時每月供款範圍'],
  ['stable_income','目前是否有穩定收入'],
  ['account_type','主要欠款類型'],
  ['phone','聯絡電話']
 ];
 const phoneError='請輸入有效的香港 8 位電話號碼（例如 31198466）。';
 function normalizeHKPhone(value){
  return String(value??'').trim().replace(/[()\s-]/g,'');
 }
 function isValidHKPhone(value){
  return /^[2-9]\d{7}$/.test(normalizeHKPhone(value));
 }
 function buildWhatsAppURL(values){
  const clean=v=>String(v??'').replace(/[\r\n\t]+/g,' ').trim().slice(0,100);
  const normalized={...values,phone:normalizeHKPhone(values.phone)};
  const lines=['你好，我想預約初步諮詢。','',...fields.map(([key,label])=>label+'：'+(clean(normalized[key])||'未填寫')),'','本人已閱讀個人資料收集聲明及私隱政策，同意就本次查詢聯絡本人。'];
  return 'https://wa.me/85255455105?text='+encodeURIComponent(lines.join('\n'));
 }
 if(typeof module!=='undefined'&&module.exports)module.exports={buildWhatsAppURL,normalizeHKPhone,isValidHKPhone};
 if(typeof document==='undefined')return;
 const dialog=document.getElementById('initial-enquiry');
 const form=document.getElementById('hp-enquiry');
 if(!dialog||!form||form.dataset.bound)return;
 form.dataset.bound='true';let opener=null,oldOverflow='';
 const phoneInput=form.elements.phone;
 function validatePhone(){
  if(!phoneInput)return true;
  const valid=isValidHKPhone(phoneInput.value);
  if(typeof phoneInput.setCustomValidity==='function')phoneInput.setCustomValidity(valid?'':phoneError);
  return valid;
 }
 if(phoneInput?.addEventListener){
  phoneInput.addEventListener('input',validatePhone);
  phoneInput.addEventListener('blur',validatePhone);
 }
 function open(trigger){
  if(dialog.open)return;
  const menu=document.getElementById('original-mobile-menu'),toggle=document.getElementById('original-menu-toggle');if(menu)menu.hidden=true;if(toggle)toggle.setAttribute('aria-expanded','false');
  opener=trigger||document.activeElement;oldOverflow=document.body.style.overflow;
  dialog.showModal();document.body.style.overflow='hidden';
  dialog.querySelector('select').focus();
 }
 document.querySelectorAll('[data-open-enquiry]').forEach(button=>button.addEventListener('click',e=>{e.preventDefault();open(button);}));
 dialog.addEventListener('open-enquiry',()=>open());
 dialog.querySelector('.enquiry-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 dialog.addEventListener('close',()=>{document.body.style.overflow=oldOverflow;if(opener?.isConnected)opener.focus();});
 form.addEventListener('submit',e=>{
  e.preventDefault();const feedback=document.getElementById('enquiry-feedback');
  const phoneValid=validatePhone();
  if(!phoneValid||!form.checkValidity()){feedback.textContent=phoneValid?'請完成必填項目並確認同意聲明。':phoneError;form.reportValidity();return;}
  if(form.elements.website?.value)return;
  const values={};fields.forEach(([key])=>values[key]=form.elements[key].value);
  feedback.textContent='正在開啟 WhatsApp，請確認訊息內容後傳送。';
  const targetURL=buildWhatsAppURL(values);
  window.location.assign(targetURL);
 });
 if(location.hash==='#initial-enquiry')open();
})();
