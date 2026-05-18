/**
 * Life Tech · Panel de Empleados
 * React 18 via CDN + Babel Standalone (sin build step)
 *
 * Flujo: Login → Dashboard → ProductForm
 * API en http://localhost:3001
 */

const { useState, useEffect, useRef, useCallback } = React;

// ═══════════════════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════════════════
const API = "http://localhost:3001/api";

// ═══════════════════════════════════════════════════════════════
// API HELPERS
// ═══════════════════════════════════════════════════════════════
const getToken = () => localStorage.getItem("lt_admin_token");

async function apiFetch(endpoint, opts = {}) {
  const token = getToken();
  const isFormData = opts.body instanceof FormData;
  const headers = {
    ...(!isFormData ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(opts.headers || {}),
  };
  const res = await fetch(`${API}${endpoint}`, { ...opts, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
  return data;
}

async function uploadImage(file) {
  const form = new FormData();
  form.append("image", file);
  return apiFetch("/upload", { method: "POST", body: form });
}

// Convierte una imageUrl almacenada ("assets/x.png") a una URL
// que el admin panel (puerto 3001) puede cargar directamente.
// El servidor Express expone /uploads → ui_kits/storefront/assets/
function resolveAdminImageUrl(url) {
  if (!url) return null;
  if (url.startsWith("assets/")) {
    return `http://localhost:3001/uploads/${url.slice("assets/".length)}`;
  }
  return url; // ya es URL absoluta o ruta de uploads
}

// ═══════════════════════════════════════════════════════════════
// MICRO COMPONENTS
// ═══════════════════════════════════════════════════════════════
function Spinner({ size = 16, color = "currentColor" }) {
  return (
    <span style={{
      display: "inline-block", width: size, height: size, flexShrink: 0,
      border: `2px solid rgba(255 255 255 / 0.15)`, borderTopColor: color,
      borderRadius: "50%", animation: "spin .65s linear infinite",
    }}/>
  );
}

function GridBg() {
  return <div className="lt-grid-bg" aria-hidden/>;
}

function ScanLines() {
  return <div className="lt-scanlines" aria-hidden/>;
}

function Toast({ toast }) {
  if (!toast) return null;
  const isSuccess = toast.type === "success";
  return (
    <div className={`lt-toast lt-toast-${toast.type}`}>
      <span style={{ fontSize: 16, flexShrink: 0, color: isSuccess ? "var(--lime)" : "#ff7070" }}>
        {isSuccess ? "✓" : "⚠"}
      </span>
      <div>
        <div style={{ fontWeight: 600 }}>{toast.msg}</div>
        {toast.sub && <div style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 3 }}>{toast.sub}</div>}
      </div>
    </div>
  );
}

function Label({ children, required }) {
  return (
    <label style={{
      display: "block", font: "500 11px/1 var(--font-mono)", color: "var(--fg-3)",
      letterSpacing: ".09em", marginBottom: 8, textTransform: "uppercase",
    }}>
      {children}{required && <span style={{ color: "var(--red)", marginLeft: 3 }}>*</span>}
    </label>
  );
}

function Toggle({ on, onToggle }) {
  return (
    <div className={`lt-toggle ${on ? "on" : ""}`} onClick={onToggle} role="switch" aria-checked={on}>
      <div className="lt-toggle-knob"/>
    </div>
  );
}

function EmptyStateIcon({ type }) {
  const base = { width: 44, height: 44, viewBox: "0 0 20 20", fill: "none", stroke: "rgba(240,240,240,0.2)", strokeWidth: "1.1", strokeLinecap: "round", strokeLinejoin: "round" };
  if (type === "search") return (
    <svg {...base}>
      <circle cx="8.5" cy="8.5" r="5.5"/>
      <line x1="12.5" y1="12.5" x2="18" y2="18"/>
      <line x1="6" y1="8.5" x2="11" y2="8.5"/>
      <line x1="8.5" y1="6" x2="8.5" y2="11"/>
    </svg>
  );
  // default: caja vacía / producto
  return (
    <svg {...base}>
      <path d="M10 1.5 L18 5.5 L18 14.5 L10 18.5 L2 14.5 L2 5.5 Z"/>
      <line x1="2" y1="5.5" x2="10" y2="9.5"/>
      <line x1="18" y1="5.5" x2="10" y2="9.5"/>
      <line x1="10" y1="9.5" x2="10" y2="18.5"/>
      <line x1="6" y1="3.5" x2="14" y2="7.5" strokeWidth="0.8" opacity="0.5"/>
    </svg>
  );
}

function EmptyState({ icon, title, body, action }) {
  return (
    <div style={{ textAlign: "center", padding: "72px 24px" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
        <EmptyStateIcon type={icon}/>
      </div>
      <div style={{ font: "700 17px/1.2 var(--font-sans)", marginBottom: 8 }}>{title}</div>
      <div style={{ font: "400 13px/1.5 var(--font-sans)", color: "var(--fg-3)", maxWidth: 380, margin: "0 auto 20px" }}>{body}</div>
      {action}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// LOGIN SCREEN
// ═══════════════════════════════════════════════════════════════
function LoginScreen({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [serverOk, setServerOk] = useState(null); // null=checking, true=ok, false=down

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

  // Verifica si el servidor está corriendo al montar y cada 5 s si está caído
  useEffect(() => {
    let interval;
    async function ping() {
      try {
        const r = await fetch(`${API}/public/products`, { signal: AbortSignal.timeout(3000) });
        if (r.ok) { setServerOk(true); setError(""); clearInterval(interval); }
        else setServerOk(false);
      } catch { setServerOk(false); }
    }
    ping();
    interval = setInterval(ping, 5000);
    return () => clearInterval(interval);
  }, []);

  function friendlyError(msg) {
    if (!msg) return "Error desconocido";
    if (msg.includes("fetch") || msg.includes("network") || msg.includes("connect"))
      return "Servidor no disponible. Ejecuta: cd server && node server.js";
    if (msg.includes("401") || msg.toLowerCase().includes("credencial"))
      return "Usuario o contraseña incorrectos";
    return msg;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.username || !form.password) return setError("Completa todos los campos");
    if (serverOk === false) return setError("El servidor no está corriendo. Inícialo primero.");
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch("/login", {
        method: "POST",
        body: JSON.stringify(form),
      });
      localStorage.setItem("lt_admin_token", data.token);
      localStorage.setItem("lt_admin_emp", JSON.stringify(data.employee));
      onLogin(data.employee);
    } catch (err) {
      setError(friendlyError(err.message));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative" }}>
      <GridBg/>
      <ScanLines/>

      {/* Glow orb */}
      <div style={{ position: "fixed", top: "30%", left: "50%", transform: "translate(-50%, -50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(239,43,43,0.08) 0%, transparent 70%)", pointerEvents: "none" }}/>

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 440 }}>

        {/* Logo / header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 18, margin: "0 auto 18px",
            background: "linear-gradient(135deg, #ef2b2b 0%, #8b0000 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 48px rgba(239,43,43,0.5), inset 0 1px 0 rgba(255,255,255,0.15)",
            font: "900 28px/1 var(--font-sans)", letterSpacing: "-0.05em",
          }}>LT</div>
          <div style={{ font: "900 26px/1 var(--font-sans)", letterSpacing: "-0.05em", marginBottom: 8 }}>LIFE TECH</div>
          <div style={{ font: "500 10px/1 var(--font-mono)", color: "var(--fg-3)", letterSpacing: ".18em" }}>PANEL DE EMPLEADOS · ACCESO RESTRINGIDO</div>
        </div>

        {/* Card */}
        <div style={{
          background: "var(--surface)", borderRadius: 16, padding: "32px 28px",
          border: "1px solid var(--border)",
          boxShadow: "0 0 0 1px rgba(239,43,43,0.07), 0 32px 72px rgba(0,0,0,0.6)",
        }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <Label required>ID de empleado</Label>
              <input className="lt-input" value={form.username} onChange={set("username")} placeholder="tu_usuario" autoFocus autoComplete="username"/>
            </div>
            <div>
              <Label required>Contraseña</Label>
              <input className="lt-input" type="password" value={form.password} onChange={set("password")} placeholder="••••••••" autoComplete="current-password"/>
            </div>

            {/* Estado del servidor */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", borderRadius: 8, background: "var(--surface-2)", border: "1px solid var(--border)" }}>
              <span style={{
                width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                background: serverOk === null ? "#71717a" : serverOk ? "#22c55e" : "#ef2b2b",
                boxShadow: serverOk === true ? "0 0 0 3px rgba(34,197,94,0.25)" : serverOk === false ? "0 0 0 3px rgba(239,43,43,0.25)" : "none",
                animation: serverOk === null ? "none" : serverOk ? "none" : "lt-pulse 1.2s ease-in-out infinite",
              }}/>
              <span style={{ font: "500 11px/1 var(--font-mono)", color: serverOk === null ? "var(--fg-3)" : serverOk ? "#22c55e" : "#ff7070" }}>
                {serverOk === null ? "Verificando servidor..." : serverOk ? "Servidor activo · localhost:3001" : "Servidor caído · ejecuta node server.js"}
              </span>
            </div>

            {error && (
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start", background: "rgba(239,43,43,0.1)", border: "1px solid rgba(239,43,43,0.25)", borderRadius: 8, padding: "11px 14px", font: "500 12px/1.4 var(--font-mono)", color: "#ff7070" }}>
                <span style={{ flexShrink: 0, marginTop: 1 }}>⚠</span> {error}
              </div>
            )}

            <button type="submit" className="lt-btn lt-btn-primary" disabled={loading || serverOk === false} style={{ height: 46, fontSize: 13, letterSpacing: ".08em", marginTop: 4, opacity: serverOk === false ? 0.5 : 1 }}>
              {loading ? <Spinner/> : serverOk === false ? "Esperando servidor..." : "ACCEDER →"}
            </button>
          </form>

          <div style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid var(--border)", font: "400 11px/1.55 var(--font-mono)", color: "var(--fg-4)", textAlign: "center" }}>
            Solo personal autorizado puede acceder a este sistema.<br/>
            ¿Problemas de acceso? Contacta al administrador.
          </div>
        </div>

        <div style={{ marginTop: 22, textAlign: "center", font: "400 10px/1 var(--font-mono)", color: "var(--fg-4)", letterSpacing: ".1em" }}>
          LIFE TECH ADMIN PANEL · v1.0.0-MVP
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// IMAGE DROPZONE
// ═══════════════════════════════════════════════════════════════
function ImageDropzone({ value, onChange }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  function processFile(file) {
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 8 * 1024 * 1024) return alert("Imagen muy grande (máx 8 MB)");
    const reader = new FileReader();
    reader.onload = e => onChange({ preview: e.target.result, file });
    reader.readAsDataURL(file);
  }

  return (
    <div
      className={`lt-dropzone${dragging ? " dragging" : ""}${value ? " has-image" : ""}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget)) setDragging(false); }}
      onDrop={e => { e.preventDefault(); setDragging(false); processFile(e.dataTransfer.files[0]); }}
    >
      {value ? (
        <>
          <img src={value.preview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "contain" }}/>
          <div style={{ position: "absolute", bottom: 10, right: 10 }}>
            <span className="lt-badge lt-badge-lime">✓ IMAGEN LISTA</span>
          </div>
          <button
            onClick={e => { e.stopPropagation(); onChange(null); }}
            className="lt-btn lt-btn-danger lt-btn-sm"
            style={{ position: "absolute", top: 10, right: 10 }}
          >✕</button>
        </>
      ) : (
        <div style={{ textAlign: "center", padding: 24, pointerEvents: "none" }}>
          <div style={{ marginBottom: 14, display: "flex", justifyContent: "center" }}>
            <svg width="40" height="40" viewBox="0 0 20 20" fill="none"
              stroke="rgba(240,240,240,0.25)" strokeWidth="1.1"
              strokeLinecap="round" strokeLinejoin="round">
              {/* marco de imagen */}
              <rect x="1.5" y="2.5" width="17" height="15" rx="2"/>
              {/* montaña / paisaje */}
              <path d="M1.5 13 L6 8 L9.5 12 L13 9 L18.5 15"/>
              {/* sol */}
              <circle cx="14.5" cy="6.5" r="2"/>
              {/* flecha de subida */}
              <line x1="10" y1="20" x2="10" y2="14" stroke="rgba(240,240,240,0.5)" strokeWidth="1.3"/>
              <polyline points="7.5,16.5 10,14 12.5,16.5" stroke="rgba(240,240,240,0.5)" strokeWidth="1.3"/>
            </svg>
          </div>
          <div style={{ font: "600 13px/1 var(--font-sans)", color: "var(--fg-2)", marginBottom: 8 }}>
            Arrastra o haz clic para subir imagen
          </div>
          <div style={{ font: "400 11px/1.4 var(--font-mono)", color: "var(--fg-4)" }}>
            PNG, JPG, WebP · Máximo 8 MB
          </div>
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => processFile(e.target.files[0])}/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SPECS EDITOR  (pares clave-valor dinámicos)
// ═══════════════════════════════════════════════════════════════
function SpecsEditor({ specs, onChange }) {
  const [pairs, setPairs] = useState(() =>
    Object.entries(specs || {}).map(([k, v]) => ({ id: Math.random(), k, v }))
  );

  function sync(next) {
    setPairs(next);
    const obj = {};
    next.forEach(p => { if (p.k.trim()) obj[p.k.trim()] = p.v; });
    onChange(obj);
  }

  const add    = ()       => sync([...pairs, { id: Math.random(), k: "", v: "" }]);
  const remove = id       => sync(pairs.filter(p => p.id !== id));
  const update = (id, f, val) => sync(pairs.map(p => p.id === id ? { ...p, [f]: val } : p));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {pairs.map(p => (
        <div key={p.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 34px", gap: 8, alignItems: "center" }}>
          <input className="lt-input" value={p.k} onChange={e => update(p.id, "k", e.target.value)}
            placeholder="Especificación (ej: Sensor)" style={{ fontSize: 13 }}/>
          <input className="lt-input" value={p.v} onChange={e => update(p.id, "v", e.target.value)}
            placeholder="Valor (ej: HERO 25K)" style={{ fontSize: 13 }}/>
          <button onClick={() => remove(p.id)} className="lt-btn lt-btn-danger lt-btn-sm lt-btn-icon"
            style={{ width: 34, height: 34, padding: 0 }} title="Eliminar">×</button>
        </div>
      ))}
      <button onClick={add} className="lt-btn lt-btn-ghost lt-btn-sm" style={{ alignSelf: "flex-start" }}>
        + Añadir especificación
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PRODUCT FORM
// ═══════════════════════════════════════════════════════════════
// ── Formas por categoría — sin emojis, solo label limpio ────────────────────
const CAT_SHAPES = {
  perif: [
    ["mouse",    "Mouse"],
    ["keyboard", "Teclado"],
    ["headset",  "Audífonos"],
    ["pad",      "Mousepad"],
    ["webcam",   "Webcam"],
    ["monitor",  "Monitor"],
    ["mic",      "Micrófono"],
    ["chair",    "Silla"],
    ["speaker",  "Bafles"],
  ],
  comp: [
    ["gpu",         "Tarjeta Gráfica"],
    ["cpu",         "Procesador"],
    ["motherboard", "Tarjeta Madre"],
    ["ram",         "Memoria RAM"],
    ["ssd",         "SSD NVMe"],
    ["hdd",         "Disco Duro"],
    ["psu",         "Fuente de Poder"],
    ["case",        "Gabinete"],
    ["cooling",     "Refrigeración"],
  ],
  setup: [
    ["aficionado", "Aficionado"],
    ["gama-alta",  "Gama Alta"],
    ["gama-media", "Gama Media"],
    ["gama-baja",  "Gama Baja"],
  ],
};

// ── Subcategorías sugeridas por categoría ────────────────────────────────────
const CAT_SUBCATS = {
  perif: [
    // Mouse
    "Mouse inalámbrico",
    "Mouse con cable",
    "Mouse RGB",
    "Mouse ergonómico",
    // Teclado
    "Teclado mecánico",
    "Teclado RGB",
    "Teclado inalámbrico",
    "Teclado TKL",
    "Teclado 60%",
    "Teclado de membrana",
    // Audífonos
    "Audífonos gaming",
    "Audífonos inalámbricos",
    "Audífonos con micrófono",
    "Audífonos hi-fi",
    // Mousepad
    "Mousepad XL",
    "Mousepad RGB",
    "Mousepad estándar",
    // Webcam
    "Webcam HD 1080p",
    "Webcam 4K",
    // Monitor
    "Monitor gaming",
    "Monitor curvo",
    "Monitor 4K",
    "Monitor 144Hz",
    "Monitor 240Hz",
    // Micrófono
    "Micrófono USB",
    "Micrófono XLR",
    "Micrófono condensador",
    "Micrófono dinámico",
    "Micrófono de streaming",
    "Micrófono de solapa",
    // Silla
    "Silla gaming",
    "Silla ergonómica",
    "Silla de oficina",
    "Silla reclinable",
    // Bafles / Parlantes
    "Parlantes estéreo 2.0",
    "Sistema 2.1 con subwoofer",
    "Bafles gaming RGB",
    "Barra de sonido",
    "Sonido surround 5.1",
  ],
  comp: [
    // Tarjeta Gráfica
    "Tarjeta Gráfica NVIDIA GeForce RTX",
    "Tarjeta Gráfica NVIDIA GeForce GTX",
    "Tarjeta Gráfica AMD Radeon RX",
    "Tarjeta Gráfica para workstation",
    // Procesador
    "Procesador Intel Core i9",
    "Procesador Intel Core i7",
    "Procesador Intel Core i5",
    "Procesador Intel Core i3",
    "Procesador AMD Ryzen 9",
    "Procesador AMD Ryzen 7",
    "Procesador AMD Ryzen 5",
    "Procesador AMD Ryzen 3",
    // Tarjeta Madre
    "Tarjeta Madre Intel Z790",
    "Tarjeta Madre Intel B760",
    "Tarjeta Madre Intel H610",
    "Tarjeta Madre AMD X670",
    "Tarjeta Madre AMD B650",
    "Tarjeta Madre AMD A620",
    "Tarjeta Madre ATX",
    "Tarjeta Madre mATX",
    "Tarjeta Madre Mini-ITX",
    // Memoria RAM
    "Memoria RAM DDR5 8 GB",
    "Memoria RAM DDR5 16 GB",
    "Memoria RAM DDR5 32 GB",
    "Memoria RAM DDR4 8 GB",
    "Memoria RAM DDR4 16 GB",
    "Memoria RAM DDR4 32 GB",
    "Kit de Memoria RAM DDR5 64 GB",
    // SSD NVMe
    "SSD NVMe PCIe 5.0",
    "SSD NVMe PCIe 4.0",
    "SSD NVMe PCIe 3.0",
    "SSD SATA 2.5\"",
    "SSD 500 GB",
    "SSD 1 TB",
    "SSD 2 TB",
    // Disco Duro
    "Disco Duro 1 TB",
    "Disco Duro 2 TB",
    "Disco Duro 4 TB",
    "Disco Duro 8 TB",
    "Disco Duro para NAS",
    // Fuente de Poder
    "Fuente de Poder Modular 650W",
    "Fuente de Poder Modular 750W",
    "Fuente de Poder Modular 850W",
    "Fuente de Poder Semi-Modular",
    "Fuente de Poder Estándar",
    "Fuente 80 Plus Gold",
    "Fuente 80 Plus Platinum",
    "Fuente 80 Plus Titanium",
    // Gabinete
    "Gabinete ATX Torre Media",
    "Gabinete ATX Torre Completa",
    "Gabinete mATX",
    "Gabinete Mini-ITX",
    "Gabinete con Panel de Vidrio",
    "Gabinete RGB",
    // Refrigeración
    "Refrigeración Líquida 240 mm",
    "Refrigeración Líquida 280 mm",
    "Refrigeración Líquida 360 mm",
    "Disipador de Aire Torre Simple",
    "Disipador de Aire Torre Doble",
    "Ventiladores de Gabinete 120 mm",
    "Ventiladores de Gabinete 140 mm",
  ],
  setup: [
    // Gamas de precio
    "Gama Alta",
    "Gama Media-Alta",
    "Gama Media",
    "Gama Media-Baja",
    "Gama Entrada",
    // Por tipo de uso
    "Setup Gaming",
    "Setup Streaming",
    "Setup Trabajo / Productividad",
    "Setup Estudio / Universidad",
    "Setup Diseño / Creativo",
    "Setup Minimalista",
    "Setup RGB Full",
    "Setup Dual Monitor",
    "Setup Triple Monitor",
    "Setup Portátil",
  ],
};

const CATS = [["perif", "Periféricos"], ["comp", "Componentes"], ["setup", "Setup completo"]];

// ═══════════════════════════════════════════════════════════════
// SHAPE ICON — SVG vectorial, sin emojis
// ═══════════════════════════════════════════════════════════════
function ShapeIcon({ shape, size = 20, color = "currentColor" }) {
  const base = {
    width: size, height: size, viewBox: "0 0 20 20",
    fill: "none", stroke: color, strokeWidth: "1.3",
    strokeLinecap: "round", strokeLinejoin: "round",
  };
  const f = color; // fill shorthand

  switch (shape) {
    case "mouse": return (
      <svg {...base}>
        <path d="M10 2C7 2 5 4.2 5 7v6c0 3 2.2 5 5 5s5-2 5-5V7c0-2.8-2-5-5-5z"/>
        <line x1="10" y1="2" x2="10" y2="9"/>
        <rect x="8.2" y="5" width="3.6" height="3" rx="1" strokeWidth="0.9"/>
        <circle cx="10" cy="6.5" r="0.7" fill={f} stroke="none"/>
      </svg>
    );
    case "keyboard": return (
      <svg {...base}>
        <rect x="1.5" y="5" width="17" height="11" rx="2"/>
        {[[3,7],[6.5,7],[10,7],[13.5,7],[3,10],[6.5,10],[10,10],[13.5,10]].map(([x,y],i) => (
          <rect key={i} x={x} y={y} width="2.5" height="2" rx="0.5" fill={f} stroke="none" opacity="0.75"/>
        ))}
        <rect x="6" y="13" width="8.5" height="2" rx="0.6" fill={f} stroke="none" opacity="0.75"/>
        <rect x="16.5" y="7" width="2" height="5" rx="0.5" fill={f} stroke="none" opacity="0.5"/>
      </svg>
    );
    case "headset": return (
      <svg {...base}>
        <path d="M3.5 10a6.5 6.5 0 0113 0"/>
        <rect x="1.5" y="9" width="3.5" height="6" rx="1.8"/>
        <rect x="15" y="9" width="3.5" height="6" rx="1.8"/>
        <path d="M15.5 15q0 2.5-2 2.5" strokeWidth="1"/>
        <circle cx="13.5" cy="17.5" r="1" fill={f} stroke="none"/>
      </svg>
    );
    case "pad": return (
      <svg {...base}>
        <rect x="1.5" y="6" width="17" height="11" rx="1.8"/>
        <rect x="2.5" y="7" width="15" height="9" rx="1.2" strokeWidth="0.7" opacity="0.4"/>
        <text x="10" y="13" textAnchor="middle" fontSize="5.5" fontWeight="900"
          fontFamily="Inter,sans-serif" fill={f} stroke="none" letterSpacing="-0.3">LT</text>
        <rect x="1.5" y="6" width="17" height="2" rx="1.8" fill={f} stroke="none" opacity="0.2"/>
      </svg>
    );
    case "webcam": return (
      <svg {...base}>
        <circle cx="10" cy="8" r="5.5"/>
        <circle cx="10" cy="8" r="3.2" strokeWidth="1"/>
        <circle cx="10" cy="8" r="1.2" fill={f} stroke="none"/>
        <rect x="8.5" y="13.5" width="3" height="2.5" rx="0.5"/>
        <rect x="6" y="16" width="8" height="1.5" rx="0.7"/>
      </svg>
    );
    case "monitor": return (
      <svg {...base}>
        <rect x="1.5" y="2.5" width="17" height="12" rx="1.8"/>
        <line x1="1.5" y1="11.5" x2="18.5" y2="11.5" strokeWidth="0.8"/>
        <path d="M10 14.5v3"/>
        <line x1="7" y1="17.5" x2="13" y2="17.5"/>
        <rect x="3.5" y="4.5" width="4.5" height="3.5" rx="0.6" strokeWidth="0.8" opacity="0.5"/>
        <rect x="9.5" y="4.5" width="7" height="1.5" rx="0.4" fill={f} stroke="none" opacity="0.35"/>
        <rect x="9.5" y="7" width="5" height="1.5" rx="0.4" fill={f} stroke="none" opacity="0.25"/>
      </svg>
    );
    case "gpu": return (
      <svg {...base}>
        <rect x="1.5" y="5" width="15" height="10" rx="1.8"/>
        <circle cx="6.5" cy="10" r="3"/>
        <circle cx="6.5" cy="10" r="1.4" strokeWidth="0.8"/>
        <circle cx="12.5" cy="10" r="3"/>
        <circle cx="12.5" cy="10" r="1.4" strokeWidth="0.8"/>
        <rect x="16.5" y="7" width="2" height="6" rx="0.6"/>
        <line x1="1.5" y1="7.5" x2="3" y2="7.5" strokeWidth="0.8"/>
        <line x1="1.5" y1="10" x2="3" y2="10" strokeWidth="0.8"/>
        <line x1="1.5" y1="12.5" x2="3" y2="12.5" strokeWidth="0.8"/>
      </svg>
    );
    case "cpu": return (
      <svg {...base}>
        <rect x="5.5" y="5.5" width="9" height="9" rx="1.5"/>
        <rect x="7" y="7" width="6" height="6" rx="0.8" strokeWidth="0.8"/>
        {[6,9,12].map(x => (
          <g key={x}>
            <line x1={x} y1="1.5" x2={x} y2="5.5"/>
            <line x1={x} y1="14.5" x2={x} y2="18.5"/>
          </g>
        ))}
        {[6,9,12].map(y => (
          <g key={y}>
            <line x1="1.5" y1={y} x2="5.5" y2={y}/>
            <line x1="14.5" y1={y} x2="18.5" y2={y}/>
          </g>
        ))}
      </svg>
    );
    case "ram": return (
      <svg {...base}>
        <rect x="6" y="2" width="8" height="14" rx="1.2"/>
        {[3.5, 6, 8.5].map((y,i) => (
          <rect key={i} x="7.2" y={y} width="5.6" height="1.8" rx="0.4" fill={f} stroke="none" opacity="0.65"/>
        ))}
        {[7.5, 9.5, 11.5, 13.5].map((x,i) => (
          <line key={i} x1={x} y1="16" x2={x} y2="18.5" strokeWidth="1.5"/>
        ))}
      </svg>
    );
    case "ssd": return (
      <svg {...base}>
        <rect x="1.5" y="4.5" width="17" height="11" rx="1.8"/>
        <rect x="3.5" y="6.5" width="6" height="4" rx="0.9" strokeWidth="0.9"/>
        {[6.5, 8.5, 10.5].map((y,i) => (
          <rect key={i} x="11.5" y={y} width="5" height="1.5" rx="0.4" fill={f} stroke="none" opacity="0.55"/>
        ))}
        <line x1="3.5" y1="12.5" x2="16.5" y2="12.5" strokeWidth="0.7" opacity="0.4"/>
      </svg>
    );
    case "psu": return (
      <svg {...base}>
        <rect x="1.5" y="3.5" width="17" height="13" rx="1.8"/>
        <circle cx="14.5" cy="7.5" r="2.5" strokeWidth="1"/>
        <path d="M14.5 5.5v1.2M12.3 6.8l1 .7M16.7 6.8l-1 .7" strokeWidth="1"/>
        {[9.5, 11.5, 13.5].map((y,i) => (
          <line key={i} x1="3.5" y1={y} x2="10" y2={y} strokeWidth="0.9"/>
        ))}
        <rect x="3.5" y="8.5" width="5" height="1.5" rx="0.4" fill={f} stroke="none" opacity="0.35"/>
      </svg>
    );
    case "case": return (
      <svg {...base}>
        <rect x="5" y="1.5" width="10" height="17" rx="1.8"/>
        <rect x="6.5" y="3.5" width="4" height="2.5" rx="0.5" strokeWidth="0.9"/>
        <rect x="6.5" y="7" width="4" height="2.5" rx="0.5" strokeWidth="0.9"/>
        <line x1="6.5" y1="11" x2="13.5" y2="11" strokeWidth="0.8"/>
        <circle cx="12.5" cy="4.8" r="1.2" strokeWidth="0.9"/>
        <rect x="6.5" y="12.5" width="6" height="4.5" rx="0.7" strokeWidth="0.9"/>
        <circle cx="9.5" cy="14.8" r="1" fill={f} stroke="none" opacity="0.5"/>
      </svg>
    );
    // ── Nuevos periféricos ────────────────────────────────────────────────────
    case "mic": return (
      // Micrófono de estudio — cápsula + arco + base
      <svg {...base}>
        <ellipse cx="10" cy="7.5" rx="3.8" ry="5" strokeWidth="1.3"/>
        <line x1="6.5" y1="5.5" x2="13.5" y2="5.5" strokeWidth="0.7" opacity="0.4"/>
        <line x1="6.2" y1="7.5" x2="13.8" y2="7.5" strokeWidth="0.7" opacity="0.4"/>
        <line x1="6.5" y1="9.5" x2="13.5" y2="9.5" strokeWidth="0.7" opacity="0.4"/>
        <path d="M6 12.5 Q6 17 10 17 Q14 17 14 12.5" strokeWidth="1.3" fill="none"/>
        <line x1="10" y1="17" x2="10" y2="19"/>
        <line x1="7" y1="19" x2="13" y2="19"/>
      </svg>
    );
    case "chair": return (
      // Silla gaming — respaldo alto + asiento + base de estrella
      <svg {...base}>
        {/* respaldo con alas laterales */}
        <path d="M6.5 2.5 Q5 2.5 5 4.5v7h10V4.5Q15 2.5 13.5 2.5Z" strokeWidth="1.2"/>
        <path d="M5 4.5 Q3.5 4.5 3.5 6.5v3h1.5" strokeWidth="0.9" fill="none"/>
        <path d="M15 4.5 Q16.5 4.5 16.5 6.5v3h-1.5" strokeWidth="0.9" fill="none"/>
        {/* asiento */}
        <rect x="4.5" y="11.5" width="11" height="3" rx="1.2"/>
        {/* columna */}
        <line x1="10" y1="14.5" x2="10" y2="17"/>
        {/* base de estrella con 5 ruedas */}
        <line x1="10" y1="17" x2="6"  y2="19.5" strokeWidth="1.2"/>
        <line x1="10" y1="17" x2="14" y2="19.5" strokeWidth="1.2"/>
        <line x1="10" y1="17" x2="10" y2="20"   strokeWidth="1.2"/>
        <line x1="10" y1="17" x2="4"  y2="18"   strokeWidth="1.2"/>
        <line x1="10" y1="17" x2="16" y2="18"   strokeWidth="1.2"/>
        <circle cx="6"  cy="19.5" r="0.8" fill={f} stroke="none"/>
        <circle cx="14" cy="19.5" r="0.8" fill={f} stroke="none"/>
        <circle cx="10" cy="20"   r="0.8" fill={f} stroke="none"/>
        <circle cx="4"  cy="18"   r="0.8" fill={f} stroke="none"/>
        <circle cx="16" cy="18"   r="0.8" fill={f} stroke="none"/>
      </svg>
    );
    case "speaker": return (
      // Bafle / parlante — gabinete + woofer + tweeter
      <svg {...base}>
        <rect x="4" y="1.5" width="12" height="17" rx="1.8"/>
        {/* woofer grande */}
        <circle cx="10" cy="9" r="4.2"/>
        <circle cx="10" cy="9" r="2.3" strokeWidth="0.9"/>
        <circle cx="10" cy="9" r="0.9" fill={f} stroke="none"/>
        {/* tweeter */}
        <circle cx="10" cy="4" r="1.5"/>
        <circle cx="10" cy="4" r="0.6" fill={f} stroke="none"/>
        {/* port / bass reflex */}
        <rect x="6.5" y="14.5" width="7" height="2" rx="1" strokeWidth="0.9"/>
        {/* borde del gabinete */}
        <rect x="4" y="1.5" width="12" height="17" rx="1.8" strokeWidth="1.3" fill="none"/>
      </svg>
    );
    // ── Componentes nuevos ───────────────────────────────────────────────────
    case "motherboard": return (
      // PCB con socket CPU, ranuras RAM y slots PCIe
      <svg {...base}>
        {/* Placa base */}
        <rect x="1.5" y="2" width="17" height="16" rx="1.5"/>
        {/* Socket CPU */}
        <rect x="5" y="4" width="6" height="6" rx="0.9" strokeWidth="1"/>
        {/* Chip dentro del socket */}
        <rect x="6.3" y="5.3" width="3.4" height="3.4" rx="0.5" fill={f} stroke="none" opacity="0.55"/>
        {/* Ranuras de RAM (2 sticks) */}
        <rect x="12.5" y="3" width="1.7" height="7.5" rx="0.5" strokeWidth="0.85"/>
        <rect x="14.8" y="3" width="1.7" height="7.5" rx="0.5" strokeWidth="0.85"/>
        {/* Slot PCIe principal */}
        <rect x="2.5" y="12.5" width="12" height="1.6" rx="0.4" strokeWidth="0.85"/>
        {/* Slot PCIe secundario */}
        <rect x="2.5" y="15" width="8.5" height="1.3" rx="0.4" strokeWidth="0.7" opacity="0.55"/>
        {/* Chipset */}
        <rect x="12" y="11" width="4.5" height="3.5" rx="0.6" fill={f} stroke="none" opacity="0.38"/>
        {/* Panel I/O */}
        <rect x="1.5" y="2" width="2.5" height="7" fill={f} stroke="none" opacity="0.1"/>
      </svg>
    );
    case "hdd": return (
      // Disco duro con plato, cabezal lector y conector
      <svg {...base}>
        {/* Carcasa */}
        <rect x="1.5" y="4" width="17" height="12" rx="2"/>
        {/* Plato circular */}
        <circle cx="8.5" cy="10" r="4.5" strokeWidth="0.9"/>
        {/* Anillo interior */}
        <circle cx="8.5" cy="10" r="2.5" strokeWidth="0.6" opacity="0.4"/>
        {/* Eje central */}
        <circle cx="8.5" cy="10" r="1" fill={f} stroke="none"/>
        {/* Brazo lector */}
        <line x1="8.5" y1="10" x2="14.5" y2="5.5" strokeWidth="1.3"/>
        {/* Cabeza lectora */}
        <circle cx="14.5" cy="5.5" r="1.2" fill={f} stroke="none"/>
        {/* Conector SATA */}
        <rect x="14.5" y="9" width="3.5" height="3" rx="0.4" strokeWidth="0.8" opacity="0.6"/>
      </svg>
    );
    case "cooling": return (
      // Ventilador / disipador con aspas y tornillos de montaje
      <svg {...base}>
        {/* Marco cuadrado del ventilador */}
        <rect x="1.5" y="1.5" width="17" height="17" rx="2.5"/>
        {/* Círculo externo */}
        <circle cx="10" cy="10" r="6.8" strokeWidth="0.8" opacity="0.4"/>
        {/* Aspas (4) curvas */}
        <path d="M10 5 C13.5 5 15 8 10 9 Z" fill={f} stroke="none" opacity="0.75"/>
        <path d="M15 10 C15 13.5 12 15 11 10 Z" fill={f} stroke="none" opacity="0.75"/>
        <path d="M10 15 C6.5 15 5 12 10 11 Z" fill={f} stroke="none" opacity="0.75"/>
        <path d="M5 10 C5 6.5 8 5 9 10 Z" fill={f} stroke="none" opacity="0.75"/>
        {/* Centro / buje */}
        <circle cx="10" cy="10" r="2.2" fill={f} stroke="none"/>
        <circle cx="10" cy="10" r="1" stroke="none" fill="var(--bg)"/>
        {/* Tornillos de montaje en esquinas */}
        <circle cx="3.5" cy="3.5" r="0.9" fill={f} stroke="none" opacity="0.4"/>
        <circle cx="16.5" cy="3.5" r="0.9" fill={f} stroke="none" opacity="0.4"/>
        <circle cx="3.5" cy="16.5" r="0.9" fill={f} stroke="none" opacity="0.4"/>
        <circle cx="16.5" cy="16.5" r="0.9" fill={f} stroke="none" opacity="0.4"/>
      </svg>
    );
    // ── Setup tiers ──────────────────────────────────────────────────────────
    case "aficionado": return (
      // Gamepad casual — usuario que empieza
      <svg {...base}>
        <path d="M4.5 9Q4.5 5.5 7 5.5h6Q15.5 5.5 15.5 9v2Q15.5 14 13 14.5H7Q4.5 14 4.5 11z"/>
        <line x1="6.5" y1="10" x2="9.5" y2="10"/>
        <line x1="8" y1="8.5" x2="8" y2="11.5"/>
        <circle cx="13" cy="9" r="1" fill={f} stroke="none"/>
        <circle cx="11.5" cy="11" r="1" fill={f} stroke="none"/>
        <line x1="7" y1="14.5" x2="6.5" y2="17" strokeWidth="1"/>
        <line x1="13" y1="14.5" x2="13.5" y2="17" strokeWidth="1"/>
        <line x1="5.5" y1="17" x2="14.5" y2="17"/>
      </svg>
    );
    case "gama-alta": return (
      // Corona / 3 barras premium completamente llenas
      <svg {...base}>
        <path d="M4 14 L4 7 L7 10 L10 3 L13 10 L16 7 L16 14Z" fill={f} stroke={color} strokeWidth="1.1" fillOpacity="0.18"/>
        <line x1="3" y1="16" x2="17" y2="16"/>
        <circle cx="4"  cy="7"  r="1.1" fill={f} stroke="none"/>
        <circle cx="10" cy="3"  r="1.1" fill={f} stroke="none"/>
        <circle cx="16" cy="7"  r="1.1" fill={f} stroke="none"/>
      </svg>
    );
    case "gama-media": return (
      // 3 barras ascendentes — 2 llenas, 1 vacía
      <svg {...base}>
        <rect x="2.5"  y="13" width="4" height="5"  rx="0.8" fill={f} stroke="none"/>
        <rect x="8"    y="9"  width="4" height="9"  rx="0.8" fill={f} stroke="none"/>
        <rect x="13.5" y="4"  width="4" height="14" rx="0.8" fill="none" stroke={color} strokeWidth="1.1" opacity="0.3"/>
        <line x1="2"  y1="19" x2="18" y2="19" strokeWidth="0.8" opacity="0.4"/>
      </svg>
    );
    case "gama-baja": return (
      // 3 barras ascendentes — solo la primera llena
      <svg {...base}>
        <rect x="2.5"  y="13" width="4" height="5"  rx="0.8" fill={f} stroke="none"/>
        <rect x="8"    y="9"  width="4" height="9"  rx="0.8" fill="none" stroke={color} strokeWidth="1.1" opacity="0.3"/>
        <rect x="13.5" y="4"  width="4" height="14" rx="0.8" fill="none" stroke={color} strokeWidth="1.1" opacity="0.3"/>
        <line x1="2"  y1="19" x2="18" y2="19" strokeWidth="0.8" opacity="0.4"/>
      </svg>
    );
    // ─────────────────────────────────────────────────────────────────────────
    default: return (
      <svg {...base}>
        <rect x="3" y="3" width="14" height="14" rx="2.5"/>
        <rect x="6" y="6" width="8" height="8" rx="1.5" strokeWidth="0.8"/>
      </svg>
    );
  }
}

// ── Selector visual de forma/icono ────────────────────────────────────────────
function ShapeSelector({ value, options, onChange }) {
  const cols = options.length <= 3 ? options.length : 3;
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 8 }}>
      {options.map(([v, label]) => {
        const active = value === v;
        return (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
              padding: "12px 6px 10px",
              background: active ? "rgba(239,43,43,0.1)" : "var(--surface-2)",
              border: `1px solid ${active ? "rgba(239,43,43,0.55)" : "var(--border)"}`,
              borderRadius: 9,
              cursor: "pointer",
              color: active ? "var(--red)" : "var(--fg-3)",
              transition: "all .14s",
              outline: "none",
              boxShadow: active ? "0 0 14px rgba(239,43,43,0.15)" : "none",
            }}
            onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = "rgba(239,43,43,0.28)"; e.currentTarget.style.color = "var(--fg-2)"; } }}
            onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--fg-3)"; } }}
          >
            <ShapeIcon shape={v} size={22} color={active ? "var(--red)" : "rgba(240,240,240,0.38)"}/>
            <span style={{
              font: "600 9px/1 var(--font-mono)", letterSpacing: ".09em",
              textTransform: "uppercase", textAlign: "center",
            }}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TAG INPUT
// ═══════════════════════════════════════════════════════════════
function TagInput({ tags, onChange }) {
  const [input, setInput] = useState("");
  const inputRef = useRef();

  function addTag(raw) {
    const val = raw.trim().toLowerCase().replace(/,/g, "");
    if (!val || tags.includes(val)) { setInput(""); return; }
    onChange([...tags, val]);
    setInput("");
  }

  function removeTag(tag) {
    onChange(tags.filter(t => t !== tag));
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    }
    if (e.key === "Backspace" && input === "" && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  }

  function handleBlur() {
    if (input.trim()) addTag(input);
  }

  return (
    <div>
      {/* Input */}
      <div
        onClick={() => inputRef.current?.focus()}
        style={{
          display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6,
          background: "var(--surface-2)", border: "1px solid var(--border)",
          borderRadius: 8, padding: "8px 12px", cursor: "text",
          minHeight: 42, transition: "border-color .15s, box-shadow .15s",
        }}
        onFocus={() => {}}
      >
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={tags.length === 0 ? "Escribe un tag y pulsa Enter o ," : "Añadir otro…"}
          style={{
            background: "transparent", border: "none", outline: "none",
            font: "500 13px/1 var(--font-sans)", color: "var(--fg)",
            flex: 1, minWidth: 120,
          }}
        />
      </div>

      {/* Tags guardados */}
      {tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
          {tags.map(tag => (
            <span
              key={tag}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "4px 10px 4px 12px",
                background: "var(--surface-3)",
                border: "1px solid var(--border)",
                borderRadius: 99, font: "500 11px/1 var(--font-mono)",
                color: "var(--fg-2)", letterSpacing: ".04em",
                animation: "fade-in .15s",
              }}
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "var(--fg-4)", padding: 0, lineHeight: 1,
                  fontSize: 14, display: "flex", alignItems: "center",
                  transition: "color .12s",
                }}
                onMouseEnter={e => e.currentTarget.style.color = "var(--red)"}
                onMouseLeave={e => e.currentTarget.style.color = "var(--fg-4)"}
                title={`Eliminar "${tag}"`}
              >×</button>
            </span>
          ))}

          {/* Borrar todos */}
          <button
            type="button"
            onClick={() => onChange([])}
            style={{
              background: "none", border: "none", cursor: "pointer",
              font: "400 10px/1 var(--font-mono)", color: "var(--fg-4)",
              padding: "4px 6px", transition: "color .12s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--red)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--fg-4)"}
          >Limpiar todo</button>
        </div>
      )}

      <div style={{ font: "400 10px/1 var(--font-mono)", color: "var(--fg-4)", marginTop: 6 }}>
        {tags.length} tag{tags.length !== 1 ? "s" : ""} · Enter o coma para confirmar · ⌫ para deshacer
      </div>
    </div>
  );
}

const EMPTY = {
  id: "", name: "", cat: "perif", subcat: "", brand: "", shape: "mouse",
  price: "", was: "", stock: "10",
  tagline: "", tags: "", specs: {}, inOferta: false, imageUrl: "",
};

function ProductForm({ product, onSave, onBack, showToast, brands }) {
  const isEdit = Boolean(product?.id);
  const [form, setForm] = useState(() => ({
    ...EMPTY,
    ...(product || {}),
    price:   product?.price   != null ? String(product.price)   : "",
    was:     product?.was     != null ? String(product.was)     : "",
    stock:   product?.stock   != null ? String(product.stock)   : "10",
    tags:    Array.isArray(product?.tags) ? product.tags : (product?.tags ? product.tags.split(",").map(t => t.trim()).filter(Boolean) : []),
  }));
  const [image, setImage]     = useState(product?.imageUrl ? { preview: resolveAdminImageUrl(product.imageUrl) } : null);
  const [saving, setSaving]   = useState(false);
  const [discountOn, setDiscountOn] = useState(Boolean(product?.was));

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }));
  const setV = (f, v) => setForm(p => ({ ...p, [f]: v }));

  // Cuando cambia la categoría → resetear shape y subcat a valores válidos
  useEffect(() => {
    const shapes   = CAT_SHAPES[form.cat]   || [];
    const subcats  = CAT_SUBCATS[form.cat]  || [];
    const validShapes = shapes.map(([v]) => v);
    setForm(p => ({
      ...p,
      shape:  validShapes.includes(p.shape) ? p.shape : (validShapes[0] || ""),
      subcat: subcats.includes(p.subcat)    ? p.subcat : "",
    }));
  }, [form.cat]); // eslint-disable-line react-hooks/exhaustive-deps

  const discount = form.was && form.price
    ? Math.round((1 - parseFloat(form.price) / parseFloat(form.was)) * 100)
    : null;

  function generateId(name) {
    return name.toLowerCase()
      .replace(/[áàä]/g,"a").replace(/[éèë]/g,"e").replace(/[íìï]/g,"i")
      .replace(/[óòö]/g,"o").replace(/[úùü]/g,"u").replace(/ñ/g,"n")
      .replace(/[^a-z0-9]/g,"-").replace(/-+/g,"-").replace(/^-|-$/g,"")
      .slice(0, 18);
  }

  async function handleSave() {
    if (!form.name.trim()) return showToast("El nombre es obligatorio", "error");
    if (!form.price)       return showToast("El precio es obligatorio", "error");

    setSaving(true);
    try {
      let imageUrl = form.imageUrl;

      if (image?.file) {
        showToast("Subiendo imagen…", "success");
        const uploaded = await uploadImage(image.file);
        imageUrl = uploaded.storefrontUrl;
      }

      const price = parseFloat(form.price) || 0;
      const was   = form.was ? parseFloat(form.was) : undefined;

      const payload = {
        ...form,
        id:       (form.id.trim() || generateId(form.name) || Date.now().toString(36)),
        price,
        was,
        save:     was ? Math.round((1 - price / was) * 100) : undefined,
        stock:    parseInt(form.stock) || 0,
        tags:     form.tags,
        imageUrl: imageUrl || undefined,
      };

      // Limpiar claves undefined
      Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k]);

      if (isEdit) {
        await apiFetch(`/products/${product.id}`, { method: "PUT", body: JSON.stringify(payload) });
        showToast("Producto actualizado", "success");
      } else {
        await apiFetch("/products", { method: "POST", body: JSON.stringify(payload) });
        showToast("Producto creado y publicado ✓", "success");
      }
      onSave();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ maxWidth: 1020, margin: "0 auto", padding: "32px 24px 64px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
        <button onClick={onBack} className="lt-btn lt-btn-ghost lt-btn-sm">← Volver</button>
        <div>
          <div style={{ font: "700 20px/1 var(--font-sans)", letterSpacing: "-0.025em" }}>
            {isEdit ? "Editar producto" : "Nuevo producto"}
          </div>
          <div style={{ font: "400 11px/1 var(--font-mono)", color: "var(--fg-3)", marginTop: 5 }}>
            {isEdit ? `ID: ${product.id}` : "Los cambios se publican automáticamente en la tienda"}
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 20, alignItems: "start" }}>

        {/* ─── LEFT COLUMN ─── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Imagen */}
          <div className="lt-card" style={{ padding: 18 }}>
            <div className="lt-section-label">Imagen del producto</div>
            <ImageDropzone value={image} onChange={setImage}/>
          </div>

          {/* Config rápida */}
          <div className="lt-card" style={{ padding: 18 }}>
            <div className="lt-section-label">Configuración</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Toggle oferta */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <div style={{ font: "600 13px/1 var(--font-sans)", marginBottom: 4 }}>Incluir en Ofertas</div>
                  <div style={{ font: "400 11px/1 var(--font-mono)", color: "var(--fg-3)" }}>Aparece en la sección Ofertas Flash</div>
                </div>
                <Toggle on={form.inOferta} onToggle={() => setV("inOferta", !form.inOferta)}/>
              </div>

              {/* ID */}
              <div>
                <Label>ID del producto</Label>
                <input className="lt-input" value={form.id} onChange={set("id")} placeholder="auto-generado" style={{ fontSize: 12, fontFamily: "var(--font-mono)" }}/>
                <div style={{ font: "400 10px/1 var(--font-mono)", color: "var(--fg-4)", marginTop: 6 }}>
                  {form.id ? "" : `Se usará: ${generateId(form.name) || "slug-del-nombre"}`}
                </div>
              </div>
            </div>
          </div>

          {/* Preview visual */}
          {(form.name || form.price) && (
            <div className="lt-card" style={{ padding: 18 }}>
              <div className="lt-section-label">Preview en tienda</div>
              <div style={{ background: "var(--surface-2)", borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ font: "400 10px/1 var(--font-mono)", color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 4 }}>
                  {form.brand || "—"} · {form.subcat || "—"}
                </div>
                <div style={{ font: "600 14px/1.3 var(--font-sans)", marginBottom: 6 }}>{form.name || "—"}</div>
                {form.tagline && <div style={{ font: "400 12px/1.4 var(--font-sans)", color: "var(--fg-3)", marginBottom: 8 }}>{form.tagline}</div>}
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  {form.price && <span style={{ font: "700 18px/1 var(--font-sans)" }}>${parseFloat(form.price).toLocaleString("es-MX")}</span>}
                  {form.was   && <span style={{ font: "400 12px/1 var(--font-sans)", color: "var(--fg-3)", textDecoration: "line-through" }}>${parseFloat(form.was).toLocaleString("es-MX")}</span>}
                  {discount   && discount > 0 && <span className="lt-badge lt-badge-red">−{discount}%</span>}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ─── RIGHT COLUMN ─── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Información básica */}
          <div className="lt-card" style={{ padding: 20 }}>
            <div className="lt-section-label">Información básica</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

              <div>
                <Label required>Nombre del producto</Label>
                <input className="lt-input" value={form.name} onChange={set("name")} placeholder="ej: Razer DeathAdder V3 Pro"/>
              </div>

              {/* Categoría */}
              <div>
                <Label>Categoría</Label>
                <div style={{ display: "flex", gap: 8 }}>
                  {CATS.map(([v, l]) => {
                    const active = form.cat === v;
                    return (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setV("cat", v)}
                        style={{
                          flex: 1, padding: "9px 12px", border: "1px solid",
                          borderColor: active ? "rgba(239,43,43,0.55)" : "var(--border)",
                          borderRadius: 8, cursor: "pointer", font: "600 12px/1 var(--font-sans)",
                          background: active ? "rgba(239,43,43,0.1)" : "var(--surface-2)",
                          color: active ? "var(--red)" : "var(--fg-3)",
                          boxShadow: active ? "0 0 12px rgba(239,43,43,0.12)" : "none",
                          transition: "all .14s",
                        }}
                      >{l}</button>
                    );
                  })}
                </div>
              </div>

              {/* Icono / forma — selector visual */}
              <div>
                <Label>Icono representativo</Label>
                <ShapeSelector
                  value={form.shape}
                  options={CAT_SHAPES[form.cat] || []}
                  onChange={v => setV("shape", v)}
                />
                <div style={{ font: "400 10px/1 var(--font-mono)", color: "var(--fg-4)", marginTop: 7 }}>
                  Selecciona el ícono que representa el producto en la tienda
                </div>
              </div>

              {/* Marca + Subcategoría */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <Label>Marca</Label>
                  <input
                    className="lt-input"
                    list="brand-suggestions"
                    value={form.brand}
                    onChange={set("brand")}
                    placeholder="ej: Razer, NVIDIA, Corsair"
                    autoComplete="off"
                  />
                  <datalist id="brand-suggestions">
                    {((brands || {})[form.cat] || []).map(b => <option key={b} value={b}/>)}
                  </datalist>
                </div>
                <div>
                  <Label>Subcategoría</Label>
                  <input
                    className="lt-input"
                    list={`subcats-${form.cat}`}
                    value={form.subcat}
                    onChange={set("subcat")}
                    placeholder="Selecciona o escribe…"
                    autoComplete="off"
                  />
                  <datalist id={`subcats-${form.cat}`}>
                    {(CAT_SUBCATS[form.cat] || []).map(s => (
                      <option key={s} value={s}/>
                    ))}
                  </datalist>
                  <div style={{ font: "400 10px/1 var(--font-mono)", color: "var(--fg-4)", marginTop: 5 }}>
                    {(CAT_SUBCATS[form.cat] || []).length} opciones predefinidas
                  </div>
                </div>
              </div>

              <div>
                <Label>Tagline</Label>
                <input className="lt-input" value={form.tagline} onChange={set("tagline")} placeholder="ej: Precisión quirúrgica en cada movimiento"/>
              </div>

              <div>
                <Label>Tags</Label>
                <TagInput
                  tags={form.tags}
                  onChange={tags => setV("tags", tags)}
                />
              </div>
            </div>
          </div>

          {/* Precio y stock */}
          <div className="lt-card" style={{ padding: 20 }}>
            <div className="lt-section-label">Precio y stock</div>

            {/* Fila base: precio + stock */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
              <div>
                <Label required>Precio actual</Label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", font: "600 13px/1 var(--font-mono)", color: "var(--fg-3)", pointerEvents: "none" }}>$</span>
                  <input className="lt-input" type="number" min="0" step="0.01" value={form.price} onChange={set("price")} placeholder="1299" style={{ paddingLeft: 24 }}/>
                </div>
              </div>
              <div>
                <Label>Stock</Label>
                <input className="lt-input" type="number" min="0" value={form.stock} onChange={set("stock")}/>
              </div>
            </div>

            {/* Botón de descuento */}
            <div style={{ marginBottom: discountOn ? 14 : 0 }}>
              <button
                type="button"
                onClick={() => {
                  if (discountOn) { setDiscountOn(false); setV("was", ""); }
                  else setDiscountOn(true);
                }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  padding: "7px 14px", borderRadius: 8, cursor: "pointer",
                  font: "600 12px/1 var(--font-sans)", border: "1px dashed",
                  borderColor: discountOn ? "rgba(239,43,43,0.45)" : "var(--border)",
                  background: discountOn ? "rgba(239,43,43,0.08)" : "transparent",
                  color: discountOn ? "var(--red)" : "var(--fg-3)",
                  transition: "all .18s",
                }}
              >
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <circle cx="5.5" cy="5.5" r="2"/><circle cx="10.5" cy="10.5" r="2"/>
                  <line x1="3.5" y1="12.5" x2="12.5" y2="3.5"/>
                </svg>
                {discountOn ? "Quitar descuento" : "+ Añadir descuento"}
              </button>
            </div>

            {/* Campos de descuento — solo si está activo */}
            {discountOn && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, animation: "slide-up .2s var(--ease-out)" }}>
                <div>
                  <Label>Precio original (antes)</Label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", font: "600 13px/1 var(--font-mono)", color: "var(--fg-3)", pointerEvents: "none" }}>$</span>
                    <input className="lt-input" type="number" min="0" step="0.01" value={form.was} onChange={set("was")} placeholder="1799" autoFocus style={{ paddingLeft: 24 }}/>
                  </div>
                </div>
                <div>
                  <Label>Descuento calculado</Label>
                  <div style={{
                    height: 40, display: "flex", alignItems: "center", paddingInline: 14,
                    background: "var(--bg)", borderRadius: 8, border: "1px solid var(--border)",
                    gap: 10,
                  }}>
                    {discount && discount > 0 ? (
                      <>
                        <span style={{ font: "700 22px/1 var(--font-mono)", color: "var(--red)", letterSpacing: "-0.04em" }}>−{discount}%</span>
                        <span style={{ font: "400 11px/1.3 var(--font-mono)", color: "var(--fg-3)" }}>
                          ahorras ${(parseFloat(form.was||0) - parseFloat(form.price||0)).toLocaleString("es-MX")}
                        </span>
                      </>
                    ) : (
                      <span style={{ font: "400 12px/1 var(--font-mono)", color: "var(--fg-4)" }}>Ingresa el precio original</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>


          {/* Especificaciones */}
          <div className="lt-card" style={{ padding: 20 }}>
            <div className="lt-section-label">Especificaciones técnicas</div>
            <SpecsEditor specs={form.specs} onChange={specs => setV("specs", specs)}/>
          </div>

          {/* Acciones */}
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button onClick={onBack} className="lt-btn lt-btn-ghost">Cancelar</button>
            <button onClick={handleSave} disabled={saving} className="lt-btn lt-btn-primary" style={{ minWidth: 180 }}>
              {saving ? <><Spinner/>&nbsp;Guardando…</> : (isEdit ? "✓ Guardar cambios" : "+ Publicar producto")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// BRAND MANAGER
// ═══════════════════════════════════════════════════════════════
function BrandManager({ brands, onUpdate, showToast }) {
  const [tab, setTab]     = useState("perif");
  const [input, setInput] = useState("");
  const [saving, setSaving] = useState(false);

  const TAB_LABELS = { perif: "Periféricos", comp: "Componentes" };

  async function addBrand() {
    const name = input.trim();
    if (!name) return;
    setSaving(true);
    try {
      const updated = await apiFetch(`/brands/${tab}`, {
        method: "POST", body: JSON.stringify({ brand: name }),
      });
      onUpdate(updated);
      setInput("");
      showToast(`Marca "${name}" añadida`, "success");
    } catch (err) { showToast(err.message, "error"); }
    finally { setSaving(false); }
  }

  async function removeBrand(name) {
    try {
      const updated = await apiFetch(`/brands/${tab}/${encodeURIComponent(name)}`, { method: "DELETE" });
      onUpdate(updated);
      showToast(`Marca "${name}" eliminada`, "success");
    } catch (err) { showToast(err.message, "error"); }
  }

  const setupBrands = brands.setup || [];

  return (
    <div className="lt-card" style={{ padding: 20, marginBottom: 20 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <div style={{ font: "700 14px/1 var(--font-sans)", letterSpacing: "-0.01em", marginBottom: 5 }}>
            Gestión de marcas
          </div>
          <div style={{ font: "400 11px/1 var(--font-mono)", color: "var(--fg-3)" }}>
            Aparecen como filtros en la tienda y como sugerencias al crear productos
          </div>
        </div>
        <span className="lt-badge lt-badge-cyan">
          {(brands.perif || []).length + (brands.comp || []).length} marcas
        </span>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14, paddingBottom: 14, borderBottom: "1px solid var(--border)" }}>
        {Object.entries(TAB_LABELS).map(([key, label]) => (
          <button
            key={key}
            onClick={() => { setTab(key); setInput(""); }}
            className={`lt-btn lt-btn-sm ${tab === key ? "lt-btn-primary" : "lt-btn-ghost"}`}
          >
            {label}
            <span style={{
              marginLeft: 4, padding: "1px 7px", borderRadius: 99,
              background: tab === key ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.06)",
              font: "600 10px/1.6 var(--font-mono)",
            }}>
              {(brands[key] || []).length}
            </span>
          </button>
        ))}
      </div>

      {/* Chips de la categoría activa */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7, minHeight: 36, marginBottom: 14 }}>
        {(brands[tab] || []).length === 0 ? (
          <span style={{ font: "400 12px/1 var(--font-mono)", color: "var(--fg-4)" }}>
            Sin marcas. Añade la primera abajo.
          </span>
        ) : (brands[tab] || []).map(name => (
          <span
            key={name}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "5px 10px 5px 13px",
              background: "var(--surface-2)", border: "1px solid var(--border)",
              borderRadius: 99, font: "500 12px/1 var(--font-sans)",
              color: "var(--fg-2)", animation: "fade-in .15s",
            }}
          >
            {name}
            <button
              onClick={() => removeBrand(name)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "var(--fg-4)", padding: 0, lineHeight: 1,
                fontSize: 15, display: "flex", alignItems: "center",
                transition: "color .12s",
              }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--red)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--fg-4)"}
              title={`Eliminar "${name}"`}
            >×</button>
          </span>
        ))}
      </div>

      {/* Input añadir */}
      <div style={{ display: "flex", gap: 8 }}>
        <input
          className="lt-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addBrand(); } }}
          placeholder={`Nueva marca de ${TAB_LABELS[tab]}…`}
          style={{ flex: 1 }}
        />
        <button
          onClick={addBrand}
          disabled={!input.trim() || saving}
          className="lt-btn lt-btn-primary"
        >
          {saving ? <Spinner size={14}/> : "+ Añadir"}
        </button>
      </div>

      {/* Setup — read-only, suma automática */}
      <div style={{
        marginTop: 16, padding: "12px 14px",
        background: "var(--surface-2)", borderRadius: 8,
        border: "1px solid var(--border)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <span style={{ font: "600 10px/1 var(--font-mono)", color: "var(--fg-3)", letterSpacing: ".08em", textTransform: "uppercase" }}>
            Setup completo
          </span>
          <span className="lt-badge lt-badge-neutral">{setupBrands.length} marcas · automático</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {setupBrands.length === 0 ? (
            <span style={{ font: "400 11px/1 var(--font-mono)", color: "var(--fg-4)" }}>
              Añade marcas en Periféricos o Componentes para que aparezcan aquí.
            </span>
          ) : setupBrands.map(name => (
            <span
              key={name}
              style={{
                padding: "3px 9px", borderRadius: 99,
                background: "rgba(34,211,238,0.07)",
                border: "1px solid rgba(34,211,238,0.15)",
                font: "500 11px/1 var(--font-mono)", color: "var(--cyan)",
              }}
            >{name}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PRODUCT CARD  (dashboard grid)
// ═══════════════════════════════════════════════════════════════
const CAT_LABELS = { perif: "Periférico", comp: "Componente", setup: "Setup" };

function ProductCard({ product: p, onEdit, onDelete, deleting }) {
  return (
    <div className="lt-card lt-card-hover" style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Imagen */}
      <div style={{ height: 150, background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid var(--border)", position: "relative", overflow: "hidden" }}>
        {p.imageUrl ? (
          <img src={resolveAdminImageUrl(p.imageUrl)} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 12 }}/>
        ) : (
          <div style={{ textAlign: "center", color: "var(--fg-4)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <svg width="28" height="28" viewBox="0 0 20 20" fill="none"
              stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1.5" y="2.5" width="17" height="15" rx="2"/>
              <path d="M1.5 13 L6 8 L9.5 12 L13 9 L18.5 15"/>
              <circle cx="14.5" cy="6.5" r="1.8"/>
            </svg>
            <div style={{ font: "400 10px/1 var(--font-mono)" }}>Sin imagen</div>
          </div>
        )}
        <div style={{ position: "absolute", top: 8, left: 8, display: "flex", gap: 4 }}>
          {p.inOferta && <span className="lt-badge lt-badge-red">OFERTA</span>}
          {p.stock === 0 && <span className="lt-badge lt-badge-neutral">AGOTADO</span>}
          {p.stock > 0 && p.stock <= 5 && <span className="lt-badge lt-badge-orange">STOCK: {p.stock}</span>}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "13px 15px", flex: 1 }}>
        <div style={{ font: "400 10px/1 var(--font-mono)", color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 5 }}>
          {p.brand || "—"} · {CAT_LABELS[p.cat] || p.cat}
        </div>
        <div style={{ font: "600 13px/1.3 var(--font-sans)", marginBottom: 8, letterSpacing: "-0.01em" }}>{p.name}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ font: "700 16px/1 var(--font-sans)" }}>
            ${(p.price || 0).toLocaleString("es-MX")}
          </span>
          {p.was && <span style={{ font: "400 12px/1 var(--font-sans)", color: "var(--fg-3)", textDecoration: "line-through" }}>${p.was.toLocaleString("es-MX")}</span>}
        </div>
      </div>

      {/* Acciones */}
      <div style={{ padding: "11px 15px", borderTop: "1px solid var(--border)", display: "flex", gap: 8 }}>
        <button onClick={onEdit} className="lt-btn lt-btn-ghost lt-btn-sm" style={{ flex: 1 }}>✏ Editar</button>
        <button onClick={onDelete} disabled={deleting} className="lt-btn lt-btn-danger lt-btn-sm lt-btn-icon" style={{ width: 34, height: 32, padding: 0 }} title="Eliminar">
          {deleting ? <Spinner size={12}/> : (
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="2,4 14,4"/><path d="M5 4V2.5h6V4"/><path d="M3 4l1 9.5h8L13 4"/>
              <line x1="6.5" y1="7" x2="6.5" y2="11"/><line x1="9.5" y1="7" x2="9.5" y2="11"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════
function Dashboard({ products, loadingProducts, onAdd, onEdit, onRefresh, showToast, brands, onBrandsUpdate }) {
  const [search, setSearch]     = useState("");
  const [catFilter, setCat]     = useState("all");
  const [deleting, setDeleting] = useState(null);
  const [confirm, setConfirm]   = useState(null); // id of product to delete

  const filtered = products.filter(p => {
    const matchesCat    = catFilter === "all" || p.cat === catFilter;
    const q             = search.toLowerCase();
    const matchesSearch = !q || p.name?.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q) || p.id?.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const stats = {
    total:    products.length,
    inOferta: products.filter(p => p.inOferta).length,
    lowStock: products.filter(p => p.stock <= 5 && p.stock > 0).length,
    outStock: products.filter(p => p.stock === 0).length,
  };

  async function handleDelete(id) {
    setDeleting(id);
    try {
      await apiFetch(`/products/${id}`, { method: "DELETE" });
      showToast("Producto eliminado", "success");
      onRefresh();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setDeleting(null);
      setConfirm(null);
    }
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>

      {/* Brand Manager */}
      <BrandManager brands={brands} onUpdate={onBrandsUpdate} showToast={showToast}/>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 32 }}>
        {[
          { label: "Total productos",   value: stats.total,    color: "var(--fg)" },
          { label: "En ofertas",        value: stats.inOferta, color: "var(--red)" },
          { label: "Stock bajo (≤5)",   value: stats.lowStock, color: "var(--orange)" },
          { label: "Agotados",          value: stats.outStock, color: "var(--fg-3)" },
        ].map(s => (
          <div key={s.label} className="lt-card" style={{ padding: "16px 20px" }}>
            <div style={{ font: "400 10px/1 var(--font-mono)", color: "var(--fg-3)", letterSpacing: ".07em", textTransform: "uppercase", marginBottom: 10 }}>{s.label}</div>
            <div style={{ font: "700 30px/1 var(--font-sans)", color: s.color, letterSpacing: "-0.03em" }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <input
          className="lt-input"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nombre, marca o ID…"
          style={{ flex: 1, minWidth: 200, maxWidth: 380 }}
        />
        <div style={{ display: "flex", gap: 6 }}>
          {[["all", "Todos"], ["perif", "Periféricos"], ["comp", "Componentes"], ["setup", "Setups"]].map(([k, v]) => (
            <button key={k} onClick={() => setCat(k)} className={`lt-btn lt-btn-sm ${catFilter === k ? "lt-btn-primary" : "lt-btn-ghost"}`}>{v}</button>
          ))}
        </div>
        <button onClick={onRefresh} className="lt-btn lt-btn-ghost lt-btn-sm" title="Refrescar" style={{ marginLeft: 4 }}>↺</button>
        <button onClick={onAdd} className="lt-btn lt-btn-primary" style={{ marginLeft: "auto" }}>+ Nuevo producto</button>
      </div>

      {/* Grid */}
      {loadingProducts ? (
        <div style={{ textAlign: "center", padding: 80, color: "var(--fg-3)", display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
          <Spinner/> Cargando productos…
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={products.length === 0 ? "box" : "search"}
          title={products.length === 0 ? "Aún no hay productos" : "Sin resultados"}
          body={products.length === 0 ? "Crea el primer producto para que aparezca en la tienda." : "Intenta con otro término de búsqueda o categoría."}
          action={products.length === 0 && <button onClick={onAdd} className="lt-btn lt-btn-primary">+ Crear primer producto</button>}
        />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
          {filtered.map(p => (
            <ProductCard
              key={p.id}
              product={p}
              onEdit={() => onEdit(p)}
              deleting={deleting === p.id}
              onDelete={() => {
                if (confirm === p.id) {
                  handleDelete(p.id);
                } else {
                  setConfirm(p.id);
                  setTimeout(() => setConfirm(null), 3000);
                }
              }}
            />
          ))}
        </div>
      )}

      {/* Confirm delete hint */}
      {confirm && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "var(--surface-2)", border: "1px solid var(--border-red)", borderRadius: 10, padding: "12px 20px", font: "500 13px/1 var(--font-sans)", color: "var(--fg-2)", zIndex: 200, animation: "fade-in .2s" }}>
          Haz clic de nuevo en el ícono de eliminar para confirmar
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ADMIN HEADER
// ═══════════════════════════════════════════════════════════════
function AdminHeader({ employee, screen, onLogout }) {
  return (
    <header style={{
      height: 60, display: "flex", alignItems: "center", padding: "0 24px",
      background: "rgba(13 13 18 / 0.92)", backdropFilter: "blur(14px)",
      borderBottom: "1px solid var(--border)",
      position: "sticky", top: 0, zIndex: 100, gap: 18,
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#ef2b2b,#8b0000)", display: "flex", alignItems: "center", justifyContent: "center", font: "700 13px/1 var(--font-sans)", flexShrink: 0 }}>LT</div>
        <div>
          <span style={{ font: "700 13px/1 var(--font-sans)", letterSpacing: "-0.02em" }}>LIFE TECH</span>
          <span style={{ font: "400 10px/1 var(--font-mono)", color: "var(--fg-4)", marginLeft: 8 }}>ADMIN</span>
        </div>
      </div>

      <div style={{ width: 1, height: 20, background: "var(--border)" }}/>

      {/* Status */}
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--lime)", animation: "pulse-dot 2.4s ease-in-out infinite" }}/>
        <span style={{ font: "400 11px/1 var(--font-mono)", color: "var(--fg-3)" }}>SISTEMA EN LÍNEA</span>
      </div>

      {/* Screen breadcrumb */}
      {screen === "form" && (
        <>
          <div style={{ width: 1, height: 20, background: "var(--border)" }}/>
          <span style={{ font: "400 11px/1 var(--font-mono)", color: "var(--fg-3)" }}>
            / {screen === "form" ? "producto" : screen}
          </span>
        </>
      )}

      {/* Employee + logout */}
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ font: "600 12px/1 var(--font-sans)" }}>{employee.name}</div>
          <div style={{ font: "400 10px/1 var(--font-mono)", color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: ".06em" }}>{employee.role}</div>
        </div>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(239 43 43 / 0.2)", border: "1px solid rgba(239 43 43 / 0.3)", display: "flex", alignItems: "center", justifyContent: "center", font: "700 13px/1 var(--font-sans)", color: "var(--red)", flexShrink: 0 }}>
          {employee.avatar || employee.name?.slice(0, 2).toUpperCase()}
        </div>
        <button onClick={onLogout} className="lt-btn lt-btn-ghost lt-btn-sm">Salir →</button>
      </div>
    </header>
  );
}

// ═══════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════
function App() {
  const [screen,    setScreen]    = useState("loading");
  const [employee,  setEmployee]  = useState(null);
  const [products,  setProducts]  = useState([]);
  const [brands,    setBrands]    = useState({ perif: [], comp: [], setup: [] });
  const [loading,   setLoading]   = useState(false);
  const [editProd,  setEditProd]  = useState(null);
  const [toast,     setToast]     = useState(null);

  function showToast(msg, type = "success", sub) {
    setToast({ msg, type, sub });
    setTimeout(() => setToast(null), 3200);
  }

  // ── Verificar sesión guardada ──
  useEffect(() => {
    const token = getToken();
    const emp   = JSON.parse(localStorage.getItem("lt_admin_emp") || "null");
    if (!token || !emp) { setScreen("login"); return; }

    Promise.all([apiFetch("/products"), apiFetch("/brands")])
      .then(([prods, brs]) => {
        setProducts(prods);
        setBrands(brs);
        setEmployee(emp);
        setScreen("dashboard");
      })
      .catch(() => {
        localStorage.removeItem("lt_admin_token");
        localStorage.removeItem("lt_admin_emp");
        setScreen("login");
      });
  }, []);

  // ── Cargar productos ──
  async function loadProducts() {
    setLoading(true);
    try {
      const data = await apiFetch("/products");
      setProducts(data);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  // ── Cargar marcas ──
  async function loadBrands() {
    try {
      const data = await apiFetch("/brands");
      setBrands(data);
    } catch {}
  }

  function handleLogin(emp) {
    setEmployee(emp);
    Promise.all([loadProducts(), loadBrands()]).then(() => setScreen("dashboard"));
  }

  function handleLogout() {
    apiFetch("/logout", { method: "POST" }).catch(() => {});
    localStorage.removeItem("lt_admin_token");
    localStorage.removeItem("lt_admin_emp");
    setEmployee(null);
    setProducts([]);
    setEditProd(null);
    setScreen("login");
  }

  function goForm(product = null) {
    setEditProd(product);
    setScreen("form");
  }

  function handleSaved() {
    loadProducts();
    setScreen("dashboard");
  }

  // ── Loading splash ──
  if (screen === "loading") return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <GridBg/>
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: "linear-gradient(135deg,#ef2b2b,#8b0000)", display: "flex", alignItems: "center", justifyContent: "center", font: "800 24px/1 var(--font-sans)" }}>LT</div>
        <Spinner size={20} color="var(--red)"/>
      </div>
    </div>
  );

  if (screen === "login") return <LoginScreen onLogin={handleLogin}/>;

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      <GridBg/>
      <ScanLines/>
      <div style={{ position: "relative", zIndex: 1 }}>
        <AdminHeader employee={employee} screen={screen} onLogout={handleLogout}/>
        <main style={{ animation: "slide-up .25s var(--ease-out)" }}>
          {screen === "dashboard" && (
            <Dashboard
              products={products}
              loadingProducts={loading}
              onAdd={() => goForm(null)}
              onEdit={p => goForm(p)}
              onRefresh={loadProducts}
              showToast={showToast}
              brands={brands}
              onBrandsUpdate={setBrands}
            />
          )}
          {screen === "form" && (
            <ProductForm
              product={editProd}
              onSave={handleSaved}
              onBack={() => setScreen("dashboard")}
              showToast={showToast}
              brands={brands}
            />
          )}
        </main>
      </div>
      <Toast toast={toast}/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
