import React, { useEffect, useMemo, useState } from "react";
import "./final.css";

type Product = { id:number; name:string; description:string; price:number; stock:number; category:string; image:string };
type ApiProduct = { id:number; name:string; description:string; price:number; stock:number; category:string; image_url?:string };
type Role = "none" | "admin" | "client";
type Page = "login" | "dashboard" | "products" | "add-product" | "orders" | "clients" | "stats" | "shop" | "detail" | "payment" | "confirmation";
type CollectionMode = "all" | "new" | "sale";

const HAIR_1 = "https://osrahcosmetics.ma/cdn/shop/files/1-10_d0a1dd97-a339-415a-bf3f-1a555c52d7c1.webp?v=1769279715&width=1946";
const HAIR_2 = "https://osrahcosmetics.ma/cdn/shop/files/1-14_306870ad-c7d2-45bb-bbb2-0b741d52200a.webp?v=1769441473&width=1946";
const HAIR_3 = "https://osrahcosmetics.ma/cdn/shop/files/1-12.webp?v=1769264215&width=1946";
const HAIR_4 = "https://osrahcosmetics.ma/cdn/shop/files/1-13_69ba91f2-8616-4f8b-a764-664b7daf79cb.webp?v=1769266736&width=1946";
const HAIR_5 = "https://osrahcosmetics.ma/cdn/shop/files/1-24_507f4f59-979c-4732-9cf9-5f8a5ffc2090.webp?v=1769446245&width=1946";
const HERO_IMG = "https://osrahcosmetics.ma/cdn/shop/files/69ff4d88-a340-4379-b528-b7f3d5e398fe.png?v=1780763528&width=1254";
const SOLAR_IMG = "https://osrahcosmetics.ma/cdn/shop/files/1-13_69ba91f2-8616-4f8b-a764-664b7daf79cb.webp?v=1769266736&width=1946";
const FALLBACK_IMAGE = HAIR_1;

const fallbackProducts: Product[] = [
  {id:1,name:"H-THERAPY - Shampooing Hydratant",description:"Shampooing hydratant qui nettoie les cheveux en douceur.",price:140,stock:18,category:"Cheveux",image:HAIR_1},
  {id:2,name:"H-THERAPY - Masque Hydratant",description:"Masque capillaire nourrissant et hydratant.",price:160,stock:15,category:"Cheveux",image:HAIR_2},
  {id:3,name:"Crème cheveux bouclés - Leave-in",description:"Crème sans rinçage pour définir les boucles.",price:110,stock:20,category:"Cheveux",image:HAIR_3},
  {id:4,name:"Shampooing Sans Sulfate",description:"Shampooing doux sans sulfate, parabène ni silicone.",price:39,stock:22,category:"Cheveux",image:HAIR_4},
  {id:5,name:"Après-shampooing démêleur",description:"Soin léger qui démêle et adoucit les longueurs.",price:40,stock:17,category:"Cheveux",image:HAIR_5},
  {id:6,name:"Lait Corps Fraîcheur",description:"Lait corporel hydratant pour une peau douce.",price:57,stock:20,category:"Corps et douche",image:HERO_IMG},
  {id:7,name:"Gel Douche Fleur d'Oranger",description:"Gel douche parfumé pour nettoyer la peau en douceur.",price:55,stock:25,category:"Corps et douche",image:HERO_IMG},
  {id:8,name:"Gommage au sucre Rose",description:"Gommage corps au sucre rose pour une peau lisse.",price:49,stock:14,category:"Corps et douche",image:HERO_IMG},
  {id:9,name:"Savon Noir Eucalyptus",description:"Savon noir exfoliant pour la routine hammam.",price:39,stock:18,category:"Corps et douche",image:HERO_IMG},
  {id:10,name:"Huile de Bronzage Pailletée",description:"Huile solaire pour sublimer la peau.",price:79,stock:10,category:"Solaire",image:SOLAR_IMG},
  {id:11,name:"Lait Solaire SPF 30",description:"Protection UVA/UVB pour la routine solaire.",price:79,stock:16,category:"Solaire",image:SOLAR_IMG},
  {id:12,name:"Écran solaire teinté SPF 50+",description:"Haute protection solaire teintée.",price:129,stock:12,category:"Solaire",image:SOLAR_IMG},
  {id:13,name:"Brume parfumée OSRAH",description:"Brume légère et fraîche pour le quotidien.",price:69,stock:21,category:"Parfum & senteurs",image:HERO_IMG},
  {id:14,name:"Pack Hammam OSRAH",description:"Coffret de soins corps pour une routine complète.",price:249,stock:8,category:"Promotion",image:HERO_IMG}
];

