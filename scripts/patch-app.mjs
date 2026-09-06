import fs from "node:fs";

const appPath = new URL("../src/App.tsx", import.meta.url);
let code = fs.readFileSync(appPath, "utf8");

const defaultImage =
  "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=800&q=80";

code = code.replace(
  'import React, { useState } from "react";',
  'import React, { useEffect, useState } from "react";'
);

if (!code.includes('import "./premium.css";')) {
  code = code.replace('import "./App.css";', 'import "./App.css";\nimport "./premium.css";');
}

const productsStart = code.indexOf(
  '  const [products, setProducts] = useState<Product[]>(['
);
const productsEndMarker = `  /* =========================\n     PRODUCT FORM\n  ========================= */`;
const productsEnd = code.indexOf(productsEndMarker);

if (productsStart !== -1 && productsEnd !== -1) {
  const replacement = `  const API_URL = "http://localhost:5000/api/products";\n\n  const [products, setProducts] = useState<Product[]>([]);\n\n  const productFromApi = (product: any): Product => ({\n    id: Number(product.id),\n    name: product.name ?? "",\n    description: product.description ?? "",\n    price: Number(product.price ?? 0),\n    stock: Number(product.stock ?? 0),\n    category: product.category ?? "",\n    image: product.image_url || product.image || "${defaultImage}",\n  });\n\n  const loadProducts = async () => {\n    try {\n      const response = await fetch(API_URL);\n      if (!response.ok) throw new Error("Impossible de charger les produits");\n      const data = await response.json();\n      setProducts(data.map(productFromApi));\n    } catch (error) {\n      console.error("Erreur API produits:", error);\n    }\n  };\n\n  useEffect(() => {\n    loadProducts();\n  }, []);\n\n`;

  code =
    code.slice(0, productsStart) + replacement + code.slice(productsEnd);
}

const addStartMarker = `  /* =========================\n     ADD PRODUCT\n  ========================= */`;
const deleteStartMarker = `  /* =========================\n     DELETE PRODUCT\n  ========================= */`;
const addStart = code.indexOf(addStartMarker);
const deleteStart = code.indexOf(deleteStartMarker);

if (addStart !== -1 && deleteStart !== -1) {
  const replacement = `${addStartMarker}\n\n  const addProduct = async (e: React.FormEvent) => {\n    e.preventDefault();\n\n    if (!productName || !productDescription || !productPrice || !productStock) {\n      alert("Veuillez remplir tous les champs.");\n      return;\n    }\n\n    try {\n      const response = await fetch(API_URL, {\n        method: "POST",\n        headers: { "Content-Type": "application/json" },\n        body: JSON.stringify({\n          name: productName,\n          description: productDescription,\n          price: Number(productPrice),\n          stock: Number(productStock),\n          category: productCategory,\n          image_url: productImage || "${defaultImage}",\n        }),\n      });\n\n      const data = await response.json();\n      if (!response.ok) {\n        throw new Error(data.message || "Erreur lors de l'ajout du produit");\n      }\n\n      const savedProduct = productFromApi(data.product ?? data);\n      setProducts((current) => [savedProduct, ...current]);\n\n      setProductName("");\n      setProductDescription("");\n      setProductPrice("");\n      setProductStock("");\n      setProductImage("");\n\n      alert("Produit ajouté avec succès !");\n      setPage("products");\n    } catch (error) {\n      console.error(error);\n      alert("Le backend ne répond pas. Vérifiez que le port 5000 est démarré.");\n    }\n  };\n\n`;

  code = code.slice(0, addStart) + replacement + code.slice(deleteStart);
}

const imageStartMarker = `  /* =========================\n     IMAGE UPLOAD\n  ========================= */`;
const deleteStart2 = code.indexOf(deleteStartMarker);
const imageStart = code.indexOf(imageStartMarker);

if (deleteStart2 !== -1 && imageStart !== -1) {
  const replacement = `${deleteStartMarker}\n\n  const deleteProduct = async (id: number) => {\n    if (!window.confirm("Voulez-vous supprimer ce produit ?")) return;\n\n    try {\n      const response = await fetch(\`${"${API_URL}"}/\${id}\`, { method: "DELETE" });\n      const data = await response.json();\n      if (!response.ok) {\n        throw new Error(data.message || "Erreur lors de la suppression");\n      }\n      setProducts((current) => current.filter((product) => product.id !== id));\n    } catch (error) {\n      console.error(error);\n      alert("Impossible de supprimer le produit depuis le backend.");\n    }\n  };\n\n`;

  code = code.slice(0, deleteStart2) + replacement + code.slice(imageStart);
}

const orderStartMarker = `  /* =========================\n     ADD ORDER\n  ========================= */`;
const imageStart2 = code.indexOf(imageStartMarker);
const orderStart = code.indexOf(orderStartMarker);

