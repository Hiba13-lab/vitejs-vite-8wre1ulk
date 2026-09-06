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
const productsPath = path.join(__dirname, "products.json");
const ordersPath = path.join(__dirname, "orders.json");

function readJson(filePath) {
  try {
    if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, "[]", "utf-8");
    const raw = fs.readFileSync(filePath, "utf-8");
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error(`Erreur lecture ${path.basename(filePath)}:`, error.message);
    return [];
  }
}
function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}
const readProducts = () => readJson(productsPath);
const writeProducts = (data) => writeJson(productsPath, data);
const readOrders = () => readJson(ordersPath);
const writeOrders = (data) => writeJson(ordersPath, data);

console.log(`Base locale produits prête: ${productsPath}`);
console.log(`Base locale commandes prête: ${ordersPath}`);

app.get("/", (req, res) => {
  res.json({ message: "OSRAH COSMETIQUES Backend is running 🚀", database: "Local JSON storage connected ✅" });
});

app.get("/api/products", (req, res) => {
  res.json(readProducts().sort((a, b) => b.id - a.id));
});
app.get("/api/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const product = readProducts().find((p) => p.id === id);
  if (!product) return res.status(404).json({ message: "Produit introuvable" });
  res.json(product);
});
app.post("/api/products", (req, res) => {
  const { name, description = "", price, stock = 0, category = "", image_url = "" } = req.body;
  if (!name || price === undefined || price === null || price === "") return res.status(400).json({ message: "Le nom et le prix sont obligatoires" });
  const numericPrice = Number(price), numericStock = Number(stock);
  if (Number.isNaN(numericPrice) || numericPrice < 0) return res.status(400).json({ message: "Prix invalide" });
  if (!Number.isInteger(numericStock) || numericStock < 0) return res.status(400).json({ message: "Stock invalide" });
  const products = readProducts();
  const nextId = products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1;
  const now = new Date().toISOString();
  const product = { id: nextId, name: name.trim(), description, price: numericPrice, stock: numericStock, category, image_url, created_at: now, updated_at: now };
  products.push(product); writeProducts(products);
  res.status(201).json({ message: "Produit ajouté avec succès ✅", product });
});
app.put("/api/products/:id", (req, res) => {
  const id = Number(req.params.id), products = readProducts(), index = products.findIndex((p) => p.id === id);
  if (index === -1) return res.status(404).json({ message: "Produit introuvable" });
  const { name, description = "", price, stock = 0, category = "", image_url = "" } = req.body;
  if (!name || price === undefined || price === null || price === "") return res.status(400).json({ message: "Le nom et le prix sont obligatoires" });
  const numericPrice = Number(price), numericStock = Number(stock);
  if (Number.isNaN(numericPrice) || numericPrice < 0) return res.status(400).json({ message: "Prix invalide" });
  if (!Number.isInteger(numericStock) || numericStock < 0) return res.status(400).json({ message: "Stock invalide" });
  products[index] = { ...products[index], name: name.trim(), description, price: numericPrice, stock: numericStock, category, image_url, updated_at: new Date().toISOString() };
  writeProducts(products); res.json({ message: "Produit modifié avec succès ✅", product: products[index] });
});
app.delete("/api/products/:id", (req, res) => {
  const id = Number(req.params.id), products = readProducts(), filtered = products.filter((p) => p.id !== id);
  if (filtered.length === products.length) return res.status(404).json({ message: "Produit introuvable" });
  writeProducts(filtered); res.json({ message: "Produit supprimé avec succès ✅" });
});

app.get("/api/orders", (req, res) => {
  res.json(readOrders().sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
});
app.post("/api/orders", (req, res) => {
  const { customer = {}, items = [], payment_method = "", subtotal = 0, shipping = 0, total = 0 } = req.body;
  if (!Array.isArray(items) || !items.length) return res.status(400).json({ message: "La commande doit contenir au moins un produit" });
  const orders = readOrders();
  const nextId = orders.length ? Math.max(...orders.map((o) => Number(o.id) || 0)) + 1 : 1001;
  const order = {
    id: nextId,
    reference: `OSR-${nextId}`,
    customer: {
      name: String(customer.name || "Client OSRAH"),
      phone: String(customer.phone || ""),
      address: String(customer.address || ""),
      city: String(customer.city || ""),
      email: String(customer.email || "client@osrah.ma")
    },
    items: items.map((item) => ({ name: String(item.name || "Produit"), price: Number(item.price || 0), qty: Number(item.qty || 1), image: String(item.image || ""), category: String(item.category || "") })),
    payment_method: String(payment_method || ""),
    subtotal: Number(subtotal || 0),
    shipping: Number(shipping || 0),
    total: Number(total || 0),
    status: "Nouvelle",
    created_at: new Date().toISOString()
  };
  orders.push(order); writeOrders(orders);
  res.status(201).json({ message: "Commande enregistrée avec succès ✅", order });
});
app.put("/api/orders/:id/status", (req, res) => {
  const id = Number(req.params.id), orders = readOrders(), index = orders.findIndex((o) => Number(o.id) === id);
  if (index === -1) return res.status(404).json({ message: "Commande introuvable" });
  orders[index].status = String(req.body.status || orders[index].status);
  orders[index].updated_at = new Date().toISOString();
  writeOrders(orders); res.json({ message: "Statut mis à jour ✅", order: orders[index] });
});

const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
