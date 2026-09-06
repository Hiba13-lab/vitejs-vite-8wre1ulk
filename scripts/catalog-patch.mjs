import fs from "node:fs";

const appPath = new URL("../src/App.tsx", import.meta.url);
let code = fs.readFileSync(appPath, "utf8");

if (!code.includes('import "./catalog.css";')) {
  code = code.replace('import "./premium.css";', 'import "./premium.css";\nimport "./catalog.css";');
}

if (!code.includes('const [selectedCategory, setSelectedCategory]')) {
  code = code.replace(
    '  const [search, setSearch] = useState("");',
    `  const [search, setSearch] = useState("");\n  const [selectedCategory, setSelectedCategory] = useState("Tous");\n  const [sortBy, setSortBy] = useState("best");\n  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");\n\n  const goToCategory = (category: string) => {\n    setSelectedCategory(category);\n    setTimeout(() => {\n      document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth", block: "start" });\n    }, 50);\n  };`
  );
}

code = code.replace(
  /const filteredProducts = products\.filter\(\(product\) =>[\s\S]*?\);\n\n    const cartTotal/,
  `const filteredProducts = products\n      .filter((product) =>\n        product.name.toLowerCase().includes(search.toLowerCase())\n      )\n      .filter((product) =>\n        selectedCategory === "Tous" || product.category === selectedCategory\n      )\n      .sort((a, b) => {\n        if (sortBy === "price-asc") return a.price - b.price;\n        if (sortBy === "price-desc") return b.price - a.price;\n        if (sortBy === "name") return a.name.localeCompare(b.name);\n        return b.id - a.id;\n      });\n\n    const cartTotal`
);

const oldNav = `<nav className="client-nav">\n\n          <button>SOINS VISAGE</button>\n          <button>CHEVEUX</button>\n          <button>CORPS ET DOUCHE</button>\n          <button>PARFUM & SENTEURS</button>\n          <button>COFFRETS</button>\n          <button>HOMME</button>\n          <button>PROMOTION</button>\n\n        </nav>`;

const newNav = `<nav className="client-nav">\n          <button onClick={() => goToCategory("Soin visage")}>SOINS VISAGE</button>\n          <button onClick={() => goToCategory("Cheveux")}>CHEVEUX</button>\n          <button onClick={() => goToCategory("Corps et douche")}>CORPS ET DOUCHE</button>\n          <button onClick={() => goToCategory("Parfum & senteurs")}>PARFUM & SENTEURS</button>\n          <button onClick={() => goToCategory("Coffrets")}>COFFRETS</button>\n          <button onClick={() => goToCategory("Homme")}>HOMME</button>\n          <button onClick={() => goToCategory("Promotion")}>PROMOTION</button>\n        </nav>`;

code = code.replace(oldNav, newNav);

if (!code.includes('className="catalog-toolbar"')) {
  code = code.replace(
    '          <div className="client-products-grid">',
    `          <div className="catalog-toolbar">\n            <div className="catalog-toolbar-left">\n              <button className="filter-pill">⌄ <span>Filtre</span></button>\n              <strong>{filteredProducts.length} produits</strong>\n            </div>\n\n            <div className="catalog-toolbar-center">\n              <span>Comparer:</span>\n              <button className="compare-toggle" aria-label="Comparer"><span /></button>\n            </div>\n\n            <div className="catalog-toolbar-right">\n              <label>Trier par:</label>\n              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>\n                <option value="best">Meilleures ventes</option>\n                <option value="price-asc">Prix croissant</option>\n                <option value="price-desc">Prix décroissant</option>\n                <option value="name">Nom A-Z</option>\n              </select>\n              <span>Afficher comme:</span>\n              <button className={viewMode === "grid" ? "view-button active" : "view-button"} onClick={() => setViewMode("grid")}>▦</button>\n              <button className={viewMode === "list" ? "view-button active" : "view-button"} onClick={() => setViewMode("list")}>☷</button>\n            </div>\n          </div>\n\n          <div className="catalog-current-category">\n            <span>CATÉGORIE</span>\n            <h2>{selectedCategory === "Tous" ? "Tous nos produits" : selectedCategory}</h2>\n            <button onClick={() => setSelectedCategory("Tous")}>Voir tout</button>\n          </div>\n\n          <div className={viewMode === "list" ? "client-products-grid catalog-list" : "client-products-grid"}>`
  );
}

code = code.replace(
  `<div className="category-buttons">\n\n            <button>Tous</button>\n            <button>Soin visage</button>\n            <button>Cheveux</button>\n            <button>Corps et douche</button>\n            <button>Coffrets</button>\n\n          </div>`,
  `<div className="category-buttons">\n            <button onClick={() => goToCategory("Tous")}>Tous</button>\n            <button onClick={() => goToCategory("Soin visage")}>Soin visage</button>\n            <button onClick={() => goToCategory("Cheveux")}>Cheveux</button>\n            <button onClick={() => goToCategory("Corps et douche")}>Corps et douche</button>\n            <button onClick={() => goToCategory("Coffrets")}>Coffrets</button>\n          </div>`
);

fs.writeFileSync(appPath, code, "utf8");
console.log("Category catalog page applied");
