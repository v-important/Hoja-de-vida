// Shop / category listing screen with filters

const SUBCATS = {
  perif: [
    { id: "all-perif", label: "Todos los periféricos" },
    { id: "mouse",       label: "Mouse" },
    { id: "teclado",     label: "Teclado" },
    { id: "diademas",    label: "Diademas" },
    { id: "alfombrillas",label: "Alfombrillas" },
    { id: "microfonos",  label: "Micrófonos" },
    { id: "audifonos",   label: "Audífonos" },
    { id: "webcams",     label: "Webcams" },
  ],
  comp: [
    { id: "all-comp",         label: "Todos los componentes"  },
    { id: "tarjetas-graficas",label: "Tarjetas Gráficas"      },
    { id: "procesadores",     label: "Procesadores"           },
    { id: "tarjetas-madre",   label: "Tarjetas Madre"         },
    { id: "memorias-ram",     label: "Memorias RAM"           },
    { id: "almacenamiento",   label: "SSD NVMe"               },
    { id: "discos-duros",     label: "Discos Duros"           },
    { id: "fuentes",          label: "Fuentes de Poder"       },
    { id: "gabinetes",        label: "Gabinetes"              },
    { id: "refrigeracion",    label: "Refrigeración"          },
  ],
  setup: [
    { id: "all-setup",   label: "Todos los setups" },
    { id: "aficionado",  label: "Aficionado" },
    { id: "gama-alta",   label: "Gama Alta" },
    { id: "gama-media",  label: "Gama Media" },
    { id: "gama-baja",   label: "Gama Baja" },
  ],
};

const TOP_CATS = [
  { id: "all",   label: "Todos los productos" },
  { id: "perif", label: "Periféricos" },
  { id: "comp",  label: "Componentes" },
  { id: "setup", label: "Setups completos" },
];

function FilterChip({ on, onClick, children }) {
  return (
    <span onClick={onClick}
      style={{
        font: "600 12px/1 var(--font-sans)", height: 32, padding: "0 14px",
        border: `1px solid ${on ? "var(--brand-red)" : "var(--border)"}`,
        borderRadius: 999, color: on ? "var(--fg)" : "var(--fg-2)",
        background: on ? "rgb(239 43 43 / 0.12)" : "var(--surface)",
        display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer",
        transition: "all .22s var(--ease-out)",
      }}>
      {on && <span style={{ color: "var(--brand-red)", fontWeight: 700 }}>✓</span>}
      {children}
    </span>
  );
}

// Mapea cada ID de subcategoría a los valores de `shape` de los productos
const SUBCAT_SHAPES = {
  // perif
  "mouse":        ["mouse"],
  "teclado":      ["keyboard"],
  "diademas":     ["headset"],
  "alfombrillas": ["pad"],
  "microfonos":   ["mic"],
  "audifonos":    ["headset"],
  "webcams":      ["webcam"],
  // comp
  "tarjetas-graficas":   ["gpu"],
  "procesadores":        ["cpu"],
  "tarjetas-madre":      ["motherboard"],
  "memorias-ram":        ["ram"],
  "almacenamiento":      ["ssd"],
  "discos-duros":        ["hdd"],
  "fuentes":             ["psu"],
  "gabinetes":           ["case"],
  "refrigeracion":       ["cooling"],
  // setup
  "aficionado":  ["aficionado"],
  "gama-alta":   ["gama-alta"],
  "gama-media":  ["gama-media"],
  "gama-baja":   ["gama-baja"],
};

// Cuenta productos que coinciden con un filtro de subcategoría
function countSubcat(products, cat, subcatId) {
  const catProds = (products || []).filter(p => p.cat === cat);
  if (subcatId.startsWith("all-")) return catProds.length;
  const shapes = SUBCAT_SHAPES[subcatId];
  if (!shapes || shapes.length === 0) return 0;
  return catProds.filter(p => shapes.includes(p.shape)).length;
}

