import React, { useState } from "react";
import "./App.css";

/* =========================
   TYPES
========================= */

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image: string;
};

type Order = {
  id: number;
  client: string;
  product: string;
  quantity: number;
  total: number;
  status: string;
};

/* =========================
   APP
========================= */

function App() {
  /* =========================
     NAVIGATION
  ========================= */

  const [page, setPage] = useState("dashboard");

  /* =========================
     CLIENT LOGIN
  ========================= */

  const [clientEmail, setClientEmail] = useState("");
  const [clientPassword, setClientPassword] = useState("");
  const [clientLoggedIn, setClientLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState("");

  /* =========================
     PRODUCTS
  ========================= */

  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Lait Corps Fraîcheur",
      description:
        "Lait corporel hydratant qui nourrit la peau et lui apporte douceur et fraîcheur au quotidien.",
      price: 57,
      stock: 20,
      category: "Corps et douche",
      image:
        "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      name: "Pack Extreme Réparation",
      description:
        "Pack complet pour prendre soin des cheveux secs et abîmés et leur apporter nutrition et réparation.",
      price: 330,
      stock: 8,
      category: "Cheveux",
      image:
        "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      name: "Pack Solaire Osrah",
      description:
        "Pack solaire avec protection SPF50+ et lait solaire SPF30 pour protéger la peau pendant l'été.",
      price: 199,
      stock: 15,
      category: "Soin visage",
      image:
        "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 4,
      name: "Crème Capillaire Sans Rinçage",
      description:
        "Crème capillaire nourrissante sans rinçage pour hydrater, protéger et faciliter le coiffage.",
      price: 190,
      stock: 10,
      category: "Cheveux",
      image:
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 5,
      name: "Shampooing Intense Hydratation",
      description:
        "Shampooing doux qui nettoie les cheveux tout en leur apportant une hydratation intense.",
      price: 53,
      stock: 25,
      category: "Cheveux",
      image:
        "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 6,
      name: "Sérum Éclat",
      description:
        "Sérum visage léger conçu pour hydrater la peau et lui donner un aspect plus lumineux.",
      price: 120,
      stock: 12,
      category: "Soin visage",
      image:
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 7,
      name: "Huile Nourrissante",
      description:
        "Huile nourrissante idéale pour prendre soin des cheveux et leur apporter souplesse et brillance.",
      price: 89,
      stock: 18,
      category: "Cheveux",
      image:
        "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 8,
      name: "Coffret Soin Beauté",
      description:
        "Un coffret beauté complet réunissant plusieurs soins pour une routine quotidienne.",
      price: 249,
      stock: 6,
      category: "Coffrets",
      image:
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
    },
  ]);

  /* =========================
     PRODUCT FORM
  ========================= */

  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productStock, setProductStock] = useState("");
  const [productCategory, setProductCategory] = useState("Soin visage");
  const [productImage, setProductImage] = useState("");

  /* =========================
     ORDERS
  ========================= */

  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      client: "Sara Amrani",
      product: "Lait Corps Fraîcheur",
      quantity: 2,
      total: 114,
      status: "En préparation",
    },
    {
      id: 2,
      client: "Aya Benali",
      product: "Pack Solaire Osrah",
      quantity: 1,
      total: 199,
      status: "Expédiée",
    },
    {
      id: 3,
      client: "Imane Alaoui",
      product: "Shampooing Intense Hydratation",
      quantity: 3,
      total: 159,
      status: "Livrée",
    },
  ]);

  const [orderClient, setOrderClient] = useState("");
  const [orderProduct, setOrderProduct] = useState("");
  const [orderQuantity, setOrderQuantity] = useState("");

  /* =========================
     CART
  ========================= */

  const [cart, setCart] = useState<Product[]>([]);

  /* =========================
     SEARCH
  ========================= */

  const [search, setSearch] = useState("");

  /* =========================
     CLIENT LOGIN
  ========================= */

  const handleClientLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientEmail || !clientPassword) {
      setLoginError("Veuillez remplir tous les champs.");
      return;
    }

    setLoginError("");
    setClientLoggedIn(true);
    setPage("client-shop");
  };

  const logoutClient = () => {
    setClientLoggedIn(false);
    setClientEmail("");
    setClientPassword("");
    setPage("dashboard");
  };

  /* =========================
     ADD PRODUCT
  ========================= */

  const addProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !productName ||
      !productDescription ||
      !productPrice ||
      !productStock
    ) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    const newProduct: Product = {
      id: Date.now(),
      name: productName,
      description: productDescription,
      price: Number(productPrice),
      stock: Number(productStock),
      category: productCategory,
      image:
        productImage ||
        "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=800&q=80",
    };

    setProducts([...products, newProduct]);

    setProductName("");
    setProductDescription("");
    setProductPrice("");
    setProductStock("");
    setProductImage("");

    alert("Produit ajouté avec succès !");
    setPage("products");
  };

  /* =========================
     DELETE PRODUCT
  ========================= */

  const deleteProduct = (id: number) => {
    if (window.confirm("Voulez-vous supprimer ce produit ?")) {
      setProducts(products.filter((product) => product.id !== id));
    }
  };

  /* =========================
     IMAGE UPLOAD
  ========================= */

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProductImage(imageUrl);
    }
  };

  /* =========================
     ADD ORDER
  ========================= */

  const addOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!orderClient || !orderProduct || !orderQuantity) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    const selectedProduct = products.find(
      (p) => p.name === orderProduct
    );

    if (!selectedProduct) {
      alert("Produit introuvable.");
      return;
    }

    const quantity = Number(orderQuantity);

    const newOrder: Order = {
      id: Date.now(),
      client: orderClient,
      product: orderProduct,
      quantity,
      total: selectedProduct.price * quantity,
      status: "En préparation",
    };

    setOrders([...orders, newOrder]);

    setOrderClient("");
    setOrderProduct("");
    setOrderQuantity("");

    alert("Commande ajoutée !");
    setPage("orders");
  };

  /* =========================
     DELETE ORDER
  ========================= */

  const deleteOrder = (id: number) => {
    if (window.confirm("Supprimer cette commande ?")) {
      setOrders(orders.filter((order) => order.id !== id));
    }
  };

  /* =========================
     ADD TO CART
  ========================= */

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      alert("Produit en rupture de stock.");
      return;
    }

    setCart([...cart, product]);
  };

  /* =========================
     REMOVE FROM CART
  ========================= */

  const removeFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  /* =========================
     CLIENT LOGIN PAGE
  ========================= */

  if (page === "client-login" && !clientLoggedIn) {
    return (
      <div className="client-login-page">

        <div className="client-login-card">

          <div className="login-logo">
            <strong>OSRAH</strong>
            <span>Cosmétiques</span>
          </div>

          <h1>Bienvenue chez Osrah</h1>

          <p className="login-subtitle">
            Connectez-vous à votre espace client
          </p>

          <form onSubmit={handleClientLogin}>

            <label>Email</label>

            <input
              type="email"
              placeholder="Votre adresse email"
              value={clientEmail}
              onChange={(e) =>
                setClientEmail(e.target.value)
              }
            />

            <label>Mot de passe</label>

            <input
              type="password"
              placeholder="Votre mot de passe"
              value={clientPassword}
              onChange={(e) =>
                setClientPassword(e.target.value)
              }
            />

            {loginError && (
              <p className="login-error">
                {loginError}
              </p>
            )}

            <button type="submit">
              SE CONNECTER
            </button>

          </form>

          <button
            className="back-to-admin"
            onClick={() => setPage("dashboard")}
          >
            ← Retour à l'espace gestion
          </button>

        </div>

      </div>
    );
  }

  /* =========================
     CLIENT SHOP
  ========================= */

  if (page === "client-shop" && clientLoggedIn) {

    const filteredProducts = products.filter((product) =>
      product.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    const cartTotal = cart.reduce(
      (total, product) => total + product.price,
      0
    );

    return (
      <div className="client-shop-page">

        {/* TOP BAR */}

        <div className="client-topbar">

          <span>
            🚚 Livraison gratuite dès 300 DH
          </span>

          <span>
            🛡️ Produits authentiques
          </span>

          <span>
            🎧 Service client 7j/7
          </span>

        </div>

        {/* HEADER */}

        <header className="client-header">

          <div className="client-logo">
            <strong>OSRAH</strong>
            <span>Cosmétiques</span>
          </div>

          <div className="client-search">

            <input
              type="text"
              placeholder="Qu'est-ce que tu cherches ?"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            <span>🔍</span>

          </div>

          <div className="client-icons">

            <div className="header-icon">
              📍
              <small>Livraison</small>
            </div>

            <button
              className="header-icon"
              onClick={() =>
                alert(
                  `Connecté avec : ${clientEmail}`
                )
              }
            >
              👤
              <small>Mon compte</small>
            </button>

            <button
              className="header-cart"
              onClick={() =>
                document
                  .getElementById("cart-section")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
            >
              🛒

              {cart.length > 0 && (
                <b>{cart.length}</b>
              )}
            </button>

            <button
              className="logout-btn"
              onClick={logoutClient}
            >
              Déconnexion
            </button>

          </div>

        </header>

        {/* NAVIGATION */}

        <nav className="client-nav">

          <button>SOINS VISAGE</button>
          <button>CHEVEUX</button>
          <button>CORPS ET DOUCHE</button>
          <button>PARFUM & SENTEURS</button>
          <button>COFFRETS</button>
          <button>HOMME</button>
          <button>PROMOTION</button>

        </nav>

        {/* HERO */}

        <section className="client-hero">

          <div className="hero-text">

            <p>OSRAH COSMÉTIQUES</p>

            <h1>
              Votre beauté,
              <br />
              notre passion
            </h1>

            <span>
              Découvrez notre sélection
              de soins beauté
            </span>

            <button
              onClick={() =>
                document
                  .getElementById("products-section")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
            >
              DÉCOUVRIR NOS PRODUITS
            </button>

          </div>

          <div className="hero-decoration">
            🌸
          </div>

        </section>

        {/* SERVICES */}

        <section className="client-services">

          <div>
            <span>🌿</span>
            <div>
              <strong>Qualité</strong>
              <p>Des produits sélectionnés</p>
            </div>
          </div>

          <div>
            <span>🚚</span>
            <div>
              <strong>Livraison rapide</strong>
              <p>Partout au Maroc</p>
            </div>
          </div>

          <div>
            <span>🔒</span>
            <div>
              <strong>Paiement sécurisé</strong>
              <p>Achat en toute confiance</p>
            </div>
          </div>

          <div>
            <span>💗</span>
            <div>
              <strong>Service client</strong>
              <p>Nous sommes à votre écoute</p>
            </div>
          </div>

        </section>

        {/* PRODUCTS */}

        <section
          className="client-products-section"
          id="products-section"
        >

          <div className="section-heading">

            <div>
              <p>NOS COLLECTIONS</p>

              <h2>
                Découvrez nos produits
              </h2>

              <span>
                Des soins adaptés à vos besoins
              </span>
            </div>

            <select>
              <option>
                Trier par : Nouveautés
              </option>

              <option>
                Prix croissant
              </option>

              <option>
                Prix décroissant
              </option>
            </select>

          </div>

          <div className="category-buttons">

            <button>Tous</button>
            <button>Soin visage</button>
            <button>Cheveux</button>
            <button>Corps et douche</button>
            <button>Coffrets</button>

          </div>

          <div className="client-products-grid">

            {filteredProducts.map((product) => (

              <div
                className="client-product-card"
                key={product.id}
              >

                <div className="client-product-image">

                  <img
                    src={product.image}
                    alt={product.name}
                  />

                  {product.stock < 5 &&
                    product.stock > 0 && (
                      <span className="product-badge">
                        Dernières pièces
                      </span>
                    )}

                  {product.stock === 0 && (
                    <span className="product-badge out">
                      Rupture
                    </span>
                  )}

                </div>

                <div className="client-product-info">

                  <span className="product-category">
                    {product.category}
                  </span>

                  <h3>
                    {product.name}
                  </h3>

                  <p className="product-description">
                    {product.description}
                  </p>

                  <div className="product-bottom">

                    <strong>
                      {product.price.toFixed(2)} DH
                    </strong>

                    {product.stock > 0 ? (
                      <span className="in-stock">
                        ✓ En stock
                      </span>
                    ) : (
                      <span className="out-stock">
                        ✕ Rupture
                      </span>
                    )}

                  </div>

                  <button
                    className="client-add-cart"
                    disabled={product.stock === 0}
                    onClick={() =>
                      addToCart(product)
                    }
                  >
                    🛒 Ajouter au panier
                  </button>

                </div>

              </div>

            ))}

          </div>

          {filteredProducts.length === 0 && (
            <div className="no-products">
              <h3>
                Aucun produit trouvé
              </h3>

              <p>
                Essayez une autre recherche.
              </p>
            </div>
          )}

        </section>

        {/* CART */}

        <section
          className="cart-section"
          id="cart-section"
        >

          <div className="cart-title">

            <div>
              <p>VOTRE SÉLECTION</p>

              <h2>
                🛒 Votre panier
              </h2>
            </div>

            <strong>
              {cart.length} article(s)
            </strong>

          </div>

          {cart.length === 0 ? (

            <div className="empty-cart">
              <div>🛒</div>

              <h3>
                Votre panier est vide
              </h3>

              <p>
                Ajoutez vos produits préférés
                pour commencer votre commande.
              </p>
            </div>

          ) : (

            <div className="cart-content">

              <div className="cart-items">

                {cart.map((product, index) => (

                  <div
                    className="cart-item"
                    key={`${product.id}-${index}`}
                  >

                    <img
                      src={product.image}
                      alt={product.name}
                    />

                    <div className="cart-item-info">

                      <h3>
                        {product.name}
                      </h3>

                      <p>
                        {product.description}
                      </p>

                      <strong>
                        {product.price.toFixed(2)} DH
                      </strong>

                    </div>

                    <button
                      onClick={() =>
                        removeFromCart(index)
                      }
                    >
                      ✕
                    </button>

                  </div>

                ))}

              </div>

              <div className="cart-summary">

                <h3>
                  Résumé
                </h3>

                <div>
                  <span>
                    Sous-total
                  </span>

                  <strong>
                    {cartTotal.toFixed(2)} DH
                  </strong>
                </div>

                <div>
                  <span>
                    Livraison
                  </span>

                  <strong>
                    {cartTotal >= 300
                      ? "Gratuite"
                      : "30 DH"}
                  </strong>
                </div>

                <hr />

                <div className="cart-final-total">
                  <span>
                    Total
                  </span>

                  <strong>
                    {(
                      cartTotal +
                      (cartTotal >= 300 ? 0 : 30)
                    ).toFixed(2)}{" "}
                    DH
                  </strong>
                </div>

                <button
                  onClick={() =>
                    alert(
                      "Votre commande a été enregistrée !"
                    )
                  }
                >
                  PASSER LA COMMANDE
                </button>

              </div>

            </div>

          )}

        </section>

        {/* NEWSLETTER */}

        <section className="client-newsletter">

          <div>

            <p>
              RESTEZ INFORMÉE
            </p>

            <h2>
              Recevez nos nouveautés
            </h2>

            <span>
              Inscrivez-vous pour recevoir
              nos offres exclusives.
            </span>

          </div>

          <div className="newsletter-form">

            <input
              type="email"
              placeholder="Votre adresse email"
            />

            <button>
              S'INSCRIRE
            </button>

          </div>

        </section>

        {/* FOOTER */}

        <footer className="client-footer">

          <div className="footer-logo">

            <strong>
              OSRAH
            </strong>

            <span>
              Cosmétiques
            </span>

            <p>
              Votre beauté, notre passion.
            </p>

          </div>

          <div>
            <h3>
              Catégories
            </h3>

            <p>Soin visage</p>
            <p>Cheveux</p>
            <p>Corps et douche</p>
            <p>Parfum</p>
          </div>

          <div>
            <h3>
              Informations
            </h3>

            <p>À propos</p>
            <p>Livraison</p>
            <p>Contact</p>
            <p>Conditions</p>
          </div>

          <div>
            <h3>
              Contact
            </h3>

            <p>📞 +212 5 22 00 00 00</p>
            <p>✉️ contact@osrah.ma</p>
            <p>📍 Casablanca, Maroc</p>
          </div>

        </footer>

      </div>
    );
  }

  /* =========================
     ADMIN AREA
  ========================= */

  return (
    <div className="admin-app">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="admin-logo">
          <strong>OSRAH</strong>
          <span>Cosmétiques</span>
        </div>

        <div className="admin-menu">

          <button
            className={
              page === "dashboard"
                ? "active"
                : ""
            }
            onClick={() =>
              setPage("dashboard")
            }
          >
            🏠 Dashboard
          </button>

          <button
            className={
              page === "products"
                ? "active"
                : ""
            }
            onClick={() =>
              setPage("products")
            }
          >
            🧴 Produits
          </button>

          <button
            onClick={() =>
              setPage("add-product")
            }
          >
            ➕ Ajouter produit
          </button>

          <button
            className={
              page === "orders"
                ? "active"
                : ""
            }
            onClick={() =>
              setPage("orders")
            }
          >
            📦 Commandes
          </button>

          <button
            onClick={() =>
              setPage("add-order")
            }
          >
            ➕ Ajouter commande
          </button>

          <button
            onClick={() =>
              setPage("clients")
            }
          >
            👥 Clients
          </button>

          <button
            onClick={() =>
              setPage("stats")
            }
          >
            📊 Statistiques
          </button>

        </div>

        <div className="client-access">

          <button
            onClick={() =>
              setPage("client-login")
            }
          >
            👤 ESPACE CLIENT
          </button>

        </div>

      </aside>

      {/* ADMIN CONTENT */}

      <main className="admin-content">

        {/* DASHBOARD */}

        {page === "dashboard" && (

          <div>

            <div className="admin-header">

              <div>
                <h1>
                  Dashboard
                </h1>

                <p>
                  Bienvenue dans votre espace
                  de gestion Osrah Cosmétiques.
                </p>
              </div>

              <button
                className="open-client"
                onClick={() =>
                  setPage("client-login")
                }
              >
                👤 Voir espace client
              </button>

            </div>

            <div className="stats-grid">

              <div className="stat-card">
                <span>🧴</span>

                <div>
                  <p>Produits</p>
                  <h2>
                    {products.length}
                  </h2>
                </div>
              </div>

              <div className="stat-card">
                <span>📦</span>

                <div>
                  <p>Commandes</p>
                  <h2>
                    {orders.length}
                  </h2>
                </div>
              </div>

              <div className="stat-card">
                <span>💰</span>

                <div>
                  <p>Chiffre d'affaires</p>
                  <h2>
                    {orders
                      .reduce(
                        (sum, order) =>
                          sum + order.total,
                        0
                      )
                      .toFixed(0)}{" "}
                    DH
                  </h2>
                </div>
              </div>

              <div className="stat-card">
                <span>👥</span>

                <div>
                  <p>Clients</p>
                  <h2>
                    24
                  </h2>
                </div>
              </div>

            </div>

            <div className="dashboard-card">

              <h2>
                Dernières commandes
              </h2>

              {orders.slice(0, 5).map(
                (order) => (

                  <div
                    className="dashboard-order"
                    key={order.id}
                  >

                    <div>
                      <strong>
                        CMD00{order.id}
                      </strong>

                      <span>
                        {order.client}
                      </span>
                    </div>

                    <div>
                      {order.product}
                    </div>

                    <strong>
                      {order.total} DH
                    </strong>

                    <span className="status">
                      {order.status}
                    </span>

                  </div>

                )
              )}

            </div>

          </div>

        )}

        {/* PRODUCTS ADMIN */}

        {page === "products" && (

          <div>

            <div className="admin-header">

              <div>
                <h1>
                  Gestion des produits
                </h1>

                <p>
                  Gérez les produits visibles
                  dans votre espace client.
                </p>
              </div>

              <button
                className="primary-btn"
                onClick={() =>
                  setPage("add-product")
                }
              >
                + Ajouter produit
              </button>

            </div>

            <div className="admin-products-grid">

              {products.map((product) => (

                <div
                  className="admin-product-card"
                  key={product.id}
                >

                  <img
                    src={product.image}
                    alt={product.name}
                  />

                  <div>

                    <span>
                      {product.category}
                    </span>

                    <h3>
                      {product.name}
                    </h3>

                    <p>
                      {product.description}
                    </p>

                    <strong>
                      {product.price.toFixed(2)} DH
                    </strong>

                    <small>
                      Stock : {product.stock}
                    </small>

                  </div>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteProduct(product.id)
                    }
                  >
                    Supprimer
                  </button>

                </div>

              ))}

            </div>

          </div>

        )}

        {/* ADD PRODUCT */}

        {page === "add-product" && (

          <div>

            <div className="admin-header">

              <div>
                <h1>
                  Ajouter un produit
                </h1>

                <p>
                  Le produit sera également
                  visible dans l'espace client.
                </p>
              </div>

            </div>

            <form
              className="admin-form"
              onSubmit={addProduct}
            >

              <label>
                Nom du produit
              </label>

              <input
                type="text"
                placeholder="Ex: Crème hydratante"
                value={productName}
                onChange={(e) =>
                  setProductName(e.target.value)
                }
              />

              <label>
                Description
              </label>

              <textarea
                placeholder="Décrivez le produit..."
                value={productDescription}
                onChange={(e) =>
                  setProductDescription(
                    e.target.value
                  )
                }
              />

              <label>
                Catégorie
              </label>

              <select
                value={productCategory}
                onChange={(e) =>
                  setProductCategory(
                    e.target.value
                  )
                }
              >
                <option>
                  Soin visage
                </option>

                <option>
                  Cheveux
                </option>

                <option>
                  Corps et douche
                </option>

                <option>
                  Parfum & senteurs
                </option>

                <option>
                  Coffrets
                </option>

                <option>
                  Homme
                </option>

                <option>
                  Promotion
                </option>
              </select>

              <label>
                Prix (DH)
              </label>

              <input
                type="number"
                placeholder="Ex: 99"
                value={productPrice}
                onChange={(e) =>
                  setProductPrice(
                    e.target.value
                  )
                }
              />

              <label>
                Stock
              </label>

              <input
                type="number"
                placeholder="Ex: 20"
                value={productStock}
                onChange={(e) =>
                  setProductStock(
                    e.target.value
                  )
                }
              />

              <label>
                Photo du produit
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />

              {productImage && (
                <div className="image-preview">
                  <img
                    src={productImage}
                    alt="Aperçu"
                  />
                </div>
              )}

              <button
                type="submit"
                className="primary-btn"
              >
                AJOUTER LE PRODUIT
              </button>

            </form>

          </div>

        )}

        {/* ORDERS */}

        {page === "orders" && (

          <div>

            <div className="admin-header">

              <div>
                <h1>
                  Commandes
                </h1>

                <p>
                  Gestion de toutes les commandes.
                </p>
              </div>

              <button
                className="primary-btn"
                onClick={() =>
                  setPage("add-order")
                }
              >
                + Nouvelle commande
              </button>

            </div>

            <div className="orders-table">

              <div className="table-head">
                <span>ID</span>
                <span>Client</span>
                <span>Produit</span>
                <span>Quantité</span>
                <span>Total</span>
                <span>Statut</span>
                <span>Action</span>
              </div>

              {orders.map((order) => (

                <div
                  className="table-row"
                  key={order.id}
                >

                  <span>
                    CMD00{order.id}
                  </span>

                  <span>
                    {order.client}
                  </span>

                  <span>
                    {order.product}
                  </span>

                  <span>
                    {order.quantity}
                  </span>

                  <span>
                    {order.total} DH
                  </span>

                  <span className="status">
                    {order.status}
                  </span>

                  <button
                    className="delete-small"
                    onClick={() =>
                      deleteOrder(order.id)
                    }
                  >
                    ✕
                  </button>

                </div>

              ))}

            </div>

          </div>

        )}

        {/* ADD ORDER */}

        {page === "add-order" && (

          <div>

            <div className="admin-header">

              <div>
                <h1>
                  Ajouter une commande
                </h1>
              </div>

            </div>

            <form
              className="admin-form"
              onSubmit={addOrder}
            >

              <label>
                Nom du client
              </label>

              <input
                type="text"
                placeholder="Nom du client"
                value={orderClient}
                onChange={(e) =>
                  setOrderClient(
                    e.target.value
                  )
                }
              />

              <label>
                Produit
              </label>

              <select
                value={orderProduct}
                onChange={(e) =>
                  setOrderProduct(
                    e.target.value
                  )
                }
              >

                <option value="">
                  Sélectionner un produit
                </option>

                {products.map((product) => (

                  <option
                    key={product.id}
                    value={product.name}
                  >
                    {product.name}
                  </option>

                ))}

              </select>

              <label>
                Quantité
              </label>

              <input
                type="number"
                min="1"
                value={orderQuantity}
                onChange={(e) =>
                  setOrderQuantity(
                    e.target.value
                  )
                }
              />

              <button
                type="submit"
                className="primary-btn"
              >
                AJOUTER LA COMMANDE
              </button>

            </form>

          </div>

        )}

        {/* CLIENTS */}

        {page === "clients" && (

          <div>

            <div className="admin-header">

              <div>
                <h1>
                  Clients
                </h1>

                <p>
                  Gestion de votre clientèle.
                </p>
              </div>

            </div>

            <div className="clients-card">

              <div>
                <strong>
                  Sara Amrani
                </strong>

                <span>
                  sara@gmail.com
                </span>
              </div>

              <div>
                <strong>
                  5 commandes
                </strong>
              </div>

            </div>

            <div className="clients-card">

              <div>
                <strong>
                  Aya Benali
                </strong>

                <span>
                  aya@gmail.com
                </span>
              </div>

              <div>
                <strong>
                  3 commandes
                </strong>
              </div>

            </div>

            <div className="clients-card">

              <div>
                <strong>
                  Imane Alaoui
                </strong>

                <span>
                  imane@gmail.com
                </span>
              </div>

              <div>
                <strong>
                  7 commandes
                </strong>
              </div>

            </div>

          </div>

        )}

        {/* STATISTICS */}

        {page === "stats" && (

          <div>

            <div className="admin-header">

              <div>
                <h1>
                  Statistiques
                </h1>

                <p>
                  Vue globale de votre activité.
                </p>
              </div>

            </div>

            <div className="stats-grid">

              <div className="stat-card">
                <span>📦</span>

                <div>
                  <p>
                    Commandes
                  </p>

                  <h2>
                    {orders.length}
                  </h2>
                </div>
              </div>

              <div className="stat-card">
                <span>🧴</span>

                <div>
                  <p>
                    Produits
                  </p>

                  <h2>
                    {products.length}
                  </h2>
                </div>
              </div>

              <div className="stat-card">
                <span>💰</span>

                <div>
                  <p>
                    Revenus
                  </p>

                  <h2>
                    {orders
                      .reduce(
                        (sum, order) =>
                          sum + order.total,
                        0
                      )
                      .toFixed(2)}{" "}
                    DH
                  </h2>
                </div>
              </div>

            </div>

          </div>

        )}

      </main>

    </div>
  );
}

export default App;