const normalize=(value:string)=>value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();

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
  const [collectionMode,setCollectionMode]=useState<CollectionMode>("all");
  const [selected,setSelected]=useState<Product|null>(null);
  const [cart,setCart]=useState<Product[]>([]);
  const [favorites,setFavorites]=useState<number[]>([]);
  const [toast,setToast]=useState("");
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
      .then((data:ApiProduct[])=>{
        if(Array.isArray(data)&&data.length){
          setProducts(data.map((p,index)=>({...p,image:p.image_url||fallbackProducts[index%fallbackProducts.length]?.image||FALLBACK_IMAGE})));
        }
      }).catch(()=>{});
  },[]);

  useEffect(()=>{
    if(!toast)return;
    const t=window.setTimeout(()=>setToast(""),2200);
    return()=>window.clearTimeout(t);
  },[toast]);

  const login=(e:React.FormEvent)=>{
    e.preventDefault();setLoginError("");
    if(email==="admin@osrah.ma"&&password==="osrah2026"){setRole("admin");setPage("dashboard");return;}
    if(email==="client@osrah.ma"&&password==="client2026"){setRole("client");setPage("shop");return;}
    setLoginError("Email ou mot de passe incorrect.");
  };
  const logout=()=>{setRole("none");setPage("login");setEmail("");setPassword("");};
  const addToCart=(p:Product)=>{if(p.stock<=0){setToast("Produit en rupture de stock");return;}setCart(c=>[...c,p]);setToast(`${p.name} ajouté au panier`);};
  const toggleFavorite=(id:number)=>setFavorites(f=>f.includes(id)?f.filter(x=>x!==id):[...f,id]);
  const subtotal=cart.reduce((s,p)=>s+p.price,0);
  const delivery=subtotal>=300||subtotal===0?0:30;
  const total=subtotal+delivery;

  const visible=useMemo(()=>{
    const q=normalize(search);
    let list=products.filter(p=>{
      const text=normalize(`${p.name} ${p.description} ${p.category}`);
      const categoryOk=category==="Tous"||p.category===category;
      const searchOk=!q||text.includes(q);
      const saleOk=collectionMode!=="sale"||p.category==="Promotion"||p.price<=79;
      return categoryOk&&searchOk&&saleOk;
    });
    if(collectionMode==="new") list=[...list].slice(-8).reverse();
    if(sort==="asc")list=[...list].sort((a,b)=>a.price-b.price);
    if(sort==="desc")list=[...list].sort((a,b)=>b.price-a.price);
    if(sort==="az")list=[...list].sort((a,b)=>a.name.localeCompare(b.name));
    return list;
  },[products,category,search,sort,collectionMode]);

  const scrollCatalog=()=>window.setTimeout(()=>document.getElementById("catalog")?.scrollIntoView({behavior:"smooth"}),50);
  const selectCategory=(c:string)=>{setSearch("");setCollectionMode("all");setCategory(c);scrollCatalog();};
  const runSearch=()=>{setCollectionMode("all");setCategory("Tous");scrollCatalog();};
  const openCollection=(mode:CollectionMode)=>{setSearch("");setCategory("Tous");setCollectionMode(mode);scrollCatalog();};
  const openProduct=(p:Product)=>{setSelected(p);setPage("detail");window.scrollTo(0,0);};

  const addProduct=async(e:React.FormEvent)=>{e.preventDefault();if(!productName||!productPrice)return;
    const payload={name:productName,description:productDescription,price:Number(productPrice),stock:Number(productStock||0),category:productCategory,image_url:productImage};
    try{const r=await fetch("http://localhost:5000/api/products",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});const data=await r.json();if(r.ok&&data.product){const p=data.product;setProducts(x=>[{...p,image:p.image_url||FALLBACK_IMAGE},...x]);}}
    catch{setProducts(x=>[{id:Date.now(),name:payload.name,description:payload.description,price:payload.price,stock:payload.stock,category:payload.category,image:payload.image_url||FALLBACK_IMAGE},...x]);}
    setProductName("");setProductDescription("");setProductPrice("");setProductStock("");setProductImage("");setPage("products");
  };

  const Brand=()=> <div className="osrah-logo"><b>O<span>S</span>RAH</b><em>cosmétiques</em><small>BEAUTÉ NATURELLE, CONFIANCE RÉELLE</small></div>;
  const Toast=()=>toast?<div className="cart-success-toast show"><div className="cart-success-icon">✓</div><div><strong>Produit ajouté</strong><small>{toast}</small></div></div>:null;

  if(page==="login")return <div className="login-page"><div className="login-card"><Brand/><h1>Bienvenue</h1><p>Connectez-vous à votre espace OSRAH</p><form onSubmit={login}><label>Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Votre adresse email"/><label>Mot de passe</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Votre mot de passe"/>{loginError&&<p className="login-error">{loginError}</p>}<button className="primary">SE CONNECTER</button></form><div className="demo-accounts"><span>Admin : admin@osrah.ma / osrah2026</span><span>Client : client@osrah.ma / client2026</span></div></div></div>;

  if(role==="client"&&page==="detail"&&selected)return <><Toast/><div className="detail-page"><header className="simple-header"><button className="ghost" onClick={()=>setPage("shop")}>← Retour</button><Brand/><button className="ghost" onClick={()=>setPage("payment")}>🛒 {cart.length}</button></header><main className="detail-wrap"><div className="detail-img"><img src={selected.image} alt={selected.name}/></div><div className="detail-info"><small>{selected.category}</small><h1>{selected.name}</h1><div className="price">{selected.price.toFixed(2)} DH</div><p>{selected.description}</p><p className="in-stock">{selected.stock>0?"✓ En stock":"Rupture de stock"}</p><div className="detail-actions"><button className="primary" onClick={()=>addToCart(selected)}>AJOUTER AU PANIER</button><button className="ghost" onClick={()=>{addToCart(selected);setPage("payment")}}>ACHETER MAINTENANT</button></div><div className="product-benefits"><span>🚚 Livraison rapide</span><span>🔒 Paiement fiable</span><span>♡ Produits authentiques</span></div></div></main></div></>;

  if(role==="client"&&page==="payment")return <div className="payment-page"><header className="simple-header"><button className="ghost" onClick={()=>setPage("shop")}>← Boutique</button><Brand/><span>🔒 Paiement fiable</span></header><main className="payment-wrap"><section className="payment-panel"><h2>Vos articles ({cart.length})</h2>{cart.length===0?<p>Votre panier est vide.</p>:cart.map((p,i)=><div className="pay-item" key={p.id+"-"+i}><img src={p.image} alt={p.name}/><div><small>{p.category}</small><h3>{p.name}</h3><b>{p.price.toFixed(2)} DH</b></div><button className="ghost" onClick={()=>setCart(c=>c.filter((_,x)=>x!==i))}>✕</button></div>)}</section><aside className="payment-summary"><h2>Résumé de votre commande</h2><div className="summary-line"><span>Sous-total</span><b>{subtotal.toFixed(2)} DH</b></div><div className="summary-line"><span>Livraison</span><b>{delivery===0?"Gratuite":delivery+" DH"}</b></div><div className="summary-line total-line"><span>Total TTC</span><b>{total.toFixed(2)} DH</b></div><h3>Moyen de paiement</h3><div className="methods">{["Carte bancaire","PayPal","Paiement à la livraison"].map(m=><button className={paymentMethod===m?"active":""} onClick={()=>setPaymentMethod(m)} key={m}>{m}</button>)}</div>{paymentMethod==="Carte bancaire"&&<div className="card-form"><input placeholder="Nom sur la carte" value={cardName} onChange={e=>setCardName(e.target.value)}/><input placeholder="0000 0000 0000 0000" value={cardNumber} onChange={e=>setCardNumber(e.target.value)}/><div className="card-row"><input placeholder="MM/AA" value={cardExpiry} onChange={e=>setCardExpiry(e.target.value)}/><input placeholder="CVV" value={cardCvv} onChange={e=>setCardCvv(e.target.value)}/></div></div>}<button className="primary full" disabled={!cart.length} onClick={()=>setPage("confirmation")}>CONFIRMER LE PAIEMENT</button><p className="demo-note">Simulation pour la soutenance — aucune transaction réelle.</p></aside></main></div>;

  if(role==="client"&&page==="confirmation")return <div className="confirm"><div className="confirm-box"><div className="check">✓</div><h1>Commande confirmée</h1><p>Votre commande OSRAH a été enregistrée avec succès.</p><button className="primary" onClick={()=>{setCart([]);setPage("shop")}}>RETOURNER À LA BOUTIQUE</button></div></div>;

  if(role==="client")return <><Toast/><div className="storefront">
    <div className="store-topbar"><span>🚚 Livraison partout au Maroc</span><span>☎ +212 600 123 456</span><span>◇ Produits authentiques</span><span>🎧 Service client 7j/7</span></div>
    <header className="store-header"><Brand/><div className="search-box"><input value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")runSearch();}} placeholder="Rechercher un produit, une catégorie..."/><button onClick={runSearch}>⌕</button></div><div className="header-icons"><button onClick={()=>setToast("Espace client connecté")}>♙<small>Espace client</small></button><button onClick={()=>setToast(`${favorites.length} favori(s)`) }>♡<small>Favoris</small></button><button className="cart-head" onClick={()=>setPage("payment")}>🛍<b>{cart.length}</b><small>Panier</small></button></div></header>
    <nav className="store-nav">{["Accueil","Visage","Corps","Cheveux","Solaire","Parfums","Nos marques","Nouveautés","Promotions"].map(item=><button key={item} onClick={()=>{if(item==="Accueil"){setCategory("Tous");setCollectionMode("all");window.scrollTo({top:0,behavior:"smooth"});}else if(item==="Visage")selectCategory("Soin visage");else if(item==="Corps")selectCategory("Corps et douche");else if(item==="Cheveux")selectCategory("Cheveux");else if(item==="Solaire")selectCategory("Solaire");else if(item==="Parfums")selectCategory("Parfum & senteurs");else if(item==="Nouveautés")openCollection("new");else if(item==="Promotions")openCollection("sale");else setToast("OSRAH Cosmétiques");}}>{item}</button>)}</nav>

    <section className="hero-osrah"><div className="hero-copy"><small>OSRAH COSMETICS</small><h1>Révélez votre<br/><em>beauté naturelle</em></h1><p>Des soins authentiques pour une peau et des cheveux en pleine santé.</p><button className="hero-cta" onClick={()=>openCollection("all")}>Découvrir nos produits →</button></div><div className="hero-visual"><img src={HERO_IMG} alt="OSRAH Cosmétiques"/></div></section>

    <section className="category-circles">{[
      ["Visage",SOLAR_IMG,"Soin visage"],["Corps",HERO_IMG,"Corps et douche"],["Cheveux",HAIR_2,"Cheveux"],["Solaire",SOLAR_IMG,"Solaire"],["Parfums",HERO_IMG,"Parfum & senteurs"],["Nos marques",HAIR_1,"Tous"],["Nouveautés",HAIR_3,"new"],["Promotions",HERO_IMG,"sale"]
    ].map(([label,img,target])=><button key={label} onClick={()=>target==="new"?openCollection("new"):target==="sale"?openCollection("sale"):selectCategory(target)}><span><img src={img} alt={label}/></span><b>{label}</b></button>)}</section>

    <section className="promo-duo"><button className="promo-banner new-banner" onClick={()=>openCollection("new")}><div className="promo-img"><img src={HERO_IMG} alt="Nouveautés OSRAH"/></div><div><small>NOUVEL ARRIVAGE</small><h2>Les nouveautés<br/>de la semaine</h2><span>Découvrir →</span></div></button><button className="promo-banner sale-banner" onClick={()=>openCollection("sale")}><div className="promo-img"><img src={HAIR_2} alt="Soldes OSRAH"/></div><div><small>SOLDES</small><h2>Profitez de nos<br/>offres spéciales</h2><span>Voir les promotions →</span></div><strong>-30%</strong></button></section>

    <section className="catalog-osrah" id="catalog"><div className="catalog-title"><div><h2>{collectionMode==="new"?"Nos nouveautés":collectionMode==="sale"?"Nos promotions":category==="Tous"?"Nos produits phares":category}</h2><p>{visible.length} produits</p></div><select value={sort} onChange={e=>setSort(e.target.value)}><option value="best">Meilleures ventes</option><option value="asc">Prix croissant</option><option value="desc">Prix décroissant</option><option value="az">Nom A-Z</option></select></div>{visible.length===0?<div className="no-results">Aucun produit trouvé.</div>:<div className="product-grid-osrah">{visible.map(p=><article className="product-card-osrah" key={p.id}><button className={`heart ${favorites.includes(p.id)?"liked":""}`} onClick={()=>toggleFavorite(p.id)}>♡</button><div className="product-photo" onClick={()=>openProduct(p)}><img src={p.image} alt={p.name}/></div><div className="product-info"><small>{p.category}</small><h3 onClick={()=>openProduct(p)}>{p.name}</h3><div className="price">{p.price.toFixed(2)} DH</div><button className="add-pink" onClick={()=>addToCart(p)}>Ajouter au panier</button></div></article>)}</div>}</section>

    <section className="loyalty-section"><div className="loyalty-copy"><h2>GAGNEZ À CHAQUE ACHAT</h2><h3>CUMULEZ DES POINTS,<br/>PROFITEZ D’AVANTAGES EXCLUSIFS<br/>ET DE CADEAUX.</h3></div><div className="loyalty-benefits"><span>★ <b>Fidélité récompensée</b></span><span>🎁 <b>Offres exclusives</b></span><span>♡ <b>Surprises toute l'année</b></span></div><div className="loyalty-card"><div className="thanks-card">OSRAH<br/><b>Merci</b><small>pour votre fidélité</small></div><div className="order-card">Merci pour votre commande<small>Cumulez vos points à chaque achat</small></div></div></section>

    <footer className="store-footer"><span>© 2026 Osrah Cosmetics. Tous droits réservés.</span><div><button>À propos</button><button>Contact</button><button>CGV</button><button>Politique de confidentialité</button></div><span>◎ ● ♪</span></footer>
  </div></>;

  const adminNav=(target:Page,label:string)=><button className={page===target?"active":""} onClick={()=>setPage(target)}>{label}</button>;
  return <div className="shell"><aside className="sidebar"><Brand/><nav>{adminNav("dashboard","🏠 Dashboard")}{adminNav("products","🧴 Produits")}{adminNav("add-product","➕ Ajouter produit")}{adminNav("orders","📦 Commandes")}{adminNav("clients","👥 Clients")}{adminNav("stats","📊 Statistiques")}</nav><button className="logout" onClick={logout}>Déconnexion admin</button></aside><main className="admin-main">{page==="dashboard"&&<><div className="admin-header"><div><h1>Dashboard</h1><p>Bienvenue dans votre espace de gestion Osrah Cosmétiques.</p></div><button className="primary" onClick={()=>{setRole("client");setPage("shop")}}>Voir espace client</button></div><div className="stats"><div className="stat"><p>Produits</p><b>{products.length}</b></div><div className="stat"><p>Commandes</p><b>3</b></div><div className="stat"><p>Chiffre d'affaires</p><b>472 DH</b></div><div className="stat"><p>Clients</p><b>24</b></div></div><div className="panel"><h2>Dernières commandes</h2><div className="table"><div className="row"><b>CMD001</b><span>Lait Corps Fraîcheur</span><b>114 DH</b><span>En préparation</span></div><div className="row"><b>CMD002</b><span>Pack Solaire Osrah</span><b>199 DH</b><span>Expédiée</span></div><div className="row"><b>CMD003</b><span>Shampooing Hydratant</span><b>159 DH</b><span>Livrée</span></div></div></div></>}{page==="products"&&<><div className="admin-header"><h1>Gestion des produits</h1><button className="primary" onClick={()=>setPage("add-product")}>+ Ajouter produit</button></div><div className="admin-grid">{products.map(p=><div className="admin-product" key={p.id}><img src={p.image} alt={p.name}/><div className="info"><small>{p.category}</small><h3>{p.name}</h3><p>{p.description}</p><b>{p.price.toFixed(2)} DH</b><p>Stock: {p.stock}</p></div></div>)}</div></>}{page==="add-product"&&<><h1>Ajouter un produit</h1><form className="admin-form" onSubmit={addProduct}><label>Nom</label><input value={productName} onChange={e=>setProductName(e.target.value)}/><label>Description</label><textarea value={productDescription} onChange={e=>setProductDescription(e.target.value)}/><label>Catégorie</label><select value={productCategory} onChange={e=>setProductCategory(e.target.value)}>{["Soin visage","Cheveux","Corps et douche","Solaire","Parfum & senteurs","Coffrets","Homme","Promotion"].map(c=><option key={c}>{c}</option>)}</select><label>Prix</label><input type="number" value={productPrice} onChange={e=>setProductPrice(e.target.value)}/><label>Stock</label><input type="number" value={productStock} onChange={e=>setProductStock(e.target.value)}/><label>URL photo</label><input value={productImage} onChange={e=>setProductImage(e.target.value)}/><button className="primary">AJOUTER LE PRODUIT</button></form></>}{page==="orders"&&<div className="panel"><h1>Commandes</h1><div className="table"><div className="row"><b>CMD001</b><span>Sara Amrani</span><b>114 DH</b><span>En préparation</span></div><div className="row"><b>CMD002</b><span>Aya Benali</span><b>199 DH</b><span>Expédiée</span></div><div className="row"><b>CMD003</b><span>Imane Alaoui</span><b>159 DH</b><span>Livrée</span></div></div></div>}{page==="clients"&&<div className="panel"><h1>Clients</h1><p>Sara Amrani — sara@gmail.com</p><p>Aya Benali — aya@gmail.com</p><p>Imane Alaoui — imane@gmail.com</p></div>}{page==="stats"&&<><h1>Statistiques</h1><div className="stats"><div className="stat"><p>Produits</p><b>{products.length}</b></div><div className="stat"><p>Commandes</p><b>3</b></div><div className="stat"><p>Revenus</p><b>472 DH</b></div><div className="stat"><p>Clients</p><b>24</b></div></div></>}</main></div>;
}

export default App;
