import express from "express";
import cors from "cors";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "products.json");

function readProducts() {
  try {
    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, "[]", "utf-8");
    }
    const raw = fs.readFileSync(dbPath, "utf-8");
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("Erreur lecture products.json:", error.message);
    return [];
  }
}

function writeProducts(products) {
  fs.writeFileSync(dbPath, JSON.stringify(products, null, 2), "utf-8");
}

console.log(`Base locale prête: ${dbPath}`);

app.get("/", (req, res) => {
  res.json({
    message: "OSRAH COSMETIQUES Backend is running 🚀",
    database: "Local JSON storage connected ✅",
  });
});

app.get("/api/products", (req, res) => {
  const products = readProducts().sort((a, b) => b.id - a.id);
  res.json(products);
});

app.get("/api/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const product = readProducts().find((p) => p.id === id);
  if (!product) return res.status(404).json({ message: "Produit introuvable" });
  res.json(product);
});

app.post("/api/products", (req, res) => {
  const {
    name,
    description = "",
    price,
    stock = 0,
    category = "",
    image_url = "",
  } = req.body;

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

  const products = readProducts();
  const nextId = products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1;
  const now = new Date().toISOString();

  const product = {
    id: nextId,
    name: name.trim(),
    description,
    price: numericPrice,
    stock: numericStock,
    category,
    image_url,
    created_at: now,
    updated_at: now,
  };

  products.push(product);
  writeProducts(products);

  res.status(201).json({ message: "Produit ajouté avec succès ✅", product });
});

app.put("/api/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const products = readProducts();
  const index = products.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Produit introuvable" });
  }

  const {
    name,
    description = "",
    price,
    stock = 0,
    category = "",
    image_url = "",
  } = req.body;

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

  products[index] = {
    ...products[index],
    name: name.trim(),
    description,
    price: numericPrice,
    stock: numericStock,
    category,
    image_url,
    updated_at: new Date().toISOString(),
  };

  writeProducts(products);
  res.json({ message: "Produit modifié avec succès ✅", product: products[index] });
});

app.delete("/api/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const products = readProducts();
  const filtered = products.filter((p) => p.id !== id);

  if (filtered.length === products.length) {
    return res.status(404).json({ message: "Produit introuvable" });
  }

  writeProducts(filtered);
  res.json({ message: "Produit supprimé avec succès ✅" });
});

const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
