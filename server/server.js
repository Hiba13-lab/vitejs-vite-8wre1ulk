import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import "dotenv/config";

const app = express();

app.use(cors());
app.use(express.json());

// Connexion MySQL
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
});

// Test connexion
app.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 AS connected");

    res.json({
      message: "OSRAH COSMETIQUES Backend is running 🚀",
      database: "MySQL connected ✅",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Backend running ولكن MySQL connection failed ❌",
      error: error.message,
    });
  }
});

// Get products
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

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});