if (imageStart2 !== -1 && orderStart !== -1) {
  const replacement = `${imageStartMarker}\n\n  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {\n    const file = e.target.files?.[0];\n    if (!file) return;\n\n    const reader = new FileReader();\n    reader.onload = () => setProductImage(String(reader.result || ""));\n    reader.readAsDataURL(file);\n  };\n\n`;

  code = code.slice(0, imageStart2) + replacement + code.slice(orderStart);
}

const heroStartMarker = "        {/* HERO */}";
const servicesMarker = "        {/* SERVICES */}";
const heroStart = code.indexOf(heroStartMarker);
const servicesStart = code.indexOf(servicesMarker);

if (heroStart !== -1 && servicesStart !== -1 && !code.includes('className="luxury-hero"')) {
  const premiumShowcase = `        {/* HERO */}\n\n        <section className="luxury-hero">\n          <div className="luxury-hero-overlay" />\n          <div className="luxury-hero-content">\n            <span className="luxury-kicker">NOUVELLE COLLECTION · 2026</span>\n            <h1>La beauté qui vous ressemble.</h1>\n            <p>Des soins iconiques, des nouveautés et des offres exclusives sélectionnées par Osrah Cosmétiques.</p>\n            <div className="luxury-hero-actions">\n              <button onClick={() => document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" })}>DÉCOUVRIR LA COLLECTION</button>\n              <button className="ghost" onClick={() => document.getElementById("sale-section")?.scrollIntoView({ behavior: "smooth" })}>VOIR LES SOLDES</button>\n            </div>\n          </div>\n          <div className="luxury-hero-badge"><strong>-30%</strong><span>sur une sélection</span></div>\n        </section>\n\n        <section className="campaign-grid">\n          <article className="campaign-card campaign-arrivals">\n            <div><span>NOUVEL ARRIVAGE</span><h3>Glow Season</h3><p>Les essentiels qui viennent d'arriver.</p><button onClick={() => document.getElementById("new-arrivals")?.scrollIntoView({ behavior: "smooth" })}>Découvrir →</button></div>\n          </article>\n          <article className="campaign-card campaign-hair">\n            <div><span>ROUTINE CHEVEUX</span><h3>Repair & Shine</h3><p>Une routine complète pour des cheveux sublimés.</p><button onClick={() => document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" })}>Voir la sélection →</button></div>\n          </article>\n          <article className="campaign-card campaign-sale">\n            <div><span>OFFRE LIMITÉE</span><h3>Beauty Sale</h3><p>Jusqu'à -30% sur nos favoris.</p><button onClick={() => document.getElementById("sale-section")?.scrollIntoView({ behavior: "smooth" })}>Profiter de l'offre →</button></div>\n          </article>\n        </section>\n\n        <section className="new-arrivals-section" id="new-arrivals">\n          <div className="premium-section-title">\n            <div><span>NOUVEAUTÉS</span><h2>Les derniers arrivages</h2><p>Les produits qui viennent de rejoindre la sélection Osrah.</p></div>\n            <button onClick={() => document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" })}>TOUT VOIR</button>\n          </div>\n          <div className="arrival-grid">\n            {products.slice(0, 4).map((product, index) => (\n              <article className="arrival-card" key={product.id}>\n                <div className="arrival-image-wrap">\n                  <img src={product.image} alt={product.name} />\n                  <span className="arrival-badge">{index === 0 ? "NEW" : index === 1 ? "BEST" : "NOUVEAU"}</span>\n                </div>\n                <div className="arrival-info">\n                  <small>{product.category}</small>\n                  <h3>{product.name}</h3>\n                  <div><strong>{product.price.toFixed(2)} DH</strong><button onClick={() => addToCart(product)}>＋</button></div>\n                </div>\n              </article>\n            ))}\n          </div>\n        </section>\n\n        <section className="sale-showcase" id="sale-section">\n          <div className="sale-copy">\n            <span>BEAUTY DAYS</span>\n            <h2>Les soldes sont arrivées.</h2>\n            <p>Profitez de prix doux sur une sélection de soins visage, cheveux et coffrets beauté.</p>\n            <div className="sale-codes"><strong>JUSQU'À -30%</strong><small>Offre dans la limite des stocks disponibles</small></div>\n            <button onClick={() => document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" })}>SHOPPER LES OFFRES</button>\n          </div>\n          <div className="sale-visual"><span>OSRAH</span><strong>SALE</strong><em>-30%</em></div>\n        </section>\n\n`;

  code = code.slice(0, heroStart) + premiumShowcase + code.slice(servicesStart);
}

fs.writeFileSync(appPath, code, "utf8");
console.log("Frontend connected + premium storefront applied");
