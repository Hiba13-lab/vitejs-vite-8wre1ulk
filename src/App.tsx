import React, { useEffect, useMemo, useState } from "react";
import "./final.css";

type Product = { id:number; name:string; description:string; price:number; stock:number; category:string; image:string };
type ApiProduct = { id:number; name:string; description:string; price:number; stock:number; category:string; image_url?:string };
type Role = "none" | "admin" | "client";
type Page = "login" | "dashboard" | "products" | "add-product" | "orders" | "clients" | "stats" | "shop" | "detail" | "payment" | "confirmation";

const fallbackProducts: Product[] = [
  {id:1,name:"H-Therapy Shampooing Hydratant",description:"Shampooing hydratant pour nettoyer les cheveux en douceur et aider à préserver leur souplesse.",price:69,stock:18,category:"Cheveux",image:"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80"},
  {id:2,name:"H-Therapy Masque Hydratant",description:"Masque capillaire riche pour nourrir les cheveux secs et améliorer leur douceur.",price:95,stock:15,category:"Cheveux",image:"https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80"},
  {id:3,name:"Crème Cheveux Bouclés Leave-in",description:"Crème sans rinçage pour définir les boucles et faciliter le coiffage au quotidien.",price:85,stock:20,category:"Cheveux",image:"https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80"},
  {id:4,name:"Shampooing Sans Sulfate",description:"Shampooing doux sans sulfate pour un nettoyage quotidien adapté aux cheveux délicats.",price:59,stock:22,category:"Cheveux",image:"https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=800&q=80"},
  {id:5,name:"Après-Shampooing Nourrissant",description:"Soin après-shampooing qui aide à démêler et adoucir les longueurs.",price:64,stock:17,category:"Cheveux",image:"https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=800&q=80"},
  {id:6,name:"Sérum Éclat Visage",description:"Sérum léger hydratant pour une peau plus lumineuse.",price:120,stock:12,category:"Soin visage",image:"https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80"},
  {id:7,name:"Crème Hydratante Visage",description:"Crème quotidienne pour hydrater et apporter du confort à la peau.",price:98,stock:14,category:"Soin visage",image:"https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=800&q=80"},
  {id:8,name:"Lait Corps Fraîcheur",description:"Lait corporel hydratant pour une peau douce et fraîche.",price:57,stock:20,category:"Corps et douche",image:"https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=800&q=80"},
  {id:9,name:"Gel Douche Douceur",description:"Gel douche parfumé pour nettoyer la peau sans la dessécher.",price:49,stock:25,category:"Corps et douche",image:"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80"},
  {id:10,name:"Parfum Fleur d'Osrah",description:"Une senteur féminine florale et douce pour le quotidien.",price:179,stock:10,category:"Parfum & senteurs",image:"https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80"},
  {id:11,name:"Coffret Beauté Signature",description:"Coffret cadeau réunissant plusieurs essentiels beauté Osrah.",price:249,stock:8,category:"Coffrets",image:"https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80"},
  {id:12,name:"Gel Nettoyant Homme",description:"Gel nettoyant visage et barbe pour la routine homme.",price:72,stock:16,category:"Homme",image:"https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=800&q=80"},
  {id:13,name:"Pack Solaire Osrah",description:"Pack solaire pour protéger et hydrater la peau pendant les journées ensoleillées.",price:199,stock:15,category:"Promotion",image:"https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=800&q=80"},
  {id:14,name:"Huile Capillaire Brillance",description:"Huile légère pour nourrir les pointes et apporter de la brillance.",price:89,stock:18,category:"Cheveux",image:"https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80"},
  {id:15,name:"Brume Parfumée Rose",description:"Brume légère et fraîche aux notes florales.",price:79,stock:21,category:"Parfum & senteurs",image:"https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80"},
  {id:16,name:"Coffret Routine Cheveux",description:"Routine complète shampooing, masque et soin sans rinçage.",price:279,stock:7,category:"Coffrets",image:"https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80"}
];

