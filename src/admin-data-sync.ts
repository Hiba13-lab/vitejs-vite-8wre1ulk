type AdminProduct={id:number;name:string;description?:string;price:number;stock:number;category:string;image_url?:string;source?:'client'|'api'};
type Order={id:number;reference:string;customer:any;items:any[];payment_method:string;subtotal:number;shipping:number;total:number;status:string;created_at:string};
const PRODUCT_API='http://localhost:5000/api/products';
const ORDER_API='http://localhost:5000/api/orders';
const IMG={
 brume:'https://osrahcosmetics.ma/cdn/shop/files/1-20_e3d23aa1-331c-4276-953b-556d8f34d7a7.webp?v=1769432013&width=1946',
 gel:'https://osrahcosmetics.ma/cdn/shop/files/GelDoucheFleurd_Oranger1000ml.webp?v=1769518316&width=1946',
 gommage:'https://osrahcosmetics.ma/cdn/shop/files/1-05_f8e2a2a7-eb34-4404-b101-8d659973e4b0.webp?v=1769440772&width=1946',
 savon:'https://osrahcosmetics.ma/cdn/shop/files/1-20_03d27d7c-53c6-4fe8-8a4e-ef19a78db909.webp?v=1769275507&width=1946',
 bronze:'https://osrahcosmetics.ma/cdn/shop/files/huile-bronzage-pailletee-osrah.png?v=1780759691&width=1946',
 hair:'https://osrahcosmetics.ma/cdn/shop/files/1-10_d0a1dd97-a339-415a-bf3f-1a555c52d7c1.webp?v=1769279715&width=1946',
 blondMask:'https://osrahcosmetics.ma/cdn/shop/files/1-18.webp?v=1769267021&width=1946',
 blondShampoo:'https://osrahcosmetics.ma/cdn/shop/files/1-15_b30a107d-5f7f-4d16-b4a9-9bffcaad8fdf.webp?v=1769269984&width=1946',
 color:'https://osrahcosmetics.ma/cdn/shop/files/1-18_b1b925f0-f60a-4d03-937b-2109607292e7.webp?v=1769269889&width=1946',
 clean:'https://osrahcosmetics.ma/cdn/shop/files/1-09_220c1547-762f-4587-807d-27152c74edba.webp?v=1769454500&width=1946',
 hero:'https://osrahcosmetics.ma/cdn/shop/files/69ff4d88-a340-4379-b528-b7f3d5e398fe.png?v=1780763528&width=1254',
 spf:'/spf50.svg'
};
const clientProducts:AdminProduct[]=[
{id:101,name:'Brume parfumée',description:'Brume parfumée OSRAH',price:55,stock:20,category:'Parfums',image_url:IMG.brume,source:'client'},
{id:102,name:"Gel douche Fleur d'Oranger",description:'Gel douche parfumé',price:44,stock:25,category:'Corps',image_url:IMG.gel,source:'client'},
{id:103,name:'Lait corporel',description:'Lait corps hydratant',price:57,stock:20,category:'Corps',image_url:IMG.hero,source:'client'},
{id:104,name:'Gommage corps sucre rose',description:'Gommage au sucre rose',price:39,stock:18,category:'Corps',image_url:IMG.gommage,source:'client'},
{id:105,name:'Savon noir Eucalyptus',description:'Savon noir traditionnel',price:31,stock:18,category:'Corps',image_url:IMG.savon,source:'client'},
{id:106,name:'Huile de bronzage',description:'Huile de bronzage pailletée',price:63,stock:15,category:'Solaire',image_url:IMG.bronze,source:'client'},
{id:107,name:'Lait solaire SPF 30',description:'Protection UVA/UVB',price:79,stock:16,category:'Solaire',image_url:IMG.hero,source:'client'},
{id:108,name:'Écran solaire SPF 50+',description:'Haute protection solaire',price:99,stock:12,category:'Solaire',image_url:IMG.spf,source:'client'},
{id:109,name:'Huile végétale Amande douce',description:'Huile nourrissante',price:29,stock:20,category:'Corps',image_url:IMG.hero,source:'client'},
{id:110,name:"Masques Terre d'Arômes",description:'Sélection de masques',price:47,stock:14,category:'Visage',image_url:IMG.gommage,source:'client'},
{id:111,name:'Masque Blond Lumière',description:'Masque H-Therapy',price:128,stock:12,category:'Cheveux',image_url:IMG.blondMask,source:'client'},
{id:112,name:'Shampooing Blond Lumière',description:'Shampooing H-Therapy',price:140,stock:15,category:'Cheveux',image_url:IMG.blondShampoo,source:'client'},
{id:113,name:'Shampooing Couleur Magnétique',description:'Fixateur de couleur',price:112,stock:15,category:'Cheveux',image_url:IMG.color,source:'client'},
{id:114,name:'Gel nettoyant visage',description:'Nettoyant doux visage',price:79,stock:18,category:'Visage',image_url:IMG.clean,source:'client'},
{id:115,name:'Savon aux extraits AHA & Tea Tree',description:'Savon visage',price:39,stock:22,category:'Visage',image_url:IMG.savon,source:'client'},
{id:116,name:'Lotion micellaire',description:'Lotion micellaire Subliderm',price:58,stock:18,category:'Visage',image_url:IMG.hero,source:'client'}
];
const esc=(s:any)=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]||m));
const money=(n:number)=>`${Number(n||0).toFixed(0)} DH`;
let signature='';

