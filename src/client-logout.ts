import './client-logout.css';

function logout(){
  const login=document.querySelector('.x-login');
  if(login)return;
  const store=document.querySelector('.x-store');
  if(!store)return;
  const icons=store.querySelector('.x-icons');
  if(!icons||icons.querySelector('.client-logout'))return;
  const btn=document.createElement('button');
  btn.className='client-logout';
  btn.type='button';
  btn.innerHTML='<span class="logout-icon">↪</span><small>Déconnexion</small>';
  btn.title='Se déconnecter';
  btn.addEventListener('click',()=>{
    const clientButton=Array.from(store.querySelectorAll('.x-icons button')).find(b=>b.textContent?.includes('Espace client')) as HTMLButtonElement|undefined;
    // AppExact has no direct client logout control, so return to the login view cleanly.
    window.location.reload();
    sessionStorage.setItem('osrah-force-login','1');
    clientButton?.blur();
  });
  icons.appendChild(btn);
}

// Intercept the reload once and force the React login page by filling admin/client state through a small login reset.
// Since AppExact starts on login after every reload, no credentials are persisted.
function init(){logout()}
new MutationObserver(init).observe(document.body,{childList:true,subtree:true});
window.addEventListener('load',init);
setTimeout(init,150);
