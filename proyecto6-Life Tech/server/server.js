/**
 * Life Tech · Admin Panel Backend
 * Node.js + Express — MVP
 *
 * Rutas:
 *   POST   /api/login          → autenticación de empleado
 *   POST   /api/logout         → cerrar sesión
 *   GET    /api/products       → listar productos
 *   POST   /api/products       → crear producto
 *   PUT    /api/products/:id   → actualizar producto
 *   DELETE /api/products/:id   → eliminar producto
 *   POST   /api/upload         → subir imagen
 *   GET    /uploads/*          → imágenes estáticas
 *   GET    /*                  → sirve el panel admin (admin/index.html)
 */

const express  = require("express");
const multer   = require("multer");
const cors     = require("cors");
const path     = require("path");
const fs       = require("fs");
const { v4: uuid } = require("uuid");

// xlsx es opcional: si no está instalado el servidor sigue funcionando
let XLSX;
try { XLSX = require("xlsx"); } catch { XLSX = null; }

const app  = express();
const PORT = 3001;

// ── Rutas absolutas ──────────────────────────────────────────────────────────
const ROOT            = path.join(__dirname, "..");
const ADMIN_DIR       = path.join(ROOT, "admin");
const UPLOADS_DIR     = path.join(__dirname, "uploads");
const DB_PATH         = path.join(__dirname, "products.json");
const BRANDS_PATH     = path.join(__dirname, "brands.json");
const USERS_PATH      = path.join(__dirname, "users.json");
const USERS_CSV       = path.join(__dirname, "users.csv");
const PRODUCTS_XLSX   = path.join(__dirname, "products.xlsx");
const USERS_XLSX      = path.join(__dirname, "users.xlsx");
const DATA_JS_PATH    = path.join(ROOT, "ui_kits", "storefront", "data.js");
const SF_ASSETS       = path.join(ROOT, "ui_kits", "storefront", "assets");

// Asegura que existan los directorios necesarios
[UPLOADS_DIR, SF_ASSETS].forEach(d => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); });

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/uploads", express.static(UPLOADS_DIR));
app.use(express.static(ADMIN_DIR));          // sirve el admin panel

// ── Multer (imágenes) ─────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename:    (_req,  file, cb) => cb(null, `${uuid()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage, limits: { fileSize: 8 * 1024 * 1024 } }); // 8 MB

// ── Empleados (hardcoded MVP) ─────────────────────────────────────────────────
const EMPLOYEES = [
  { id: 1, username: "admin",  password: "lt2024!",   name: "Administrador",  role: "admin",    avatar: "AD" },
  { id: 2, username: "carlos", password: "emp123",     name: "Carlos López",   role: "employee", avatar: "CL" },
  { id: 3, username: "ana",    password: "lt.ana",     name: "Ana Martínez",   role: "employee", avatar: "AM" },
];

// ── Sesiones persistentes (sobreviven reinicios del servidor) ─────────────────
const SESSIONS_PATH  = path.join(__dirname, "sessions.json");
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 días

const sessions = new Map(); // token → { emp, expiresAt }

function loadSessionsFromFile() {
  try {
    if (!fs.existsSync(SESSIONS_PATH)) return;
    const obj = JSON.parse(fs.readFileSync(SESSIONS_PATH, "utf-8"));
    const now = Date.now();
    let restored = 0;
    for (const [token, entry] of Object.entries(obj)) {
      if (entry.expiresAt > now) {
        sessions.set(token, entry);
        restored++;
      }
    }
    if (restored > 0) console.log(`[sessions] ${restored} sesión(es) restaurada(s) desde disco`);
  } catch (err) {
    console.warn("[sessions] No se pudieron cargar sesiones:", err.message);
  }
}

function persistSessions() {
  try {
    const obj = Object.fromEntries(sessions.entries());
    fs.writeFileSync(SESSIONS_PATH, JSON.stringify(obj, null, 2));
  } catch (err) {
    console.warn("[sessions] No se pudieron guardar sesiones:", err.message);
  }
}

// Carga sesiones al arrancar
loadSessionsFromFile();