function App(){
  const [role,setRole]=useState<Role>("none");
  const [page,setPage]=useState<Page>("login");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [loginError,setLoginError]=useState("");
  const [products,setProducts]=useState<Product[]>(fallbackProducts);
  const [category,setCategory]=useState("Tous");
  const [search,setSearch]=useState("");
  const [sort,setSort]=useState("best");
  const [selected,setSelected]=useState<Product|null>(null);
  const [cart,setCart]=useState<Product[]>([]);
  const [paymentMethod,setPaymentMethod]=useState("Carte bancaire");
  const [cardName,setCardName]=useState("");
  const [cardNumber,setCardNumber]=useState("");
  const [cardExpiry,setCardExpiry]=useState("");
  const [cardCvv,setCardCvv]=useState("");
  const [productName,setProductName]=useState("");
  const [productDescription,setProductDescription]=useState("");
  const [productPrice,setProductPrice]=useState("");
  const [productStock,setProductStock]=useState("");
  const [productCategory,setProductCategory]=useState("Cheveux");
  const [productImage,setProductImage]=useState("");

  useEffect(()=>{
    fetch("http://localhost:5000/api/products")
      .then(r=>r.ok?r.json():Promise.reject())
      .then((data:ApiProduct[])=>{ if(Array.isArray(data)&&data.length){ setProducts(data.map(p=>({...p,image:p.image_url||fallbackProducts.find(x=>x.id===p.id)?.image||fallbackProducts[0].image}))); } })
      .catch(()=>{});
  },[]);

  const login=(e:React.FormEvent)=>{
    e.preventDefault(); setLoginError("");
    if(email==="admin@osrah.ma"&&password==="osrah2026"){setRole("admin");setPage("dashboard");return;}
    if(email==="client@osrah.ma"&&password==="client2026"){setRole("client");setPage("shop");return;}
    setLoginError("Email ou mot de passe incorrect.");
  };
  const logout=()=>{setRole("none");setPage("login");setEmail("");setPassword("");};
  const addToCart=(p:Product)=>{if(p.stock>0)setCart(c=>[...c,p]);};
  const subtotal=cart.reduce((s,p)=>s+p.price,0); const delivery=subtotal>=300||subtotal===0?0:30; const total=subtotal+delivery;
  const visible=useMemo(()=>{
    let list=products.filter(p=>(category==="Tous"||p.category===category)&&p.name.toLowerCase().includes(search.toLowerCase()));
    if(sort==="asc") list=[...list].sort((a,b)=>a.price-b.price);
    if(sort==="desc") list=[...list].sort((a,b)=>b.price-a.price);
    if(sort==="az") list=[...list].sort((a,b)=>a.name.localeCompare(b.name));
    return list;
  },[products,category,search,sort]);

  const openProduct=(p:Product)=>{setSelected(p);setPage("detail");window.scrollTo(0,0);};
  const addProduct=async(e:React.FormEvent)=>{e.preventDefault(); if(!productName||!productPrice)return;
    const payload={name:productName,description:productDescription,price:Number(productPrice),stock:Number(productStock||0),category:productCategory,image_url:productImage};
    try{const r=await fetch("http://localhost:5000/api/products",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});const data=await r.json();if(r.ok&&data.product){const p=data.product;setProducts(x=>[{...p,image:p.image_url||fallbackProducts[0].image},...x]);}}
    catch{setProducts(x=>[{id:Date.now(),...payload,image:productImage||fallbackProducts[0].image},...x]);}
    setProductName("");setProductDescription("");setProductPrice("");setProductStock("");setProductImage("");setPage("products");
  };

  if(page==="login") return <div className="login-page"><div className="login-card"><div className="brand">OSRAH<span>Cosmétiques</span></div><h1>Bienvenue</h1><p>Connectez-vous à votre espace</p><form onSubmit={login}><label>Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Votre adresse email"/><label>Mot de passe</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Votre mot de passe"/>{loginError&&<p style={{color:"#b4003d"}}>{loginError}</p>}<button className="primary">SE CONNECTER</button></form><p style={{fontSize:12}}>Admin: admin@osrah.ma / osrah2026<br/>Client: client@osrah.ma / client2026</p></div></div>;

  if(role==="client"&&page==="detail"&&selected) return <div className="detail-page"><header className="simple-header"><button className="ghost" onClick={()=>setPage("shop")}>← Retour</button><div className="brand">OSRAH<span>Cosmétiques</span></div><button className="ghost" onClick={()=>setPage("payment")}>🛒 {cart.length}</button></header><main className="detail-wrap"><div className="detail-img"><img src={selected.image} alt={selected.name}/></div><div className="detail-info"><small>{selected.category}</small><h1>{selected.name}</h1><div className="price">{selected.price.toFixed(2)} DH</div><p>{selected.description}</p><p><b>{selected.stock>0?"✓ En stock":"Rupture de stock"}</b></p><div className="detail-actions"><button className="primary" onClick={()=>addToCart(selected)}>AJOUTER AU PANIER</button><button className="ghost" onClick={()=>{addToCart(selected);setPage("payment")}}>ACHETER MAINTENANT</button></div></div></main></div>;

  if(role==="client"&&page==="payment") return <div className="payment-page"><header className="simple-header"><button className="ghost" onClick={()=>setPage("shop")}>← Boutique</button><div className="brand">OSRAH<span>Cosmétiques</span></div><span>🔒 Paiement fiable</span></header><main className="payment-wrap"><section className="payment-panel"><h2>Vos articles ({cart.length})</h2>{cart.map((p,i)=><div className="pay-item" key={p.id+"-"+i}><img src={p.image} alt={p.name}/><div><small>{p.category}</small><h3>{p.name}</h3><b>{p.price.toFixed(2)} DH</b></div><button className="ghost" onClick={()=>setCart(c=>c.filter((_,x)=>x!==i))}>✕</button></div>)}</section><aside className="payment-summary"><h2>Résumé de votre commande</h2><div className="summary-line"><span>Sous-total</span><b>{subtotal.toFixed(2)} DH</b></div><div className="summary-line"><span>Livraison</span><b>{delivery===0?"Gratuite":delivery+" DH"}</b></div><div className="summary-line"><span>Total TTC</span><b className="price">{total.toFixed(2)} DH</b></div><h3>Moyen de paiement</h3><div className="methods">{["Carte bancaire","PayPal","Paiement à la livraison"].map(m=><button className={paymentMethod===m?"active":""} onClick={()=>setPaymentMethod(m)} key={m}>{m}</button>)}</div>{paymentMethod==="Carte bancaire"&&<div className="card-form"><input placeholder="Nom sur la carte" value={cardName} onChange={e=>setCardName(e.target.value)}/><input placeholder="0000 0000 0000 0000" value={cardNumber} onChange={e=>setCardNumber(e.target.value)}/><input placeholder="MM/AA" value={cardExpiry} onChange={e=>setCardExpiry(e.target.value)}/><input placeholder="CVV" value={cardCvv} onChange={e=>setCardCvv(e.target.value)}/></div>}<button className="primary" style={{width:"100%",marginTop:16}} disabled={!cart.length} onClick={()=>setPage("confirmation")}>CONFIRMER LE PAIEMENT</button><p style={{fontSize:12,color:"#777"}}>Simulation pour la soutenance.</p></aside></main></div>;

  if(role==="client"&&page==="confirmation") return <div className="confirm"><div className="confirm-box"><div className="check">✓</div><h1>Commande confirmée</h1><p>Votre commande OSRAH a été enregistrée avec succès.</p><button className="primary" onClick={()=>{setCart([]);setPage("shop")}}>RETOURNER À LA BOUTIQUE</button></div></div>;

  if(role==="client") return <div className="client-page"><div className="topbar"><span>🚚 Livraison gratuite dès 300 DH</span><span>🛡️ Produits authentiques</span><span>🎧 Service client 7j/7</span></div><header className="shop-header"><div className="brand">OSRAH<span>Cosmétiques</span></div><div className="search"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Qu'est-ce que tu cherches ?"/><span>🔍</span></div><div className="header-actions"><button onClick={()=>setPage("payment")}>🛒 {cart.length}</button><button onClick={logout}>Déconnexion</button></div></header><nav className="nav">{["Tous","Soin visage","Cheveux","Corps et douche","Parfum & senteurs","Coffrets","Homme","Promotion"].map(c=><button className={category===c?"active":""} key={c} onClick={()=>{setCategory(c);document.getElementById("catalog")?.scrollIntoView({behavior:"smooth"})}}>{c.toUpperCase()}</button>)}</nav><section className="hero"><div><small>NOUVELLE COLLECTION</small><h1>Votre beauté,<br/>notre passion</h1><p>Découvrez les soins, nouveautés et offres OSRAH sélectionnés pour votre routine.</p><button className="primary" onClick={()=>document.getElementById("catalog")?.scrollIntoView({behavior:"smooth"})}>DÉCOUVRIR</button></div></section><section className="promo-strip"><div className="promo arr"><small>NOUVEL ARRIVAGE</small><h2>Les nouveautés de la semaine</h2></div><div className="promo sale"><small>SOLDES</small><h2>Jusqu'à -30% sur une sélection</h2></div></section><section className="catalog" id="catalog"><div className="toolbar"><div><h2>{category==="Tous"?"Tous nos produits":category}</h2><span>{visible.length} produits</span></div><select value={sort} onChange={e=>setSort(e.target.value)}><option value="best">Meilleures ventes</option><option value="asc">Prix croissant</option><option value="desc">Prix décroissant</option><option value="az">Nom A-Z</option></select></div><div className="grid">{visible.map(p=><article className="card" key={p.id}><div className="card-img" onClick={()=>openProduct(p)}><img src={p.image} alt={p.name}/></div><div className="card-info"><small>{p.category}</small><h3 onClick={()=>openProduct(p)}>{p.name}</h3><div className="price">{p.price.toFixed(2)} DH</div><button className="add" onClick={()=>addToCart(p)}>AJOUTER AU PANIER</button></div></article>)}</div></section><section className="cart"><h2>Votre panier</h2><div className="cart-layout"><div>{cart.length===0?<p>Votre panier est vide.</p>:cart.map((p,i)=><div className="cart-item" key={p.id+"c"+i}><img src={p.image} alt={p.name}/><div><h3>{p.name}</h3><b>{p.price.toFixed(2)} DH</b></div><button className="ghost" onClick={()=>setCart(c=>c.filter((_,x)=>x!==i))}>✕</button></div>)}</div><aside className="summary"><h3>Résumé</h3><div className="summary-line"><span>Sous-total</span><b>{subtotal.toFixed(2)} DH</b></div><div className="summary-line"><span>Livraison</span><b>{delivery===0?"Gratuite":delivery+" DH"}</b></div><div className="summary-line"><span>Total</span><b>{total.toFixed(2)} DH</b></div><button className="primary" style={{width:"100%"}} disabled={!cart.length} onClick={()=>setPage("payment")}>PASSER LA COMMANDE</button></aside></div></section></div>;

  const adminNav=(target:Page,label:string)=><button className={page===target?"active":""} onClick={()=>setPage(target)}>{label}</button>;
  return <div className="shell"><aside className="sidebar"><div className="brand">OSRAH<span>Cosmétiques</span></div><nav>{adminNav("dashboard","🏠 Dashboard")}{adminNav("products","🧴 Produits")}{adminNav("add-product","➕ Ajouter produit")}{adminNav("orders","📦 Commandes")}{adminNav("clients","👥 Clients")}{adminNav("stats","📊 Statistiques")}</nav><button className="logout" onClick={logout}>Déconnexion admin</button></aside><main className="admin-main">{page==="dashboard"&&<><div className="admin-header"><div><h1>Dashboard</h1><p>Bienvenue dans votre espace de gestion Osrah Cosmétiques.</p></div><button className="primary" onClick={()=>{setRole("client");setPage("shop")}}>Voir espace client</button></div><div className="stats"><div className="stat"><p>Produits</p><b>{products.length}</b></div><div className="stat"><p>Commandes</p><b>3</b></div><div className="stat"><p>Chiffre d'affaires</p><b>472 DH</b></div><div className="stat"><p>Clients</p><b>24</b></div></div><div className="panel"><h2>Dernières commandes</h2><div className="table"><div className="row"><b>CMD001</b><span>Lait Corps Fraîcheur</span><b>114 DH</b><span>En préparation</span></div><div className="row"><b>CMD002</b><span>Pack Solaire Osrah</span><b>199 DH</b><span>Expédiée</span></div><div className="row"><b>CMD003</b><span>Shampooing Hydratant</span><b>159 DH</b><span>Livrée</span></div></div></div></>}{page==="products"&&<><div className="admin-header"><h1>Gestion des produits</h1><button className="primary" onClick={()=>setPage("add-product")}>+ Ajouter produit</button></div><div className="admin-grid">{products.map(p=><div className="admin-product" key={p.id}><img src={p.image} alt={p.name}/><div className="info"><small>{p.category}</small><h3>{p.name}</h3><p>{p.description}</p><b>{p.price.toFixed(2)} DH</b><p>Stock: {p.stock}</p></div></div>)}</div></>}{page==="add-product"&&<><h1>Ajouter un produit</h1><form className="admin-form" onSubmit={addProduct}><label>Nom</label><input value={productName} onChange={e=>setProductName(e.target.value)}/><label>Description</label><textarea value={productDescription} onChange={e=>setProductDescription(e.target.value)}/><label>Catégorie</label><select value={productCategory} onChange={e=>setProductCategory(e.target.value)}>{["Soin visage","Cheveux","Corps et douche","Parfum & senteurs","Coffrets","Homme","Promotion"].map(c=><option key={c}>{c}</option>)}</select><label>Prix</label><input type="number" value={productPrice} onChange={e=>setProductPrice(e.target.value)}/><label>Stock</label><input type="number" value={productStock} onChange={e=>setProductStock(e.target.value)}/><label>URL photo</label><input value={productImage} onChange={e=>setProductImage(e.target.value)}/><button className="primary">AJOUTER LE PRODUIT</button></form></>}{page==="orders"&&<div className="panel"><h1>Commandes</h1><div className="table"><div className="row"><b>CMD001</b><span>Sara Amrani</span><b>114 DH</b><span>En préparation</span></div><div className="row"><b>CMD002</b><span>Aya Benali</span><b>199 DH</b><span>Expédiée</span></div><div className="row"><b>CMD003</b><span>Imane Alaoui</span><b>159 DH</b><span>Livrée</span></div></div></div>}{page==="clients"&&<div className="panel"><h1>Clients</h1><p>Sara Amrani — sara@gmail.com</p><p>Aya Benali — aya@gmail.com</p><p>Imane Alaoui — imane@gmail.com</p></div>}{page==="stats"&&<><h1>Statistiques</h1><div className="stats"><div className="stat"><p>Produits</p><b>{products.length}</b></div><div className="stat"><p>Commandes</p><b>3</b></div><div className="stat"><p>Revenus</p><b>472 DH</b></div><div className="stat"><p>Clients</p><b>24</b></div></div></>}</main></div>;
}

export default App;
