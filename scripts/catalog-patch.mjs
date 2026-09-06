import fs from "node:fs";

const appPath = new URL("../src/App.tsx", import.meta.url);
let code = fs.readFileSync(appPath, "utf8");

if (!code.includes('import "./catalog.css";')) {
  code = code.replace('import "./premium.css";', 'import "./premium.css";\nimport "./catalog.css";');
}

// The premium patch can already add selectedCategory/goToCategory.
// Add each missing catalog state independently so the page never crashes.
if (!code.includes('const [selectedCategory, setSelectedCategory]')) {
  code = code.replace(
    '  const [search, setSearch] = useState("");',
    '  const [search, setSearch] = useState("");\n  const [selectedCategory, setSelectedCategory] = useState("Tous");'
  );
}

if (!code.includes('const [sortBy, setSortBy]')) {
  const anchor = '  const [selectedCategory, setSelectedCategory] = useState("Tous");';
  code = code.replace(
    anchor,
    `${anchor}\n  const [sortBy, setSortBy] = useState("best");`
  );
}

if (!code.includes('const [viewMode, setViewMode]')) {
  const anchor = '  const [sortBy, setSortBy] = useState("best");';
  code = code.replace(
    anchor,
    `${anchor}\n  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");`
  );
}

if (!code.includes('const goToCategory = (category: string)')) {
  const anchor = '  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");';
  code = code.replace(
    anchor,
    `${anchor}\n\n  const goToCategory = (category: string) => {\n    setSelectedCategory(category);\n    setTimeout(() => {\n      document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth", block: "start" });\n    }, 50);\n  };`
  );
}

// Replace the product filtering with a stable search + category + sorting pipeline.
code = code.replace(
  /const filteredProducts = products(?:\n|\r\n)[\s\S]*?;\n\n    const cartTotal/,
  `const filteredProducts = products\n      .filter((product) => product.name.toLowerCase().includes(search.toLowerCase()))\n      .filter((product) => selectedCategory === "Tous" || product.category === selectedCategory)\n      .sort((a, b) => {\n        if (sortBy === "price-asc") return a.price - b.price;\n        if (sortBy === "price-desc") return b.price - a.price;\n        if (sortBy === "name") return a.name.localeCompare(b.name);\n        return b.id - a.id;\n      });\n\n    const cartTotal`
);

// If the filter is still the old simple version, replace that too.
code = code.replace(
  /const filteredProducts = products\.filter\(\(product\) =>[\s\S]*?\n\s*\);\n\n    const cartTotal/,
  `const filteredProducts = products\n      .filter((product) => product.name.toLowerCase().includes(search.toLowerCase()))\n      .filter((product) => selectedCategory === "Tous" || product.category === selectedCategory)\n      .sort((a, b) => {\n        if (sortBy === "price-asc") return a.price - b.price;\n        if (sortBy === "price-desc") return b.price - a.price;\n        if (sortBy === "name") return a.name.localeCompare(b.name);\n        return b.id - a.id;\n      });\n\n    const cartTotal`
);

// Ensure category navigation is functional.
code = code.replace(
  /<nav className="client-nav">[\s\S]*?<\/nav>/,
  `<nav className="client-nav">\n          <button className={selectedCategory === "Soin visage" ? "nav-active" : ""} onClick={() => goToCategory("Soin visage")}>SOINS VISAGE</button>\n          <button className={selectedCategory === "Cheveux" ? "nav-active" : ""} onClick={() => goToCategory("Cheveux")}>CHEVEUX</button>\n          <button className={selectedCategory === "Corps et douche" ? "nav-active" : ""} onClick={() => goToCategory("Corps et douche")}>CORPS ET DOUCHE</button>\n          <button className={selectedCategory === "Parfum & senteurs" ? "nav-active" : ""} onClick={() => goToCategory("Parfum & senteurs")}>PARFUM & SENTEURS</button>\n          <button className={selectedCategory === "Coffrets" ? "nav-active" : ""} onClick={() => goToCategory("Coffrets")}>COFFRETS</button>\n          <button className={selectedCategory === "Homme" ? "nav-active" : ""} onClick={() => goToCategory("Homme")}>HOMME</button>\n          <button className={selectedCategory === "Promotion" ? "nav-active" : ""} onClick={() => goToCategory("Promotion")}>PROMOTION</button>\n        </nav>`
);

if (!code.includes('className="catalog-toolbar"')) {
  code = code.replace(
    '          <div className="client-products-grid">',
    `          <div className="catalog-toolbar">\n            <div className="catalog-toolbar-left">\n              <button className="filter-pill"><span>Filtre</span></button>\n              <strong>{filteredProducts.length} produits</strong>\n            </div>\n\n            <div className="catalog-toolbar-center">\n              <span>Comparer:</span>\n              <button className="compare-toggle" aria-label="Comparer"><span /></button>\n            </div>\n\n            <div className="catalog-toolbar-right">\n              <label>Trier par:</label>\n              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>\n                <option value="best">Meilleures ventes</option>\n                <option value="price-asc">Prix croissant</option>\n                <option value="price-desc">Prix décroissant</option>\n                <option value="name">Nom A-Z</option>\n              </select>\n              <span>Afficher comme:</span>\n              <button className={viewMode === "grid" ? "view-button active" : "view-button"} onClick={() => setViewMode("grid")}>▦</button>\n              <button className={viewMode === "list" ? "view-button active" : "view-button"} onClick={() => setViewMode("list")}>☷</button>\n            </div>\n          </div>\n\n          <div className="catalog-current-category">\n            <span>CATÉGORIE</span>\n            <h2>{selectedCategory === "Tous" ? "Tous nos produits" : selectedCategory}</h2>\n            <button onClick={() => setSelectedCategory("Tous")}>Voir tout</button>\n          </div>\n\n          <div className={viewMode === "list" ? "client-products-grid catalog-list" : "client-products-grid"}>`
  );
}

code = code.replace(
  /<div className="category-buttons">[\s\S]*?<\/div>/,
  `<div className="category-buttons">\n            {["Tous", "Soin visage", "Cheveux", "Corps et douche", "Parfum & senteurs", "Coffrets", "Homme", "Promotion"].map((category) => (\n              <button\n                key={category}\n                className={selectedCategory === category ? "active-category" : ""}\n                onClick={() => setSelectedCategory(category)}\n              >\n                {category}\n              </button>\n            ))}\n          </div>`
);

fs.writeFileSync(appPath, code, "utf8");
console.log("Category catalog page fixed and applied");