async function getData(){
 const [pr,or]=await Promise.allSettled([fetch(PRODUCT_API).then(r=>r.ok?r.json():[]),fetch(ORDER_API).then(r=>r.ok?r.json():[])]);
 const apiProducts:AdminProduct[]=pr.status==='fulfilled'?pr.value:[];
 const orders:Order[]=or.status==='fulfilled'?or.value:[];
 const merged=[...clientProducts,...apiProducts.filter(p=>!clientProducts.some(c=>c.name.toLowerCase()===String(p.name).toLowerCase())).map(p=>({...p,source:'api' as const}))];
 return {products:merged,orders};
}
function productRows(products:AdminProduct[]){return products.map(p=>`<tr><td><div class="admin-prod"><img src="${esc(p.image_url||'')}" onerror="this.style.display='none'"><div><b>${esc(p.name)}</b><small>${esc((p.description||'').slice(0,58))}</small></div></div></td><td>${esc(p.category)}</td><td>${money(p.price)}</td><td><span class="admin-stock ${p.stock<=5?'admin-low':''}">${p.stock}</span></td><td>${p.source==='api'?`<button class="admin-edit" data-admin-edit="${p.id}">Modifier</button><button class="admin-delete" data-admin-delete="${p.id}">Supprimer</button>`:'<span class="admin-badge">Catalogue client</span>'}</td></tr>`).join('')}
function orderRows(orders:Order[]){
 if(!orders.length)return '<div class="admin-empty">Aucune commande client pour le moment.</div>';
 return `<div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Commande</th><th>Client</th><th>Produits</th><th>Total</th><th>Paiement</th><th>Statut</th></tr></thead><tbody>${orders.map(o=>`<tr><td><b>#${esc(o.reference||`OSR-${o.id}`)}</b><small>${new Date(o.created_at).toLocaleString('fr-FR')}</small></td><td><b>${esc(o.customer?.name||'Client OSRAH')}</b><small>${esc(o.customer?.city||'')} · ${esc(o.customer?.phone||'')}</small></td><td>${o.items.map(i=>`<small>${Number(i.qty||1)}× ${esc(i.name)}</small>`).join('')}</td><td><b>${money(o.total)}</b></td><td>${esc(o.payment_method||'')}</td><td><select class="admin-order-status" data-order-status="${o.id}">${['Nouvelle','En préparation','Expédiée','Livrée','Annulée'].map(s=>`<option ${o.status===s?'selected':''}>${s}</option>`).join('')}</select></td></tr>`).join('')}</tbody></table></div>`;
}
async function sync(){
 const admin=document.querySelector('.x-admin'); if(!admin)return;
 const {products,orders}=await getData();
 const sig=JSON.stringify([products.map(p=>[p.id,p.name,p.price,p.stock]),orders.map(o=>[o.id,o.status,o.total])]);
 if(sig===signature)return; signature=sig;
 const tbody=document.querySelector('[data-admin-section="products"] .admin-table tbody'); if(tbody)tbody.innerHTML=productRows(products);
 const orderCard=document.querySelector('[data-admin-section="orders"] .admin-card'); if(orderCard)orderCard.innerHTML=orderRows(orders);
 const kpis=document.querySelectorAll('[data-admin-section="dashboard"] .admin-kpi b');
 if(kpis[0])kpis[0].textContent=String(products.length);
 if(kpis[1])kpis[1].textContent=String(orders.length);
 if(kpis[2])kpis[2].textContent=money(orders.reduce((s,o)=>s+Number(o.total||0),0));
 document.querySelectorAll<HTMLSelectElement>('[data-order-status]').forEach(sel=>sel.onchange=async()=>{await fetch(`${ORDER_API}/${sel.dataset.orderStatus}/status`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({status:sel.value})});signature='';sync()});
}
setInterval(sync,1800);window.addEventListener('load',sync);setTimeout(sync,500);