// Fallback hardcodeado — se usa si la API no responde
const BRANDS_FALLBACK = {
  perif:  ["Logitech", "Razer", "Corsair", "Redragon", "HyperX", "Acer"],
  comp:   ["Intel", "AMD", "ASUS", "Gigabyte", "MSI", "Corsair", "Kingston", "ADATA"],
  setup:  ["ASUS", "MSI", "Corsair", "Logitech", "Razer", "Gigabyte"],
  all:    ["Logitech", "Razer", "Intel", "AMD", "ASUS", "MSI", "Corsair"],
};

function ShopFilters({ filters, setFilters, onChat, allBrands, products }) {
  // Mezcla API + fallback
  const brandMap = (allBrands && Object.keys(allBrands).length > 0) ? allBrands : BRANDS_FALLBACK;
  const brands = (() => {
    if (filters.cat === "all") {
      const all = [...new Set([
        ...(brandMap.perif || BRANDS_FALLBACK.perif),
        ...(brandMap.comp  || BRANDS_FALLBACK.comp),
      ])].sort();
      return all.length > 0 ? all : BRANDS_FALLBACK.all;
    }
    const apiList = brandMap[filters.cat] || [];
    return apiList.length > 0 ? apiList : (BRANDS_FALLBACK[filters.cat] || []);
  })();

  const CONN = {
    perif: ["USB-A", "USB-C", "Inalámbrico 2.4 GHz", "Bluetooth"],
    comp:  [],
    setup: [],
    all:   ["USB-A", "USB-C", "Inalámbrico 2.4 GHz", "Bluetooth"],
  };
  const conn = CONN[filters.cat] || [];

  const toggle = (key, val) => {
    setFilters(f => {
      const set = new Set(f[key] || []);
      set.has(val) ? set.delete(val) : set.add(val);
      return { ...f, [key]: Array.from(set) };
    });
  };

  const subcats = SUBCATS[filters.cat] || null;
  const subcatLabel = { perif: "Periféricos", comp: "Componentes", setup: "Setups" };

  return (
    <aside style={{ position: "sticky", top: 80, alignSelf: "flex-start", display: "flex", flexDirection: "column", gap: 24 }}>

      {/* ── Navegación: categorías principales (cat=all) ó subcategorías (cat=perif/comp/setup) ── */}
      {subcats ? (
        /* Vista de categoría específica: subcategorías + botón volver */
        <div style={{ animation: "lt-fade-in .2s ease" }}>
          <h6 style={{ font: "600 11px/1 var(--font-sans)", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--fg-3)", marginBottom: 10 }}>
            {subcatLabel[filters.cat]}
          </h6>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {subcats.map(({ id, label }) => {
              const active = (filters.subcat || subcats[0].id) === id;
              return (
                <a key={id} onClick={() => setFilters(f => ({ ...f, subcat: id }))}
                  style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "8px 10px", borderRadius: 6, cursor: "pointer", fontSize: 13,
                    fontWeight: active ? 600 : 400,
                    color: active ? "var(--fg)" : "var(--fg-2)",
                    background: active ? "rgb(239 43 43 / 0.1)" : "transparent",
                    borderLeft: active ? "2px solid var(--brand-red)" : "2px solid transparent",
                    transition: "all .15s var(--ease-out)",
                  }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "rgb(239 43 43 / 0.06)"; e.currentTarget.style.color = "var(--fg)"; }}}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--fg-2)"; }}}>
                  <span>{label}</span>
                  <span style={{ color: "var(--fg-3)", fontFamily: "var(--font-mono)", fontSize: 11 }}>
                    {countSubcat(products, filters.cat, id)}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      ) : (
        /* Vista "Todos": selector de categorías principales */
        <div style={{ animation: "lt-fade-in .2s ease" }}>
          <h6 style={{ font: "600 11px/1 var(--font-sans)", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--fg-3)", marginBottom: 10 }}>
            Categorías
          </h6>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {TOP_CATS.slice(1).map(({ id, label }) => {
              const count = (products || []).filter(p => p.cat === id).length;
              return (
                <a key={id} onClick={() => setFilters(f => ({ ...f, cat: id, subcat: null }))}
                  style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "9px 10px", borderRadius: 6, cursor: "pointer", fontSize: 13,
                    color: "var(--fg-2)", fontWeight: 400,
                    borderLeft: "2px solid transparent",
                    transition: "all .15s var(--ease-out)",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgb(239 43 43 / 0.07)"; e.currentTarget.style.color = "var(--fg)"; e.currentTarget.style.borderLeftColor = "var(--brand-red)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--fg-2)"; e.currentTarget.style.borderLeftColor = "transparent"; }}>
                  <span>{label}</span>
                  <span style={{ color: "var(--fg-3)", fontFamily: "var(--font-mono)", fontSize: 11 }}>{count}</span>
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Marcas ── */}
      <div>
        <h6 style={{ font: "600 11px/1 var(--font-sans)", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--fg-3)", marginBottom: 10 }}>Marca</h6>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {brands.map(b => (
            <FilterChip key={b} on={(filters.brand || []).includes(b)} onClick={() => toggle("brand", b)}>{b}</FilterChip>
          ))}
        </div>
      </div>

      {/* ── Conexión (solo para perif y all) ── */}
      {conn.length > 0 && (
        <div>
          <h6 style={{ font: "600 11px/1 var(--font-sans)", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--fg-3)", marginBottom: 10 }}>Conexión</h6>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {conn.map(c => (
              <FilterChip key={c} on={(filters.conn || []).includes(c)} onClick={() => toggle("conn", c)}>{c}</FilterChip>
            ))}
          </div>
        </div>
      )}

      {/* ── Precio ── */}
      <div>
        <h6 style={{ font: "600 11px/1 var(--font-sans)", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--fg-3)", marginBottom: 10 }}>Precio</h6>
        <div style={{ display: "flex", gap: 8 }}>
          <input className="lt-input" placeholder="Min" style={{ height: 36, fontSize: 12 }}/>
          <input className="lt-input" placeholder="Max" style={{ height: 36, fontSize: 12 }}/>
        </div>
      </div>

      {/* ── IA Recommend ── */}
      <div style={{ padding: 12, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <Icon name="ai" size={14} style={{ color: "var(--neon-cyan)" }}/>
          <span style={{ font: "600 12px/1 var(--font-sans)", color: "var(--neon-cyan)" }}>IA Recommend</span>
        </div>
        <p style={{ font: "400 12px/1.4 var(--font-sans)", color: "var(--fg-2)" }}>
          Cuéntanos qué juegas y armamos tu setup ideal en menos de 30s.
        </p>
        <Button variant="secondary" block onClick={onChat}>Probar</Button>
      </div>
    </aside>
  );
}

function ShopScreen({ products, onAdd, onOpen, favs, onFav, initialCat, brands }) {
  const [filters, setFilters] = React.useState({ cat: initialCat || "all", subcat: null, brand: [], conn: [] });
  const [sort, setSort] = React.useState("relev");
  const [chatOpen, setChatOpen] = React.useState(false);

  // Sincroniza filters.cat cuando cambia la prop initialCat (navegación por header sin re-montar)
  React.useEffect(() => {
    setFilters(f => ({ ...f, cat: initialCat || "all", subcat: null }));
  }, [initialCat]);

  // Filtrado por categoría, subcategoría (shape), marca
  const list = (products || [])
    .filter(p => {
      if (filters.cat !== "all" && p.cat !== filters.cat) return false;
      // Filtro de subcategoría: usa el mapa shape ↔ subcatId
      if (filters.subcat && !filters.subcat.startsWith("all-")) {
        const shapes = SUBCAT_SHAPES[filters.subcat];
        if (shapes && shapes.length > 0 && !shapes.includes(p.shape)) return false;
      }
      if (filters.brand && filters.brand.length > 0 && !filters.brand.includes(p.brand)) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === "low")  return (a.price || 0) - (b.price || 0);
      if (sort === "high") return (b.price || 0) - (a.price || 0);
      return 0;
    });

  const catLabels = { all: "Todos los productos", perif: "Periféricos", comp: "Componentes", setup: "Setups" };

  // Etiqueta activa: subcategoría si hay, categoría si no
  const activeSubcat = filters.subcat
    ? (SUBCATS[filters.cat] || []).find(s => s.id === filters.subcat)?.label
    : null;
  const headingLabel = activeSubcat || catLabels[filters.cat] || "Todos";

  // Chips de filtros activos (para poder limpiarlos fácilmente)
  const activeFilters = [
    ...(filters.brand || []).map(b => ({ key: "brand", val: b, label: b })),
    ...(filters.conn  || []).map(c => ({ key: "conn",  val: c, label: c })),
  ];

  const clearFilter = (key, val) => setFilters(f => {
    const arr = (f[key] || []).filter(x => x !== val);
    return { ...f, [key]: arr };
  });

  return (
    <>
      <section className="lt-section" style={{ paddingTop: 32 }}>
        <div className="lt-section-inner">

          {/* ── Shop hero header ── */}
          <div className="lt-shop-hero" style={{ marginInline: `calc(-1 * var(--gutter))`, marginTop: -32, marginBottom: 40 }}>
            <div className="lt-shop-hero-inner">
              <div className="lt-section-eyebrow">
                Tienda &nbsp;/&nbsp; {headingLabel}
              </div>
              <h1 className="lt-shop-hero-h1">
                Construye tu{" "}
                <span style={{ color: "var(--brand-red)" }}>próximo nivel</span>
              </h1>
              <p style={{ font: "400 16px/1.5 var(--font-sans)", color: "var(--fg-2)", marginTop: 12, maxWidth: 520 }}>
                Filtra por marca, tipo y presupuesto. Si no sabes por dónde empezar, deja que la IA lo haga por ti.
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 32, alignItems: "flex-start" }}>
            <ShopFilters filters={filters} setFilters={setFilters} onChat={() => setChatOpen(true)} allBrands={brands} products={products}/>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* ── Barra de controles ── */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <span style={{ color: "var(--fg-2)", fontSize: 13 }}>
                    <span className="lt-mono" style={{ color: "var(--fg)", fontWeight: 600 }}>{list.length}</span> producto{list.length !== 1 ? "s" : ""}
                  </span>
                  {/* Chips de filtros activos */}
                  {activeFilters.map(af => (
                    <span key={af.key + af.val}
                      onClick={() => clearFilter(af.key, af.val)}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 5, height: 26,
                        padding: "0 10px", borderRadius: 999, fontSize: 11, fontWeight: 600,
                        background: "rgb(239 43 43 / 0.15)", color: "var(--brand-red)",
                        border: "1px solid var(--brand-red)", cursor: "pointer",
                      }}>
                      {af.label} ×
                    </span>
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span className="lt-overline" style={{ color: "var(--fg-3)" }}>Ordenar</span>
                  <select value={sort} onChange={e => setSort(e.target.value)}
                    style={{ background: "var(--surface-2)", color: "var(--fg)", border: "1px solid var(--border)", borderRadius: 8, height: 34, padding: "0 10px", font: "500 13px/1 var(--font-sans)" }}>
                    <option value="relev">Más relevante</option>
                    <option value="low">Precio: menor a mayor</option>
                    <option value="high">Precio: mayor a menor</option>
                  </select>
                </div>
              </div>

              {/* ── Grid de productos o estado vacío ── */}
              {list.length > 0 ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16, animation: "lt-fade-in .2s ease" }}>
                  {list.map(p => (
                    <ProductCard key={p.id} product={p} onAdd={onAdd} onOpen={onOpen}
                      fav={favs ? favs.has(p.id) : false} onFav={onFav}/>
                  ))}
                </div>
              ) : (
                <div style={{ padding: 64, textAlign: "center", border: "1px dashed var(--border)", borderRadius: 12, color: "var(--fg-3)", background: "var(--surface)" }}>
                  <div style={{ font: "600 14px/1.4 var(--font-sans)", color: "var(--fg-2)", marginBottom: 6 }}>
                    {(products || []).length === 0 ? "Catálogo vacío" : "Sin resultados"}
                  </div>
                  <div style={{ fontSize: 13 }}>
                    {(products || []).length === 0
                      ? "Aún no hay productos. Añádelos desde el panel de empleados."
                      : "Prueba con otra categoría o elimina los filtros de marca."}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {chatOpen && <ChatBotPanel onClose={() => setChatOpen(false)}/>}
    </>
  );
}

window.ShopScreen = ShopScreen;