// ── Datos de cuenta (fijos para el storefront) ────────────────────────────────
const ACCOUNT_DATA = {
  name: "Carlos G.",
  email: "carlos@lifetechco.mx",
  tier: "Pro",
  avatar: "CG",
  orders: [
    { id: "LT-2025-8821", date: "2025-03-10", status: "entregado", total: 4299, items: [] },
    { id: "LT-2025-7653", date: "2025-04-22", status: "entregado", total: 1899, items: [] },
    { id: "LT-2025-0112", date: "2025-05-05", status: "en camino",  total: 2549, items: [] },
  ],
  addresses: [
    { id: 1, label: "Casa", name: "Carlos García", line1: "Av. Insurgentes Sur 1234, Apto 8B",
      city: "Ciudad de México", state: "CDMX", zip: "03100", country: "México", default: true },
  ],
  cards: [
    { id: 1, brand: "Visa", last4: "4521", exp: "12/27", default: true },
  ],
};

// ── DB helpers ────────────────────────────────────────────────────────────────
function loadDB() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ products: [] }, null, 2));
  }
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}

function saveDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  regenerateDataJs(data.products);
  syncProductsXLSX(data.products);
}

// ── Código de serie ───────────────────────────────────────────────────────────
const CAT_PREFIX = { perif: "PRF", comp: "CMP", setup: "SET" };

function generateSerialCode(cat) {
  const prefix = CAT_PREFIX[cat] || "PRD";
  const now    = new Date();
  const yy     = String(now.getFullYear()).slice(2);
  const mm     = String(now.getMonth() + 1).padStart(2, "0");
  const dd     = String(now.getDate()).padStart(2, "0");
  const rand   = Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4).padEnd(4, "0");
  return `LT-${prefix}-${yy}${mm}${dd}-${rand}`;
}

// Asigna código de serie a productos existentes que no lo tengan (migración)
function migrateSerialCodes(products) {
  let changed = false;
  products.forEach(p => {
    if (!p.serialCode) {
      p.serialCode = generateSerialCode(p.cat);
      changed = true;
    }
  });
  return changed;
}

// ── Excel helpers ─────────────────────────────────────────────────────────────
const CAT_LABEL = { perif: "Periféricos", comp: "Componentes", setup: "Setups" };

