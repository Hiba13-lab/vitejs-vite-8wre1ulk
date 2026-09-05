import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import "dotenv/config";

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function initDatabase() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        stock INT NOT NULL DEFAULT 0,
        category VARCHAR(100),
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log("Table products prête ✅");
  } catch (error) {
    console.error("Erreur création table products:", error.message);
  }
}

app.get("/", async (req, res) => {
  try {
    await db.query("SELECT 1 AS connected");

    res.json({
      message: "OSRAH COSMETIQUES Backend is running 🚀",
      database: "MySQL connected ✅",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Backend running mais MySQL connection failed ❌",
      error: error.message,
    });
  }
});

// Afficher tous les produits
app.get("/api/products", async (req, res) => {
  try {
    const [products] = await db.query(
      "SELECT * FROM products ORDER BY id DESC"
    );

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de récupération des produits",
      error: error.message,
    });
  }
});

// Afficher un produit
app.get("/api/products/:id", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM products WHERE id = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Produit introuvable" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de récupération du produit",
      error: error.message,
    });
  }
});

// Ajouter un produit
app.post("/api/products", async (req, res) => {
  try {
    const {
      name,
      description = "",
      price,
      stock = 0,
      category = "",
      image_url = "",
    } = req.body;

    if (!name || price === undefined || price === null || price === "") {
      return res.status(400).json({
        message: "Le nom et le prix sont obligatoires",
      });
    }

    const numericPrice = Number(price);
    const numericStock = Number(stock);

    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({ message: "Prix invalide" });
    }

    if (!Number.isInteger(numericStock) || numericStock < 0) {
      return res.status(400).json({ message: "Stock invalide" });
    }

    const [result] = await db.query(
      `INSERT INTO products
       (name, description, price, stock, category, image_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name.trim(), description, numericPrice, numericStock, category, image_url]
    );

    const [rows] = await db.query(
      "SELECT * FROM products WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json({
      message: "Produit ajouté avec succès ✅",
      product: rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de l'ajout du produit",
      error: error.message,
    });
  }
});

// Modifier un produit
app.put("/api/products/:id", async (req, res) => {
  try {
    const {
      name,
      description = "",
      price,
      stock = 0,
      category = "",
      image_url = "",
    } = req.body;

    if (!name || price === undefined || price === null || price === "") {
      return res.status(400).json({
        message: "Le nom et le prix sont obligatoires",
      });
    }

    const numericPrice = Number(price);
    const numericStock = Number(stock);

    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({ message: "Prix invalide" });
    }

    if (!Number.isInteger(numericStock) || numericStock < 0) {
      return res.status(400).json({ message: "Stock invalide" });
    }

    const [result] = await db.query(
      `UPDATE products
       SET name = ?, description = ?, price = ?, stock = ?, category = ?, image_url = ?
       WHERE id = ?`,
      [
        name.trim(),
        description,
        numericPrice,
        numericStock,
        category,
        image_url,
        req.params.id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Produit introuvable" });
    }

    const [rows] = await db.query(
      "SELECT * FROM products WHERE id = ?",
      [req.params.id]
    );

    res.json({
      message: "Produit modifié avec succès ✅",
      product: rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de la modification du produit",
      error: error.message,
    });
  }
});

// Supprimer un produit
app.delete("/api/products/:id", async (req, res) => {
  try {
    const [result] = await db.query(
      "DELETE FROM products WHERE id = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Produit introuvable" });
    }

    res.json({ message: "Produit supprimé avec succès ✅" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de la suppression du produit",
      error: error.message,
    });
  }
});

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, async () => {
  console.log(`Backend running on port ${PORT}`);
  await initDatabase();
});
