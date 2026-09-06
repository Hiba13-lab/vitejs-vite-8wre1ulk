import fs from "node:fs";

const appPath = new URL("../src/App.tsx", import.meta.url);
let code = fs.readFileSync(appPath, "utf8");

if (!code.includes('import "./commerce.css";')) {
  code = code.replace('import "./auth.css";', 'import "./auth.css";\nimport "./commerce.css";');
}

if (!code.includes('const [selectedProduct, setSelectedProduct]')) {
  code = code.replace(
    '  const [cart, setCart] = useState<Product[]>([]);',
    '  const [cart, setCart] = useState<Product[]>([]);\n  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);\n  const [paymentMethod, setPaymentMethod] = useState("Carte bancaire");\n  const [cardName, setCardName] = useState("");\n  const [cardNumber, setCardNumber] = useState("");\n  const [cardExpiry, setCardExpiry] = useState("");\n  const [cardCvv, setCardCvv] = useState("");'
  );
}

if (!code.includes('const checkoutSubtotal =')) {
  const marker = `  /* =========================\n     CLIENT LOGIN PAGE\n  ========================= */`;
  const idx = code.indexOf(marker);
  if (idx !== -1) {
    const helpers = String.raw`  const checkoutSubtotal = cart.reduce((sum, product) => sum + product.price, 0);
  const checkoutDelivery = checkoutSubtotal >= 300 || checkoutSubtotal === 0 ? 0 : 30;
  const checkoutTotal = checkoutSubtotal + checkoutDelivery;

  const openProduct = (product: Product) => {
    setSelectedProduct(product);
    setPage("product-detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirmDemoPayment = () => {
    if (cart.length === 0) return;
    if (paymentMethod === "Carte bancaire") {
      const digits = cardNumber.replace(/\s/g, "");
      if (!cardName || digits.length < 12 || !cardExpiry || cardCvv.length < 3) {
        alert("Veuillez compléter les informations de paiement.");
        return;
      }
    }
    setPage("confirmation");
  };

`;
    code = code.slice(0, idx) + helpers + code.slice(idx);
  }
}

