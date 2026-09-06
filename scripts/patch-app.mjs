import fs from "node:fs";

const appPath = new URL("../src/App.tsx", import.meta.url);
let code = fs.readFileSync(appPath, "utf8");

const defaultImage =
  "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=800&q=80";

code = code.replace(
  'import React, { useState } from "react";',
  'import React, { useEffect, useState } from "react";'
);

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

fs.writeFileSync(appPath, code, "utf8");
console.log("Frontend products connected to http://localhost:5000/api/products");
