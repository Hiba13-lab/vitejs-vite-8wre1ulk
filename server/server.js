import express from "express";
import cors from "cors";
import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "osrah.db");
const db = new DatabaseSync(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    price REAL NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    category TEXT DEFAULT '',
    image_url TEXT DEFAULT '',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

console.log(`SQLite database ready: ${dbPath}`);

app.get("/", (req, res) => {
  res.json({
    message: "OSRAH COSMETIQUES Backend is running 🚀",
    database: "SQLite connected ✅",
  });
});

app.get("/api/products", (req, res) => {
  try {
    const products = db.prepare("SELECT * FROM products ORDER BY id DESC").all();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de récupération des produits", error: error.message });
  }
});

app.get("/api/products/:id", (req, res) => {
  try {
    const product = db.prepare("SELECT * FROM products WHERE id = ?").get(req.params.id);
    if (!product) return res.status(404).json({ message: "Produit introuvable" });
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de récupération du produit", error: error.message });
  }
});

app.post("/api/products", (req, res) => {
  try {
    const { name, description = "", price, stock = 0, category = "", image_url = "" } = req.body;

    if (!name || price === undefined || price === null || price === "") {
      return res.status(400).json({ message: "Le nom et le prix sont obligatoires" });
    }

    const numericPrice = Number(price);
    const numericStock = Number(stock);

    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({ message: "Prix invalide" });
    }
    if (!Number.isInteger(numericStock) || numericStock < 0) {
      return res.status(400).json({ message: "Stock invalide" });
    }

    const result = db.prepare(`
      INSERT INTO products (name, description, price, stock, category, image_url)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(name.trim(), description, numericPrice, numericStock, category, image_url);

    const product = db.prepare("SELECT * FROM products WHERE id = ?").get(result.lastInsertRowid);
    res.status(201).json({ message: "Produit ajouté avec succès ✅", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l'ajout du produit", error: error.message });
  }
});

app.put("/api/products/:id", (req, res) => {
  try {
    const { name, description = "", price, stock = 0, category = "", image_url = "" } = req.body;

    if (!name || price === undefined || price === null || price === "") {
      return res.status(400).json({ message: "Le nom et le prix sont obligatoires" });
    }

    const numericPrice = Number(price);
    const numericStock = Number(stock);

    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({ message: "Prix invalide" });
    }
    if (!Number.isInteger(numericStock) || numericStock < 0) {
      return res.status(400).json({ message: "Stock invalide" });
    }

    const result = db.prepare(`
      UPDATE products
      SET name = ?, description = ?, price = ?, stock = ?, category = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(name.trim(), description, numericPrice, numericStock, category, image_url, req.params.id);

    if (result.changes === 0) return res.status(404).json({ message: "Produit introuvable" });

    const product = db.prepare("SELECT * FROM products WHERE id = ?").get(req.params.id);
    res.json({ message: "Produit modifié avec succès ✅", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la modification du produit", error: error.message });
  }
});

app.delete("/api/products/:id", (req, res) => {
  try {
    const result = db.prepare("DELETE FROM products WHERE id = ?").run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ message: "Produit introuvable" });
    res.json({ message: "Produit supprimé avec succès ✅" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la suppression du produit", error: error.message });
  }
});

const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