function syncProductsXLSX(products) {
  if (!XLSX) return; // librería no instalada aún
  try {
    const wb   = XLSX.utils.book_new();
    const data = products.map(p => ({
      "Código de Serie":       p.serialCode   || "",
      "ID":                    p.id           || "",
      "Nombre":                p.name         || "",
      "Categoría":             CAT_LABEL[p.cat] || p.cat || "",
      "Subcategoría":          p.subcat       || "",
      "Marca":                 p.brand        || "",
      "Precio (MXN)":          p.price        ?? "",
      "Precio anterior (MXN)": p.was          ?? "",
      "Descuento (%)":         p.save         ?? "",
      "Stock":                 p.stock        ?? "",
      "En oferta":             p.inOferta     ? "Sí" : "No",
      "Descripción":           p.tagline      || "",
      "Tags":                  (p.tags || []).join(", "),
      "Creado por":            p.createdBy    || "",
      "Fecha creación":        p.createdAt    ? p.createdAt.slice(0, 10)  : "",
      "Última modificación":   p.updatedAt    ? p.updatedAt.slice(0, 10) : "",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    ws["!cols"] = [
      { wch: 22 }, // Código de Serie
      { wch: 16 }, // ID
      { wch: 28 }, // Nombre
      { wch: 14 }, // Categoría
      { wch: 20 }, // Subcategoría
      { wch: 14 }, // Marca
      { wch: 14 }, // Precio
      { wch: 18 }, // Precio anterior
      { wch: 14 }, // Descuento
      { wch: 10 }, // Stock
      { wch: 10 }, // En oferta
      { wch: 42 }, // Descripción
      { wch: 24 }, // Tags
      { wch: 18 }, // Creado por
      { wch: 16 }, // Fecha creación
      { wch: 20 }, // Última modificación
    ];
    XLSX.utils.book_append_sheet(wb, ws, "Productos");
    XLSX.writeFile(wb, PRODUCTS_XLSX);
    console.log(`[xlsx] products.xlsx · ${products.length} producto(s)`);
  } catch (err) {
    console.warn("[xlsx] Error generando products.xlsx:", err.message);
  }
}

function syncUsersXLSX(users) {
  if (!XLSX) return;
  try {
    const wb   = XLSX.utils.book_new();
    const data = users.map(u => ({
      "ID":              u.id           || "",
      "Email":           u.email        || "",
      "Nombre":          u.name         || "",
      "Nickname":        u.nickname     || "",
      "Proveedor":       u.provider     || "",
      "Tier":            u.tier         || "",
      "Puntos":          u.points       ?? 0,
      "Color":           u.color        || "",
      "Fecha registro":  u.registeredAt ? u.registeredAt.slice(0, 10) : "",
      "Último acceso":   u.lastLogin    ? u.lastLogin.slice(0, 10)    : "",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    ws["!cols"] = [
      { wch: 36 }, // ID
      { wch: 32 }, // Email
      { wch: 26 }, // Nombre
      { wch: 20 }, // Nickname
      { wch: 12 }, // Proveedor
      { wch: 10 }, // Tier
      { wch: 8  }, // Puntos
      { wch: 10 }, // Color
      { wch: 16 }, // Fecha registro
      { wch: 16 }, // Último acceso
    ];
    XLSX.utils.book_append_sheet(wb, ws, "Usuarios");
    XLSX.writeFile(wb, USERS_XLSX);
    console.log(`[xlsx] users.xlsx · ${users.length} usuario(s)`);
  } catch (err) {
    console.warn("[xlsx] Error generando users.xlsx:", err.message);
  }
}

function regenerateDataJs(products) {
  const js = `// Generado automáticamente por Life Tech Admin Panel · ${new Date().toISOString()}
// No edites este archivo manualmente — usa el panel de empleados.
window.LT_DATA = {
  products: ${JSON.stringify(products, null, 2)},
  account: ${JSON.stringify(ACCOUNT_DATA, null, 2)}
};
`;
  try {
    fs.writeFileSync(DATA_JS_PATH, js, "utf-8");
    console.log(`[data.js] Regenerado · ${products.length} producto(s)`);
  } catch (err) {
    console.error("[data.js] Error al escribir:", err.message);
  }
}

// ── Brands helpers ────────────────────────────────────────────────────────────
const BRANDS_DEFAULTS = {
  perif: ["Logitech", "Razer", "Corsair", "Redragon", "HyperX", "Acer"],
  comp:  ["Intel", "AMD", "ASUS", "Gigabyte", "MSI", "Corsair", "Kingston", "ADATA"],
};

function loadBrands() {
  if (!fs.existsSync(BRANDS_PATH)) {
    fs.writeFileSync(BRANDS_PATH, JSON.stringify(BRANDS_DEFAULTS, null, 2));
    return { ...BRANDS_DEFAULTS };
  }
  return JSON.parse(fs.readFileSync(BRANDS_PATH, "utf-8"));
}

function saveBrands(data) {
  fs.writeFileSync(BRANDS_PATH, JSON.stringify(data, null, 2));
}

// Setup = unión de perif + comp, ordenada alfabéticamente
function withSetup(brands) {
  const setup = [...new Set([...(brands.perif || []), ...(brands.comp || [])])].sort();
  return { ...brands, setup };
}

// ── Users helpers ─────────────────────────────────────────────────────────────
function loadUsers() {
  if (!fs.existsSync(USERS_PATH)) {
    fs.writeFileSync(USERS_PATH, JSON.stringify([], null, 2));
    return [];
  }
  try { return JSON.parse(fs.readFileSync(USERS_PATH, "utf-8")); } catch { return []; }
}

function syncUsersCSV(users) {
  const header = "ID,Email,Nombre,Nickname,Proveedor,Tier,Puntos,Color,Registrado,Último acceso";
  const rows = users.map(u => [
    u.id, u.email, u.name, u.nickname, u.provider,
    u.tier, u.points, u.color,
    u.registeredAt ? u.registeredAt.slice(0, 10) : "",
    u.lastLogin    ? u.lastLogin.slice(0, 10)    : "",
  ].map(v => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","));
  const csv = "﻿" + [header, ...rows].join("\r\n");
  try { fs.writeFileSync(USERS_CSV, csv, "utf-8"); } catch (err) {
    console.warn("[users] CSV error:", err.message);
  }
}

function saveUsers(users) {
  fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2));
  syncUsersCSV(users);
  syncUsersXLSX(users);
}

// ── Auth middleware ───────────────────────────────────────────────────────────
function requireAuth(req, res, next) {
  const token = (req.headers["authorization"] || "").replace("Bearer ", "").trim();
  const entry = token ? sessions.get(token) : null;
  if (!entry || entry.expiresAt < Date.now()) {
    if (entry) sessions.delete(token); // limpia sesión expirada
    return res.status(401).json({ error: "No autorizado. Inicia sesión de nuevo." });
  }
  req.employee = entry.emp;
  next();
}

// ── RUTAS ─────────────────────────────────────────────────────────────────────

// Autenticación
app.post("/api/login", (req, res) => {
  const { username, password } = req.body || {};
  const emp = EMPLOYEES.find(e => e.username === username && e.password === password);
  if (!emp) return res.status(401).json({ error: "Credenciales incorrectas" });

  const safeEmp   = { id: emp.id, name: emp.name, role: emp.role, avatar: emp.avatar };
  const token     = uuid();
  const expiresAt = Date.now() + SESSION_TTL_MS;
  sessions.set(token, { emp: safeEmp, expiresAt });
  persistSessions();
  console.log(`[auth] Login: ${emp.name} (${emp.role}) · sesión válida 30 días`);
  res.json({ token, employee: safeEmp });
});

app.post("/api/logout", requireAuth, (req, res) => {
  const token = (req.headers["authorization"] || "").replace("Bearer ", "").trim();
  sessions.delete(token);
  persistSessions();
  console.log(`[auth] Logout: ${req.employee.name}`);
  res.json({ ok: true });
});

// Productos — endpoint público (sin auth) para el storefront
app.get("/api/public/products", (_req, res) => {
  const { products } = loadDB();
  res.json(products);
});

// Productos — CRUD (requiere auth)
app.get("/api/products", requireAuth, (_req, res) => {
  const { products } = loadDB();
  res.json(products);
});

app.post("/api/products", requireAuth, (req, res) => {
  const db = loadDB();
  const product = {
    ...req.body,
    id:         req.body.id?.trim() || uuid().slice(0, 10),
    serialCode: req.body.serialCode || generateSerialCode(req.body.cat),
    createdAt:  new Date().toISOString(),
    createdBy:  req.employee.name,
  };
  db.products.push(product);
  saveDB(db);
  console.log(`[products] Creado: "${product.name}" (${product.serialCode}) por ${req.employee.name}`);
  res.status(201).json(product);
});

app.put("/api/products/:id", requireAuth, (req, res) => {
  const db = loadDB();
  const idx = db.products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Producto no encontrado" });

  db.products[idx] = {
    ...db.products[idx],
    ...req.body,
    updatedAt: new Date().toISOString(),
    updatedBy: req.employee.name,
  };
  saveDB(db);
  console.log(`[products] Actualizado: "${db.products[idx].name}"`);
  res.json(db.products[idx]);
});

app.delete("/api/products/:id", requireAuth, (req, res) => {
  const db = loadDB();
  const idx = db.products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Producto no encontrado" });

  const [removed] = db.products.splice(idx, 1);
  saveDB(db);
  console.log(`[products] Eliminado: "${removed.name}"`);
  res.json({ ok: true });
});

// Subida de imagen
app.post("/api/upload", requireAuth, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No se recibió ninguna imagen" });

  // Copia al directorio de assets del storefront
  const destPath = path.join(SF_ASSETS, req.file.filename);
  try {
    fs.copyFileSync(req.file.path, destPath);
  } catch (err) {
    console.warn("[upload] No se pudo copiar al storefront:", err.message);
  }

  console.log(`[upload] ${req.file.filename} (${(req.file.size / 1024).toFixed(1)} KB)`);
  res.json({
    url: `http://localhost:${PORT}/uploads/${req.file.filename}`,
    storefrontUrl: `assets/${req.file.filename}`,  // ruta relativa al storefront
    filename: req.file.filename,
  });
});

// ── Marcas ────────────────────────────────────────────────────────────────────

// Público (storefront sin auth)
app.get("/api/public/brands", (_req, res) => {
  res.json(withSetup(loadBrands()));
});

// Admin — listar
app.get("/api/brands", requireAuth, (_req, res) => {
  res.json(withSetup(loadBrands()));
});

// Admin — añadir marca a una categoría (perif | comp)
app.post("/api/brands/:cat", requireAuth, (req, res) => {
  const { cat } = req.params;
  if (!["perif", "comp"].includes(cat))
    return res.status(400).json({ error: "Categoría inválida. Usa perif o comp." });

  const name = (req.body?.brand || "").trim();
  if (!name) return res.status(400).json({ error: "Nombre de marca requerido" });

  const brands = loadBrands();
  if (!brands[cat]) brands[cat] = [];
  if (brands[cat].map(b => b.toLowerCase()).includes(name.toLowerCase()))
    return res.status(409).json({ error: `"${name}" ya existe en esta categoría` });

  brands[cat].push(name);
  brands[cat].sort((a, b) => a.localeCompare(b));
  saveBrands(brands);
  console.log(`[brands] +${name} → ${cat}`);
  res.status(201).json(withSetup(brands));
});

// Admin — eliminar marca
app.delete("/api/brands/:cat/:brand", requireAuth, (req, res) => {
  const { cat } = req.params;
  const name = decodeURIComponent(req.params.brand);
  if (!["perif", "comp"].includes(cat))
    return res.status(400).json({ error: "Categoría inválida" });

  const brands = loadBrands();
  if (!brands[cat]) return res.status(404).json({ error: "Categoría no encontrada" });
  brands[cat] = brands[cat].filter(b => b !== name);
  saveBrands(brands);
  console.log(`[brands] -${name} ← ${cat}`);
  res.json(withSetup(brands));
});

// ── Usuarios (storefront) ─────────────────────────────────────────────────────

// Lookup por email — público (storefront sin auth)
app.get("/api/public/users/lookup", (req, res) => {
  const email = (req.query.email || "").toLowerCase().trim();
  if (!email) return res.status(400).json({ error: "email requerido" });
  const users = loadUsers();
  const user = users.find(u => u.email.toLowerCase() === email);
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
  res.json(user);
});

// Registro o actualización de último acceso — público
app.post("/api/public/users/register", (req, res) => {
  const { email, name, nickname, provider, tier, points, color } = req.body || {};
  if (!email || !nickname) return res.status(400).json({ error: "email y nickname requeridos" });

  const users = loadUsers();
  const idx   = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase().trim());
  const now   = new Date().toISOString();

  if (idx !== -1) {
    // Usuario existente → actualiza lastLogin (y nickname si se envía uno diferente)
    users[idx] = {
      ...users[idx],
      nickname: nickname || users[idx].nickname,
      lastLogin: now,
    };
    saveUsers(users);
    console.log(`[users] Login: ${email}`);
    return res.json(users[idx]);
  }

  // Usuario nuevo → crea registro
  const newUser = {
    id:           uuid(),
    email:        email.trim().toLowerCase(),
    name:         name || email.split("@")[0],
    nickname:     nickname.startsWith("@") ? nickname : "@" + nickname,
    provider:     provider || "email",
    tier:         tier    || "FREE",
    points:       points  || 0,
    color:        color   || "#ef2b2b",
    registeredAt: now,
    lastLogin:    now,
  };
  users.push(newUser);
  saveUsers(users);
  console.log(`[users] Nuevo: ${newUser.email} (${newUser.nickname}) [${newUser.provider}]`);
  res.status(201).json(newUser);
});

// Admin — lista completa de usuarios (requiere auth)
app.get("/api/users", requireAuth, (_req, res) => {
  res.json(loadUsers());
});

// Fallback → sirve el admin panel para rutas de SPA
app.get("*", (_req, res) => {
  res.sendFile(path.join(ADMIN_DIR, "index.html"));
});

// ── Arranque ──────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log("\n╔══════════════════════════════════════╗");
  console.log("║   Life Tech · Admin Panel Server     ║");
  console.log("╠══════════════════════════════════════╣");
  console.log(`║  Admin:  http://localhost:${PORT}        ║`);
  console.log(`║  API:    http://localhost:${PORT}/api     ║`);
  console.log("╚══════════════════════════════════════╝\n");
  console.log("Cuentas disponibles:");
  EMPLOYEES.forEach(e => console.log(`  • ${e.username} / ${e.password}  [${e.role}]`));
  console.log("");

  // ── Migración: asigna serialCode a productos que no lo tengan ───────────────
  const db = loadDB();
  if (migrateSerialCodes(db.products)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    console.log(`[migration] Códigos de serie asignados a ${db.products.filter(p => p.serialCode).length} producto(s)`);
  }

  // ── Genera Excel al arrancar (refleja estado actual de la BD) ───────────────
  if (XLSX) {
    syncProductsXLSX(db.products);
    syncUsersXLSX(loadUsers());
    console.log("[xlsx] Archivos Excel generados en server/");
  } else {
    console.log("[xlsx] Instala 'xlsx' (npm install) para habilitar exportación Excel");
  }
});