if (!code.includes('className="product-detail-page"')) {
  const marker = `  /* =========================\n     CLIENT SHOP\n  ========================= */`;
  const idx = code.indexOf(marker);
  if (idx !== -1) {
    const pages = String.raw`  if (page === "product-detail" && clientLoggedIn && selectedProduct) {
    return (
      <div className="product-detail-page">
        <header className="detail-header">
          <button onClick={() => setPage("client-shop")}>← Retour</button>
          <div className="detail-brand"><strong>OSRAH</strong><span>Cosmétiques</span></div>
          <button onClick={() => setPage("payment")}>🛒 {cart.length}</button>
        </header>
        <main className="detail-layout">
          <div className="detail-image"><img src={selectedProduct.image} alt={selectedProduct.name} /></div>
          <div className="detail-info">
            <span className="detail-category">{selectedProduct.category}</span>
            <h1>{selectedProduct.name}</h1>
            <div className="detail-price">{selectedProduct.price.toFixed(2)} DH</div>
            <p>{selectedProduct.description}</p>
            <div className="detail-stock">{selectedProduct.stock > 0 ? "✓ En stock" : "Rupture de stock"}</div>
            <div className="detail-actions">
              <button disabled={selectedProduct.stock === 0} onClick={() => addToCart(selectedProduct)}>AJOUTER AU PANIER</button>
              <button className="buy-now" disabled={selectedProduct.stock === 0} onClick={() => { addToCart(selectedProduct); setPage("payment"); }}>ACHETER MAINTENANT</button>
            </div>
            <div className="detail-benefits"><span>🚚 Livraison rapide</span><span>🔒 Paiement sécurisé</span><span>💗 Service client</span></div>
          </div>
        </main>
      </div>
    );
  }

  if (page === "payment" && clientLoggedIn) {
    return (
      <div className="payment-page-osrah">
        <header className="payment-header-osrah">
          <button onClick={() => setPage("client-shop")}>← Boutique</button>
          <div><strong>OSRAH</strong><span>Cosmétiques</span></div>
          <span>🔒 Paiement fiable</span>
        </header>
        <div className="payment-steps"><strong>Panier</strong><b>›</b><span>Validation</span><b>›</b><strong>Payer</strong><b>›</b><span>Confirmation</span></div>
        <main className="payment-grid-osrah">
          <section className="payment-cart-panel">
            <h2>Vos articles ({cart.length})</h2>
            {cart.length === 0 ? <p>Votre panier est vide.</p> : cart.map((product, index) => (
              <article className="payment-cart-item" key={product.id + "-" + index}>
                <img src={product.image} alt={product.name} />
                <div><small>{product.category}</small><h3>{product.name}</h3><strong>{product.price.toFixed(2)} DH</strong></div>
                <button onClick={() => removeFromCart(index)}>✕</button>
              </article>
            ))}
          </section>
          <aside className="payment-summary-osrah">
            <h2>Résumé de votre commande</h2>
            <div><span>Sous-total</span><strong>{checkoutSubtotal.toFixed(2)} DH</strong></div>
            <div><span>Livraison</span><strong>{checkoutDelivery === 0 ? "Gratuite" : checkoutDelivery + " DH"}</strong></div>
            <div className="payment-total"><span>Total TTC</span><strong>{checkoutTotal.toFixed(2)} DH</strong></div>
            <h3>Moyen de paiement</h3>
            <div className="payment-method-buttons">
              {["Carte bancaire", "PayPal", "Paiement à la livraison"].map((method) => (
                <button key={method} className={paymentMethod === method ? "active" : ""} onClick={() => setPaymentMethod(method)}>{method}</button>
              ))}
            </div>
            {paymentMethod === "Carte bancaire" && (
              <div className="demo-card-form">
                <input placeholder="Nom sur la carte" value={cardName} onChange={(e) => setCardName(e.target.value)} />
                <input placeholder="0000 0000 0000 0000" value={cardNumber} onChange={(e) => setCardNumber(e.target.value.replace(/[^0-9 ]/g, "").slice(0, 19))} />
                <div><input placeholder="MM/AA" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value.slice(0, 5))} /><input placeholder="CVV" value={cardCvv} onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3))} /></div>
              </div>
            )}
            <button className="confirm-payment-btn" disabled={cart.length === 0} onClick={confirmDemoPayment}>CONFIRMER LE PAIEMENT</button>
            <small>Simulation pour la soutenance — aucune transaction réelle.</small>
          </aside>
        </main>
      </div>
    );
  }

  if (page === "confirmation" && clientLoggedIn) {
    return (
      <div className="confirmation-page-osrah">
        <div className="confirmation-box-osrah"><div>✓</div><h1>Commande confirmée</h1><p>Votre commande OSRAH a été enregistrée avec succès.</p><button onClick={() => { setCart([]); setPage("client-shop"); }}>RETOURNER À LA BOUTIQUE</button></div>
      </div>
    );
  }

`;
    code = code.slice(0, idx) + pages + code.slice(idx);
  }
}

code = code.replace(
  '<div className="client-product-image">',
  '<div className="client-product-image" onClick={() => openProduct(product)} role="button" tabIndex={0}>'
);

code = code.replace(
  /<h3>\s*\{product\.name\}\s*<\/h3>/,
  '<h3 className="product-name-link" onClick={() => openProduct(product)}>{product.name}</h3>'
);

code = code.replace(
  /<button\s+onClick=\{\(\) =>\s*alert\(\s*"Votre commande a été enregistrée !"\s*\)\s*\}\s*>\s*PASSER LA COMMANDE\s*<\/button>/,
  '<button onClick={() => setPage("payment")}>PASSER AU PAIEMENT</button>'
);

fs.writeFileSync(appPath, code, "utf8");
console.log("Product details + demo payment flow applied");
