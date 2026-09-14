function openPremiumDashboard(){
  const admin=document.querySelector('.x-admin');
  if(!admin)return false;
  if(admin.querySelector('.admin-page'))return true;
  const dashboard=admin.querySelector<HTMLButtonElement>('aside > button');
  if(!dashboard)return false;
  dashboard.click();
  return true;
}

document.addEventListener('submit',e=>{
  const form=e.target as HTMLFormElement|null;
  if(!form?.closest('.x-login'))return;
  let tries=0;
  const timer=window.setInterval(()=>{
    tries++;
    if(openPremiumDashboard()||tries>20)window.clearInterval(timer);
  },50);
},true);

window.addEventListener('load',()=>{
  window.setTimeout(openPremiumDashboard,120);
});

export {};
