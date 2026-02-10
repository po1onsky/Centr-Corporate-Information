import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import sqlite3 from "sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const dbPath = path.join(__dirname, "data", "store.db");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS visits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip TEXT,
      user_agent TEXT,
      visited_at TEXT
    )`
  );
});

const categories = {
  male: ["Верхняя", "Штаны", "Кроссовки", "Аксессуары"],
  female: ["Верхняя", "Платья", "Юбки", "Кроссовки", "Аксессуары"]
};

const products = [
  {
    id: 1,
    title: "Куртка утеплённая",
    gender: "male",
    category: "Верхняя",
    price: 8900,
    popular: true,
    image: "images/jacket.svg"
  },
  {
    id: 2,
    title: "Худи oversize",
    gender: "female",
    category: "Верхняя",
    price: 6200,
    popular: true,
    image: "images/hoodie.svg"
  },
  {
    id: 3,
    title: "Брюки cargo",
    gender: "male",
    category: "Штаны",
    price: 5400,
    popular: true,
    image: "images/cargo.svg"
  },
  {
    id: 4,
    title: "Платье минимал",
    gender: "female",
    category: "Платья",
    price: 7300,
    popular: true,
    image: "images/dress.svg"
  },
  {
    id: 5,
    title: "Кроссовки street",
    gender: "male",
    category: "Кроссовки",
    price: 9900,
    popular: false,
    image: "images/sneakers.svg"
  },
  {
    id: 6,
    title: "Кроссовки light",
    gender: "female",
    category: "Кроссовки",
    price: 10500,
    popular: false,
    image: "images/sneakers-light.svg"
  }
];

app.get("/api/popular", (_req, res) => {
  res.json(products.filter((product) => product.popular));
});

app.get("/api/categories", (req, res) => {
  const { gender } = req.query;
  if (gender && categories[gender]) {
    res.json(categories[gender]);
    return;
  }
  res.json({ male: categories.male, female: categories.female });
});

app.get("/api/products", (req, res) => {
  const { gender, category } = req.query;
  let filtered = [...products];
  if (gender) {
    filtered = filtered.filter((product) => product.gender === gender);
  }
  if (category) {
    filtered = filtered.filter((product) => product.category === category);
  }
  res.json(filtered);
});

app.post("/api/track", (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
  const userAgent = req.headers["user-agent"] || "unknown";
  const visitedAt = new Date().toISOString();

  db.run(
    "INSERT INTO visits (ip, user_agent, visited_at) VALUES (?, ?, ?)",
    [ip, userAgent, visitedAt],
    (err) => {
      if (err) {
        res.status(500).json({ error: "db_error" });
        return;
      }
      res.json({ status: "ok" });
    }
  );
});

app.get("/api/visits", (_req, res) => {
  db.all("SELECT * FROM visits ORDER BY visited_at DESC LIMIT 50", (err, rows) => {
    if (err) {
      res.status(500).json({ error: "db_error" });
      return;
    }
    res.json(rows);
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
